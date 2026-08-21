import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, tableOfContents } from "@/components/ArticleBody";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard, ProductCard } from "@/components/Cards";
import { Faq } from "@/components/Faq";
import { CategoryIcon, IconArrowRight, IconWhatsApp } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { getProduct } from "@/data/products";
import { getService } from "@/data/services";
import { waLink } from "@/data/site";
import {
  formatDate,
  getPublishedArticle,
  publishedArticles,
  relatedArticles,
} from "@/lib/content";
import { clampDescription, pageMeta } from "@/lib/seo";
import { articleSchema, faqSchema } from "@/lib/schema";

/** Hourly revalidation is what makes scheduled publishing work without a deploy. */
export const revalidate = 3600;

/**
 * Only PUBLISHED articles are prerendered. Scheduled ones are deliberately
 * left out: `dynamicParams` defaults to true, so a scheduled slug renders on
 * demand — 404 before its date, 200 the moment the date arrives. Prerendering
 * them instead would bake a static 404 into the build that has to wait for a
 * revalidation window to clear.
 */
export function generateStaticParams() {
  return publishedArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getPublishedArticle(slug);
  if (!article) return {};

  return pageMeta({
    title: article.title,
    description: clampDescription(article.excerpt),
    path: `/articles/${article.slug}`,
    keywords: article.keywords,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt ?? article.publishedAt,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getPublishedArticle(slug);
  if (!article) notFound();

  const toc = tableOfContents(article.body);
  const related = relatedArticles(article, 3);

  const products = (article.relatedProducts ?? [])
    .map(getProduct)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const services = (article.relatedServices ?? [])
    .map(getService)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <>
      <JsonLd data={articleSchema(article)} />
      {article.faqs && article.faqs.length > 0 && <JsonLd data={faqSchema(article.faqs)} />}

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs
          trail={[
            { name: "Articles", path: "/articles" },
            { name: article.title, path: `/articles/${article.slug}` },
          ]}
        />
      </div>

      {/* Header */}
      <header className="container-nex pb-10 border-b border-[var(--border)]">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-[var(--fg-subtle)] mb-5">
            <Link href={`/articles/category/${article.category}`} className="badge badge-accent capitalize">
              {article.category}
            </Link>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <span>{article.author}</span>
          </div>

          <h1 className="text-3xl md:text-5xl mb-5 leading-[1.1]">{article.title}</h1>
          <p className="text-lg md:text-xl text-[var(--fg-muted)] leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </header>

      {/* Body + sidebar */}
      <div className="container-nex py-12">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          <article className="max-w-2xl min-w-0">
            <ArticleBody blocks={article.body} />

            {/* Tags */}
            <div className="mt-12 pt-6 border-t border-[var(--border)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] mr-1">
                  Tagged
                </span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/articles/tag/${encodeURIComponent(tag)}`}
                    className="badge hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Article FAQ */}
            {article.faqs && article.faqs.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl mb-6">Common questions</h2>
                <Faq items={article.faqs} defaultOpen={null} />
              </section>
            )}

            {/* CTA */}
            <aside className="mt-12 surface carbon-texture p-6 md:p-7">
              <p className="eyebrow mb-2.5">Talk to us</p>
              <h2 className="text-xl md:text-2xl mb-2.5">
                Want a straight answer about your car?
              </h2>
              <p className="text-[var(--fg-muted)] leading-relaxed mb-5">
                Send a photo on WhatsApp. We will tell you what we would do first, what we would
                leave alone, and what it costs — with no obligation.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={waLink(
                    `Hi Nexmod, I just read your article "${article.title}" and had a question about my car.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <IconWhatsApp width={17} height={17} />
                  Ask on WhatsApp
                </a>
                <Link href="/book" className="btn btn-outline">
                  Book a fitting
                </Link>
              </div>
            </aside>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {toc.length > 2 && (
                <nav aria-label="On this page">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
                    On this page
                  </h2>
                  <ul className="space-y-2 border-l border-[var(--border)]">
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="block pl-3 -ml-px border-l border-transparent text-[13px] leading-snug text-[var(--fg-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {services.length > 0 && (
                <div>
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
                    Related services
                  </h2>
                  <div className="space-y-2">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="surface surface-hover p-3.5 flex items-start gap-2.5 group"
                      >
                        <span className="shrink-0 grid place-items-center w-8 h-8 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)]">
                          <CategoryIcon name={s.icon} width={15} height={15} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13.5px] font-semibold leading-snug group-hover:text-[var(--accent)] transition-colors">
                            {s.name}
                          </span>
                          <span className="block text-[11.5px] text-[var(--fg-subtle)] mt-0.5">
                            {s.duration}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="surface p-4">
                <p className="text-[13px] font-semibold mb-1.5">Get new guides</p>
                <p className="text-[12.5px] text-[var(--fg-muted)] leading-relaxed mb-3">
                  We publish a new guide most weeks. Subscribe by RSS.
                </p>
                <a href="/feed.xml" className="btn btn-sm btn-outline w-full">
                  RSS feed
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Products */}
      {products.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="container-nex py-14">
            <h2 className="text-2xl md:text-3xl mb-7">Products mentioned</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Read next */}
      {related.length > 0 && (
        <section className="border-t border-[var(--border)]">
          <div className="container-nex py-14">
            <div className="flex items-end justify-between gap-4 mb-7">
              <h2 className="text-2xl md:text-3xl">Read next</h2>
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:text-[var(--accent)] transition-colors"
              >
                All articles
                <IconArrowRight width={15} height={15} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
