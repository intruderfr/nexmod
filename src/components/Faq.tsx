"use client";

import { useState } from "react";
import type { FaqItem } from "@/data/types";
import { IconPlus } from "./Icons";

/**
 * FAQ accordion. Built on <button> + aria-expanded rather than <details> so the
 * open/close animation is controllable and the state is announced correctly.
 *
 * The matching FAQPage JSON-LD is emitted separately by the page, from the same
 * data array.
 */
export function Faq({ items, defaultOpen = 0 }: { items: FaqItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="w-full flex items-start justify-between gap-4 py-5 text-left group"
              >
                <span
                  className={`font-semibold text-[15.5px] leading-snug transition-colors ${
                    isOpen ? "text-[var(--accent)]" : "group-hover:text-[var(--accent)]"
                  }`}
                >
                  {item.q}
                </span>
                <span
                  className={`shrink-0 grid place-items-center w-6 h-6 mt-0.5 rounded border transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 border-[var(--accent)] text-[var(--accent)]"
                      : "border-[var(--border-strong)] text-[var(--fg-subtle)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]"
                  }`}
                >
                  <IconPlus width={13} height={13} />
                </span>
              </button>
            </h3>

            <div
              id={`faq-panel-${i}`}
              hidden={!isOpen}
              className="pb-5 pr-10 text-[14.5px] leading-relaxed text-[var(--fg-muted)]"
            >
              {item.a}
            </div>
          </div>
        );
      })}
    </div>
  );
}
