import type { MetadataRoute } from "next";

import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { localeMeta, locales } from "@/i18n/config";
import { publishedArticles } from "@/lib/content";

/** Required so this route can be emitted by `output: export`. */
export const dynamic = "force-static";

/**
 * Sitemap.
 *
 * Every path is emitted once per locale, and each entry carries the full
 * `alternates.languages` set so Google can see the translation cluster from
 * the sitemap alone rather than having to crawl each page for hreflang.
 *
 * Scheduled articles are excluded automatically, because publishedArticles()
 * filters on date — a future-dated post never leaks in before it goes live.
 *
 * Revalidated daily so newly scheduled content appears without a redeploy.
 */
export const revalidate = 86400;

interface Entry {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  lastModified?: Date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: Entry[] = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/products", changeFrequency: "weekly", priority: 0.9 },
    { path: "/services", changeFrequency: "monthly", priority: 0.9 },
    { path: "/ez-lip", changeFrequency: "monthly", priority: 0.9 },
    { path: "/packages", changeFrequency: "weekly", priority: 0.9 },
    { path: "/build", changeFrequency: "monthly", priority: 0.85 },
    { path: "/gallery", changeFrequency: "weekly", priority: 0.8 },
    { path: "/articles", changeFrequency: "daily", priority: 0.8 },
    { path: "/book", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.7 },
    { path: "/about", changeFrequency: "yearly", priority: 0.6 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
    { path: "/delivery-returns", changeFrequency: "yearly", priority: 0.4 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },

    ...categories.map((c) => ({
      path: `/categories/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...services.map((s) => ({
      path: `/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: s.featured ? 0.85 : 0.75,
    })),

    ...products.map((p) => ({
      path: `/products/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: p.featured ? 0.8 : 0.7,
    })),

    ...publishedArticles().map((a) => ({
      path: `/articles/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: a.featured ? 0.75 : 0.65,
      lastModified: new Date(a.updatedAt ?? a.publishedAt),
    })),
  ];

  return entries.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${entry.path}`,
      lastModified: entry.lastModified ?? now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [localeMeta[l].htmlLang, `${site.url}/${l}${entry.path}`]),
          ),
          "x-default": `${site.url}/en${entry.path}`,
        },
      },
    })),
  );
}
