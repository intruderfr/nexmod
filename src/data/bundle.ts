import type { Money } from "./types";

/**
 * The bundle discount ladder.
 *
 * This lives here rather than inside the package builder because the discount
 * is a property of the *order*, not of the screen it was assembled on. Someone
 * who browses the catalogue and adds four things to the cart is booking
 * exactly the same visit as someone who used the builder, and quoting them a
 * different number would be indefensible.
 *
 * It also removes a real bug: the builder used to show a discounted total that
 * the cart then silently dropped, so the price went up between the summary and
 * the checkout.
 *
 * WHY IT SCALES WITH ITEMS RATHER THAN SPEND. The saving to the workshop is a
 * bay changeover and a second appointment, and that is the same whether the
 * item is a set of mats or a body kit. Tying the rate to item count keeps the
 * discount honest — and stops it quietly becoming a volume discount that
 * favours whoever spends most.
 *
 * RATES ARE PLACEHOLDER DATA. Confirm with the owner.
 */

export interface BundleTier {
  /** Minimum distinct items being fitted in one visit. */
  items: number;
  rate: number;
  label: string;
}

export const BUNDLE_LADDER: BundleTier[] = [
  { items: 2, rate: 0.05, label: "Two items, one visit" },
  { items: 3, rate: 0.08, label: "Three items" },
  { items: 4, rate: 0.11, label: "Four items" },
  { items: 5, rate: 0.14, label: "Five or more" },
];

/** The tier reached by fitting `count` distinct items, or null below the first. */
export function bundleTier(count: number): BundleTier | null {
  return [...BUNDLE_LADDER].reverse().find((tier) => count >= tier.items) ?? null;
}

export function bundleRate(count: number): number {
  return bundleTier(count)?.rate ?? 0;
}

/** The next rung up, for the "add one more to reach 11%" nudge. */
export function nextBundleTier(count: number): BundleTier | null {
  return BUNDLE_LADDER.find((tier) => tier.items > count) ?? null;
}

/**
 * Discount on the parts total.
 *
 * Deliberately applied to parts only. Fitting labour is already priced at the
 * bay rate and discounting it twice would mean the workshop pays for the
 * convenience it is being thanked for.
 */
export function bundleSaving(partsTotal: Money, fittedItemCount: number): Money {
  return Math.round(partsTotal * bundleRate(fittedItemCount));
}
