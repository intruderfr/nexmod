import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/Cards";
import { allTags, articlesWithTag } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return allTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: raw } = await params;
  const tag = decodeURIComponent(raw);
  const items = articlesWithTag(tag);
  if (items.length === 0) return {};

  return pageMeta({
    title: `${tag} — Articles`,
    description: `${items.length} Nexmod ${items.length === 1 ? "article" : "articles"} about ${tag} — practical guidance for car owners in Sri Lanka.`,
    path: `/articles/tag/${encodeURIComponent(tag)}`,
    keywords: [`${tag} Sri Lanka`, `car ${tag}`, "car modification Sri Lanka"],
  });
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: raw } = await params;
  const tag = decodeURIComponent(raw);
  const items = articlesWithTag(tag);
  if (items.length === 0) notFound();

  const others = allTags().filter((t) => t.tag !== tag).slice(0, 12);

  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs
          trail={[
            { name: "Articles", path: "/articles" },
            { name: tag, path: `/articles/tag/${encodeURIComponent(tag)}` },
          ]}
        />
      </div>

      <section className="container-nex pb-10 border-b border-[var(--border)]">
        <p className="eyebrow mb-2.5">Topic</p>
        <h1 className="text-4xl md:text-5xl mb-3 capitalize">{tag}</h1>
        <p className="text-lg text-[var(--fg-muted)]">
          {items.length} {items.length === 1 ? "article" : "articles"}
        </p>
      </section>

      <section className="container-nex py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {items.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="border-t border-[var(--border)]">
          <div className="container-nex py-12">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
              Other topics
            </h2>
            <div className="flex flex-wrap gap-2">
              {others.map(({ tag: t, count }) => (
                <Link
                  key={t}
                  href={`/articles/tag/${encodeURIComponent(t)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[13px] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {t}
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
