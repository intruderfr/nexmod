"use client";

import { useEffect, useRef, useState } from "react";
import { lkr, waLink } from "@/data/site";
import type { Product } from "@/data/types";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { IconCart, IconCheck, IconWhatsApp } from "./Icons";

/**
 * Sticky buy bar.
 *
 * Appears once the main buy box has scrolled past, so the price and the add
 * button are always one tap away on a long product page. Hides again when the
 * buy box comes back into view — two add-to-cart controls on screen at once is
 * confusing, not helpful.
 *
 * Uses an IntersectionObserver on a sentinel rather than a scroll listener, so
 * it costs nothing while the page is being read.
 */
export function StickyBuyBar({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const { toggleCompare, isComparing } = usePrefs();
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function handleAdd() {
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
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <>
      {/* Marks where the main buy box ends. */}
      <div ref={sentinel} aria-hidden="true" />

      <div
        className={`fixed inset-x-0 bottom-0 z-40 print:hidden transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="glass border-t border-[var(--border)] shadow-2xl">
          <div className="container-nex">
            <div className="flex items-center gap-4 h-16">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold truncate leading-tight">{product.name}</p>
                <p className="flex items-baseline gap-2">
                  <span className="figure text-[15px] font-bold">{lkr(product.price)}</span>
                  {product.installation?.available && (product.installation.fee ?? 0) === 0 && (
                    <span className="text-[11.5px] text-[var(--fg-subtle)] hidden sm:inline">
                      fitting included
                    </span>
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={() => toggleCompare(product.slug)}
                className={`hidden md:inline-flex btn btn-sm ${
                  isComparing(product.slug) ? "btn-secondary" : "btn-ghost"
                }`}
              >
                {isComparing(product.slug) ? "In compare" : "Compare"}
              </button>

              <a
                href={waLink(`Hi Nexmod, I'd like to ask about the ${product.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex btn btn-sm btn-whatsapp"
              >
                <IconWhatsApp width={14} height={14} />
                Ask
              </a>

              <button
                type="button"
                onClick={handleAdd}
                disabled={!product.inStock}
                className="btn btn-sm btn-primary shrink-0"
              >
                {added ? (
                  <>
                    <IconCheck width={15} height={15} />
                    Added
                  </>
                ) : (
                  <>
                    <IconCart width={15} height={15} />
                    <span className="hidden sm:inline">Add to cart</span>
                    <span className="sm:hidden">Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
