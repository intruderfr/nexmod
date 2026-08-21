"use client";

import { LocaleLink as Link } from "@/i18n/client";
import { useState } from "react";
import { lkr, site } from "@/data/site";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import { IconCart, IconCheck, IconTruck, IconWhatsApp } from "./Icons";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * On the GitHub Pages static export there is no server to POST to, so the
 * form skips the request entirely and hands off to WhatsApp — which is how
 * Nexmod takes most bookings anyway.
 */
const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";


/**
 * Checkout.
 *
 * Collects the order and posts it to /api/orders, which is a stub — see that
 * file for where a real payment gateway (PayHere / OnePay) plugs in. Cash on
 * delivery and bank transfer work end to end today; card and BNPL are shown as
 * "we will send a payment link" until a gateway is connected, which is honest
 * rather than a broken button.
 */
export function CheckoutForm() {
  const { lines, totals, clear, whatsappOrderLink } = useCart();
  const { logHistory, profile } = usePrefs();
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  // Pre-filled from the saved profile so returning customers do not retype.
  const [form, setForm] = useState({
    name: profile.name ?? "",
    phone: profile.phone ?? "",
    email: profile.email ?? "",
    address: "",
    city: profile.city ?? "",
    payment: "cod",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // No backend on the static build — hand the formatted order to WhatsApp.
    if (IS_STATIC) {
      window.open(whatsappOrderLink(), "_blank", "noopener,noreferrer");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, lines, totals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");

      setReference(data.reference);
      logHistory({
        kind: "order",
        summary: `Order — ${lines.length} ${lines.length === 1 ? "item" : "items"}`,
        total: totals.total,
        reference: data.reference,
      });
      setStatus("sent");
      clear();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error && err.message !== "Request failed"
          ? err.message
          : "We could not place that order. Please use WhatsApp — it reaches us straight away.",
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="surface p-8 md:p-10 text-center max-w-lg mx-auto">
        <span className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] mb-5">
          <IconCheck width={26} height={26} />
        </span>
        <h1 className="text-heading mb-2.5">Order received</h1>
        <p className="text-[var(--fg-muted)] leading-relaxed mb-5">
          Thanks {form.name.split(" ")[0]}. Your reference is{" "}
          <strong className="text-[var(--fg)] font-mono">{reference}</strong>. We will confirm
          availability and delivery by phone or WhatsApp, usually within a few hours during
          opening times.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn btn-outline">
            Keep shopping
          </Link>
          <a
            href={`https://wa.me/${site.contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <IconWhatsApp width={17} height={17} />
            Message us
          </a>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="surface p-10 text-center max-w-lg mx-auto">
        <span className="grid place-items-center w-14 h-14 mx-auto rounded-full bg-[var(--bg-inset)] text-[var(--fg-subtle)] mb-5">
          <IconCart width={24} height={24} />
        </span>
        <h1 className="text-2xl mb-2">Your cart is empty</h1>
        <p className="text-[var(--fg-muted)] mb-6 leading-relaxed">
          Add something to your cart, or message us on WhatsApp and we will help you choose.
        </p>
        <Link href="/products" className="btn btn-primary">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_380px] gap-8">
      {/* Details */}
      <div className="space-y-6">
        <div className="surface p-6">
          <h2 className="text-lg mb-5">Your details</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="co-name" className="label">
                  Full name <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="co-name"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="field"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="co-phone" className="label">
                  Phone / WhatsApp <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="co-phone"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="field"
                  placeholder="07X XXX XXXX"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label htmlFor="co-email" className="label">
                Email <span className="text-[var(--fg-subtle)] font-normal">(optional)</span>
              </label>
              <input
                id="co-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="field"
                autoComplete="email"
              />
            </div>
          </div>
        </div>

        {/* Delivery — hidden when everything is being fitted at the workshop */}
        {!totals.allInstalled && (
          <div className="surface p-6">
            <h2 className="flex items-center gap-2 text-lg mb-5">
              <IconTruck width={19} height={19} className="text-[var(--accent)]" />
              Delivery address
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="co-address" className="label">
                  Address <span className="text-[var(--accent)]">*</span>
                </label>
                <textarea
                  id="co-address"
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  className="field resize-y"
                  autoComplete="street-address"
                />
              </div>
              <div>
                <label htmlFor="co-city" className="label">
                  City / town <span className="text-[var(--accent)]">*</span>
                </label>
                <input
                  id="co-city"
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="field"
                  autoComplete="address-level2"
                />
              </div>
            </div>
            <p className="text-[12.5px] text-[var(--fg-subtle)] mt-4 leading-relaxed">
              Colombo {site.delivery.colomboDays} · outstation {site.delivery.outstationDays}.{" "}
              {site.delivery.courierNote}
            </p>
          </div>
        )}

        {totals.allInstalled && (
          <div className="surface p-6 bg-[var(--accent-subtle)] border-[var(--accent)]/30">
            <h2 className="text-lg mb-2">Workshop fitting</h2>
            <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed">
              Everything in your cart is being fitted at our Dehiwala workshop, so no delivery
              address is needed. We will contact you to arrange a slot after confirming your order.
            </p>
          </div>
        )}

        {/* Payment */}
        <div className="surface p-6">
          <h2 className="text-lg mb-5">Payment</h2>
          <div className="space-y-2">
            {site.payments.map((p) => {
              const selected = form.payment === p.id;
              const needsLink = p.id === "card" || p.id === "koko" || p.id === "mintpay";
              return (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                      : "border-[var(--border)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <span
                    className={`shrink-0 grid place-items-center w-4 h-4 mt-0.5 rounded-full border-2 transition-colors ${
                      selected ? "border-[var(--accent)]" : "border-[var(--border-strong)]"
                    }`}
                  >
                    {selected && <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    value={p.id}
                    checked={selected}
                    onChange={() => update("payment", p.id)}
                    className="sr-only"
                  />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold">{p.label}</span>
                    <span className="block text-[12.5px] text-[var(--fg-muted)] mt-0.5">
                      {needsLink ? "We will send you a secure payment link to complete" : p.note}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="surface p-6">
          <label htmlFor="co-notes" className="label">
            Order notes <span className="text-[var(--fg-subtle)] font-normal">(optional)</span>
          </label>
          <textarea
            id="co-notes"
            rows={3}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="field resize-y"
            placeholder="Vehicle model, colour code, preferred fitting day, anything else."
          />
        </div>
      </div>

      {/* Summary */}
      <aside>
        <div className="surface p-6 sticky top-24">
          <h2 className="text-lg mb-5">Order summary</h2>

          <ul className="space-y-3 pb-5 mb-5 border-b border-[var(--border)] max-h-64 overflow-y-auto">
            {lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-3 text-[13.5px]">
                <span className="min-w-0">
                  <span className="block font-medium leading-snug">{line.name}</span>
                  <span className="block text-[12px] text-[var(--fg-subtle)] mt-0.5">
                    {line.variantLabel && `${line.variantLabel} · `}
                    Qty {line.qty}
                    {line.withInstallation && " · with fitting"}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums font-medium">
                  {lkr((line.unitPrice + (line.withInstallation ? line.installationFee : 0)) * line.qty)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="space-y-2 text-[14px] mb-6">
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
                  <span className="text-[var(--fg-subtle)]">Workshop</span>
                ) : totals.deliveryFee === 0 ? (
                  <span className="text-[var(--color-nex-green)] font-medium">Free</span>
                ) : (
                  lkr(totals.deliveryFee)
                )}
              </dd>
            </div>
            <div className="flex justify-between pt-3 mt-3 border-t border-[var(--border)] text-lg font-bold">
              <dt>Total</dt>
              <dd className="tabular-nums">{lkr(totals.total)}</dd>
            </div>
          </dl>

          {error && (
            <p role="alert" className="text-[13px] text-[var(--accent)] font-medium mb-3">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn btn-primary btn-lg w-full"
            >
              {status === "sending"
                ? "Placing order…"
                : IS_STATIC
                  ? "Send order on WhatsApp"
                  : "Place order"}
            </button>
            <a
              href={whatsappOrderLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp w-full"
            >
              <IconWhatsApp width={17} height={17} />
              Order on WhatsApp instead
            </a>
          </div>

          <p className="text-[11.5px] text-[var(--fg-subtle)] text-center mt-3.5 leading-relaxed">
            We confirm every order by phone or WhatsApp before dispatch or fitting.
          </p>
        </div>
      </aside>
    </form>
  );
}
