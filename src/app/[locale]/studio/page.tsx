import { LocaleLink as Link } from "@/i18n/client";
import { IconArrowRight, IconCalendar, IconCheck, IconSearch } from "@/components/Icons";
import { articlePipeline, keywordMap, localSeoChecklist, weeklyPlan } from "@/data/calendar";
import { publishedArticles, scheduledArticles } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

/**
 * INTERNAL SEO STUDIO — noindex, not linked from public navigation.
 *
 * A working tool for whoever runs Nexmod's marketing: the weekly posting
 * rhythm, the article pipeline, the local SEO checklist and the keyword map,
 * all rendered from src/data/calendar.ts.
 */

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "SEO Studio — Internal",
  description: "Internal content calendar and SEO checklist for Nexmod.",
  path: "/studio",
  noindex: true,
    locale,
  });
}

export default function StudioPage() {
  const live = publishedArticles();
  const queued = scheduledArticles();
  const critical = localSeoChecklist.filter((c) => c.priority === "critical");
  const planned = articlePipeline.filter((p) => p.status === "planned");

  return (
    <>
      <section className="container-nex pt-10 pb-8 border-b border-[var(--border)]">
        <span className="badge badge-accent mb-4">Internal — not indexed</span>
        <h1 className="text-display-2 mb-4">SEO Studio</h1>
        <p className="text-lede">
          The posting plan, the article pipeline and the local SEO checklist. Everything here is
          driven by <code className="text-[var(--accent)]">src/data/calendar.ts</code> — edit that
          file and this page updates.
        </p>

        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {[
            { value: live.length, label: "Articles live" },
            { value: queued.length, label: "Scheduled to publish" },
            { value: planned.length, label: "Planned, not yet written" },
            { value: critical.length, label: "Critical SEO tasks" },
          ].map((s) => (
            <div key={s.label} className="surface p-4">
              <dd className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--accent)] tabular-nums leading-none mb-1.5">
                {s.value}
              </dd>
              <dt className="text-[12.5px] text-[var(--fg-muted)] leading-snug">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* How scheduling works */}
      <section className="container-nex py-12 md:py-16 border-b border-[var(--border)]">
        <div className="surface p-6 max-w-3xl">
          <h2 className="flex items-center gap-2.5 text-xl mb-3">
            <IconCalendar width={20} height={20} className="text-[var(--accent)]" />
            How scheduled publishing works
          </h2>
          <ol className="space-y-2.5 text-[14.5px] text-[var(--fg-muted)] leading-relaxed">
            <li>
              <strong className="text-[var(--fg)]">1.</strong> Add an article to{" "}
              <code className="text-[var(--accent)]">src/data/articles.ts</code> with a{" "}
              <code className="text-[var(--accent)]">publishedAt</code> date in the future.
            </li>
            <li>
              <strong className="text-[var(--fg)]">2.</strong> It stays hidden from the site, the
              sitemap and the RSS feed until that date arrives. Nothing leaks early.
            </li>
            <li>
              <strong className="text-[var(--fg)]">3.</strong> Article pages revalidate hourly, so
              it goes live on its date with no deploy needed.
            </li>
            <li>
              <strong className="text-[var(--fg)]">4.</strong> On publish day, request indexing in
              Google Search Console (URL Inspection → Request Indexing) and post the link to Google
              Business Profile.
            </li>
          </ol>
        </div>
      </section>

      {/* Scheduled queue */}
      {queued.length > 0 && (
        <section className="container-nex py-12 md:py-16 border-b border-[var(--border)]">
          <h2 className="text-heading mb-6">Publishing queue</h2>
          <div className="surface overflow-hidden">
            <div className="scroll-x">
              <table className="w-full text-left border-collapse min-w-[40rem]">
                <thead>
                  <tr className="bg-[var(--bg-inset)]">
                    {["Publish date", "Title", "Category", "Read time"].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] border-b border-[var(--border)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queued.map((a) => (
                    <tr key={a.slug} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3 text-[13.5px] font-mono tabular-nums text-[var(--accent)]">
                        {a.publishedAt}
                      </td>
                      <td className="px-4 py-3 text-[13.5px] font-medium">{a.title}</td>
                      <td className="px-4 py-3 text-[13.5px] text-[var(--fg-muted)] capitalize">
                        {a.category}
                      </td>
                      <td className="px-4 py-3 text-[13.5px] text-[var(--fg-muted)] tabular-nums">
                        {a.readingMinutes} min
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Weekly rhythm */}
      <section className="container-nex py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-2xl mb-7">
          <h2 className="text-heading mb-3">Weekly posting rhythm</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed">
            Google Business Profile posts expire after seven days, so consistency matters more than
            volume. This is a repeatable cycle — the copy templates are ready to fill in and paste.
          </p>
        </div>

        <div className="space-y-4">
          {weeklyPlan.map((day) => (
            <details key={day.day} className="surface overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                <span className="min-w-0">
                  <span className="flex items-center gap-3 mb-1">
                    <span className="badge badge-accent">{day.day}</span>
                    <span className="font-semibold text-[15.5px]">{day.theme}</span>
                  </span>
                  <span className="block text-[13px] text-[var(--fg-muted)] leading-relaxed">
                    {day.why}
                  </span>
                </span>
                <span className="shrink-0 text-[var(--fg-subtle)] group-open:rotate-90 transition-transform">
                  <IconArrowRight width={17} height={17} />
                </span>
              </summary>

              <div className="px-5 pb-5 space-y-4 border-t border-[var(--border)] pt-5">
                {day.posts.map((post, i) => (
                  <div key={i} className="rounded-lg border border-[var(--border)] p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="badge uppercase">{post.channel}</span>
                      {post.gbpType && <span className="badge">{post.gbpType}</span>}
                      <span className="text-[13px] font-semibold">{post.title}</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-[var(--fg-muted)] bg-[var(--bg-inset)] rounded-md p-3.5 mb-3">
                      {post.body}
                    </pre>
                    <dl className="space-y-1.5 text-[12.5px]">
                      <div className="flex gap-2">
                        <dt className="text-[var(--fg-subtle)] shrink-0">CTA:</dt>
                        <dd className="font-medium">{post.cta}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt className="text-[var(--fg-subtle)] shrink-0">Media:</dt>
                        <dd className="text-[var(--fg-muted)]">{post.media}</dd>
                      </div>
                      {post.hashtags && (
                        <div className="flex gap-2">
                          <dt className="text-[var(--fg-subtle)] shrink-0">Tags:</dt>
                          <dd className="text-[var(--accent)]">{post.hashtags.join(" ")}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="container-nex py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-2xl mb-7">
          <h2 className="text-heading mb-3">Local SEO checklist</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed">
            Ranked by impact. The critical items are where nearly all the local-pack visibility
            comes from — and most competitors have not done them.
          </p>
        </div>

        <div className="space-y-3">
          {localSeoChecklist.map((item) => (
            <div key={item.task} className="surface p-5">
              <div className="flex flex-wrap items-start gap-3 mb-2">
                <span
                  className={`shrink-0 grid place-items-center w-5 h-5 mt-0.5 rounded border ${
                    item.priority === "critical"
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-[var(--border-strong)] text-[var(--fg-subtle)]"
                  }`}
                >
                  <IconCheck width={12} height={12} strokeWidth={2.5} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-semibold text-[15px] leading-snug mb-1.5">
                    {item.task}
                  </span>
                  <span className="flex flex-wrap gap-1.5 mb-2">
                    <span
                      className={item.priority === "critical" ? "badge badge-accent" : "badge"}
                    >
                      {item.priority}
                    </span>
                    <span className="badge">{item.frequency}</span>
                  </span>
                  <span className="block text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
                    {item.detail}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Keyword map */}
      <section className="container-nex py-12 md:py-16 border-b border-[var(--border)]">
        <div className="max-w-2xl mb-7">
          <h2 className="flex items-center gap-2.5 text-heading mb-3">
            <IconSearch width={22} height={22} className="text-[var(--accent)]" />
            Keyword map
          </h2>
          <p className="text-[var(--fg-muted)] leading-relaxed">
            One target keyword per page, so pages never compete with each other. Difficulty is a
            judgement call, not a tool figure — verify with real data once Search Console has
            history.
          </p>
        </div>

        <div className="surface overflow-hidden">
          <div className="scroll-x">
            <table className="w-full text-left border-collapse min-w-[48rem]">
              <thead>
                <tr className="bg-[var(--bg-inset)]">
                  {["Keyword", "Target page", "Intent", "Difficulty", "Note"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] border-b border-[var(--border)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {keywordMap.map((k) => (
                  <tr key={k.keyword} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3 text-[13.5px] font-medium">{k.keyword}</td>
                    <td className="px-4 py-3 text-[13px]">
                      <Link href={k.page} className="text-[var(--accent)] font-mono">
                        {k.page}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--fg-muted)] capitalize">
                      {k.intent}
                    </td>
                    <td className="px-4 py-3 text-[13px]">
                      <span
                        className={
                          k.difficulty === "low"
                            ? "badge badge-stock"
                            : k.difficulty === "high"
                              ? "badge badge-accent"
                              : "badge"
                        }
                      >
                        {k.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12.5px] text-[var(--fg-muted)] leading-snug max-w-xs">
                      {k.note ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="container-nex py-12 md:py-16">
        <div className="max-w-2xl mb-7">
          <h2 className="text-heading mb-3">Article pipeline</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed">
            Write these in order. Model-specific guides are the biggest untapped opportunity — one
            per popular Sri Lankan model, and almost nobody is targeting them.
          </p>
        </div>

        <div className="surface overflow-hidden">
          <div className="scroll-x">
            <table className="w-full text-left border-collapse min-w-[46rem]">
              <thead>
                <tr className="bg-[var(--bg-inset)]">
                  {["Status", "Date", "Title", "Target keyword", "Drives to"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] border-b border-[var(--border)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articlePipeline.map((p) => (
                  <tr key={p.title} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-3">
                      <span
                        className={
                          p.status === "published"
                            ? "badge badge-stock"
                            : p.status === "scheduled"
                              ? "badge badge-accent"
                              : "badge"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] font-mono tabular-nums text-[var(--fg-muted)]">
                      {p.publishDate ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[13.5px] font-medium">
                      {p.title}
                      {p.notes && (
                        <span className="block text-[12px] text-[var(--fg-subtle)] mt-0.5 font-normal leading-snug">
                          {p.notes}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--fg-muted)]">
                      {p.targetKeyword}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-mono text-[var(--fg-subtle)]">
                      {p.drivesTo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
