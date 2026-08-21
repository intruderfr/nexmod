import { articles } from "@/data/articles";
import type { Article } from "@/data/types";

/**
 * SCHEDULED PUBLISHING
 *
 * An article is live once its `publishedAt` date has arrived. Anything dated in
 * the future is filtered out of the site, the sitemap and the RSS feed —
 * so scheduling a post is just a matter of setting a future date.
 *
 * Pages that list articles use `revalidate` so the site re-renders periodically
 * and scheduled posts appear without a redeploy.
 */

/** Midnight UTC today — comparing date-only avoids timezone edge cases. */
function today(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function isPublished(article: Article, at: Date = today()): boolean {
  return new Date(article.publishedAt) <= at;
}

/** All live articles, newest first. */
export function publishedArticles(): Article[] {
  return articles
    .filter((a) => isPublished(a))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

/** Articles queued for future publication — used by the internal calendar page. */
export function scheduledArticles(): Article[] {
  return articles
    .filter((a) => !isPublished(a))
    .sort((a, b) => +new Date(a.publishedAt) - +new Date(b.publishedAt));
}

export function getPublishedArticle(slug: string): Article | undefined {
  const article = articles.find((a) => a.slug === slug);
  return article && isPublished(article) ? article : undefined;
}

export function articlesInCategory(category: Article["category"]): Article[] {
  return publishedArticles().filter((a) => a.category === category);
}

export function featuredArticles(limit = 3): Article[] {
  const live = publishedArticles();
  const featured = live.filter((a) => a.featured);
  return [...featured, ...live.filter((a) => !a.featured)].slice(0, limit);
}

export function latestArticles(limit = 6): Article[] {
  return publishedArticles().slice(0, limit);
}

/** Articles sharing tags with the given one, for the "read next" block. */
export function relatedArticles(article: Article, limit = 3): Article[] {
  const scored = publishedArticles()
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({
      article: a,
      score:
        a.tags.filter((t) => article.tags.includes(t)).length * 2 +
        (a.category === article.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.article);
}

/** All distinct tags across live articles, most used first. */
export function allTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const a of publishedArticles()) {
    for (const t of a.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function articlesWithTag(tag: string): Article[] {
  return publishedArticles().filter((a) => a.tags.includes(tag));
}

/** Human-readable date, e.g. "20 August 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Short form, e.g. "20 Aug 2026". */
export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
