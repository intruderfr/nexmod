"use client";

import { useState } from "react";
import { lkr } from "@/data/site";
import { IconCheck, IconChevronDown } from "./Icons";

/**
 * Pay-in-three breakdown.
 *
 * KOKO and Mintpay are the two buy-now-pay-later providers most Sri Lankan
 * shoppers already have, and both split a purchase into three equal payments
 * with no interest to the customer.
 *
 * The provider commission is built into list prices rather than surcharged at
 * checkout, so the three instalments genuinely sum to the shelf price. That is
 * stated here rather than buried, because "0% interest" claims usually are not.
 *
 * Rounding: the first instalment absorbs the remainder so the three add up
 * exactly. Showing three rounded thirds that do not sum to the total is the
 * kind of small dishonesty people notice.
 */
export function PayLater({ amount, compact = false }: { amount: number; compact?: boolean }) {
  const [open, setOpen] = useState(false);

  if (amount <= 0) return null;

  const base = Math.floor(amount / 3);
  const first = amount - base * 2;

  if (compact) {
    return (
      <p className="text-[12.5px] text-[var(--fg-muted)]">
        or 3 × <strong className="figure text-[var(--fg)]">{lkr(base)}</strong> with KOKO or Mintpay
      </p>
    );
  }

  return (
    <div className="surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--bg-inset)] transition-colors"
      >
        <span className="flex-1 min-w-0">
          <span className="block text-[13.5px] font-semibold">
            Pay in 3 · <span className="figure">{lkr(base)}</span> a month
          </span>
          <span className="block text-[11.5px] text-[var(--fg-subtle)] mt-0.5">
            KOKO or Mintpay · 0% interest
          </span>
        </span>
        <IconChevronDown
          width={15}
          height={15}
          className={`shrink-0 text-[var(--fg-subtle)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-[var(--border)] pt-4">
          <ol className="space-y-2.5 mb-4">
            {[
              { when: "Today", value: first },
              { when: "In 1 month", value: base },
              { when: "In 2 months", value: base },
            ].map((row, i) => (
              <li key={row.when} className="flex items-center gap-3">
                <span
                  className={`shrink-0 grid place-items-center w-6 h-6 rounded-full text-[10.5px] font-bold tabular-nums ${
                    i === 0
                      ? "bg-[var(--accent)] text-white"
                      : "border border-[var(--border-strong)] text-[var(--fg-subtle)]"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-[13.5px] text-[var(--fg-muted)]">{row.when}</span>
                <span className="figure text-[13.5px] font-semibold">{lkr(row.value)}</span>
              </li>
            ))}
          </ol>

          <ul className="space-y-1.5 pt-3 border-t border-[var(--border)]">
            {[
              "No interest and no fee if you pay on time",
              "Instalment cost is built into our price — you pay the same either way",
              "Approval happens with KOKO or Mintpay, not with us",
            ].map((point) => (
              <li key={point} className="flex items-start gap-2 text-[12px] text-[var(--fg-muted)]">
                <IconCheck width={12} height={12} className="shrink-0 mt-0.5 text-[var(--ok)]" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
