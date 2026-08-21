import { applyCareOverrides } from "./overrides";
import type { Money } from "./types";

/**
 * Nexmod Care — the membership plans.
 *
 * PRICING AND TERMS ARE PLACEHOLDER DATA, like everything else priced on this
 * site. The *shape* is what matters here: a fitting shop earns most of its
 * repeat revenue from the visits after the sale — the re-bond check, the wash
 * before a wedding, the coating top-up before the monsoon — and those visits
 * are invisible to a customer who only ever sees a product page.
 *
 * A plan makes them visible, and it turns a one-off lip fitting into a
 * relationship. Confirm every rupee and every allowance with the owner before
 * launch; the allowances in particular need checking against how much bay time
 * the workshop can actually afford to give away.
 *
 * DELIBERATELY NOT INCLUDED: any payment handling. Signing up opens WhatsApp
 * with the plan details filled in. Nexmod takes payment the way it already
 * takes payment, and no card details ever touch this site.
 */

export type CareTierId = "essential" | "plus" | "signature";

export interface CareBenefit {
  /** Stable key so a tier can reference it. */
  id: string;
  label: string;
  /** What this actually gets you, in plain words. */
  detail: string;
  /**
   * Per-tier value. A number is an annual allowance, `true` is unlimited or
   * simply included, `false` is not in this tier.
   */
  tiers: Record<CareTierId, number | boolean>;
  /**
   * What one instance is worth at the counter, used by the savings maths.
   * Omitted for benefits with no a-la-carte equivalent — priority booking is
   * real, but it is not a line item.
   */
  unitValue?: Money;
  /** How the allowance is counted, for the "4 per year" style label. */
  unit?: string;
}

export interface CareTier {
  id: CareTierId;
  name: string;
  tagline: string;
  /** Who should genuinely pick this one. Written to help people rule it out. */
  bestFor: string;
  monthly: Money;
  /** Twelve months paid up front, priced as ten. */
  annual: Money;
  /** Percentage off parts and fitting for members, e.g. 10 = 10%. */
  discountPct: number;
  /** Extra months added to the warranty on anything fitted while a member. */
  warrantyBonusMonths: number;
  featured?: boolean;
  /** The honest caveat. Every tier has one. */
  notIncluded: string;
}

const tiers: CareTier[] = [
  {
    id: "essential",
    name: "Care Essential",
    tagline: "Keep what is already fitted working, and pay less for what comes next.",
    bestFor:
      "One or two things fitted and a car that lives outdoors. If you only ever come back for a wash and the odd check, this is the tier that pays for itself.",
    monthly: 2500,
    annual: 25_000,
    discountPct: 5,
    warrantyBonusMonths: 6,
    notIncluded:
      "No interior detailing and no pickup. You bring the car to Dehiwala and wait, or leave it with us for the day.",
  },
  {
    id: "plus",
    name: "Care Plus",
    tagline: "The plan for a car that is still being built.",
    bestFor:
      "Someone part-way through a build who will be back three or four times this year. The member discount alone usually covers the fee while you are still buying.",
    monthly: 4500,
    annual: 45_000,
    discountPct: 10,
    warrantyBonusMonths: 12,
    featured: true,
    notIncluded:
      "Pickup is Zone A only. Outside Dehiwala, Mount Lavinia and Colombo 3 to 6 you still bring the car in yourself.",
  },
  {
    id: "signature",
    name: "Care Signature",
    tagline: "The car is finished. This is how it stays that way.",
    bestFor:
      "A finished build you care about — coated paint, fitted kit, no appetite for it looking tired. Also the only tier that makes sense for a weekend car.",
    monthly: 9500,
    annual: 95_000,
    discountPct: 15,
    warrantyBonusMonths: 24,
    notIncluded:
      "Not a body shop. Accident damage, respray and panel work sit outside every tier, Signature included.",
  },
];

/** Fees and percentages are overridable from the local admin panel. */
export const careTiers: CareTier[] = applyCareOverrides(tiers);

export const careBenefits: CareBenefit[] = [
  {
    id: "discount",
    label: "Member price on parts and fitting",
    detail:
      "Applied to everything in the catalogue and to workshop labour, every time, with no minimum spend and no expiry date.",
    tiers: { essential: true, plus: true, signature: true },
  },
  {
    id: "wash",
    label: "Exterior wash and hand dry",
    detail:
      "A two-bucket wash, not a forecourt rinse. Booked ahead so the bay is free when you arrive.",
    unit: "per year",
    unitValue: 3500,
    tiers: { essential: 4, plus: 12, signature: 24 },
  },
  {
    id: "rebond",
    label: "Re-bond and re-torque check",
    detail:
      "Lips, skirts, spoilers and mouldings checked and re-seated. This is the visit that stops a lip you paid for ending up on Galle Road.",
    unit: "per year",
    unitValue: 4500,
    tiers: { essential: 2, plus: 4, signature: true },
  },
  {
    id: "interior",
    label: "Interior detail",
    detail:
      "Vacuum through, plastics dressed, glass cleaned inside, mats lifted and washed. Half a day with the car.",
    unit: "per year",
    unitValue: 12_000,
    tiers: { essential: false, plus: 1, signature: 3 },
  },
  {
    id: "coating",
    label: "Glass coating top-up",
    detail:
      "Hydrophobic windscreen coating stripped back and reapplied. Worth timing for the fortnight before the monsoon.",
    unit: "per year",
    unitValue: 7500,
    tiers: { essential: false, plus: 1, signature: 2 },
  },
  {
    id: "health",
    label: "Annual accessory health check",
    detail:
      "Everything we have fitted, inspected and written up: adhesion, fasteners, wiring loads, tint edges, coating condition.",
    unit: "per year",
    unitValue: 6500,
    tiers: { essential: 1, plus: 1, signature: 2 },
  },
  {
    id: "priority",
    label: "Priority booking",
    detail:
      "Member slots are held back each week. In practice this is the difference between this Saturday and the one after.",
    tiers: { essential: false, plus: true, signature: true },
  },
  {
    id: "pickup",
    label: "Pickup and drop-off",
    detail: "We collect the car and bring it back. Zone A on Plus, Zones A and B on Signature.",
    unit: "per year",
    unitValue: 4000,
    tiers: { essential: false, plus: 4, signature: 12 },
  },
  {
    id: "warranty",
    label: "Extended warranty on fitted work",
    detail:
      "Added to the manufacturer term on anything fitted while the plan is active, and it stays with the car for as long as the plan runs.",
    tiers: { essential: true, plus: true, signature: true },
  },
  {
    id: "line",
    label: "Direct WhatsApp line",
    detail:
      "A number that reaches the workshop rather than the general enquiries queue. Photograph the problem, get an answer.",
    tiers: { essential: false, plus: true, signature: true },
  },
];

/**
 * What a tier is worth at counter prices over a year.
 *
 * Unlimited benefits are counted at a deliberately conservative figure rather
 * than infinity. Six re-bond checks a year is already more than anyone
 * sensibly uses, and quoting an unbounded saving would be a lie.
 */
const UNLIMITED_ASSUMPTION = 6;

export function annualBenefitValue(tier: CareTierId): Money {
  return careBenefits.reduce((total, benefit) => {
    if (!benefit.unitValue) return total;
    const allowance = benefit.tiers[tier];
    if (allowance === false) return total;
    const count = allowance === true ? UNLIMITED_ASSUMPTION : Number(allowance);
    return total + benefit.unitValue * count;
  }, 0);
}

/** Benefits a tier actually includes, for the "what you get" list. */
export function benefitsFor(tier: CareTierId): CareBenefit[] {
  return careBenefits.filter((b) => b.tiers[tier] !== false);
}

/** "4 per year", "Unlimited", "—" — the cell text in the comparison table. */
export function allowanceLabel(benefit: CareBenefit, tier: CareTierId): string {
  const value = benefit.tiers[tier];
  if (value === false) return "—";
  if (value === true) return benefit.unit ? "Unlimited" : "Included";
  return benefit.unit ? `${value} ${benefit.unit}` : String(value);
}

export function tierById(id: string): CareTier | undefined {
  return careTiers.find((t) => t.id === id);
}
