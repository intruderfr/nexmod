import type { NextConfig } from "next";

/**
 * Two build targets.
 *
 * DEFAULT — a full Next.js server build. Route handlers, the locale proxy and
 * ISR all work. This is what you deploy to a real host.
 *
 * STATIC_EXPORT=1 — a static HTML export for GitHub Pages. Pages has no
 * server, so this build drops the API routes and the locale proxy (the build
 * script removes them), and ISR becomes build-time only. See scripts/build-static.mjs.
 */
const isStatic = process.env.STATIC_EXPORT === "1";

// On GitHub Pages the site is served from a repository subpath.
const basePath = process.env.BASE_PATH ?? "";

/**
 * Namespaces the service worker's caches. scripts/build-static.mjs sets this
 * from the git SHA and stamps the same value into out/sw.js, so a deploy can
 * never leave a visitor running a previous build's JavaScript chunks.
 */
const buildId = process.env.BUILD_ID || "dev";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  ...(isStatic
    ? {
        output: "export" as const,
        // Pages serves directory indexes, so every route needs its own
        // index.html rather than a bare .html sibling.
        trailingSlash: true,
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
        images: { unoptimized: true },
      }
    : {
        images: {
          formats: ["image/avif", "image/webp"] as const,
          remotePatterns: [{ protocol: "https" as const, hostname: "**" }],
        },
      }),

  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isStatic ? "1" : "",
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_BUILD_ID: buildId,
  },

  // Headers are a server feature; a static export ignores them, and GitHub
  // Pages sets its own. Only declare them for the server build.
  ...(isStatic
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                {
                  key: "Permissions-Policy",
                  value: "camera=(), microphone=(), geolocation=(self)",
                },
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
