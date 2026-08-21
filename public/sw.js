/*
 * Nexmod service worker.
 *
 * Two strategies, chosen by what the request is for:
 *
 *   Static assets (images, fonts, CSS, JS)  cache-first
 *     These are content-hashed or immutable, so a cached copy is always
 *     correct and going to the network first would waste the trip.
 *
 *   Navigations (HTML)  network-first, cache as fallback
 *     Prices and stock change. Serving a stale page to save a few hundred
 *     milliseconds is the wrong trade for a shop.
 *
 * Everything else passes straight through. Nothing is cached for POST, and
 * the API routes are never intercepted.
 *
 * Bump CACHE_VERSION to evict every previous cache on the next activation.
 */

const CACHE_VERSION = "nexmod-v1";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;

/** Derived from the SW's own location, so it works under a repo base path. */
const SCOPE = new URL(self.registration.scope).pathname.replace(/\/$/, "");
const OFFLINE_URL = `${SCOPE}/offline.html`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL]))
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
            .filter((key) => !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

const STATIC_RE = /\.(?:webp|avif|png|jpe?g|svg|gif|ico|woff2?|css|js)$/i;

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Same-origin only. Third-party requests are left alone entirely.
  if (url.origin !== self.location.origin) return;

  // Never cache API responses — they are dynamic by definition.
  if (url.pathname.includes("/api/")) return;

  if (STATIC_RE.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // An image that is neither cached nor reachable: fail quietly rather than
    // throwing, so one broken asset never takes the page down.
    return new Response("", { status: 504, statusText: "Offline" });
  }
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
