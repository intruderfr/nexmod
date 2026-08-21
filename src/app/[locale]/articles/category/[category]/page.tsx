import { LocaleLink as Link } from "@/i18n/client";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/Cards";
import { articleCategories } from "@/data/articles";
import type { Article } from "@/data/types";
import { articlesInCategory } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return articleCategories.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category, locale } = await params;
  const meta = articleCategories.find((c) => c.id === category);
  if (!meta) return {};

  return pageMeta({
    title: `${meta.label} — Car Care Articles`,
    description: `${meta.blurb} Nexmod's ${meta.label.toLowerCase()} on car accessories, modification and care in Sri Lanka.`,
    path: `/articles/category/${meta.id}`,
    keywords: [`car ${meta.label.toLowerCase()} Sri Lanka`, "car modification Sri Lanka"],
    locale,
  });
}

export default async function ArticleCategoryPage({
  params,
}: {
  params: Promise<{ category: string; locale: string }>;
}) {
  const { category, locale } = await params;
  const meta = articleCategories.find((c) => c.id === category);
  if (!meta) notFound();

  const items = articlesInCategory(meta.id as Article["category"]);

  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs
          trail={[
            { name: "Articles", path: "/articles" },
            { name: meta.label, path: `/articles/category/${meta.id}` },
          ]}
        />
      </div>

      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <p className="eyebrow mb-2.5">
          {items.length} {items.length === 1 ? "article" : "articles"}
        </p>
        <h1 className="text-4xl md:text-5xl mb-4">{meta.label}</h1>
        <p className="text-lg text-[var(--fg-muted)] max-w-2xl leading-relaxed mb-6">{meta.blurb}</p>

        <div className="flex flex-wrap gap-2">
          <Link href="/articles" className="badge hover:border-[var(--accent)] hover:text-[var(--accent)]">
            All articles
          </Link>
          {articleCategories
            .filter((c) => c.id !== meta.id && articlesInCategory(c.id).length > 0)
            .map((c) => (
              <Link
                key={c.id}
                href={`/articles/category/${c.id}`}
                className="badge hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {c.label}
              </Link>
            ))}
        </div>
      </section>

      <section className="container-nex py-12 md:py-16">
        {items.length === 0 ? (
          <p className="text-[var(--fg-muted)]">Nothing published in this category yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {items.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
