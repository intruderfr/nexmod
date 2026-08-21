import { site } from "@/data/site";
import { publishedArticles } from "@/lib/content";

/** Required so this route can be emitted by `output: export`. */
export const dynamic = "force-static";

/**
 * RSS 2.0 feed.
 *
 * Revalidated hourly so a scheduled article appears in the feed on its publish
 * date without needing a deploy.
 */
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const posts = publishedArticles();
  const updated = posts[0]?.publishedAt ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const url = `${site.url}/articles/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${escapeXml(site.contact.email)} (${escapeXml(post.author)})</author>
      <category>${escapeXml(post.category)}</category>
${post.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} — Articles &amp; News</title>
    <link>${site.url}/articles</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-lk</language>
    <copyright>Copyright ${new Date().getFullYear()} ${escapeXml(site.legalName)}</copyright>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
