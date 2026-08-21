import type { ImageKey } from "./images.generated";

/**
 * Curated packages.
 *
 * Most customers do not know what to buy first — they know what bothers them
 * about the car. These bundle the combinations we actually recommend, in the
 * order we recommend them, at a discount for taking the whole thing at once.
 *
 * PRICING IS PLACEHOLDER, like everything else. The `saving` figure is derived
 * at render time from the real component prices, so it can never drift out of
 * sync with the products — but the discount percentage itself is an assumption
 * to confirm with the owner.
 */

export interface Package {
  slug: string;
  name: string;
  tagline: string;
  /** Who this is genuinely for. Written to help people rule it out. */
  bestFor: string;
  /** Product slugs, in the order we would actually fit them. */
  items: string[];
  /** Fraction taken off the summed component price, e.g. 0.1 = 10%. */
  discount: number;
  duration: string;
  image: ImageKey;
  highlights: string[];
  /** Honest note about what this package deliberately leaves out. */
  notIncluded: string;
  featured?: boolean;
  tier: "essential" | "complete" | "full";
}

export const packages: Package[] = [
  {
    slug: "daily-comfort",
    name: "Daily Comfort",
    tagline: "The two things that improve the car every single day.",
    bestFor:
      "A car that lives outdoors in Colombo and gets driven daily. Start here if you are not sure — this is what we recommend first to almost everyone.",
    tier: "essential",
    items: ["seven-d-floor-mats", "sound-deadening-doors", "hydrophobic-glass-coating"],
    discount: 0.08,
    duration: "Half a day",
    image: "cat-interior",
    highlights: [
      "Measurably quieter cabin at highway speed",
      "Rain clears the windscreen itself above 60 km/h",
      "Model-cut mats that cannot slide under the pedals",
    ],
    notIncluded:
      "No styling changes at all. Nothing here is visible from outside the car — that is deliberate.",
    featured: true,
  },
  {
    slug: "first-impression",
    name: "First Impression",
    tagline: "The exterior accents that read as expensive.",
    bestFor:
      "Someone who wants the car to look considered rather than modified. High visual return, all of it reversible.",
    tier: "essential",
    items: [
      "ez-lip-pro-universal-front-lip",
      "carbon-fibre-mirror-caps",
      "tyredeckz-tyre-stickers-set",
    ],
    discount: 0.1,
    duration: "Half a day",
    image: "cat-ez-lip",
    highlights: [
      "Genuine EZ Lip, fitted and clamped while you wait",
      "Mirror caps wrapped off-car for a true wrapped edge",
      "Rubber sidewall lettering that flexes with the tyre",
    ],
    notIncluded:
      "No spoiler and no body kit. If you want the rear changed too, look at Full Exterior.",
    featured: true,
  },
  {
    slug: "night-drive",
    name: "Night Drive",
    tagline: "See properly, and be seen.",
    bestFor:
      "Anyone who drives intercity after dark, or whose headlights have gone yellow and dim with age.",
    tier: "complete",
    items: ["bi-led-projector-conversion", "led-fog-lamp-upgrade", "sequential-drl-strip"],
    discount: 0.1,
    duration: "Full day",
    image: "cat-lighting",
    highlights: [
      "True projector optics with a sharp cut-off, aimed on a board",
      "3000K selective yellow fogs that actually cut through rain",
      "Sequential DRL and indicator sweep",
    ],
    notIncluded:
      "Interior ambient lighting is separate — it is a different job on a different day.",
    featured: true,
  },
  {
    slug: "cabin-refresh",
    name: "Cabin Refresh",
    tagline: "Make a five-year-old interior feel new again.",
    bestFor:
      "Cars being kept longer than planned. The interior is where you actually spend your time, and it ages fastest.",
    tier: "complete",
    items: [
      "custom-seat-covers",
      "carbon-fibre-interior-console-set",
      "ambient-lighting-kit",
      "steering-wheel-wrap",
    ],
    discount: 0.12,
    duration: "Two days",
    image: "cat-interior",
    highlights: [
      "Airbag-safe tear-seam stitching on every seat cover",
      "Console and dash wrapped off-car where the clips allow",
      "Fibre-optic ambient light — visible glow, hidden source",
      "Leather hand-stitched onto the wheel, not a slip-on cover",
    ],
    notIncluded: "Floor mats and boot liner are not in this one — add Daily Comfort for those.",
  },
  {
    slug: "sound-system",
    name: "Sound System",
    tagline: "Built in the right order, for once.",
    bestFor:
      "Anyone who has bought speakers before and been disappointed. This does the door first, which is why it works.",
    tier: "complete",
    items: [
      "sound-deadening-doors",
      "component-speaker-set-6-5",
      "android-head-unit-9-inch",
      "underseat-subwoofer-active",
    ],
    discount: 0.12,
    duration: "Two days",
    image: "cat-audio",
    highlights: [
      "Doors damped and sealed before a single driver is fitted",
      "Tweeters at ear height, not firing at your knee",
      "Plug-and-play CANbus harness — steering controls retained",
      "Under-seat sub, so the boot stays completely usable",
    ],
    notIncluded:
      "No amplifier. The head unit drives this set well; add one later if you want headroom.",
  },
  {
    slug: "full-exterior",
    name: "Full Exterior",
    tagline: "Front to back, fitted and finished as one job.",
    bestFor:
      "A committed build. This changes the car's whole silhouette, and it narrows your buyer pool — worth knowing before you start.",
    tier: "full",
    items: [
      "three-piece-lip-kit",
      "ducktail-spoiler-abs",
      "carbon-fibre-front-bumper-trim",
      "tyredeckz-tyre-stickers-set",
      "sequential-drl-strip",
    ],
    discount: 0.15,
    duration: "Three to four days",
    image: "cat-body-kits",
    highlights: [
      "Kit dry-fitted complete and gapped before any paint",
      "Painted as a set, so colour matches across every piece",
      "Original parts boxed and returned for resale",
      "Carbon accents and lettering to finish it",
    ],
    notIncluded:
      "No wide-body arches and no wheels. Both change the wheel and geometry spec — we quote those per car.",
    featured: true,
  },
  {
    slug: "new-car-protection",
    name: "New Car Protection",
    tagline: "Everything is cheaper before the damage happens.",
    bestFor:
      "A car you have just taken delivery of. Protection costs least and works best when there is nothing to correct first.",
    tier: "complete",
    items: [
      "seven-d-floor-mats",
      "custom-seat-covers",
      "hydrophobic-glass-coating",
      "ceramic-spray-sealant",
    ],
    discount: 0.1,
    duration: "One day",
    image: "svc-detailing",
    highlights: [
      "Original carpet and upholstery stay new underneath",
      "Glass clay-barred and cerium-polished before coating",
      "No paint correction — a new car does not need clear coat removed",
    ],
    notIncluded:
      "Window film is quoted separately because the right VLT depends on how you use the car.",
  },
];

export const packageBySlug = new Map(packages.map((p) => [p.slug, p]));

export function getPackage(slug: string): Package | undefined {
  return packageBySlug.get(slug);
}

export const packageTiers: { id: Package["tier"]; label: string; blurb: string }[] = [
  { id: "essential", label: "Start here", blurb: "High return, half a day, all reversible." },
  { id: "complete", label: "Go further", blurb: "A whole area of the car, done properly." },
  { id: "full", label: "Commit", blurb: "The big builds. Booked in advance." },
];
