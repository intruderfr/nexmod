import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { publishedArticles } from "@/lib/content";

/**
 * Sitemap. Scheduled articles are excluded automatically because
 * publishedArticles() filters on date — so a future-dated post never leaks
 * into the sitemap before it goes live.
 *
 * Revalidated daily so newly scheduled content appears without a redeploy.
 */
export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/products"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/ez-lip"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/articles"), lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: url("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: url("/book"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/delivery-returns"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: url(`/categories/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: url(`/products/${p.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: p.featured ? 0.8 : 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: s.featured ? 0.85 : 0.75,
  }));

  const articlePages: MetadataRoute.Sitemap = publishedArticles().map((a) => ({
    url: url(`/articles/${a.slug}`),
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    changeFrequency: "monthly",
    priority: a.featured ? 0.75 : 0.65,
  }));

  return [...staticPages, ...categoryPages, ...servicePages, ...productPages, ...articlePages];
}
