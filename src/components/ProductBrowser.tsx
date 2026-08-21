"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/Cards";
import { IconClose, IconFilter, IconSearch } from "@/components/Icons";
import type { Category, Product } from "@/data/types";
import { lkr } from "@/data/site";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

/**
 * Client-side catalogue browser.
 *
 * The whole catalogue is small enough to filter in the browser, which keeps
 * filtering instant and avoids a round trip on every checkbox. If the range
 * grows past a few hundred items this should move to server-side filtering
 * with searchParams.
 */
export function ProductBrowser({
  products,
  categories,
  fitments,
  lockedCategory,
}: {
  products: Product[];
  categories: Category[];
  fitments: string[];
  /** When rendered inside a category page, hides the category filter. */
  lockedCategory?: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFitment, setSelectedFitment] = useState<string>("");
  const [installOnly, setInstallOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = products.filter((p) => {
      if (lockedCategory && p.category !== lockedCategory) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (selectedFitment && !(p.fitment ?? []).some((f) => f === selectedFitment || f === "Universal"))
        return false;
      if (installOnly && !p.installation?.available) return false;
      if (inStockOnly && !p.inStock) return false;

      if (q) {
        const haystack = [
          p.name,
          p.tagline,
          p.brand ?? "",
          ...p.keywords,
          ...(p.fitment ?? []),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "name":
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return [...result].sort(
          (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
        );
    }
  }, [products, query, selectedCategories, selectedFitment, installOnly, inStockOnly, sort, lockedCategory]);

  const activeCount =
    selectedCategories.length +
    (selectedFitment ? 1 : 0) +
    (installOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  function toggleCategory(slug: string) {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function clearAll() {
    setSelectedCategories([]);
    setSelectedFitment("");
    setInstallOnly(false);
    setInStockOnly(false);
    setQuery("");
  }

  const filterPanel = (
    <div className="space-y-7">
      {!lockedCategory && (
        <fieldset>
          <legend className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
            Category
          </legend>
          <div className="space-y-1.5">
            {categories.map((c) => {
              const checked = selectedCategories.includes(c.slug);
              const count = products.filter((p) => p.category === c.slug).length;
              return (
                <label
                  key={c.slug}
                  className="flex items-center justify-between gap-2 py-1 cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 grid place-items-center w-4 h-4 rounded border transition-colors ${
                        checked
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "border-[var(--border-strong)] group-hover:border-[var(--accent)]"
                      }`}
                    >
                      {checked && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <path d="m2 6 3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(c.slug)}
                      className="sr-only"
                    />
                    <span className="text-[13.5px] truncate">{c.name}</span>
                  </span>
                  <span className="text-[11.5px] text-[var(--fg-subtle)] tabular-nums shrink-0">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div>
        <label
          htmlFor="fitment"
          className="block text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3"
        >
          Fits my car
        </label>
        <select
          id="fitment"
          value={selectedFitment}
          onChange={(e) => setSelectedFitment(e.target.value)}
          className="field"
        >
          <option value="">Any vehicle</option>
          {fitments.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <p className="text-[11.5px] text-[var(--fg-subtle)] mt-2 leading-snug">
          Includes universal-fit products. Not listed? WhatsApp us — we will confirm.
        </p>
      </div>

      <fieldset>
        <legend className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
          Options
        </legend>
        <div className="space-y-2">
          {[
            { checked: installOnly, set: setInstallOnly, label: "Installation available" },
            { checked: inStockOnly, set: setInStockOnly, label: "In stock only" },
          ].map(({ checked, set, label }) => (
            <label key={label} className="flex items-center gap-2.5 py-1 cursor-pointer group">
              <span
                className={`shrink-0 grid place-items-center w-4 h-4 rounded border transition-colors ${
                  checked
                    ? "bg-[var(--accent)] border-[var(--accent)]"
                    : "border-[var(--border-strong)] group-hover:border-[var(--accent)]"
                }`}
              >
                {checked && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="m2 6 3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => set(e.target.checked)}
                className="sr-only"
              />
              <span className="text-[13.5px]">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="btn btn-sm btn-outline w-full">
          Clear {activeCount} filter{activeCount === 1 ? "" : "s"}
        </button>
      )}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-8">
      {/* Desktop filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">{filterPanel}</div>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <IconSearch
              width={16}
              height={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-subtle)] pointer-events-none"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              className="field pl-9"
            />
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden btn btn-outline relative"
          >
            <IconFilter width={16} height={16} />
            Filters
            {activeCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-[var(--accent)] text-white text-[10px] font-bold">
                {activeCount}
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
            className="field w-auto shrink-0"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-[13px] text-[var(--fg-subtle)] mb-5" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
          {filtered.length > 0 && (
            <>
              {" "}
              · from{" "}
              <span className="tabular-nums">
                {lkr(Math.min(...filtered.map((p) => p.price)))}
              </span>
            </>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="surface p-10 text-center">
            <p className="font-semibold mb-1.5">Nothing matched those filters</p>
            <p className="text-sm text-[var(--fg-muted)] mb-5">
              Try clearing a filter, or message us — we source parts to order.
            </p>
            <button type="button" onClick={clearAll} className="btn btn-outline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter sheet */}
      {filtersOpen && (
        <div className="lg:hidden fixed inset-0 z-[65]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-[var(--bg)] border-t border-[var(--border)] rounded-t-2xl flex flex-col animate-fade-up">
            <div className="flex items-center justify-between px-5 h-14 border-b border-[var(--border)] shrink-0">
              <span className="font-bold">Filters</span>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="grid place-items-center w-9 h-9 rounded-md hover:bg-[var(--bg-inset)]"
                aria-label="Close filters"
              >
                <IconClose />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>
            <div className="px-5 py-4 border-t border-[var(--border)] shrink-0">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="btn btn-primary w-full"
              >
                Show {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
