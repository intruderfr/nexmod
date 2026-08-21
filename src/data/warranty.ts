import type { Money } from "./types";

/**
 * Warranty cover.
 *
 * Every product already carries a `warranty` string written for humans
 * ("12 months against manufacturing defect and delamination"). That is the
 * right thing to show on a product page and the wrong thing to compute with,
 * so this file adds the machine-readable half: how many months a category
 * carries, what an extension costs, and what is genuinely covered.
 *
 * TERMS AND PRICES ARE PLACEHOLDER DATA. The cover periods below are ordinary
 * for this trade, but they are assumptions until the owner confirms them, and
 * the exclusions in particular need a read-through by someone who has actually
 * argued a claim at the counter.
 *
 * The registration side of this is deliberately local-only. A warranty record
 * lives in the visitor's own browser and is sent to Nexmod over WhatsApp when
 * they choose to send it. There is no account, no server and nothing to leak.
 */

/** Base cover by product category, in months. */
export const BASE_COVER_MONTHS: Record<string, number> = {
  "ez-lip": 12,
  "body-kits": 12,
  "spoilers-body": 12,
  "carbon-fibre": 12,
  lighting: 12,
  audio: 12,
  "cameras-safety": 12,
  interior: 6,
  "tyre-stickers": 6,
  essentials: 6,
};

/** Cover for the fitting itself, separate from the part. */
export const WORKMANSHIP_COVER_MONTHS = 6;

export const DEFAULT_COVER_MONTHS = 6;

export interface ExtendedCover {
  id: string;
  label: string;
  addedMonths: number;
  /**
   * Priced as a fraction of the item price rather than a flat fee, because the
   * risk scales with what is being covered.
   */
  rate: number;
  /** Below this the admin costs more than the cover is worth. */
  minimumFee: Money;
  detail: string;
}

export const extendedCover: ExtendedCover[] = [
  {
    id: "plus-12",
    label: "Extend by 12 months",
    addedMonths: 12,
    rate: 0.08,
    minimumFee: 1500,
    detail:
      "Doubles the usual term on most parts. Worth it on anything bonded or wired — those are the failures that show up in year two, not year one.",
  },
  {
    id: "plus-24",
    label: "Extend by 24 months",
    addedMonths: 24,
    rate: 0.14,
    minimumFee: 2500,
    detail:
      "For a car you intend to keep. Also the sensible choice on lighting and audio, where a component either dies early or lasts a decade.",
  },
];

export interface CoverRule {
  covered: boolean;
  label: string;
  detail: string;
}

export const coverage: CoverRule[] = [
  {
    covered: true,
    label: "Manufacturing defect",
    detail:
      "The part was faulty when it left the factory — delamination, a bad weld, a dead LED driver, a speaker with a voice coil rub out of the box.",
  },
  {
    covered: true,
    label: "Adhesion failure",
    detail:
      "Anything we bonded that lets go on its own: lips, skirts, mouldings, mirror caps, tyre stickers. If it lifted without being hit, it is ours.",
  },
  {
    covered: true,
    label: "Fitting and workmanship",
    detail:
      "Wiring, fasteners, alignment and finish on anything fitted at the Dehiwala workshop, for six months regardless of the part term.",
  },
  {
    covered: true,
    label: "Premature finish failure",
    detail:
      "Gloss going chalky, carbon clear-coat yellowing or a coating failing well inside its stated life under normal Sri Lankan sun.",
  },
  {
    covered: false,
    label: "Impact and road damage",
    detail:
      "Kerbs, speed bumps, ramps, potholes and other vehicles. A flexible lip is designed to survive these, but survival is not a guarantee.",
  },
  {
    covered: false,
    label: "Fitting by anyone else",
    detail:
      "If a part we supplied was fitted or refitted elsewhere, the part cover stands and the workmanship cover does not.",
  },
  {
    covered: false,
    label: "Modification after fitting",
    detail:
      "Cutting, drilling, respraying or rewiring anything we installed ends cover on that item.",
  },
  {
    covered: false,
    label: "Ordinary wear",
    detail:
      "Mats wearing thin, stickers fading at the end of their stated life, a lip scuffed from normal use. Wear is not a defect.",
  },
  {
    covered: false,
    label: "Counterfeit parts",
    detail:
      "Genuine EZ Lip is sold in Sri Lanka only through Nexmod. We cannot warrant a part bought elsewhere, and we will tell you honestly if what you have is not genuine.",
  },
];

export const claimSteps = [
  {
    title: "Photograph it where it sits",
    detail:
      "Before removing anything. A wide shot showing the panel and a close shot of the failure answers most of what we would otherwise have to ask.",
  },
  {
    title: "Send it with the registration",
    detail:
      "Open the record below and send it on WhatsApp. It carries the product, the fitting date and the vehicle, so nobody has to search for an invoice.",
  },
  {
    title: "We assess, usually same day",
    detail:
      "Most claims are settled from the photographs. If we need the car in, we will say so and offer a slot rather than asking you to call back.",
  },
  {
    title: "Repair, re-bond or replace",
    detail:
      "Re-bonding is done while you wait. A replacement part is ordered against your record, and there is no charge for the refit on a valid claim.",
  },
];

/** Months of cover for a product, before any extension or plan bonus. */
export function baseCoverMonths(category: string): number {
  return BASE_COVER_MONTHS[category] ?? DEFAULT_COVER_MONTHS;
}

/** What an extension costs on a given item price. */
export function extensionFee(cover: ExtendedCover, itemPrice: Money): Money {
  return Math.max(cover.minimumFee, Math.round((itemPrice * cover.rate) / 100) * 100);
}

export type WarrantyStatus = "active" | "expiring" | "expired";

export interface WarrantyWindow {
  status: WarrantyStatus;
  /** Whole months left, floored at zero. */
  monthsLeft: number;
  daysLeft: number;
  expiresAt: Date;
  totalMonths: number;
}

/**
 * Works out where a registration sits in its term.
 *
 * `now` is a parameter rather than a call to `new Date()` inside so this stays
 * pure and testable, and so a server render and the client that hydrates it
 * cannot disagree about what day it is.
 */
export function warrantyWindow(
  fittedOn: string,
  totalMonths: number,
  now: Date = new Date(),
): WarrantyWindow | null {
  const start = new Date(fittedOn);
  if (Number.isNaN(start.getTime())) return null;

  const expiresAt = new Date(start);
  expiresAt.setMonth(expiresAt.getMonth() + totalMonths);

  const msLeft = expiresAt.getTime() - now.getTime();
  const daysLeft = Math.ceil(msLeft / 86_400_000);
  const monthsLeft = Math.max(0, Math.floor(daysLeft / 30.44));

  const status: WarrantyStatus =
    daysLeft <= 0 ? "expired" : daysLeft <= 60 ? "expiring" : "active";

  return { status, monthsLeft, daysLeft: Math.max(0, daysLeft), expiresAt, totalMonths };
}
