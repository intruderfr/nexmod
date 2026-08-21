/*
 * Nexmod service worker.
 *
 * WHY THE VERSION MATTERS MORE THAN THE STRATEGY
 * The previous version of this file pinned CACHE_VERSION to a literal
 * "nexmod-v1" and served every .js and .css cache-first. Two consequences,
 * both bad:
 *
 *   1. The activate handler evicts caches whose key does not start with
 *      CACHE_VERSION. With a constant version, that condition is never true,
 *      so nothing was ever evicted. The cache was immortal.
 *   2. Turbopack chunk filenames are derived from module ids, not from a hash
 *      of their contents, so the same filename can carry different code
 *      between builds. Cache-first + immortal cache = a returning visitor
 *      running last month's chunks against this month's HTML.
 *
 * When the module graph does not line up, React throws during hydration and
 * every event handler on the page dies. The server-rendered HTML still paints,
 * so the site *looks* fine — it just does not respond to a single click.
 *
 * The fix is that BUILD_ID is stamped in by scripts/build-static.mjs, so each
 * deploy gets its own cache namespace and the old one is evicted on activate.
 *
 * CACHES
 *   nexmod-<build>-static   JS and CSS for this build.   cache-first
 *   nexmod-<build>-pages    HTML.                        network-first
 *   nexmod-media-v1         Images and fonts.            stale-while-revalidate
 *
 * Media is deliberately NOT build-scoped. Photographs are the expensive part
 * of this site and their paths are stable, so re-downloading them on every
 * daily cron rebuild would be pure waste. Stale-while-revalidate means a
 * replaced image still self-heals on the visit after next.
 */

const BUILD_ID = "__BUILD_ID__";

/*
 * True only when the stamping step in scripts/build-static.mjs did not run —
 * i.e. this is the plain server build, not the static export. Without a real
 * build id the cache key is constant again, so code must not be cached-first.
 * Better a wasted round trip than a resurrection of the stale-chunk bug.
 */
const UNSTAMPED = BUILD_ID === "__BUILD" + "_ID__";

const STATIC_CACHE = `nexmod-${BUILD_ID}-static`;
const PAGE_CACHE = `nexmod-${BUILD_ID}-pages`;
const MEDIA_CACHE = "nexmod-media-v1";

const CURRENT = new Set([STATIC_CACHE, PAGE_CACHE, MEDIA_CACHE]);

/** Derived from the SW's own location, so it works under a repo base path. */
const SCOPE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const OFFLINE_URL = `${SCOPE}/offline.html`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      // A missing offline page must not block installation.
      .catch(() => undefined)
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            // Only ever delete our own caches, and only the stale ones.
            .filter((key) => key.startsWith("nexmod-") && !CURRENT.has(key))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Lets the page tell a waiting worker to take over immediately.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

const MEDIA_RE = /\.(?:webp|avif|png|jpe?g|svg|gif|ico|woff2?)$/i;
const CODE_RE = /\.(?:js|css)$/i;

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Same-origin only. Third-party requests are left alone entirely.
  if (url.origin !== self.location.origin) return;

  // Never cache API responses — they are dynamic by definition.
  if (url.pathname.includes("/api/")) return;

  if (MEDIA_RE.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, MEDIA_CACHE));
    return;
  }

  if (CODE_RE.test(url.pathname)) {
    // Safe cache-first: STATIC_CACHE belongs to exactly one build, so a hit
    // here is guaranteed to be the code this build shipped. When the build id
    // was never stamped in, that guarantee is gone — go to the network.
    event.respondWith(UNSTAMPED ? networkFirst(request) : cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    // Neither cached nor reachable: fail quietly rather than throwing, so one
    // broken asset never takes the page down.
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => undefined);

  if (cached) return cached;

  const response = await network;
  return response ?? new Response("", { status: 504, statusText: "Offline" });
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(PAGE_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;

    return new Response("You are offline.", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
