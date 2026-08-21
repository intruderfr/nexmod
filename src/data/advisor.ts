/**
 * Budget advisor rules.
 *
 * The single most common question at the counter is "I have this much — what
 * should I do first?" This encodes the answers the workshop actually gives,
 * including the ones that lose a sale: telling someone to deaden a door before
 * buying speakers, or to spend nothing at all on a problem a wash would fix.
 *
 * Recommendations are ordered by `priority`, not by price. A cheap fix that
 * solves the stated problem outranks an expensive one that half-solves it.
 */

export interface Concern {
  id: string;
  label: string;
  /** How the customer would actually phrase it. */
  detail: string;
  icon: string;
}

export const concerns: Concern[] = [
  {
    id: "hot",
    label: "It gets unbearably hot",
    detail: "Parked in the sun, the cabin and dashboard are painful to touch.",
    icon: "tint",
  },
  {
    id: "noisy",
    label: "It's noisy on the road",
    detail: "Road and rain noise make long drives tiring.",
    icon: "deaden",
  },
  {
    id: "dark",
    label: "I can't see well at night",
    detail: "Headlights are dim or yellow, and rain makes it worse.",
    icon: "light",
  },
  {
    id: "sound",
    label: "The stereo sounds thin",
    detail: "No weight to the music, however loud I turn it up.",
    icon: "audio",
  },
  {
    id: "dated",
    label: "It looks dated outside",
    detail: "The car is fine but it reads as old next to newer ones.",
    icon: "lip",
  },
  {
    id: "interior",
    label: "The interior feels worn",
    detail: "Shiny steering wheel, tired seats, scuffed trim.",
    icon: "interior",
  },
  {
    id: "parking",
    label: "Parking is stressful",
    detail: "Tight spaces, poor visibility, kerbed wheels.",
    icon: "camera",
  },
  {
    id: "protect",
    label: "I want to protect it",
    detail: "New or newly bought, and I want to keep it that way.",
    icon: "detail",
  },
];

export interface Recommendation {
  /** Product slug this maps to. */
  slug: string;
  /** Lower runs first. Encodes the order we would actually do the work. */
  priority: number;
  /** Why this, for this concern, in the workshop's own words. */
  because: string;
}

/**
 * Concern → ordered recommendations.
 *
 * Where a concern has a cheaper prerequisite, the prerequisite has the lower
 * priority number so it is always recommended first even when the budget would
 * stretch to the expensive item alone.
 */
export const advice: Record<string, Recommendation[]> = {
  hot: [
    {
      slug: "hydrophobic-glass-coating",
      priority: 2,
      because: "Cheap, and it improves wet-weather visibility at the same time.",
    },
    {
      slug: "seven-d-floor-mats",
      priority: 5,
      because: "Protects the floor while the cabin is being worked on anyway.",
    },
  ],
  noisy: [
    {
      slug: "sound-deadening-doors",
      priority: 1,
      because:
        "The single highest-value spend on this list. Cuts road and rain noise by a measurable 3–5 dB(A), and it improves the speakers you already have.",
    },
    {
      slug: "frameless-wiper-pair",
      priority: 6,
      because: "Judder and squeal are noise too, and this is the cheapest fix on the site.",
    },
  ],
  dark: [
    {
      slug: "led-fog-lamp-upgrade",
      priority: 2,
      because:
        "Selective yellow at 3000K scatters least in rain. If you only do one lighting job for actual driving, do this one.",
    },
    {
      slug: "bi-led-projector-conversion",
      priority: 3,
      because:
        "The only upgrade that genuinely puts more light on the road. LED bulbs in a halogen reflector make it worse, not better.",
    },
    {
      slug: "hydrophobic-glass-coating",
      priority: 1,
      because:
        "Rain clears itself above 60 km/h. Cheaper than any lamp and it fixes the weather half of the problem.",
    },
  ],
  sound: [
    {
      slug: "sound-deadening-doors",
      priority: 1,
      because:
        "Do this before buying any speaker. An untreated door cancels its own midbass, so a better driver into the same door changes very little.",
    },
    {
      slug: "component-speaker-set-6-5",
      priority: 3,
      because: "Tweeters at ear height lift the soundstage out of the footwell.",
    },
    {
      slug: "android-head-unit-9-inch",
      priority: 4,
      because: "Cleaner outputs and real tuning control, plus CarPlay while you are at it.",
    },
    {
      slug: "underseat-subwoofer-active",
      priority: 6,
      because: "Only after the above. A sub cannot replace missing midbass — different frequencies.",
    },
  ],
  dated: [
    {
      slug: "ez-lip-pro-universal-front-lip",
      priority: 2,
      because: "Biggest visual change per rupee, fitted in 90 minutes, fully reversible.",
    },
    {
      slug: "carbon-fibre-mirror-caps",
      priority: 1,
      because: "The cheapest change on the site, and it is permanently in your peripheral vision.",
    },
    {
      slug: "tyredeckz-tyre-stickers-set",
      priority: 4,
      because: "Finishes the wheels. It is the detail that makes a car read as considered.",
    },
    {
      slug: "ducktail-spoiler-abs",
      priority: 5,
      because: "Lifts the boot line without the boy-racer read of a full wing.",
    },
    {
      slug: "three-piece-lip-kit",
      priority: 7,
      because: "If the budget allows it, a designed set beats three lips bought separately.",
    },
  ],
  interior: [
    {
      slug: "steering-wheel-wrap",
      priority: 1,
      because:
        "You are physically holding it every second you drive. Best rupees on this list for how the car feels.",
    },
    {
      slug: "seven-d-floor-mats",
      priority: 2,
      because: "Model-cut, raised edges, and they cannot slide under the pedals.",
    },
    {
      slug: "custom-seat-covers",
      priority: 3,
      because: "Airbag-safe tear seams, and the original upholstery stays new underneath.",
    },
    {
      slug: "ambient-lighting-kit",
      priority: 5,
      because: "Makes an older cabin feel current at night. Fibre-optic, so you never see the source.",
    },
    {
      slug: "carbon-fibre-interior-console-set",
      priority: 6,
      because: "No UV inside the car, so interior wrap effectively lasts forever.",
    },
  ],
  parking: [
    {
      slug: "reverse-camera-hd",
      priority: 1,
      because: "Cheapest fix for the actual problem. Start here before considering 360.",
    },
    {
      slug: "parking-sensor-kit",
      priority: 2,
      because: "Audible distance warning, no screen needed, sprayed to your colour code.",
    },
    {
      slug: "camera-360-3d-system",
      priority: 4,
      because:
        "Worth it on an SUV or in basement car parks. On a small hatchback it is a solution looking for a problem.",
    },
    {
      slug: "dashcam-dual-channel",
      priority: 3,
      because: "Not parking, but the same trip. Parking mode records if you get hit while away.",
    },
  ],
  protect: [
    {
      slug: "seven-d-floor-mats",
      priority: 1,
      because: "Grit ground into new carpet in month one is permanent.",
    },
    {
      slug: "custom-seat-covers",
      priority: 2,
      because: "The preserved original upholstery is worth more at sale than the covers cost.",
    },
    {
      slug: "hydrophobic-glass-coating",
      priority: 3,
      because: "Cheap, and a genuine safety upgrade in monsoon rain.",
    },
    {
      slug: "ceramic-spray-sealant",
      priority: 4,
      because: "Ten-minute application, six months of beading. Highest-value bottle on the shelf.",
    },
  ],
};

/**
 * Honest notes shown when the budget is very low, so the tool never implies
 * that spending nothing is not an option.
 */
export const lowBudgetAdvice: Record<string, string> = {
  hot: "Under Rs. 10,000 the honest answer is a sunshade and parking in shade. Window film is the real fix and it starts around Rs. 18,500.",
  noisy:
    "Door deadening is the fix and it starts around Rs. 24,500. Below that, check your door seals and tyre pressures first — both are free.",
  dark: "A glass coating at around Rs. 7,500 fixes the rain half. Do not buy LED bulbs for a halogen reflector at any price; they make night vision worse.",
  sound:
    "Below Rs. 24,500, spend nothing. Deadening is the foundation, and speakers bought before it are money you will want back.",
  dated:
    "Mirror caps at around Rs. 4,500 are the highest return per rupee on the whole site. Start there.",
  interior:
    "A steering wrap at around Rs. 12,500 changes how the car feels more than anything else at that price.",
  parking:
    "A reverse camera at around Rs. 9,500 solves most of it. Sensors and 360 can wait.",
  protect:
    "Mats first. Everything else can follow — but grit in new carpet cannot be undone later.",
};

export const BUDGET_STEPS = [10_000, 25_000, 50_000, 100_000, 200_000, 400_000] as const;
