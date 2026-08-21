"use client";

import { useMemo, useState } from "react";
import { categories } from "@/data/categories";
import { allFitments, products } from "@/data/products";
import { lkr, site, waLink } from "@/data/site";
import { useCart } from "@/lib/cart";
import {
  CategoryIcon,
  IconArrowRight,
  IconCart,
  IconCheck,
  IconTool,
  IconWhatsApp,
} from "@/components/Icons";
import { PhotoStudio } from "./PhotoStudio";

/**
 * Build Studio.
 *
 * Three panels rather than a wizard, because a wizard hides the total until the
 * end and the total is the thing people actually want to see moving. Pick a
 * vehicle, pick modifications, watch the spec sheet and the price build up.
 *
 * Everything is client-side, so it works identically on the static export.
 */

interface Selection {
  slug: string;
  variantId?: string;
  withInstallation: boolean;
}

export function BuildStudio() {
  const { add, setOpen } = useCart();

  const [vehicle, setVehicle] = useState("");
  const [customVehicle, setCustomVehicle] = useState("");
  const [colour, setColour] = useState("");
  const [selected, setSelected] = useState<Selection[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>("body-kits");
  const [hasPhoto, setHasPhoto] = useState(false);

  const fitments = useMemo(() => allFitments(), []);
  const vehicleLabel = vehicle === "other" ? customVehicle : vehicle;

  /** Products that fit the chosen vehicle, or everything if none is chosen. */
  const available = useMemo(() => {
    if (!vehicle || vehicle === "other") return products;
    return products.filter((p) =>
      (p.fitment ?? []).some((f) => f === vehicle || f === "Universal"),
    );
  }, [vehicle]);

  const lines = useMemo(
    () =>
      selected
        .map((sel) => {
          const product = products.find((p) => p.slug === sel.slug);
          if (!product) return null;
          const variant = product.variants?.find((v) => v.id === sel.variantId);
          const unit = variant?.price ?? product.price;
          const fee = sel.withInstallation ? (product.installation?.fee ?? 0) : 0;
          return { product, variant, unit, fee, total: unit + fee, sel };
        })
        .filter((l): l is NonNullable<typeof l> => Boolean(l)),
    [selected],
  );

  const total = lines.reduce((sum, l) => sum + l.total, 0);

  function isSelected(slug: string) {
    return selected.some((s) => s.slug === slug);
  }

  function toggle(slug: string) {
    const product = products.find((p) => p.slug === slug);
    if (!product) return;

    setSelected((prev) =>
      prev.some((s) => s.slug === slug)
        ? prev.filter((s) => s.slug !== slug)
        : [
            ...prev,
            {
              slug,
              variantId: product.variants?.[0]?.id,
              withInstallation: Boolean(product.installation?.available),
            },
          ],
    );
  }

  function setVariant(slug: string, variantId: string) {
    setSelected((prev) => prev.map((s) => (s.slug === slug ? { ...s, variantId } : s)));
  }

  function toggleInstall(slug: string) {
    setSelected((prev) =>
      prev.map((s) => (s.slug === slug ? { ...s, withInstallation: !s.withInstallation } : s)),
    );
  }

  /** Hand the whole build to the cart in one go. */
  function addAllToCart() {
    for (const line of lines) {
      add({
        slug: line.product.slug,
        name: line.product.name,
        variantId: line.variant?.id,
        variantLabel: line.variant?.label,
        unitPrice: line.unit,
        qty: 1,
        withInstallation: line.sel.withInstallation,
        installationFee: line.product.installation?.fee ?? 0,
        category: line.product.category,
      });
    }
    setOpen(true);
  }

  const whatsappBuild = useMemo(() => {
    const parts = [
      "Hi Nexmod, here is the build I put together on your site:",
      "",
      vehicleLabel ? `Vehicle: ${vehicleLabel}` : null,
      colour ? `Colour: ${colour}` : null,
      "",
      ...lines.map((l) => {
        const variant = l.variant ? ` (${l.variant.label})` : "";
        const install = l.sel.withInstallation ? " + fitting" : "";
        return `• ${l.product.name}${variant}${install} — ${lkr(l.total)}`;
      }),
      "",
      `Estimated total: ${lkr(total)}`,
      "",
      hasPhoto
        ? "I have a photo of the car — sending it next."
        : "Could you confirm this suits my car?",
    ].filter((line) => line !== null);

    return waLink(parts.join("\n"));
  }, [lines, total, vehicleLabel, colour, hasPhoto]);

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
      <div className="min-w-0 space-y-10">
        {/* ------------------------------------------------ 1. your car */}
        <section>
          <StepHead n="01" title="Your car" note="Optional, but it filters everything below." />

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="bs-vehicle" className="label">
                Model
              </label>
              <select
                id="bs-vehicle"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="field"
              >
                <option value="">All vehicles</option>
                {fitments.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
                <option value="other">Something else…</option>
              </select>
            </div>

            <div>
              <label htmlFor="bs-colour" className="label">
                Colour <span className="text-[var(--fg-subtle)] font-normal">(optional)</span>
              </label>
              <input
                id="bs-colour"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                placeholder="e.g. Pearl White, 070"
                className="field"
              />
            </div>
          </div>

          {vehicle === "other" && (
            <div className="mb-6">
              <label htmlFor="bs-custom" className="label">
                Tell us the model
              </label>
              <input
                id="bs-custom"
                value={customVehicle}
                onChange={(e) => setCustomVehicle(e.target.value)}
                placeholder="e.g. Honda Vezel Z 2016"
                className="field"
              />
            </div>
          )}

          <PhotoStudio onPhotoChange={setHasPhoto} />
        </section>

        {/* --------------------------------------------- 2. the build */}
        <section>
          <StepHead
            n="02"
            title="Choose your build"
            note={
              vehicle && vehicle !== "other"
                ? `Showing ${available.length} products that fit a ${vehicle}.`
                : `Showing all ${available.length} products. Pick a model above to filter.`
            }
          />

          <div className="space-y-3">
            {categories.map((category) => {
              const items = available.filter((p) => p.category === category.slug);
              if (items.length === 0) return null;

              const chosen = items.filter((p) => isSelected(p.slug)).length;
              const isOpen = openCategory === category.slug;

              return (
                <div key={category.slug} className="surface overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenCategory(isOpen ? null : category.slug)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center gap-3.5 p-4 text-left hover:bg-[var(--bg-inset)] transition-colors"
                  >
                    <span
                      className={`shrink-0 grid place-items-center w-10 h-10 rounded-lg transition-colors ${
                        chosen > 0
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--bg-inset)] text-[var(--accent)]"
                      }`}
                    >
                      <CategoryIcon name={category.icon} width={18} height={18} />
                    </span>

                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-[15px]">{category.name}</span>
                      <span className="block text-[12.5px] text-[var(--fg-subtle)] truncate">
                        {items.length} available
                        {chosen > 0 && ` · ${chosen} selected`}
                      </span>
                    </span>

                    <IconArrowRight
                      width={16}
                      height={16}
                      className={`shrink-0 text-[var(--fg-subtle)] transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[var(--border)] p-4 space-y-2.5">
                      {items.map((product) => {
                        const sel = selected.find((s) => s.slug === product.slug);
                        const active = Boolean(sel);
                        const variant = product.variants?.find((v) => v.id === sel?.variantId);
                        const unit = variant?.price ?? product.price;

                        return (
                          <div
                            key={product.slug}
                            className={`rounded-lg border transition-colors ${
                              active
                                ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                                : "border-[var(--border)]"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggle(product.slug)}
                              className="w-full flex items-start gap-3 p-3.5 text-left"
                            >
                              <span
                                className={`shrink-0 grid place-items-center w-5 h-5 mt-0.5 rounded border transition-colors ${
                                  active
                                    ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                                    : "border-[var(--border-strong)]"
                                }`}
                              >
                                {active && <IconCheck width={12} height={12} strokeWidth={3} />}
                              </span>

                              <span className="flex-1 min-w-0">
                                <span className="block font-medium text-[14px] leading-snug">
                                  {product.name}
                                </span>
                                <span className="block text-[12.5px] text-[var(--fg-muted)] leading-snug mt-0.5 line-clamp-1">
                                  {product.tagline}
                                </span>
                              </span>

                              <span className="shrink-0 figure text-[14px] font-semibold">
                                {lkr(unit)}
                              </span>
                            </button>

                            {active && (
                              <div className="px-3.5 pb-3.5 pt-0 space-y-2.5 border-t border-[var(--border)] mt-0.5">
                                {product.variants && product.variants.length > 1 && (
                                  <div className="pt-3">
                                    <span className="block text-[11px] uppercase tracking-wider text-[var(--fg-subtle)] mb-2">
                                      Option
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {product.variants.map((v) => (
                                        <button
                                          key={v.id}
                                          type="button"
                                          onClick={() => setVariant(product.slug, v.id)}
                                          className={`btn btn-sm ${
                                            sel?.variantId === v.id ? "btn-primary" : "btn-outline"
                                          }`}
                                        >
                                          {v.label}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {product.installation?.available && (
                                  <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                                    <span
                                      className={`shrink-0 grid place-items-center w-4 h-4 rounded border transition-colors ${
                                        sel?.withInstallation
                                          ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                                          : "border-[var(--border-strong)]"
                                      }`}
                                    >
                                      {sel?.withInstallation && (
                                        <IconCheck width={10} height={10} strokeWidth={3} />
                                      )}
                                    </span>
                                    <input
                                      type="checkbox"
                                      checked={Boolean(sel?.withInstallation)}
                                      onChange={() => toggleInstall(product.slug)}
                                      className="sr-only"
                                    />
                                    <span className="text-[12.5px] text-[var(--fg-muted)]">
                                      Fit at the workshop
                                      {(product.installation.fee ?? 0) > 0
                                        ? ` +${lkr(product.installation.fee ?? 0)}`
                                        : " — included"}
                                      {product.installation.duration &&
                                        ` · ${product.installation.duration}`}
                                    </span>
                                  </label>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* --------------------------------------------- spec sheet rail */}
      <aside className="lg:sticky lg:top-24">
        <div className="surface overflow-hidden">
          <div className="p-5 border-b border-[var(--border)]">
            <p className="eyebrow mb-2.5">Your build</p>
            <h2 className="text-xl">
              {vehicleLabel || "Spec sheet"}
              {colour && (
                <span className="block text-[13px] font-normal text-[var(--fg-subtle)] mt-1">
                  {colour}
                </span>
              )}
            </h2>
          </div>

          {lines.length === 0 ? (
            <div className="p-8 text-center">
              <span className="grid place-items-center w-12 h-12 mx-auto rounded-full bg-[var(--bg-inset)] text-[var(--fg-subtle)] mb-4">
                <IconTool width={22} height={22} />
              </span>
              <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed">
                Nothing selected yet. Pick modifications and they will appear here with a running
                total.
              </p>
            </div>
          ) : (
            <>
              <ul className="p-5 space-y-3 max-h-[22rem] overflow-y-auto">
                {lines.map((l) => (
                  <li key={l.product.slug} className="flex justify-between gap-3 text-[13.5px]">
                    <span className="min-w-0">
                      <span className="block font-medium leading-snug">{l.product.name}</span>
                      <span className="block text-[11.5px] text-[var(--fg-subtle)] mt-0.5">
                        {l.variant?.label}
                        {l.variant && l.sel.withInstallation && " · "}
                        {l.sel.withInstallation && "fitted"}
                      </span>
                    </span>
                    <span className="shrink-0 figure font-semibold">{lkr(l.total)}</span>
                  </li>
                ))}
              </ul>

              <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-[family-name:var(--font-display)] font-bold">
                    Estimated total
                  </span>
                  <span className="figure text-xl font-bold">{lkr(total)}</span>
                </div>
                <p className="text-[11.5px] text-[var(--fg-subtle)] leading-relaxed">
                  {lines.length} {lines.length === 1 ? "item" : "items"} · indicative, confirmed on
                  quote
                </p>
              </div>

              <div className="p-5 space-y-2">
                <a
                  href={whatsappBuild}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp w-full"
                >
                  <IconWhatsApp width={17} height={17} />
                  Send this build to us
                </a>
                <button type="button" onClick={addAllToCart} className="btn btn-outline w-full">
                  <IconCart width={16} height={16} />
                  Add all to cart
                </button>
                <button
                  type="button"
                  onClick={() => setSelected([])}
                  className="btn btn-ghost btn-sm w-full"
                >
                  Clear build
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-[12px] text-[var(--fg-subtle)] leading-relaxed mt-4">
          Prices are indicative. Some jobs are quoted per vehicle once we have seen it — we will
          confirm everything before any work starts. Call {site.contact.phoneDisplay} if you would
          rather talk it through.
        </p>
      </aside>
    </div>
  );
}

function StepHead({ n, title, note }: { n: string; title: string; note: string }) {
  return (
    <header className="mb-6">
      <span className="step-marker block mb-3">{n}</span>
      <h2 className="text-2xl md:text-3xl mb-2">{title}</h2>
      <p className="text-[var(--fg-muted)] leading-relaxed">{note}</p>
    </header>
  );
}
