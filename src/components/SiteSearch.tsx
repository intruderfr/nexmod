"use client";

import { LocaleLink as Link } from "@/i18n/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getCategory } from "@/data/categories";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { lkr, waLink } from "@/data/site";
import type { Article, Product, Service } from "@/data/types";
import { publishedArticles } from "@/lib/content";
import { CategoryIcon, IconArrowRight, IconSearch, IconWhatsApp } from "./Icons";

type Result =
  | { kind: "product"; score: number; item: Product }
  | { kind: "service"; score: number; item: Service }
  | { kind: "article"; score: number; item: Article };

/**
 * Site-wide search across products, services and articles.
 *
 * Scores field matches by weight rather than treating every hit equally, so a
 * name match outranks a passing mention in body copy. The dataset is small
 * enough to search in the browser; if it grows past a few hundred items this
 * should move to a server route or a search index.
 */
function score(haystack: { text: string; weight: number }[], terms: string[]): number {
  let total = 0;
  for (const term of terms) {
    for (const field of haystack) {
      const text = field.text.toLowerCase();
      if (text.includes(term)) {
        // An exact word boundary match is worth more than a substring.
        total += new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(text)
          ? field.weight * 2
          : field.weight;
      }
    }
  }
  return total;
}

export function SiteSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  const results = useMemo<Result[]>(() => {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 1);

    if (terms.length === 0) return [];

    const out: Result[] = [];

    for (const item of products) {
      const s = score(
        [
          { text: item.name, weight: 10 },
          { text: item.tagline, weight: 5 },
          { text: item.brand ?? "", weight: 6 },
          { text: item.keywords.join(" "), weight: 4 },
          { text: (item.fitment ?? []).join(" "), weight: 3 },
          { text: item.highlights.join(" "), weight: 2 },
          { text: item.body.join(" "), weight: 1 },
        ],
        terms,
      );
      if (s > 0) out.push({ kind: "product", score: s, item });
    }

    for (const item of services) {
      const s = score(
        [
          { text: item.name, weight: 10 },
          { text: item.tagline, weight: 5 },
          { text: item.keywords.join(" "), weight: 4 },
          { text: item.includes.join(" "), weight: 2 },
          { text: item.body.join(" "), weight: 1 },
        ],
        terms,
      );
      if (s > 0) out.push({ kind: "service", score: s, item });
    }

    for (const item of publishedArticles()) {
      const s = score(
        [
          { text: item.title, weight: 9 },
          { text: item.excerpt, weight: 5 },
          { text: item.keywords.join(" "), weight: 4 },
          { text: item.tags.join(" "), weight: 3 },
        ],
        terms,
      );
      if (s > 0) out.push({ kind: "article", score: s, item });
    }

    return out.sort((a, b) => b.score - a.score);
  }, [query]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Keep the URL shareable and Search Console friendly.
    router.replace(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  const grouped = {
    product: results.filter((r) => r.kind === "product"),
    service: results.filter((r) => r.kind === "service"),
    article: results.filter((r) => r.kind === "article"),
  };

  return (
    <>
      <form onSubmit={onSubmit} className="relative max-w-xl mb-8">
        <IconSearch
          width={18}
          height={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)] pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “ez lip”, “carbon”, “tint”, “Vezel”…"
          aria-label="Search the site"
          autoFocus
          className="field pl-11 pr-4 py-4 text-base"
        />
      </form>

      {query.trim().length < 2 ? (
        <div className="max-w-xl">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
            Popular searches
          </h2>
          <div className="flex flex-wrap gap-2">
            {["EZ Lip", "carbon fibre", "window tint", "tyre stickers", "sound deadening", "360 camera", "spoiler", "DRL", "seat covers"].map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-[13.5px] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  {term}
                </button>
              ),
            )}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="surface p-10 max-w-xl">
          <p className="font-semibold mb-2">Nothing matched &ldquo;{query}&rdquo;</p>
          <p className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed mb-5">
            We source parts to order, so it is worth asking even if it is not listed. Send us a
            photo of your car and tell us what you are after.
          </p>
          <a
            href={waLink(`Hi Nexmod, do you have or can you source: ${query}?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <IconWhatsApp width={17} height={17} />
            Ask us about it
          </a>
        </div>
      ) : (
        <div className="space-y-10">
          <p className="text-[13px] text-[var(--fg-subtle)]" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
          </p>

          {grouped.product.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
                Products ({grouped.product.length})
              </h2>
              <div className="space-y-2">
                {grouped.product.map((r) => {
                  const p = r.item as Product;
                  const cat = getCategory(p.category);
                  return (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="surface surface-hover p-4 flex items-center gap-4 group"
                    >
                      <span className="shrink-0 grid place-items-center w-10 h-10 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)]">
                        <CategoryIcon name={cat?.icon ?? "tool"} width={18} height={18} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-[15px] leading-snug group-hover:text-[var(--accent)] transition-colors">
                          {p.name}
                        </span>
                        <span className="block text-[13px] text-[var(--fg-muted)] leading-snug mt-0.5 line-clamp-1">
                          {p.tagline}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-[15px] font-bold tabular-nums">
                          {lkr(p.price)}
                        </span>
                        <span className="block text-[11px] text-[var(--fg-subtle)]">
                          {cat?.name}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {grouped.service.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
                Services ({grouped.service.length})
              </h2>
              <div className="space-y-2">
                {grouped.service.map((r) => {
                  const s = r.item as Service;
                  return (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="surface surface-hover p-4 flex items-center gap-4 group"
                    >
                      <span className="shrink-0 grid place-items-center w-10 h-10 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)]">
                        <CategoryIcon name={s.icon} width={18} height={18} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-[15px] leading-snug group-hover:text-[var(--accent)] transition-colors">
                          {s.name}
                        </span>
                        <span className="block text-[13px] text-[var(--fg-muted)] leading-snug mt-0.5 line-clamp-1">
                          {s.tagline}
                        </span>
                      </span>
                      <IconArrowRight
                        width={16}
                        height={16}
                        className="shrink-0 text-[var(--fg-subtle)] group-hover:text-[var(--accent)] transition-colors"
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {grouped.article.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
                Articles ({grouped.article.length})
              </h2>
              <div className="space-y-2">
                {grouped.article.map((r) => {
                  const a = r.item as Article;
                  return (
                    <Link
                      key={a.slug}
                      href={`/articles/${a.slug}`}
                      className="surface surface-hover p-4 group block"
                    >
                      <span className="flex items-center gap-2 mb-1">
                        <span className="badge badge-accent capitalize">{a.category}</span>
                        <span className="text-[11.5px] text-[var(--fg-subtle)]">
                          {a.readingMinutes} min read
                        </span>
                      </span>
                      <span className="block font-semibold text-[15px] leading-snug group-hover:text-[var(--accent)] transition-colors">
                        {a.title}
                      </span>
                      <span className="block text-[13px] text-[var(--fg-muted)] leading-snug mt-1 line-clamp-2">
                        {a.excerpt}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
