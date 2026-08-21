"use client";

import Link from "next/link";
import { lkr, site } from "@/data/site";
import { useCart } from "@/lib/cart";
import {
  IconCart,
  IconCheck,
  IconClose,
  IconMinus,
  IconPlus,
  IconTrash,
  IconTruck,
  IconWhatsApp,
} from "./Icons";

export function CartDrawer() {
  const { lines, open, setOpen, totals, setQty, remove, toggleInstall, whatsappOrderLink } =
    useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-[var(--bg)] border-l border-[var(--border)] flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2.5">
            <IconCart width={18} height={18} className="text-[var(--accent)]" />
            <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">
              Your cart
              {totals.itemCount > 0 && (
                <span className="ml-2 text-sm font-normal text-[var(--fg-subtle)]">
                  {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"}
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid place-items-center w-10 h-10 rounded-md hover:bg-[var(--bg-inset)]"
            aria-label="Close cart"
          >
            <IconClose />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 grid place-items-center px-8 text-center">
            <div>
              <span className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-[var(--bg-inset)] text-[var(--fg-subtle)] mb-4">
                <IconCart width={24} height={24} />
              </span>
              <p className="font-semibold mb-1.5">Your cart is empty</p>
              <p className="text-sm text-[var(--fg-muted)] mb-6 leading-relaxed">
                Browse the catalogue, or message us on WhatsApp and we will help you choose.
              </p>
              <Link href="/products" onClick={() => setOpen(false)} className="btn btn-primary">
                Shop products
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Free delivery progress */}
            {!totals.allInstalled && !totals.qualifiesForFreeDelivery && (
              <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)] shrink-0">
                <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)] mb-2">
                  <IconTruck width={14} height={14} className="text-[var(--accent)]" />
                  <span>
                    <strong className="text-[var(--fg)]">
                      {lkr(totals.amountToFreeDelivery)}
                    </strong>{" "}
                    away from free islandwide delivery
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-inset)] overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-[width] duration-500"
                    style={{
                      width: `${Math.min(100, (totals.subtotal / site.delivery.freeThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Lines */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {lines.map((line) => (
                <div key={line.key} className="surface p-3.5">
                  <div className="flex justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${line.slug}`}
                        onClick={() => setOpen(false)}
                        className="block text-sm font-semibold leading-snug hover:text-[var(--accent)]"
                      >
                        {line.name}
                      </Link>
                      {line.variantLabel && (
                        <p className="text-xs text-[var(--fg-subtle)] mt-0.5">{line.variantLabel}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      className="shrink-0 grid place-items-center w-7 h-7 rounded text-[var(--fg-subtle)] hover:text-[var(--accent)] hover:bg-[var(--bg-inset)]"
                      aria-label={`Remove ${line.name}`}
                    >
                      <IconTrash width={14} height={14} />
                    </button>
                  </div>

                  {/* Installation toggle — only where fitting is offered and chargeable */}
                  {line.installationFee >= 0 && (
                    <label className="flex items-center gap-2 mb-3 cursor-pointer select-none">
                      <span
                        className={`grid place-items-center w-4 h-4 rounded border transition-colors ${
                          line.withInstallation
                            ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                            : "border-[var(--border-strong)]"
                        }`}
                      >
                        {line.withInstallation && <IconCheck width={11} height={11} strokeWidth={3} />}
                      </span>
                      <input
                        type="checkbox"
                        checked={line.withInstallation}
                        onChange={() => toggleInstall(line.key)}
                        className="sr-only"
                      />
                      <span className="text-xs text-[var(--fg-muted)]">
                        Fit at Dehiwala workshop
                        {line.installationFee > 0 ? (
                          <span className="text-[var(--fg)] font-medium"> +{lkr(line.installationFee)}</span>
                        ) : (
                          <span className="text-[var(--color-nex-green)] font-medium"> — free</span>
                        )}
                      </span>
                    </label>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center border border-[var(--border)] rounded-md">
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.qty - 1)}
                        className="grid place-items-center w-8 h-8 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                        aria-label="Decrease quantity"
                      >
                        <IconMinus width={13} height={13} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.key, line.qty + 1)}
                        className="grid place-items-center w-8 h-8 text-[var(--fg-muted)] hover:text-[var(--fg)]"
                        aria-label="Increase quantity"
                      >
                        <IconPlus width={13} height={13} />
                      </button>
                    </div>
                    <span className="text-sm font-bold tabular-nums">
                      {lkr((line.unitPrice + (line.withInstallation ? line.installationFee : 0)) * line.qty)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-[var(--border)] px-5 py-4 shrink-0 bg-[var(--bg-subtle)]">
              <dl className="space-y-1.5 text-sm mb-4">
                <div className="flex justify-between">
                  <dt className="text-[var(--fg-muted)]">Subtotal</dt>
                  <dd className="tabular-nums">{lkr(totals.subtotal)}</dd>
                </div>
                {totals.installationTotal > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-[var(--fg-muted)]">Installation</dt>
                    <dd className="tabular-nums">{lkr(totals.installationTotal)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-[var(--fg-muted)]">Delivery</dt>
                  <dd className="tabular-nums">
                    {totals.allInstalled ? (
                      <span className="text-[var(--fg-subtle)]">Workshop fitting</span>
                    ) : totals.deliveryFee === 0 ? (
                      <span className="text-[var(--color-nex-green)] font-medium">Free</span>
                    ) : (
                      lkr(totals.deliveryFee)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between pt-2.5 mt-2.5 border-t border-[var(--border)] text-base font-bold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{lkr(totals.total)}</dd>
                </div>
              </dl>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Checkout
                </Link>
                <a
                  href={whatsappOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp w-full"
                >
                  <IconWhatsApp width={17} height={17} />
                  Order on WhatsApp
                </a>
              </div>

              <p className="text-[11px] text-[var(--fg-subtle)] text-center mt-3 leading-relaxed">
                Cash on delivery, card, bank transfer, KOKO and Mintpay accepted.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
