"use client";

import { useState } from "react";
import { lkr, site, waLink } from "@/data/site";
import type { Product } from "@/data/types";
import { useCart } from "@/lib/cart";
import { IconCart, IconCheck, IconMinus, IconPlus, IconTool, IconWhatsApp } from "./Icons";

/**
 * Product buy box. Handles variant selection, quantity, the installation
 * choice, and the two order paths — cart checkout or WhatsApp handoff.
 */
export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);
  const [withInstallation, setWithInstallation] = useState(
    Boolean(product.installation?.available),
  );
  const [added, setAdded] = useState(false);

  const variant = product.variants?.find((v) => v.id === variantId);
  const unitPrice = variant?.price ?? product.price;
  const compareAt = variant?.compareAt ?? product.compareAt;
  const installFee = product.installation?.fee ?? 0;
  const canInstall = Boolean(product.installation?.available);
  const lineTotal = (unitPrice + (withInstallation && canInstall ? installFee : 0)) * qty;

  function handleAdd() {
    add({
      slug: product.slug,
      name: product.name,
      variantId: variant?.id,
      variantLabel: variant?.label,
      unitPrice,
      qty,
      withInstallation: canInstall && withInstallation,
      installationFee: installFee,
      category: product.category,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2000);
  }

  const enquiry = waLink(
    `Hi Nexmod, I'm interested in the ${product.name}${
      variant ? ` (${variant.label})` : ""
    }. Could you confirm availability and fitment for my car?`,
  );

  return (
    <div className="surface p-5 md:p-6">
      {/* Price */}
      <div className="flex items-end gap-3 mb-1">
        <span className="text-3xl font-bold tabular-nums leading-none">{lkr(unitPrice)}</span>
        {compareAt && compareAt > unitPrice && (
          <span className="text-base text-[var(--fg-subtle)] line-through tabular-nums mb-0.5">
            {lkr(compareAt)}
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--fg-subtle)] mb-5">
        Price includes VAT. {canInstall && installFee === 0 && "Installation included."}
      </p>

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <fieldset className="mb-5">
          <legend className="label">Choose an option</legend>
          <div className="space-y-2">
            {product.variants.map((v) => {
              const selected = v.id === variantId;
              return (
                <label
                  key={v.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                      : "border-[var(--border)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`shrink-0 grid place-items-center w-4 h-4 rounded-full border-2 transition-colors ${
                        selected ? "border-[var(--accent)]" : "border-[var(--border-strong)]"
                      }`}
                    >
                      {selected && <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
                    </span>
                    <input
                      type="radio"
                      name="variant"
                      value={v.id}
                      checked={selected}
                      onChange={() => setVariantId(v.id)}
                      className="sr-only"
                    />
                    <span className="text-[13.5px] font-medium truncate">{v.label}</span>
                  </span>
                  <span className="text-[13.5px] font-bold tabular-nums shrink-0">
                    {lkr(v.price)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Installation */}
      {canInstall && (
        <div className="mb-5">
          <span className="label">Fitting</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWithInstallation(true)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                withInstallation
                  ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <span className="flex items-center gap-1.5 text-[13px] font-semibold mb-0.5">
                <IconTool width={13} height={13} />
                Fit at workshop
              </span>
              <span className="block text-[11.5px] text-[var(--fg-muted)]">
                {installFee > 0 ? `+${lkr(installFee)}` : "Included free"}
                {product.installation?.duration && ` · ${product.installation.duration}`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setWithInstallation(false)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                !withInstallation
                  ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                  : "border-[var(--border)] hover:border-[var(--border-strong)]"
              }`}
            >
              <span className="block text-[13px] font-semibold mb-0.5">Deliver only</span>
              <span className="block text-[11.5px] text-[var(--fg-muted)]">
                Islandwide, {site.delivery.colomboDays}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Quantity + total */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="inline-flex items-center border border-[var(--border)] rounded-lg">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="grid place-items-center w-10 h-10 text-[var(--fg-muted)] hover:text-[var(--fg)] disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <IconMinus width={14} height={14} />
          </button>
          <span className="w-10 text-center font-semibold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="grid place-items-center w-10 h-10 text-[var(--fg-muted)] hover:text-[var(--fg)]"
            aria-label="Increase quantity"
          >
            <IconPlus width={14} height={14} />
          </button>
        </div>

        {(qty > 1 || (withInstallation && installFee > 0)) && (
          <div className="text-right">
            <span className="block text-[10.5px] uppercase tracking-wider text-[var(--fg-subtle)]">
              Total
            </span>
            <span className="text-lg font-bold tabular-nums leading-tight">{lkr(lineTotal)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          className="btn btn-primary btn-lg w-full"
        >
          {added ? (
            <>
              <IconCheck width={17} height={17} />
              Added to cart
            </>
          ) : (
            <>
              <IconCart width={17} height={17} />
              {product.inStock ? "Add to cart" : "Out of stock"}
            </>
          )}
        </button>

        <a href={enquiry} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
          <IconWhatsApp width={17} height={17} />
          Ask about fitment
        </a>
      </div>

      {/* Trust */}
      <ul className="mt-5 pt-5 border-t border-[var(--border)] space-y-2 text-[12.5px] text-[var(--fg-muted)]">
        {product.inStock && (
          <li className="flex items-center gap-2">
            <IconCheck width={13} height={13} className="text-[var(--color-nex-green)] shrink-0" />
            In stock at Dehiwala
          </li>
        )}
        {product.warranty && (
          <li className="flex items-center gap-2">
            <IconCheck width={13} height={13} className="text-[var(--color-nex-green)] shrink-0" />
            {product.warranty}
          </li>
        )}
        <li className="flex items-center gap-2">
          <IconCheck width={13} height={13} className="text-[var(--color-nex-green)] shrink-0" />
          Cash on delivery, card, KOKO & Mintpay
        </li>
        <li className="flex items-center gap-2">
          <IconCheck width={13} height={13} className="text-[var(--color-nex-green)] shrink-0" />
          Free delivery over {lkr(site.delivery.freeThreshold)}
        </li>
      </ul>
    </div>
  );
}
