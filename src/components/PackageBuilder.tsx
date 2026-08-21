"use client";

import { useMemo, useState } from "react";

import { IconCheck, IconPlus, IconStar, IconTool, IconWhatsApp } from "@/components/Icons";
import { BUNDLE_LADDER, bundleRate, bundleSaving, nextBundleTier } from "@/data/bundle";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { lkr, waLink } from "@/data/site";
import { useCart } from "@/lib/cart";
import { usePrefs } from "@/lib/prefs";

/**
 * Build your own package.
 *
 * The curated packages answer "what should I do first". This answers the other
 * half — someone who already knows what they want, in a combination we did not
 * think to bundle, and who should not be punished for it.
 *
 * The ladder itself lives in data/bundle.ts and is applied by the cart, not
 * here. This screen only previews it. That split is deliberate: the discount
 * is a property of the order, so a basket assembled by browsing gets the same
 * rate as one assembled here — and the total shown below cannot drift away
 * from the total charged at checkout, which is exactly what it used to do.
 */

export function PackageBuilder() {
  const { add, setOpen } = useCart();
  const { saveBuild, logHistory, memberDiscount, activeVehicle } = usePrefs();

  const [picked, setPicked] = useState<string[]>([]);
  const [withFitting, setWithFitting] = useState(true);
  const [category, setCategory] = useState<string>("all");

  const chosen = useMemo(
    () => picked.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean),
    [picked],
  ) as (typeof products)[number][];

  const maths = useMemo(() => {
    const parts = chosen.reduce((n, p) => n + p.price, 0);
    const fitting = withFitting
      ? chosen.reduce((n, p) => n + (p.installation?.fee ?? 0), 0)
      : 0;
    // Only items actually being fitted count towards the ladder, matching how
    // the cart works it out.
    const fittedCount = withFitting
      ? chosen.filter((p) => p.installation?.available).length
      : 0;
    const bundle = bundleSaving(
      withFitting ? chosen.reduce((n, p) => (p.installation?.available ? n + p.price : n), 0) : 0,
      fittedCount,
    );
    const afterBundle = parts + fitting - bundle;
    const memberSaving = Math.round(afterBundle * memberDiscount);
    return {
      parts,
      fitting,
      fittedCount,
      bundlePct: Math.round(bundleRate(fittedCount) * 100),
      bundleSaving: bundle,
      memberSaving,
      total: afterBundle - memberSaving,
      saved: bundle + memberSaving,
    };
  }, [chosen, withFitting, memberDiscount]);

  const next = nextBundleTier(maths.fittedCount);

  const visible = useMemo(
    () =>
      category === "all" ? products : products.filter((p) => p.category === category),
    [category],
  );

  function toggle(slug: string) {
    setPicked((current) =>
      current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug],
    );
  }

  function addAll() {
    for (const product of chosen) {
      add({
        slug: product.slug,
        name: product.name,
        unitPrice: product.price,
        qty: 1,
        withInstallation: withFitting && Boolean(product.installation?.available),
        installationFee: product.installation?.fee ?? 0,
        category: product.category,
      });
    }
    setOpen(true);
  }

  function save() {
    saveBuild({
      name: `My package — ${chosen.length} items`,
      vehicle: activeVehicle?.model,
      items: chosen.map((p) => ({
        slug: p.slug,
        withInstallation: withFitting && Boolean(p.installation?.available),
      })),
    });
    logHistory({
      kind: "build",
      summary: `Saved a ${chosen.length}-item package`,
      total: maths.total,
    });
  }

  const quote = () => {
    const lines = [
      "Hi Nexmod, I have put together a package:",
      "",
      ...chosen.map((p) => `• ${p.name} — ${lkr(p.price)}`),
      "",
      `Parts: ${lkr(maths.parts)}`,
      withFitting && maths.fitting > 0 ? `Fitting: ${lkr(maths.fitting)}` : null,
      maths.bundleSaving > 0
        ? `Bundle discount (${maths.bundlePct}%): −${lkr(maths.bundleSaving)}`
        : null,
      maths.memberSaving > 0 ? `Care member discount: −${lkr(maths.memberSaving)}` : null,
      `Total: ${lkr(maths.total)}`,
      "",
      activeVehicle
        ? `Vehicle: ${[activeVehicle.year, activeVehicle.model].filter(Boolean).join(" ")}`
        : null,
      "Can you confirm this and a fitting slot?",
    ].filter(Boolean);
    return waLink(lines.join("\n"));
  };

  return (
    <div className="grid lg:grid-cols-[1fr_22rem] gap-8 lg:gap-10 items-start">
      {/* ------------------------------------------------------- the picker */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-6">
          <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
            Everything
          </FilterChip>
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              active={category === c.slug}
              onClick={() => setCategory(c.slug)}
            >
              {c.name}
            </FilterChip>
          ))}
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {visible.map((product) => {
            const on = picked.includes(product.slug);
            return (
              <li key={product.slug}>
                <button
                  type="button"
                  onClick={() => toggle(product.slug)}
                  aria-pressed={on}
                  className={`w-full text-left surface p-4 flex items-start gap-3 transition-colors ${
                    on ? "ring-2 ring-[var(--accent)]" : "hover:border-[var(--border-strong)]"
                  }`}
                >
                  <span
                    className={`shrink-0 grid place-items-center w-5 h-5 rounded-md border mt-0.5 transition-colors ${
                      on
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                        : "border-[var(--border-strong)] text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <IconCheck width={12} height={12} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-[13.5px] leading-snug">
                      {product.name}
                    </span>
                    <span className="flex items-center gap-2 mt-1.5">
                      <span className="text-[13px] tabular-nums font-semibold">
                        {lkr(product.price)}
                      </span>
                      {product.installation?.available && (
                        <span className="badge">
                          <IconTool width={10} height={10} />
                          Fitting
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* -------------------------------------------------------- the total */}
      <aside className="surface p-6 lg:sticky lg:top-24">
        <p className="eyebrow mb-4">Your package</p>

        {chosen.length === 0 ? (
          <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
            Pick two or more items and a bundle discount appears. Everything fitted in one visit
            saves us a bay changeover, which is where the discount comes from.
          </p>
        ) : (
          <>
            <ul className="space-y-2 mb-5 max-h-64 overflow-y-auto">
              {chosen.map((p) => (
                <li key={p.slug} className="flex items-start justify-between gap-3 text-[13px]">
                  <span className="min-w-0 leading-snug">{p.name}</span>
                  <span className="tabular-nums shrink-0 text-[var(--fg-muted)]">
                    {lkr(p.price)}
                  </span>
                </li>
              ))}
            </ul>

            <label className="flex items-center gap-2.5 mb-5 text-[13.5px] cursor-pointer">
              <input
                type="checkbox"
                checked={withFitting}
                onChange={(e) => setWithFitting(e.target.checked)}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              Fit everything at the workshop
            </label>

            <dl className="space-y-2 text-[13.5px] pt-4 border-t border-[var(--border)]">
              <div className="flex justify-between">
                <dt className="text-[var(--fg-muted)]">Parts</dt>
                <dd className="tabular-nums">{lkr(maths.parts)}</dd>
              </div>
              {maths.fitting > 0 && (
                <div className="flex justify-between">
                  <dt className="text-[var(--fg-muted)]">Fitting</dt>
                  <dd className="tabular-nums">{lkr(maths.fitting)}</dd>
                </div>
              )}
              {maths.bundleSaving > 0 && (
                <div className="flex justify-between text-[var(--accent)]">
                  <dt className="font-medium">
                    Bundle ({maths.bundlePct}%)
                  </dt>
                  <dd className="tabular-nums font-medium">−{lkr(maths.bundleSaving)}</dd>
                </div>
              )}
              {maths.memberSaving > 0 && (
                <div className="flex justify-between text-[var(--accent)]">
                  <dt className="font-medium">Care member</dt>
                  <dd className="tabular-nums font-medium">−{lkr(maths.memberSaving)}</dd>
                </div>
              )}
              <div className="flex justify-between pt-3 mt-1 border-t border-[var(--border)] text-base font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{lkr(maths.total)}</dd>
              </div>
            </dl>

            {next && (
              <p className="text-[12.5px] text-[var(--fg-subtle)] mt-3 leading-relaxed">
                {withFitting
                  ? `Add ${next.items - maths.fittedCount} more fitted ${
                      next.items - maths.fittedCount === 1 ? "item" : "items"
                    } to reach ${Math.round(next.rate * 100)}% off.`
                  : "Turn on workshop fitting to unlock the bundle discount."}
              </p>
            )}

            {maths.memberSaving === 0 && maths.parts > 0 && (
              <p className="text-[12.5px] text-[var(--fg-subtle)] mt-3 leading-relaxed">
                A Care plan would take a further 5–15% off this.
              </p>
            )}

            <div className="space-y-2 mt-6">
              <button type="button" onClick={addAll} className="btn btn-primary w-full">
                <IconPlus width={16} height={16} />
                Add all to cart
              </button>
              <a
                href={quote()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full"
              >
                <IconWhatsApp width={16} height={16} />
                Send as a quote
              </a>
              <button type="button" onClick={save} className="btn btn-ghost w-full">
                <IconStar width={15} height={15} />
                Save to my builds
              </button>
            </div>
          </>
        )}

        {/* The ladder, always visible so the mechanism is never a surprise. */}
        <ul className="mt-6 pt-5 border-t border-[var(--border)] space-y-1.5">
          {BUNDLE_LADDER.map((tier) => {
            const reached = maths.fittedCount >= tier.items;
            return (
              <li
                key={tier.items}
                className={`flex items-center justify-between text-[12.5px] ${
                  reached ? "text-[var(--fg)] font-medium" : "text-[var(--fg-subtle)]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {reached && (
                    <IconCheck
                      width={11}
                      height={11}
                      className="text-[var(--accent)]"
                      aria-hidden="true"
                    />
                  )}
                  {tier.label}
                </span>
                <span className="tabular-nums">{Math.round(tier.rate * 100)}%</span>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-8 px-3 rounded-lg text-[12.5px] font-medium border transition-colors ${
        active
          ? "bg-[var(--fg)] text-[var(--bg)] border-[var(--fg)]"
          : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]"
      }`}
    >
      {children}
    </button>
  );
}
