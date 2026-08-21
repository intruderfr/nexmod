import { LocaleLink as Link } from "@/i18n/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/Cards";
import { JsonLd } from "@/components/JsonLd";
import { articleCategories } from "@/data/articles";
import { site } from "@/data/site";
import { allTags, articlesInCategory, publishedArticles } from "@/lib/content";
import { absoluteUrl, pageMeta } from "@/lib/seo";

/**
 * Revalidated hourly so scheduled articles appear on their publish date
 * without a redeploy.
 */
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "Car Care Articles, Guides & News",
  description:
    "Honest guides to car modification in Sri Lanka — what things cost, how long they last, and which upgrades are worth the money in tropical conditions. From the Nexmod workshop in Dehiwala.",
  path: "/articles",
  keywords: [
    "car modification guide Sri Lanka",
    "car accessories guide Sri Lanka",
    "car care tips Sri Lanka",
    "car modification blog Colombo",
  ],
    locale,
  });
}

export default function ArticlesPage() {
  const all = publishedArticles();
  const [lead, ...rest] = all;
  const tags = allTags().slice(0, 14);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} Articles`,
    description: site.description,
    url: absoluteUrl("/articles"),
    inLanguage: "en-LK",
    blogPost: all.slice(0, 20).map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: absoluteUrl(`/articles/${a.slug}`),
      datePublished: a.publishedAt,
      description: a.excerpt,
    })),
  };

  return (
    <>
      <JsonLd data={blogSchema} />

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Articles", path: "/articles" }]} />
      </div>

      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <p className="eyebrow mb-2.5">Articles &amp; news</p>
        <h1 className="text-4xl md:text-5xl mb-4 max-w-2xl">Know before you spend.</h1>
        <p className="text-lg text-[var(--fg-muted)] leading-relaxed max-w-2xl mb-6">
          Guides written from the workshop floor. Real Sri Lankan prices, realistic lifespans in
          tropical sun, and the details that decide whether work lasts — including the parts that
          cost us sales to say out loud.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/articles" className="badge badge-accent">
            All ({all.length})
          </Link>
          {articleCategories.map((c) => {
            const count = articlesInCategory(c.id).length;
            if (count === 0) return null;
            return (
              <Link
                key={c.id}
                href={`/articles/category/${c.id}`}
                className="badge hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {c.label} ({count})
              </Link>
            );
          })}
          <a
            href="/feed.xml"
            className="badge hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors ml-auto"
          >
            RSS feed
          </a>
        </div>
      </section>

      <section className="container-nex py-12 md:py-16">
        {lead && (
          <div className="mb-8">
            <ArticleCard article={lead} featured />
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {rest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* Tag cloud — internal linking surface for SEO */}
      {tags.length > 0 && (
        <section className="border-t border-[var(--border)]">
          <div className="container-nex py-12 md:py-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
              Browse by topic
            </h2>
            <div className="flex flex-wrap gap-2">
              {tags.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/articles/tag/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[13px] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {tag}
                  <span className="text-[11px] text-[var(--fg-subtle)] tabular-nums">{count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
