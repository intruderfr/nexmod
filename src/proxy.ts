import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales } from "@/i18n/config";

/**
 * Locale routing.
 *
 * Every page lives under a locale prefix, so an unprefixed request is
 * redirected to the best available match. Precedence:
 *
 *   1. A previously chosen locale, from the nexmod.locale cookie
 *   2. The browser's Accept-Language header
 *   3. English
 *
 * An explicit URL always wins — /ta/products serves Tamil regardless of what
 * the cookie or headers say, which is what makes shared links behave.
 */

const PUBLIC_FILE =
  /\.(?:ico|png|jpe?g|svg|webp|avif|gif|txt|xml|json|webmanifest|woff2?|js|mjs|css|map|html)$/i;

function preferredLocale(request: NextRequest): string {
  const cookie = request.cookies.get("nexmod.locale")?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language");
  if (header) {
    // "si-LK,si;q=0.9,en;q=0.8" -> ["si-lk", "si", "en"], best first.
    const ranked = header
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { tag } of ranked) {
      const base = tag.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets are not localised. Without this, /images/hero-main-md.webp
  // gets rewritten to /en/images/... and every photograph 404s.
  if (PUBLIC_FILE.test(pathname) || pathname.startsWith("/images/")) {
    return NextResponse.next();
  }

  // Anything already carrying a valid locale passes straight through.
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;

  // 307 rather than 308: the correct target depends on the visitor, so this
  // redirect must not be cached as permanent.
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: [
    /*
     * Everything except:
     *  - /api routes
     *  - Next internals (_next/static, _next/image)
     *  - metadata files that must stay at the root (sitemap, robots, feed,
     *    manifest, icons, OG images)
     *  - any request with a file extension
     */
    "/((?!api|_next/static|_next/image|images|sitemap.xml|robots.txt|feed.xml|manifest.webmanifest|icon|apple-icon|opengraph-image|favicon.ico).*)",
  ],
};


// Referenced so the locale list stays a single source of truth.
void locales;
