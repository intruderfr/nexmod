"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { lkr } from "@/data/site";
import { href } from "@/i18n/config";
import { useDictionary, useLocale } from "@/i18n/client";
import { publishedArticles } from "@/lib/content";
import { usePrefs } from "@/lib/prefs";
import type { ReactNode } from "react";
import { CategoryIcon, IconArrowRight, IconClock, IconSearch } from "./Icons";

/**
 * Command palette.
 *
 * Opens on ⌘K / Ctrl-K, or "/" when focus is not already in a field. Searches
 * products, services, categories and articles in one list, and also exposes
 * navigation actions so the whole site is reachable from the keyboard.
 *
 * Results are scored rather than filtered: a name match outranks a keyword
 * match, which outranks a body-copy match. Without that, typing "carbon"
 * returns thirty items in arbitrary order and the feature is useless.
 */

type Kind = "product" | "service" | "category" | "article" | "action";

interface Item {
  kind: Kind;
  id: string;
  title: string;
  subtitle: string;
  path: string;
  icon: string;
  meta?: string;
  /** Static weight, so short high-value pages can outrank long ones. */
  boost?: number;
}

const KIND_LABEL: Record<Kind, string> = {
  action: "Go to",
  product: "Products",
  service: "Services",
  category: "Categories",
  article: "Articles",
};

const KIND_ORDER: Kind[] = ["action", "product", "service", "category", "article"];

export function CommandPalette() {
  const router = useRouter();
  const locale = useLocale();
  const dict = useDictionary();
  const { recent } = usePrefs();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* ------------------------------------------------------------- corpus */

  const corpus = useMemo<Item[]>(() => {
    const actions: Item[] = [
      { kind: "action", id: "a-build", title: "Build Studio", subtitle: "Upload your car and configure a build", path: "/build", icon: "tool", boost: 6 },
      { kind: "action", id: "a-products", title: dict.nav.allProducts, subtitle: "Browse the full catalogue", path: "/products", icon: "carbon", boost: 4 },
      { kind: "action", id: "a-services", title: dict.nav.allServices, subtitle: "Twelve workshop services", path: "/services", icon: "tool", boost: 4 },
      { kind: "action", id: "a-gallery", title: "Gallery", subtitle: "Recent work from the workshop", path: "/gallery", icon: "camera", boost: 4 },
      { kind: "action", id: "a-compare", title: "Compare", subtitle: "Products side by side", path: "/compare", icon: "essentials", boost: 3 },
      { kind: "action", id: "a-book", title: dict.actions.bookFitting, subtitle: "Pick a slot at Dehiwala", path: "/book", icon: "interior", boost: 5 },
      { kind: "action", id: "a-ezlip", title: "EZ Lip Sri Lanka", subtitle: "Official agent", path: "/ez-lip", icon: "lip", boost: 5 },
      { kind: "action", id: "a-contact", title: dict.nav.contact, subtitle: "Address, hours and directions", path: "/contact", icon: "essentials", boost: 3 },
      { kind: "action", id: "a-faq", title: dict.common.faq, subtitle: "Delivery, warranty and returns", path: "/faq", icon: "essentials", boost: 2 },
    ];

    const productItems: Item[] = products.map((p) => ({
      kind: "product",
      id: `p-${p.slug}`,
      title: p.name,
      subtitle: p.tagline,
      path: `/products/${p.slug}`,
      icon: categories.find((c) => c.slug === p.category)?.icon ?? "tool",
      meta: lkr(p.price),
      boost: p.featured ? 2 : 0,
    }));

    const serviceItems: Item[] = services.map((s) => ({
      kind: "service",
      id: `s-${s.slug}`,
      title: s.name,
      subtitle: s.tagline,
      path: `/services/${s.slug}`,
      icon: s.icon,
      meta: s.duration,
      boost: s.featured ? 2 : 0,
    }));

    const categoryItems: Item[] = categories.map((c) => ({
      kind: "category",
      id: `c-${c.slug}`,
      title: c.name,
      subtitle: c.tagline,
      path: `/categories/${c.slug}`,
      icon: c.icon,
      boost: 1,
    }));

    const articleItems: Item[] = publishedArticles().map((a) => ({
      kind: "article",
      id: `a-${a.slug}`,
      title: a.title,
      subtitle: a.excerpt,
      path: `/articles/${a.slug}`,
      icon: "carbon",
      meta: `${a.readingMinutes} ${dict.common.minRead}`,
    }));

    return [...actions, ...productItems, ...serviceItems, ...categoryItems, ...articleItems];
  }, [dict]);

  /** Extra searchable text per item, kept out of the render path. */
  const haystacks = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) {
      map.set(
        `p-${p.slug}`,
        [p.brand ?? "", ...p.keywords, ...(p.fitment ?? []), ...p.highlights].join(" ").toLowerCase(),
      );
    }
    for (const s of services) {
      map.set(`s-${s.slug}`, [...s.keywords, ...s.includes].join(" ").toLowerCase());
    }
    for (const c of categories) map.set(`c-${c.slug}`, c.keywords.join(" ").toLowerCase());
    for (const a of publishedArticles()) {
      map.set(`a-${a.slug}`, [...a.keywords, ...a.tags].join(" ").toLowerCase());
    }
    return map;
  }, []);

  /* -------------------------------------------------------------- search */

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      // Empty state: recently viewed first, then the primary actions.
      const recentItems = recent
        .map((slug) => corpus.find((i) => i.id === `p-${slug}`))
        .filter((i): i is Item => Boolean(i))
        .slice(0, 4);
      const actions = corpus.filter((i) => i.kind === "action").slice(0, 6);
      return [...recentItems, ...actions];
    }

    const terms = q.split(/\s+/).filter(Boolean);

    return corpus
      .map((item) => {
        const title = item.title.toLowerCase();
        const subtitle = item.subtitle.toLowerCase();
        const extra = haystacks.get(item.id) ?? "";

        let score = item.boost ?? 0;
        for (const term of terms) {
          if (title.startsWith(term)) score += 14;
          else if (title.includes(term)) score += 9;
          if (new RegExp(`\\b${escapeRe(term)}`).test(title)) score += 4;
          if (subtitle.includes(term)) score += 3;
          if (extra.includes(term)) score += 2;
        }

        // Every term must appear somewhere, or "carbon audio" matches both.
        const all = terms.every(
          (t) => title.includes(t) || subtitle.includes(t) || extra.includes(t),
        );
        return { item, score: all ? score : 0 };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 24)
      .map((r) => r.item);
  }, [query, corpus, haystacks, recent]);

  /** Results flattened in display order, so arrow keys move through groups. */
  const grouped = useMemo(() => {
    const groups = new Map<Kind, Item[]>();
    for (const item of results) {
      const list = groups.get(item.kind) ?? [];
      list.push(item);
      groups.set(item.kind, list);
    }
    return KIND_ORDER.filter((k) => groups.has(k)).map((k) => ({
      kind: k,
      items: groups.get(k) as Item[],
    }));
  }, [results]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  /* -------------------------------------------------------------- keys */

  const go = useCallback(
    (item: Item) => {
      setOpen(false);
      setQuery("");
      router.push(href(locale, item.path));
    },
    [router, locale],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => (flat.length ? (c + 1) % flat.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => (flat.length ? (c - 1 + flat.length) % flat.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flat[cursor];
        if (item) go(item);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, cursor, go]);

  useEffect(() => setCursor(0), [query]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Delay so the input exists before we reach for it.
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keep the highlighted row in view as the cursor moves.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  /* ------------------------------------------------------------- render */

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.nav.search}
        className="group hidden md:flex items-center gap-2.5 h-9 pl-3 pr-2 rounded-lg border border-[var(--border)] bg-[var(--bg-inset)] text-[var(--fg-subtle)] hover:border-[var(--border-strong)] hover:text-[var(--fg-muted)] transition-colors"
      >
        <IconSearch width={15} height={15} />
        <span className="text-[13px]">{dict.nav.search}</span>
        <kbd className="ml-3 px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--bg)] font-[family-name:var(--font-mono)] text-[10px] leading-none">
          ⌘K
        </kbd>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.nav.search}
        className="md:hidden grid place-items-center w-10 h-10 rounded-md text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-inset)] transition-colors"
      >
        <IconSearch width={18} height={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-start justify-center p-4 pt-[10vh]"
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.search}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-2xl surface shadow-2xl overflow-hidden animate-fade-up">
            <div className="flex items-center gap-3 px-4 border-b border-[var(--border)]">
              <IconSearch width={18} height={18} className="text-[var(--fg-subtle)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, services, guides…"
                aria-label={dict.nav.search}
                className="flex-1 bg-transparent border-0 outline-none py-4 text-[15px] placeholder:text-[var(--fg-faint)]"
              />
              <kbd className="hidden sm:block shrink-0 px-1.5 py-0.5 rounded border border-[var(--border)] font-[family-name:var(--font-mono)] text-[10px] text-[var(--fg-subtle)]">
                ESC
              </kbd>
            </div>

            <ul ref={listRef} className="max-h-[min(28rem,60vh)] overflow-y-auto p-2">
              {flat.length === 0 ? (
                <li className="px-4 py-10 text-center">
                  <p className="font-semibold mb-1.5">No matches for &ldquo;{query}&rdquo;</p>
                  <p className="text-[13.5px] text-[var(--fg-muted)]">
                    We source parts to order — ask us on WhatsApp even if it is not listed.
                  </p>
                </li>
              ) : (
                grouped.map((group) => (
                  <li key={group.kind}>
                    <p className="px-3 pt-3 pb-1.5 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                      {KIND_LABEL[group.kind]}
                    </p>
                    <ul>
                      {group.items.map((item) => {
                        const index = flat.indexOf(item);
                        const active = index === cursor;
                        return (
                          <li key={item.id} data-index={index}>
                            <button
                              type="button"
                              onMouseEnter={() => setCursor(index)}
                              onClick={() => go(item)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                                active ? "bg-[var(--accent-subtle)]" : ""
                              }`}
                            >
                              <span
                                className={`shrink-0 grid place-items-center w-8 h-8 rounded-md transition-colors ${
                                  active
                                    ? "bg-[var(--accent)] text-white"
                                    : "bg-[var(--bg-inset)] text-[var(--accent)]"
                                }`}
                              >
                                <CategoryIcon name={item.icon} width={15} height={15} />
                              </span>

                              <span className="flex-1 min-w-0">
                                <span
                                  className={`block text-[14px] font-medium leading-snug truncate ${
                                    active ? "text-[var(--accent)]" : ""
                                  }`}
                                >
                                  {item.title}
                                </span>
                                <span className="block text-[12px] text-[var(--fg-subtle)] leading-snug truncate">
                                  {item.subtitle}
                                </span>
                              </span>

                              {item.meta && (
                                <span className="shrink-0 figure text-[12.5px] text-[var(--fg-muted)]">
                                  {item.meta}
                                </span>
                              )}
                              <IconArrowRight
                                width={14}
                                height={14}
                                className={`shrink-0 transition-opacity ${
                                  active ? "opacity-100 text-[var(--accent)]" : "opacity-0"
                                }`}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ))
              )}
            </ul>

            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg-subtle)] text-[11px] text-[var(--fg-subtle)]">
              <span className="flex items-center gap-1.5">
                <Key>↑</Key>
                <Key>↓</Key>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <Key>↵</Key>
                open
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                {query.trim() === "" && recent.length > 0 && (
                  <>
                    <IconClock width={11} height={11} />
                    recently viewed
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="px-1 py-0.5 rounded border border-[var(--border)] bg-[var(--bg)] font-[family-name:var(--font-mono)] text-[10px] leading-none">
      {children}
    </kbd>
  );
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
