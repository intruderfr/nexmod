"use client";

import { getProduct } from "@/data/products";
import { lkr, waLink } from "@/data/site";
import type { Package } from "@/data/packages";
import { LocaleLink as Link } from "@/i18n/client";
import { useCart } from "@/lib/cart";
import { IconCart, IconCheck, IconClock, IconWhatsApp } from "./Icons";
import { Photo } from "./Photo";

/**
 * Package card.
 *
 * The saving is computed from the live component prices rather than stored, so
 * it can never drift out of sync with the products. Every component is listed
 * with its own price — a bundle that hides what is in it invites the suspicion
 * that the discount is not real.
 */
export function PackageCard({ pkg, expanded = false }: { pkg: Package; expanded?: boolean }) {
  const { add, setOpen } = useCart();

  const items = pkg.items
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const full = items.reduce((sum, p) => sum + p.price, 0);
  const price = Math.round((full * (1 - pkg.discount)) / 100) * 100;
  const saving = full - price;

  function addPackage() {
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

  const enquiry = waLink(
    [
      `Hi Nexmod, I'm interested in the ${pkg.name} package:`,
      "",
      ...items.map((p) => `• ${p.name}`),
      "",
      `Listed at ${lkr(price)}. Could you confirm it suits my car?`,
    ].join("\n"),
  );

  return (
    <article className="surface surface-hover overflow-hidden flex flex-col group">
      <div className="relative">
        <Photo
          image={pkg.image}
          ratio="wide"
          zoom
          scrim="bottom"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        {saving > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[var(--accent)] text-white font-[family-name:var(--font-mono)] text-[11px] font-semibold">
            Save {lkr(saving)}
          </span>
        )}
        <span className="absolute bottom-3 left-4 right-4">
          <span className="block font-[family-name:var(--font-display)] font-extrabold text-white text-xl leading-tight">
            {pkg.name}
          </span>
        </span>
      </div>

      <div className="flex-1 flex flex-col p-5">
        <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed mb-4">{pkg.tagline}</p>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-inset)] p-3.5 mb-4">
          <p className="text-[11px] font-[family-name:var(--font-mono)] uppercase tracking-[0.14em] text-[var(--fg-subtle)] mb-1.5">
            Best for
          </p>
          <p className="text-[13px] leading-relaxed text-[var(--fg-muted)]">{pkg.bestFor}</p>
        </div>

        {/* Components, priced individually */}
        <ul className="space-y-2 mb-4">
          {items.map((product) => (
            <li key={product.slug} className="flex items-start justify-between gap-3">
              <Link
                href={`/products/${product.slug}`}
                className="flex items-start gap-2 min-w-0 text-[13px] hover:text-[var(--accent)] transition-colors"
              >
                <IconCheck width={13} height={13} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                <span className="leading-snug">{product.name}</span>
              </Link>
              <span className="figure shrink-0 text-[12.5px] text-[var(--fg-subtle)]">
                {lkr(product.price)}
              </span>
            </li>
          ))}
        </ul>

        {expanded && (
          <>
            <ul className="space-y-1.5 mb-4 pt-3 border-t border-[var(--border)]">
              {pkg.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[12.5px] text-[var(--fg-muted)]">
                  <span className="shrink-0 w-1 h-1 mt-1.5 rounded-sm bg-[var(--accent)]" />
                  {h}
                </li>
              ))}
            </ul>
            <p className="text-[12px] text-[var(--fg-subtle)] leading-relaxed mb-4 italic">
              {pkg.notIncluded}
            </p>
          </>
        )}

        {/* Price */}
        <div className="mt-auto pt-4 border-t border-[var(--border)]">
          <div className="flex items-end justify-between gap-3 mb-1">
            <div>
              <span className="block text-[10.5px] font-[family-name:var(--font-mono)] uppercase tracking-wider text-[var(--fg-subtle)]">
                Package
              </span>
              <span className="figure text-2xl font-bold leading-none">{lkr(price)}</span>
            </div>
            {saving > 0 && (
              <span className="figure text-[13px] text-[var(--fg-subtle)] line-through mb-0.5">
                {lkr(full)}
              </span>
            )}
          </div>

          <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--fg-subtle)] mb-4">
            <IconClock width={11} height={11} />
            {pkg.duration} at the workshop
          </p>

          <div className="space-y-2">
            <button type="button" onClick={addPackage} className="btn btn-primary w-full">
              <IconCart width={16} height={16} />
              Add package to cart
            </button>
            <a
              href={enquiry}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-whatsapp w-full"
            >
              <IconWhatsApp width={14} height={14} />
              Ask about this package
            </a>
          </div>

          <p className="text-[11px] text-[var(--fg-subtle)] text-center mt-2.5 leading-relaxed">
            Adds each item separately, so you can still adjust options in the cart.
          </p>
        </div>
      </div>
    </article>
  );
}
