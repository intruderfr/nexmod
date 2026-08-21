"use client";

import { useMemo, useState } from "react";

import {
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconClose,
  IconPlus,
  IconShield,
  IconTrash,
  IconWhatsApp,
} from "@/components/Icons";
import { careTiers } from "@/data/care";
import { products } from "@/data/products";
import { lkr, waLink } from "@/data/site";
import {
  WORKMANSHIP_COVER_MONTHS,
  baseCoverMonths,
  extendedCover,
  extensionFee,
  warrantyWindow,
  type WarrantyStatus,
} from "@/data/warranty";
import { usePrefs, type WarrantyRecord } from "@/lib/prefs";

/**
 * The warranty centre.
 *
 * Three jobs, in the order people need them: register what you had fitted,
 * see what is still covered and for how long, and start a claim without
 * hunting for an invoice.
 *
 * Everything is stored on the device. That is a real constraint rather than a
 * shortcut — there is no server behind this site — and the copy says so
 * plainly instead of implying an account exists.
 */
export function WarrantyCentre() {
  const { warranties, ready } = usePrefs();
  const [adding, setAdding] = useState(false);

  if (!ready) {
    return <div className="h-64 rounded-xl bg-[var(--bg-inset)] animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-heading mb-1.5">
            {warranties.length
              ? `${warranties.length} registered ${warranties.length === 1 ? "item" : "items"}`
              : "Nothing registered yet"}
          </h2>
          <p className="text-[13.5px] text-[var(--fg-muted)]">
            Kept in this browser only. Export it from your profile if you change device.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className={`btn btn-sm ${adding ? "btn-ghost" : "btn-primary"}`}
        >
          {adding ? (
            <>
              <IconClose width={15} height={15} />
              Cancel
            </>
          ) : (
            <>
              <IconPlus width={15} height={15} />
              Register an item
            </>
          )}
        </button>
      </div>

      {adding && <RegisterForm onDone={() => setAdding(false)} />}

      {warranties.length === 0 && !adding ? (
        <EmptyState onStart={() => setAdding(true)} />
      ) : (
        <ul className="space-y-3">
          {warranties.map((record) => (
            <li key={record.id}>
              <WarrantyRow record={record} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- register */

function RegisterForm({ onDone }: { onDone: () => void }) {
  const { addWarranty, vehicles, activeVehicleId, membership } = usePrefs();

  const [slug, setSlug] = useState("");
  const [label, setLabel] = useState("");
  const [fittedOn, setFittedOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [vehicleId, setVehicleId] = useState(activeVehicleId ?? "");
  const [extension, setExtension] = useState("");
  const [reference, setReference] = useState("");

  const product = products.find((p) => p.slug === slug);

  /** Base term, plus any extension bought, plus the bonus a Care plan adds. */
  const planBonus = useMemo(() => {
    if (!membership) return 0;
    return careTiers.find((t) => t.id === membership.tier)?.warrantyBonusMonths ?? 0;
  }, [membership]);

  const base = product ? baseCoverMonths(product.category) : 12;
  const added = extendedCover.find((e) => e.id === extension)?.addedMonths ?? 0;
  const total = base + added + planBonus;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const name = product?.name ?? label.trim();
    if (!name || !fittedOn) return;

    addWarranty({
      slug: product?.slug,
      label: name,
      fittedOn,
      months: total,
      vehicleId: vehicleId || undefined,
      reference: reference.trim() || undefined,
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="surface p-6 md:p-7 space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="w-product" className="label">
            What was fitted
          </label>
          <select
            id="w-product"
            className="field"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          >
            <option value="">Something else (type it below)</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="w-label" className="label">
            {slug ? "Note (optional)" : "Item name"}
          </label>
          <input
            id="w-label"
            className="field"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={slug ? "Colour, variant, anything worth recording" : "e.g. Front lip"}
            required={!slug}
          />
        </div>

        <div>
          <label htmlFor="w-date" className="label">
            Date fitted
          </label>
          <input
            id="w-date"
            type="date"
            className="field"
            value={fittedOn}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setFittedOn(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="w-vehicle" className="label">
            Vehicle
          </label>
          <select
            id="w-vehicle"
            className="field"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            disabled={vehicles.length === 0}
          >
            <option value="">{vehicles.length ? "Not specified" : "No vehicles saved yet"}</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {[v.year, v.model, v.nickname && `(${v.nickname})`].filter(Boolean).join(" ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="w-extension" className="label">
            Extended cover
          </label>
          <select
            id="w-extension"
            className="field"
            value={extension}
            onChange={(e) => setExtension(e.target.value)}
          >
            <option value="">Standard cover only</option>
            {extendedCover.map((cover) => (
              <option key={cover.id} value={cover.id}>
                {cover.label}
                {product ? ` — ${lkr(extensionFee(cover, product.price))}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="w-ref" className="label">
            Invoice or job reference (optional)
          </label>
          <input
            id="w-ref"
            className="field"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Whatever is on the slip"
          />
        </div>
      </div>

      {/* Live arithmetic, so the term is never a surprise after saving. */}
      <div className="rounded-lg bg-[var(--bg-inset)] border border-[var(--border)] p-4">
        <p className="text-[12.5px] text-[var(--fg-subtle)] mb-2">This works out as</p>
        <p className="text-subheading mb-2 tabular-nums">{total} months of cover</p>
        <ul className="text-[12.5px] text-[var(--fg-muted)] space-y-1">
          <li>
            {base} months standard
            {product ? ` for ${product.category.replace(/-/g, " ")}` : ""}
          </li>
          {added > 0 && <li>+{added} months extended cover</li>}
          {planBonus > 0 && <li>+{planBonus} months from your Care plan</li>}
          <li>
            Fitting and workmanship covered for {WORKMANSHIP_COVER_MONTHS} months regardless
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary">
          <IconShield width={16} height={16} />
          Save registration
        </button>
        <button type="button" onClick={onDone} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------- row */

const STATUS_COPY: Record<WarrantyStatus, { label: string; className: string }> = {
  active: { label: "Covered", className: "text-[var(--ok)]" },
  expiring: { label: "Expiring soon", className: "text-[var(--accent)]" },
  expired: { label: "Expired", className: "text-[var(--fg-subtle)]" },
};

function WarrantyRow({ record }: { record: WarrantyRecord }) {
  const { removeWarranty, vehicles } = usePrefs();
  const [open, setOpen] = useState(false);

  const window_ = warrantyWindow(record.fittedOn, record.months);
  const vehicle = vehicles.find((v) => v.id === record.vehicleId);
  const status = window_?.status ?? "expired";
  const copy = STATUS_COPY[status];

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-LK", { day: "numeric", month: "short", year: "numeric" });

  const claim = () => {
    const lines = [
      "Hi Nexmod, I would like to raise a warranty claim.",
      "",
      `Item: ${record.label}`,
      `Fitted: ${fmt(new Date(record.fittedOn))}`,
      `Cover: ${record.months} months${window_ ? ` — ${copy.label.toLowerCase()}` : ""}`,
    ];
    if (window_) lines.push(`Expires: ${fmt(window_.expiresAt)}`);
    if (vehicle) lines.push(`Vehicle: ${[vehicle.year, vehicle.model].filter(Boolean).join(" ")}`);
    if (record.reference) lines.push(`Reference: ${record.reference}`);
    lines.push("", "Photos to follow.");
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  /** Fraction of the term already used, for the bar. */
  const elapsed = window_
    ? Math.min(
        1,
        Math.max(0, 1 - window_.daysLeft / Math.max(1, record.months * 30.44)),
      )
    : 1;

  return (
    <article className="surface p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 className="font-semibold text-[15px]">{record.label}</h3>
            <span className={`badge ${status === "active" ? "badge-accent" : ""}`}>
              {status === "active" ? (
                <IconCheck width={11} height={11} />
              ) : (
                <IconCalendar width={11} height={11} />
              )}
              {copy.label}
            </span>
          </div>

          <p className="text-[13px] text-[var(--fg-muted)]">
            Fitted {fmt(new Date(record.fittedOn))}
            {vehicle && ` · ${[vehicle.year, vehicle.model].filter(Boolean).join(" ")}`}
            {record.reference && ` · ${record.reference}`}
          </p>

          {window_ && (
            <>
              <div
                className="h-1 rounded-full bg-[var(--bg-inset)] mt-4 overflow-hidden"
                role="img"
                aria-label={`${Math.round(elapsed * 100)}% of the term elapsed`}
              >
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${elapsed * 100}%`,
                    background:
                      status === "expired" ? "var(--border-strong)" : "var(--accent)",
                  }}
                />
              </div>
              <p className={`text-[12.5px] mt-2 tabular-nums ${copy.className}`}>
                {status === "expired"
                  ? `Ran out ${fmt(window_.expiresAt)}`
                  : window_.monthsLeft >= 1
                    ? `${window_.monthsLeft} months left — until ${fmt(window_.expiresAt)}`
                    : `${window_.daysLeft} days left — until ${fmt(window_.expiresAt)}`}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button type="button" onClick={claim} className="btn btn-sm btn-whatsapp">
            <IconWhatsApp width={15} height={15} />
            Start a claim
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="btn btn-sm btn-ghost"
            aria-expanded={open}
          >
            {open ? "Hide" : "Details"}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-5 pt-5 border-t border-[var(--border)] flex flex-wrap items-start justify-between gap-4">
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 text-[13px] flex-1">
            <div>
              <dt className="text-[var(--fg-subtle)] text-[11.5px] uppercase tracking-wider">
                Term
              </dt>
              <dd className="font-semibold tabular-nums">{record.months} months</dd>
            </div>
            <div>
              <dt className="text-[var(--fg-subtle)] text-[11.5px] uppercase tracking-wider">
                Workmanship
              </dt>
              <dd className="font-semibold tabular-nums">{WORKMANSHIP_COVER_MONTHS} months</dd>
            </div>
            {window_ && (
              <div>
                <dt className="text-[var(--fg-subtle)] text-[11.5px] uppercase tracking-wider">
                  Expires
                </dt>
                <dd className="font-semibold">{fmt(window_.expiresAt)}</dd>
              </div>
            )}
            {record.slug && (
              <div>
                <dt className="text-[var(--fg-subtle)] text-[11.5px] uppercase tracking-wider">
                  Product
                </dt>
                <dd>
                  <a
                    href={`/products/${record.slug}`}
                    className="font-semibold hover:text-[var(--accent)] inline-flex items-center gap-1"
                  >
                    View
                    <IconArrowRight width={12} height={12} />
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <button
            type="button"
            onClick={() => removeWarranty(record.id)}
            className="btn btn-sm btn-ghost text-[var(--fg-subtle)]"
          >
            <IconTrash width={14} height={14} />
            Remove
          </button>
        </div>
      )}
    </article>
  );
}

function EmptyState({ onStart }: { onStart: () => void }) {
  return (
    <div className="surface p-8 md:p-10 text-center">
      <IconShield
        width={30}
        height={30}
        className="mx-auto text-[var(--fg-faint)] mb-4"
        aria-hidden="true"
      />
      <h3 className="text-subheading mb-2">Register what is already on the car</h3>
      <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed max-w-md mx-auto mb-6">
        It takes about twenty seconds per item and it means that when something does fail, you have
        the date, the term and the reference in one message instead of a search through old
        receipts.
      </p>
      <button type="button" onClick={onStart} className="btn btn-primary">
        <IconPlus width={16} height={16} />
        Register an item
      </button>
    </div>
  );
}
