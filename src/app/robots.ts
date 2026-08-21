import type { MetadataRoute } from "next";

import { site } from "@/data/site";

/** Required so this route can be emitted by `output: export`. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /studio is the internal SEO planning tool; /checkout and /cart have
        // no crawlable value and should never appear in results.
        disallow: ["/studio", "/studio/", "/checkout", "/api/"],
      },
      // Give the major crawlers an explicit allow so nothing is ambiguous.
      { userAgent: "Googlebot", allow: "/", disallow: ["/studio", "/checkout", "/api/"] },
      { userAgent: "Bingbot", allow: "/", disallow: ["/studio", "/checkout", "/api/"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
