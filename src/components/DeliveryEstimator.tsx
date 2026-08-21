"use client";

import { useMemo, useState } from "react";
import { districts, zoneForDistrict } from "@/data/delivery";
import { lkr, site } from "@/data/site";
import { useCart } from "@/lib/cart";
import { IconCheck, IconClock, IconMapPin, IconTruck } from "./Icons";

/**
 * Delivery estimator.
 *
 * Answers "when will it get here and what will it cost" before someone has to
 * commit to a checkout to find out. Reads the live cart subtotal so the
 * free-delivery threshold is evaluated against what they are actually buying,
 * and falls back to a worked example when the cart is empty.
 */
export function DeliveryEstimator({ compact = false }: { compact?: boolean }) {
  const { totals } = useCart();
  const [district, setDistrict] = useState("");

  const zone = useMemo(() => (district ? zoneForDistrict(district) : undefined), [district]);

  const subtotal = totals.subtotal;
  const qualifies = subtotal >= site.delivery.freeThreshold;
  const base = qualifies ? 0 : 650;
  const cost = zone ? base + (qualifies ? 0 : zone.surcharge) : null;

  return (
    <div className={compact ? "" : "surface p-5 md:p-6"}>
      <div className="flex items-center gap-2.5 mb-4">
        <IconTruck width={18} height={18} className="text-[var(--accent)] shrink-0" />
        <h3 className="font-[family-name:var(--font-display)] font-bold text-[15px]">
          Delivery estimate
        </h3>
      </div>

      <label htmlFor="delivery-district" className="label">
        Where are you?
      </label>
      <select
        id="delivery-district"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        className="field mb-4"
      >
        <option value="">Choose your district or town…</option>
        {districts.map((d) => (
          <option key={d.name} value={d.name}>
            {d.name}
          </option>
        ))}
      </select>

      {zone ? (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[var(--bg-inset)]">
            <IconClock width={16} height={16} className="shrink-0 mt-0.5 text-[var(--accent)]" />
            <div className="min-w-0">
              <p className="text-[14px] font-semibold leading-snug">{zone.days}</p>
              <p className="text-[12.5px] text-[var(--fg-subtle)] mt-0.5">
                {zone.label} · from dispatch, after we confirm your order
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-lg bg-[var(--bg-inset)]">
            <IconTruck width={16} height={16} className="shrink-0 mt-0.5 text-[var(--accent)]" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold leading-snug">
                {cost === 0 ? (
                  <span className="text-[var(--ok)]">Free delivery</span>
                ) : (
                  <span className="figure">{lkr(cost ?? 0)}</span>
                )}
              </p>
              <p className="text-[12.5px] text-[var(--fg-subtle)] mt-0.5">
                {qualifies
                  ? `Your cart is over ${lkr(site.delivery.freeThreshold)}`
                  : subtotal > 0
                    ? `${lkr(site.delivery.freeThreshold - subtotal)} more for free delivery`
                    : `Free over ${lkr(site.delivery.freeThreshold)}`}
              </p>
            </div>
          </div>

          <p className="text-[12.5px] text-[var(--fg-muted)] leading-relaxed">{zone.note}</p>

          <div className="flex items-start gap-2 pt-3 border-t border-[var(--border)]">
            <IconCheck width={13} height={13} className="shrink-0 mt-0.5 text-[var(--ok)]" />
            <p className="text-[12.5px] text-[var(--fg-muted)] leading-relaxed">
              Cash on delivery is available everywhere on this list.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 text-[13px] text-[var(--fg-muted)] leading-relaxed">
          <IconMapPin width={15} height={15} className="shrink-0 mt-0.5 text-[var(--fg-subtle)]" />
          <p>
            Islandwide delivery by tracked courier, or free collection from the workshop at{" "}
            {site.address.street}, {site.address.locality}.
          </p>
        </div>
      )}
    </div>
  );
}
