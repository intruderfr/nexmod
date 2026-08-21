"use client";

import { getCategory } from "@/data/categories";
import { getProduct } from "@/data/products";
import { productImage } from "@/data/imagery";
import { lkr, waLink } from "@/data/site";
import { LocaleLink as Link } from "@/i18n/client";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { IconArrowRight, IconCart, IconCheck, IconClose, IconWhatsApp } from "./Icons";
import { Photo } from "./Photo";

/**
 * Side-by-side product comparison.
 *
 * The spec rows are unioned across the selected products rather than fixed, so
 * comparing two lighting products shows lighting specs and comparing a wrap
 * against a spoiler shows both sets. A cell with no value shows an em dash
 * rather than collapsing, so the rows stay aligned across columns.
 */
export function CompareTable() {
  const { compare, toggleCompare, clearCompare, ready } = usePrefs();
  const { add, setOpen } = useCart();

  if (!ready) {
    return <div className="h-64 rounded-xl bg-[var(--bg-inset)] animate-pulse" />;
  }

  const items = compare
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="surface p-10 md:p-14 text-center max-w-xl mx-auto">
        <h2 className="text-2xl mb-2.5">Nothing to compare yet</h2>
        <p className="text-[var(--fg-muted)] leading-relaxed mb-6">
          Add products from the catalogue using the compare button on any product card, then come
          back here to see them side by side.
        </p>
        <Link href="/products" className="btn btn-primary">
          Browse products
          <IconArrowRight width={16} height={16} />
        </Link>
      </div>
    );
  }

  // Union of every spec label, in first-seen order.
  const specLabels: string[] = [];
  for (const product of items) {
    for (const spec of product.specs) {
      if (!specLabels.includes(spec.label)) specLabels.push(spec.label);
    }
  }

  function addAll() {
    for (const product of items) {
      add({
        slug: product.slug,
        name: product.name,
        variantId: product.variants?.[0]?.id,
        variantLabel: product.variants?.[0]?.label,
        unitPrice: product.variants?.[0]?.price ?? product.price,
        qty: 1,
        withInstallation: Boolean(product.installation?.available),
        installationFee: product.installation?.fee ?? 0,
        category: product.category,
      });
    }
    setOpen(true);
  }

  const gridCols = `repeat(${items.length}, minmax(15rem, 1fr))`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13.5px] text-[var(--fg-muted)]">
          Comparing <strong className="text-[var(--fg)]">{items.length}</strong> products
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={addAll} className="btn btn-sm btn-outline">
            <IconCart width={14} height={14} />
            Add all to cart
          </button>
          <button type="button" onClick={clearCompare} className="btn btn-sm btn-ghost">
            Clear
          </button>
        </div>
      </div>

      <div className="scroll-x -mx-5 px-5 md:mx-0 md:px-0">
        <div className="min-w-max">
          {/* Header row: photo, name, price, actions */}
          <div
            className="grid gap-4 mb-6"
            style={{ gridTemplateColumns: `10rem ${gridCols}` }}
          >
            <div aria-hidden="true" />
            {items.map((product) => {
              const photo = productImage(product.slug, product.category);
              const category = getCategory(product.category);
              return (
                <div key={product.slug} className="surface overflow-hidden group relative">
                  <button
                    type="button"
                    onClick={() => toggleCompare(product.slug)}
                    aria-label={`Remove ${product.name}`}
                    className="absolute top-2 right-2 z-10 grid place-items-center w-7 h-7 rounded-md bg-black/55 text-white backdrop-blur hover:bg-black/80 transition-colors"
                  >
                    <IconClose width={13} height={13} />
                  </button>

                  <Link href={`/products/${product.slug}`} className="block overflow-hidden">
                    {photo && <Photo image={photo} ratio="wide" zoom sizes="18rem" />}
                  </Link>

                  <div className="p-4">
                    {category && (
                      <span className="block text-[10.5px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-[var(--accent)] mb-1.5">
                        {category.name}
                      </span>
                    )}
                    <h2 className="font-semibold text-[14.5px] leading-snug mb-2 min-h-[2.6em]">
                      <Link
                        href={`/products/${product.slug}`}
                        className="hover:text-[var(--accent)] transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h2>
                    <p className="figure text-lg font-bold">{lkr(product.price)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attribute rows */}
          <CompareSection label="At a glance">
            <CompareRow
              label="Brand"
              cols={gridCols}
              values={items.map((p) => p.brand ?? "—")}
            />
            <CompareRow
              label="In stock"
              cols={gridCols}
              values={items.map((p) => (p.inStock ? "yes" : "no"))}
              render={(v) =>
                v === "yes" ? (
                  <span className="inline-flex items-center gap-1.5 text-[var(--ok)]">
                    <IconCheck width={14} height={14} /> In stock
                  </span>
                ) : (
                  <span className="text-[var(--fg-subtle)]">Out of stock</span>
                )
              }
            />
            <CompareRow
              label="Fitting"
              cols={gridCols}
              values={items.map((p) =>
                p.installation?.available
                  ? (p.installation.fee ?? 0) > 0
                    ? `+${lkr(p.installation.fee ?? 0)}`
                    : "Included"
                  : "—",
              )}
            />
            <CompareRow
              label="Fitting time"
              cols={gridCols}
              values={items.map((p) => p.installation?.duration ?? "—")}
            />
            <CompareRow
              label="Warranty"
              cols={gridCols}
              values={items.map((p) => p.warranty ?? "—")}
            />
            <CompareRow
              label="Options"
              cols={gridCols}
              values={items.map((p) =>
                p.variants?.length ? `${p.variants.length} variants` : "Single option",
              )}
            />
          </CompareSection>

          <CompareSection label="Specifications">
            {specLabels.map((label) => (
              <CompareRow
                key={label}
                label={label}
                cols={gridCols}
                values={items.map(
                  (p) => p.specs.find((s) => s.label === label)?.value ?? "—",
                )}
              />
            ))}
          </CompareSection>

          <CompareSection label="Fits">
            <CompareRow
              label="Vehicles"
              cols={gridCols}
              values={items.map((p) => (p.fitment ?? ["—"]).join(", "))}
            />
          </CompareSection>

          {/* Action row */}
          <div
            className="grid gap-4 mt-8 pt-6 border-t border-[var(--border)]"
            style={{ gridTemplateColumns: `10rem ${gridCols}` }}
          >
            <div aria-hidden="true" />
            {items.map((product) => (
              <div key={product.slug} className="space-y-2">
                <Link href={`/products/${product.slug}`} className="btn btn-sm btn-primary w-full">
                  View product
                </Link>
                <a
                  href={waLink(
                    `Hi Nexmod, I'm comparing options and had a question about the ${product.name}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-whatsapp w-full"
                >
                  <IconWhatsApp width={14} height={14} />
                  Ask
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompareSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--accent)] mb-2 pb-2 border-b border-[var(--border)]">
        {label}
      </h2>
      <div className="divide-y divide-[var(--border)]">{children}</div>
    </section>
  );
}

function CompareRow({
  label,
  values,
  cols,
  render,
}: {
  label: string;
  values: string[];
  cols: string;
  render?: (value: string) => React.ReactNode;
}) {
  return (
    <div className="grid gap-4 py-3" style={{ gridTemplateColumns: `10rem ${cols}` }}>
      <div className="text-[12.5px] text-[var(--fg-subtle)] leading-snug pt-0.5">{label}</div>
      {values.map((value, i) => (
        <div key={i} className="text-[13.5px] leading-snug">
          {render ? render(value) : value === "—" ? (
            <span className="text-[var(--fg-faint)]">—</span>
          ) : (
            value
          )}
        </div>
      ))}
    </div>
  );
}
