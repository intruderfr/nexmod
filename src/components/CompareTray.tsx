"use client";

import { getProduct } from "@/data/products";
import { lkr } from "@/data/site";
import { LocaleLink as Link } from "@/i18n/client";
import { COMPARE_LIMIT, usePrefs } from "@/lib/prefs";
import { IconArrowRight, IconClose } from "./Icons";

/**
 * Compare tray.
 *
 * A docked bar that appears once anything is queued for comparison. It sits
 * above the WhatsApp button but below the cart drawer, and gets out of the way
 * entirely when empty.
 */
export function CompareTray() {
  const { compare, toggleCompare, clearCompare, ready } = usePrefs();

  if (!ready || compare.length === 0) return null;

  const items = compare
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    /*
     * The wrapper spans the full width but only the inner card is painted, so
     * the transparent gutters either side of it would otherwise intercept
     * every click along the bottom of the page. Only the card opts back in.
     */
    <div className="fixed inset-x-0 bottom-0 z-30 print:hidden animate-fade-up pointer-events-none">
      <div className="container-nex pb-4 md:pb-5">
        <div className="surface shadow-2xl p-3 md:p-4 pointer-events-auto">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:block shrink-0">
              <p className="font-[family-name:var(--font-display)] font-bold text-[14px] leading-tight">
                Compare
              </p>
              <p className="text-[11.5px] text-[var(--fg-subtle)] tabular-nums">
                {items.length} of {COMPARE_LIMIT}
              </p>
            </div>

            <ul className="flex-1 flex items-center gap-2 overflow-x-auto scroll-x min-w-0">
              {items.map((p) => (
                <li key={p.slug} className="shrink-0">
                  <span className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-inset)]">
                    <span className="text-[12.5px] font-medium max-w-[10rem] truncate">
                      {p.name}
                    </span>
                    <span className="figure text-[11.5px] text-[var(--fg-subtle)]">
                      {lkr(p.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleCompare(p.slug)}
                      aria-label={`Remove ${p.name} from compare`}
                      className="grid place-items-center w-5 h-5 rounded text-[var(--fg-subtle)] hover:text-[var(--accent)] transition-colors"
                    >
                      <IconClose width={12} height={12} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={clearCompare}
                className="btn btn-sm btn-ghost hidden sm:inline-flex"
              >
                Clear
              </button>
              <Link
                href="/compare"
                className={`btn btn-sm btn-primary ${items.length < 2 ? "pointer-events-none opacity-50" : ""}`}
                aria-disabled={items.length < 2}
              >
                Compare
                <IconArrowRight width={14} height={14} />
              </Link>
            </div>
          </div>

          {items.length < 2 && (
            <p className="text-[11.5px] text-[var(--fg-subtle)] mt-2 sm:hidden">
              Add one more to compare.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
