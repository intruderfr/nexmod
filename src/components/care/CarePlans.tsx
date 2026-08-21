"use client";

import { useMemo, useState } from "react";

import {
  allowanceLabel,
  annualBenefitValue,
  benefitsFor,
  careBenefits,
  careTiers,
  type CareTier,
  type CareTierId,
} from "@/data/care";
import { lkr, site, waLink } from "@/data/site";
import { IconCheck, IconClose, IconShield, IconStar, IconWhatsApp } from "@/components/Icons";
import { usePrefs } from "@/lib/prefs";

type Billing = "monthly" | "annual";

/** Where the spend slider starts, and the steps it moves in. */
const SPEND_MIN = 0;
const SPEND_MAX = 400_000;
const SPEND_STEP = 10_000;
const SPEND_DEFAULT = 80_000;

export function CarePlans() {
  const { membership, setMembership, logHistory, profile, activeVehicle, ready } = usePrefs();

  const [billing, setBilling] = useState<Billing>("annual");
  const [spend, setSpend] = useState(SPEND_DEFAULT);

  const priceFor = (tier: CareTier) => (billing === "annual" ? tier.annual : tier.monthly);

  /** What a year on this tier costs, whichever way it is billed. */
  const annualCost = (tier: CareTier) =>
    billing === "annual" ? tier.annual : tier.monthly * 12;

  function join(tier: CareTier) {
    setMembership({
      tier: tier.id,
      billing,
      startedAt: new Date().toISOString(),
    });

    logHistory({
      kind: "care",
      summary: `Requested ${tier.name} (${billing === "annual" ? "annual" : "monthly"})`,
      total: annualCost(tier),
    });

    const lines = [
      `Hi Nexmod, I would like to join ${tier.name}.`,
      "",
      `Billing: ${billing === "annual" ? `Annual — ${lkr(tier.annual)}/year` : `Monthly — ${lkr(tier.monthly)}/month`}`,
      `Member discount: ${tier.discountPct}% on parts and fitting`,
      `Warranty bonus: +${tier.warrantyBonusMonths} months`,
    ];
    if (profile.name) lines.push(`Name: ${profile.name}`);
    if (profile.phone) lines.push(`Phone: ${profile.phone}`);
    if (activeVehicle) {
      lines.push(`Vehicle: ${[activeVehicle.year, activeVehicle.model].filter(Boolean).join(" ")}`);
    }
    lines.push("", "Please confirm what happens next.");

    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-16 md:space-y-24">
      {ready && membership && <CurrentPlan />}

      {/* ------------------------------------------------------ the tiers */}
      <div>
        <BillingToggle value={billing} onChange={setBilling} />

        <div className="grid gap-4 md:gap-5 lg:grid-cols-3 mt-8" data-reveal-group>
          {careTiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              billing={billing}
              price={priceFor(tier)}
              current={membership?.tier === tier.id}
              onJoin={() => join(tier)}
            />
          ))}
        </div>

        <p className="text-[12.5px] text-[var(--fg-subtle)] mt-6 max-w-2xl">
          Plans are billed by Nexmod directly — there is no card form on this site. Choosing a plan
          opens WhatsApp with the details filled in, and nothing is charged until you have spoken to
          someone.
        </p>
      </div>

      {/* ------------------------------------------------ savings maths */}
      <SavingsCalculator
        spend={spend}
        onSpend={setSpend}
        billing={billing}
        annualCost={annualCost}
      />

      {/* ------------------------------------------------ full comparison */}
      <ComparisonTable billing={billing} />
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

function BillingToggle({
  value,
  onChange,
}: {
  value: Billing;
  onChange: (v: Billing) => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div
        role="radiogroup"
        aria-label="Billing period"
        className="inline-flex items-center p-1 rounded-xl bg-[var(--bg-inset)] border border-[var(--border)]"
      >
        {(["monthly", "annual"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={value === option}
            onClick={() => onChange(option)}
            className={`h-9 px-4 rounded-lg text-[13.5px] font-semibold transition-colors ${
              value === option
                ? "bg-[var(--bg-raised)] text-[var(--fg)] shadow-sm"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {option === "monthly" ? "Monthly" : "Annual"}
          </button>
        ))}
      </div>

      <span className="badge badge-accent">Annual is two months free</span>
    </div>
  );
}

function TierCard({
  tier,
  billing,
  price,
  current,
  onJoin,
}: {
  tier: CareTier;
  billing: Billing;
  price: number;
  current: boolean;
  onJoin: () => void;
}) {
  const included = benefitsFor(tier.id);

  return (
    <article
      data-reveal
      className={`surface flex flex-col p-6 md:p-7 ${
        tier.featured ? "ring-2 ring-[var(--accent)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="text-subheading">{tier.name}</h3>
        {tier.featured && !current && <span className="badge badge-accent shrink-0">Most taken</span>}
        {current && (
          <span className="badge badge-accent shrink-0">
            <IconCheck width={11} height={11} />
            Your plan
          </span>
        )}
      </div>

      <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed mb-5">{tier.tagline}</p>

      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-display-3 tabular-nums leading-none">{lkr(price)}</span>
        <span className="text-[13px] text-[var(--fg-subtle)]">
          /{billing === "annual" ? "year" : "month"}
        </span>
      </div>
      <p className="text-[12px] text-[var(--fg-subtle)] mb-6">
        {billing === "annual"
          ? `Works out at ${lkr(Math.round(tier.annual / 12))} a month`
          : `${lkr(tier.annual)} if paid annually`}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-6">
        <span className="badge">
          <IconStar width={11} height={11} />
          {tier.discountPct}% member price
        </span>
        <span className="badge">
          <IconShield width={11} height={11} />+{tier.warrantyBonusMonths}mo warranty
        </span>
      </div>

      <ul className="space-y-2.5 mb-6">
        {included.map((benefit) => (
          <li key={benefit.id} className="flex items-start gap-2.5 text-[13.5px]">
            <IconCheck
              width={14}
              height={14}
              className="text-[var(--accent)] shrink-0 mt-[3px]"
              aria-hidden="true"
            />
            <span>
              {benefit.label}
              {benefit.unit && (
                <span className="text-[var(--fg-subtle)]">
                  {" "}
                  — {allowanceLabel(benefit, tier.id).toLowerCase()}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-5 border-t border-[var(--border)] space-y-4">
        <p className="text-[12.5px] text-[var(--fg-muted)] leading-relaxed">
          <strong className="font-semibold text-[var(--fg)]">Best for.</strong> {tier.bestFor}
        </p>
        <p className="text-[12.5px] text-[var(--fg-subtle)] leading-relaxed">
          <strong className="font-semibold">Not included.</strong> {tier.notIncluded}
        </p>

        <button
          type="button"
          onClick={onJoin}
          className={`btn w-full ${tier.featured ? "btn-primary" : "btn-outline"}`}
        >
          <IconWhatsApp width={16} height={16} />
          {current ? "Ask about this plan" : `Join ${tier.name}`}
        </button>
      </div>
    </article>
  );
}

/**
 * The honest version of a savings calculator.
 *
 * Two separate numbers, not one blended figure: what the included visits are
 * worth at counter prices, and what the member discount saves on whatever you
 * were going to spend anyway. They are added, but shown apart, because the
 * second only materialises if you actually keep buying — and a plan sold on a
 * saving that never arrives is a plan that gets cancelled.
 */
function SavingsCalculator({
  spend,
  onSpend,
  billing,
  annualCost,
}: {
  spend: number;
  onSpend: (v: number) => void;
  billing: Billing;
  annualCost: (tier: CareTier) => number;
}) {
  const rows = useMemo(
    () =>
      careTiers.map((tier) => {
        const visits = annualBenefitValue(tier.id);
        const discount = Math.round(spend * (tier.discountPct / 100));
        const cost = annualCost(tier);
        return { tier, visits, discount, cost, net: visits + discount - cost };
      }),
    [spend, billing, annualCost],
  );

  const best = rows.reduce((a, b) => (b.net > a.net ? b : a));
  const fill = ((spend - SPEND_MIN) / (SPEND_MAX - SPEND_MIN)) * 100;

  return (
    <div className="surface p-6 md:p-8" data-reveal>
      <p className="eyebrow mb-4">Is it worth it</p>
      <h2 className="text-heading mb-3">Work it out against your own year</h2>
      <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed max-w-2xl mb-8">
        Move the slider to roughly what you expect to spend on parts and fitting over the next
        twelve months. Everything below is at counter prices, and the plan fee is already
        subtracted.
      </p>

      <div className="max-w-xl mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <label htmlFor="care-spend" className="label mb-0">
            Planned spend this year
          </label>
          <output htmlFor="care-spend" className="text-subheading tabular-nums">
            {spend === 0 ? "Nothing yet" : lkr(spend)}
          </output>
        </div>
        <input
          id="care-spend"
          type="range"
          className="range"
          min={SPEND_MIN}
          max={SPEND_MAX}
          step={SPEND_STEP}
          value={spend}
          onChange={(e) => onSpend(Number(e.target.value))}
          style={{ "--fill": `${fill}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-[11.5px] text-[var(--fg-subtle)] mt-1.5 tabular-nums">
          <span>{lkr(SPEND_MIN)}</span>
          <span>{lkr(SPEND_MAX)}+</span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 md:-mx-8 px-6 md:px-8">
        <table className="w-full min-w-[34rem] text-[13.5px] border-collapse">
          <caption className="sr-only">
            Annual value of each Care plan against your planned spend
          </caption>
          <thead>
            <tr className="text-left text-[var(--fg-subtle)]">
              <th scope="col" className="font-medium pb-3 pr-4">
                Plan
              </th>
              <th scope="col" className="font-medium pb-3 px-3 text-right">
                Visits included
              </th>
              <th scope="col" className="font-medium pb-3 px-3 text-right">
                Discount on {spend === 0 ? "spend" : lkr(spend)}
              </th>
              <th scope="col" className="font-medium pb-3 px-3 text-right">
                Plan cost
              </th>
              <th scope="col" className="font-medium pb-3 pl-3 text-right">
                Net
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
            {rows.map((row) => (
              <tr key={row.tier.id} className={row.tier.id === best.tier.id ? "font-semibold" : ""}>
                <th scope="row" className="text-left font-semibold py-3.5 pr-4">
                  {row.tier.name}
                  {row.tier.id === best.tier.id && (
                    <span className="badge badge-accent ml-2 align-middle">Best here</span>
                  )}
                </th>
                <td className="py-3.5 px-3 text-right tabular-nums">{lkr(row.visits)}</td>
                <td className="py-3.5 px-3 text-right tabular-nums">
                  {row.discount ? lkr(row.discount) : "—"}
                </td>
                <td className="py-3.5 px-3 text-right tabular-nums text-[var(--fg-muted)]">
                  −{lkr(row.cost)}
                </td>
                <td
                  className={`py-3.5 pl-3 text-right tabular-nums ${
                    row.net >= 0 ? "text-[var(--ok)]" : "text-[var(--fg-muted)]"
                  }`}
                >
                  {row.net >= 0 ? "+" : "−"}
                  {lkr(Math.abs(row.net))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[12px] text-[var(--fg-subtle)] mt-5 leading-relaxed max-w-2xl">
        Unlimited allowances are counted at six uses a year rather than infinity, so these figures
        understate the top tier slightly. A negative net is the honest answer that a plan is not
        worth it for how you actually use the car.
      </p>
    </div>
  );
}

function ComparisonTable({ billing }: { billing: Billing }) {
  return (
    <div data-reveal>
      <p className="eyebrow mb-4">Side by side</p>
      <h2 className="text-heading mb-8">Everything, compared</h2>

      <div className="overflow-x-auto surface">
        <table className="w-full min-w-[46rem] text-[13.5px] border-collapse">
          <caption className="sr-only">Nexmod Care plan benefits compared</caption>
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th scope="col" className="text-left font-semibold p-4 md:p-5 w-[38%]">
                Benefit
              </th>
              {careTiers.map((tier) => (
                <th key={tier.id} scope="col" className="p-4 md:p-5 text-center">
                  <span className="block font-semibold">{tier.name}</span>
                  <span className="block text-[12px] font-normal text-[var(--fg-subtle)] tabular-nums mt-0.5">
                    {billing === "annual"
                      ? `${lkr(tier.annual)}/yr`
                      : `${lkr(tier.monthly)}/mo`}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {careBenefits.map((benefit) => (
              <tr key={benefit.id}>
                <th scope="row" className="text-left p-4 md:p-5 align-top">
                  <span className="block font-semibold">{benefit.label}</span>
                  <span className="block text-[12.5px] font-normal text-[var(--fg-muted)] leading-relaxed mt-1">
                    {benefit.detail}
                  </span>
                </th>
                {careTiers.map((tier) => {
                  const value = benefit.tiers[tier.id];
                  return (
                    <td key={tier.id} className="p-4 md:p-5 text-center align-top">
                      {value === false ? (
                        <IconClose
                          width={15}
                          height={15}
                          className="inline text-[var(--fg-faint)]"
                          aria-label="Not included"
                        />
                      ) : value === true ? (
                        <IconCheck
                          width={16}
                          height={16}
                          className="inline text-[var(--accent)]"
                          aria-label="Included"
                        />
                      ) : (
                        <span className="font-semibold tabular-nums">
                          {allowanceLabel(benefit, tier.id)}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Shown only once a plan is active on this device. */
function CurrentPlan() {
  const { membership, setMembership, logHistory } = usePrefs();
  if (!membership) return null;

  const tier = careTiers.find((t) => t.id === membership.tier);
  if (!tier) return null;

  const started = new Date(membership.startedAt);
  const renews = new Date(started);
  if (membership.billing === "annual") renews.setFullYear(renews.getFullYear() + 1);
  else renews.setMonth(renews.getMonth() + 1);

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-LK", { day: "numeric", month: "long", year: "numeric" });

  function cancel() {
    setMembership(null);
    logHistory({ kind: "care", summary: `Removed ${tier!.name} from this device` });
  }

  return (
    <div className="surface p-6 md:p-7 border-l-2 border-l-[var(--accent)]" data-reveal>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-3">Your plan</p>
          <h2 className="text-subheading mb-1.5">{tier.name}</h2>
          <p className="text-[13.5px] text-[var(--fg-muted)]">
            {membership.billing === "annual" ? "Billed annually" : "Billed monthly"} · started{" "}
            {fmt(started)} · next {fmt(renews)}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            <span className="badge badge-accent">
              {tier.discountPct}% off parts and fitting, applied at checkout
            </span>
            <span className="badge">+{tier.warrantyBonusMonths} months on anything fitted</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={waLink(
              `Hi Nexmod, a question about my ${tier.name} plan (${site.name} Care).`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-whatsapp"
          >
            <IconWhatsApp width={15} height={15} />
            Ask about it
          </a>
          <button type="button" onClick={cancel} className="btn btn-sm btn-ghost">
            Remove from device
          </button>
        </div>
      </div>

      <p className="text-[12px] text-[var(--fg-subtle)] mt-5 leading-relaxed">
        This is a record on this device, not a billing account. Removing it here stops member
        pricing showing on this browser; it does not cancel anything with Nexmod. Message the
        workshop to change or end a plan properly.
      </p>
    </div>
  );
}
