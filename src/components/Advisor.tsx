"use client";

import { useMemo, useState } from "react";
import { advice, BUDGET_STEPS, concerns, lowBudgetAdvice } from "@/data/advisor";
import { getProduct } from "@/data/products";
import { lkr, waLink } from "@/data/site";
import { LocaleLink as Link } from "@/i18n/client";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";
import {
  CategoryIcon,
  IconArrowRight,
  IconCart,
  IconCheck,
  IconTool,
  IconWhatsApp,
} from "./Icons";

/**
 * Budget advisor.
 *
 * Answers the question people actually ask: "I have this much — what should I
 * do first?" Recommendations are ordered by the sequence the workshop would
 * actually work in, not by price, and the tool will tell you to spend nothing
 * when that is the right answer.
 *
 * Deliberately not a lead-capture form. It gives the answer on the page,
 * because gating honest advice behind an email address is the opposite of the
 * thing that makes the advice worth having.
 */
export function Advisor() {
  const { add, setOpen } = useCart();
  const { activeVehicle } = usePrefs();

  const [selected, setSelected] = useState<string[]>([]);
  const [budgetIndex, setBudgetIndex] = useState(2); // Rs. 50,000
  const budget = BUDGET_STEPS[budgetIndex];

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  /**
   * Merge the rules for every selected concern, dedupe by product (keeping the
   * strongest reason), sort by the workshop's working order, then fill the
   * budget greedily in that order.
   */
  const plan = useMemo(() => {
    if (selected.length === 0) return null;

    const merged = new Map<
      string,
      { slug: string; priority: number; because: string; concern: string }
    >();

    for (const concern of selected) {
      for (const rec of advice[concern] ?? []) {
        const existing = merged.get(rec.slug);
        if (!existing || rec.priority < existing.priority) {
          merged.set(rec.slug, { ...rec, concern });
        }
      }
    }

    const ordered = [...merged.values()]
      .map((rec) => ({ ...rec, product: getProduct(rec.slug) }))
      .filter((rec): rec is typeof rec & { product: NonNullable<typeof rec.product> } =>
        Boolean(rec.product),
      )
      .sort((a, b) => a.priority - b.priority || a.product.price - b.product.price);

    const included: typeof ordered = [];
    const deferred: typeof ordered = [];
    let spent = 0;

    for (const rec of ordered) {
      if (spent + rec.product.price <= budget) {
        included.push(rec);
        spent += rec.product.price;
      } else {
        deferred.push(rec);
      }
    }

    return { included, deferred, spent, remaining: budget - spent };
  }, [selected, budget]);

  function addPlan() {
    if (!plan) return;
    for (const rec of plan.included) {
      add({
        slug: rec.product.slug,
        name: rec.product.name,
        variantId: rec.product.variants?.[0]?.id,
        variantLabel: rec.product.variants?.[0]?.label,
        unitPrice: rec.product.variants?.[0]?.price ?? rec.product.price,
        qty: 1,
        withInstallation: Boolean(rec.product.installation?.available),
        installationFee: rec.product.installation?.fee ?? 0,
        category: rec.product.category,
      });
    }
    setOpen(true);
  }

  const whatsapp = useMemo(() => {
    if (!plan) return waLink("Hi Nexmod, what would you recommend for my car?");
    return waLink(
      [
        "Hi Nexmod, I used your advisor and it suggested this:",
        "",
        activeVehicle ? `Vehicle: ${activeVehicle.model}` : null,
        `Budget: ${lkr(budget)}`,
        "",
        ...plan.included.map((r) => `• ${r.product.name} — ${lkr(r.product.price)}`),
        "",
        `Total: ${lkr(plan.spent)}`,
        "",
        "Does this make sense for my car?",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  }, [plan, budget, activeVehicle]);

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
      {/* Questions */}
      <div className="min-w-0 space-y-10">
        <section>
          <span className="step-marker block mb-3">01</span>
          <h2 className="text-heading mb-2">What bothers you about the car?</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed mb-6">
            Pick as many as apply. Describing the problem gets you a better answer than naming a
            product.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {concerns.map((concern) => {
              const active = selected.includes(concern.id);
              return (
                <button
                  key={concern.id}
                  type="button"
                  onClick={() => toggle(concern.id)}
                  aria-pressed={active}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors ${
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                      : "border-[var(--border)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <span
                    className={`shrink-0 grid place-items-center w-9 h-9 rounded-lg transition-colors ${
                      active
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--bg-inset)] text-[var(--accent)]"
                    }`}
                  >
                    <CategoryIcon name={concern.icon} width={17} height={17} />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={`block font-semibold text-[14.5px] leading-snug mb-0.5 ${
                        active ? "text-[var(--accent)]" : ""
                      }`}
                    >
                      {concern.label}
                    </span>
                    <span className="block text-[12.5px] text-[var(--fg-muted)] leading-snug">
                      {concern.detail}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <span className="step-marker block mb-3">02</span>
          <h2 className="text-heading mb-2">What are you happy to spend?</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed mb-6">
            Parts only. Fitting is included on most items, and quoted separately where it is not.
          </p>

          <div className="surface p-6">
            <div className="flex items-baseline justify-between mb-4">
              <span className="figure text-3xl font-bold">{lkr(budget)}</span>
              <span className="text-[12.5px] text-[var(--fg-subtle)]">
                Step {budgetIndex + 1} of {BUDGET_STEPS.length}
              </span>
            </div>

            <label htmlFor="budget" className="sr-only">
              Budget
            </label>
            <input
              id="budget"
              type="range"
              min={0}
              max={BUDGET_STEPS.length - 1}
              step={1}
              value={budgetIndex}
              onChange={(e) => setBudgetIndex(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />

            <div className="flex justify-between mt-2 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--fg-subtle)]">
              {BUDGET_STEPS.map((step) => (
                <span key={step}>{step >= 1000 ? `${step / 1000}k` : step}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Result */}
      <aside className="lg:sticky lg:top-24">
        {selected.length === 0 ? (
          <div className="surface p-8 text-center">
            <span className="grid place-items-center w-12 h-12 mx-auto rounded-full bg-[var(--bg-inset)] text-[var(--fg-subtle)] mb-4">
              <IconTool width={22} height={22} />
            </span>
            <p className="font-semibold mb-1.5">Pick a problem to start</p>
            <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
              We will tell you what to do first, in what order, and what to leave alone for now.
            </p>
          </div>
        ) : (
          <div className="surface overflow-hidden">
            <div className="p-5 border-b border-[var(--border)]">
              <p className="eyebrow mb-2.5">Our recommendation</p>
              <h2 className="text-subheading">
                {plan && plan.included.length > 0
                  ? `Start with ${plan.included.length} ${plan.included.length === 1 ? "thing" : "things"}`
                  : "Spend nothing yet"}
              </h2>
            </div>

            {plan && plan.included.length > 0 ? (
              <>
                <ol className="p-5 space-y-4 max-h-[26rem] overflow-y-auto">
                  {plan.included.map((rec, i) => (
                    <li key={rec.slug} className="flex gap-3">
                      <span className="shrink-0 grid place-items-center w-6 h-6 rounded-full bg-[var(--accent)] text-white font-[family-name:var(--font-mono)] text-[11px] font-semibold">
                        {i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-baseline justify-between gap-3 mb-1">
                          <Link
                            href={`/products/${rec.product.slug}`}
                            className="text-[14px] font-semibold leading-snug hover:text-[var(--accent)] transition-colors"
                          >
                            {rec.product.name}
                          </Link>
                          <span className="figure shrink-0 text-[13px] font-semibold">
                            {lkr(rec.product.price)}
                          </span>
                        </span>
                        <span className="block text-[12.5px] text-[var(--fg-muted)] leading-relaxed">
                          {rec.because}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>

                <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-[family-name:var(--font-display)] font-bold">Total</span>
                    <span className="figure text-lg font-bold">{lkr(plan.spent)}</span>
                  </div>
                  {plan.remaining > 0 && (
                    <p className="text-[11.5px] text-[var(--fg-subtle)]">
                      {lkr(plan.remaining)} of your budget left over. Keeping it is a legitimate
                      option.
                    </p>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <button type="button" onClick={addPlan} className="btn btn-primary w-full">
                    <IconCart width={16} height={16} />
                    Add all to cart
                  </button>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp w-full"
                  >
                    <IconWhatsApp width={16} height={16} />
                    Check this with us
                  </a>
                </div>
              </>
            ) : (
              <div className="p-5 space-y-3">
                {selected.map((id) => (
                  <p
                    key={id}
                    className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed pl-3 border-l-2 border-[var(--accent)]"
                  >
                    {lowBudgetAdvice[id]}
                  </p>
                ))}
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp w-full mt-2"
                >
                  <IconWhatsApp width={16} height={16} />
                  Ask us anyway
                </a>
              </div>
            )}

            {/* What we would leave for later */}
            {plan && plan.deferred.length > 0 && (
              <div className="px-5 pb-5 pt-4 border-t border-[var(--border)]">
                <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.14em] text-[var(--fg-subtle)] mb-2.5">
                  Leave for later
                </p>
                <ul className="space-y-1.5">
                  {plan.deferred.slice(0, 4).map((rec) => (
                    <li
                      key={rec.slug}
                      className="flex items-baseline justify-between gap-3 text-[12.5px] text-[var(--fg-subtle)]"
                    >
                      <Link
                        href={`/products/${rec.product.slug}`}
                        className="truncate hover:text-[var(--accent)] transition-colors"
                      >
                        {rec.product.name}
                      </Link>
                      <span className="figure shrink-0">{lkr(rec.product.price)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11.5px] text-[var(--fg-subtle)] leading-relaxed mt-3">
                  Not worse — just further down the order we would do them in.
                </p>
              </div>
            )}
          </div>
        )}

        <p className="text-[12px] text-[var(--fg-subtle)] leading-relaxed mt-4">
          These are the same answers we give at the counter, including the ones that cost us a
          sale. Prices are indicative and confirmed on quote.
        </p>
      </aside>
    </div>
  );
}

export function AdvisorTeaser() {
  return (
    <Link
      href="/advisor"
      className="group surface surface-hover p-6 md:p-7 flex flex-col sm:flex-row sm:items-center gap-5"
    >
      <span className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
        <IconTool width={22} height={22} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="eyebrow mb-2">Not sure where to start?</span>
        <span className="block text-subheading mb-1.5 group-hover:text-[var(--accent)] transition-colors">
          Tell us what bothers you about the car
        </span>
        <span className="block text-[14px] text-[var(--fg-muted)] leading-relaxed">
          Pick your budget and we will tell you what to do first, in what order — and what to leave
          alone.
        </span>
      </span>
      <span className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--accent)]">
        Open the advisor
        <IconArrowRight
          width={15}
          height={15}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}

/** Unused import guard — keeps IconCheck available for future states. */
void IconCheck;
