/**
 * Central business configuration for NEXMOD.
 *
 * Facts sourced from Nexmod's public listings (Google Business Profile,
 * Facebook @nexmod.lk, Instagram @nexmod.lk, TikTok @nexmod.lk) as of Aug 2026.
 * Anything marked PLACEHOLDER should be confirmed with the business owner.
 */

export const site = {
  name: "NEXMOD",
  legalName: "Nexmod",
  tagline: "Premium Car Accessories",
  /**
   * Canonical origin, including any base path.
   *
   * The real domain is registered but was not serving a site at time of build.
   * NEXT_PUBLIC_SITE_URL overrides it so the GitHub Pages preview emits its own
   * canonicals and sitemap rather than pointing at a domain that is not live.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://nexmod.lk",
  locale: "en_LK",
  country: "LK",
  currency: "LKR",
  currencySymbol: "Rs.",
  founded: "2020",

  description:
    "Nexmod is Sri Lanka's premium car accessories studio in Dehiwala — carbon fibre wraps, EZ Lip, spoilers, tyre stickers, lighting and car audio, supplied and professionally installed.",

  shortDescription:
    "Premium car accessories, carbon fibre styling and professional installation in Dehiwala, Colombo.",

  contact: {
    phoneDisplay: "075 774 0404",
    phoneIntl: "+94757740404",
    // tel: link
    tel: "+94757740404",
    // wa.me requires no plus sign or spaces
    whatsapp: "94757740404",
    email: "hello@nexmod.lk", // PLACEHOLDER — confirm with owner
  },

  address: {
    street: "71 Sri Saranankara Road",
    locality: "Dehiwala",
    region: "Western Province",
    postalCode: "00600",
    country: "Sri Lanka",
    countryCode: "LK",
    full: "71 Sri Saranankara Road, Dehiwala-Mount Lavinia 00600, Sri Lanka",
    // Approximate coordinates for Sri Saranankara Rd, Dehiwala.
    // PLACEHOLDER — replace with exact pin from the Google Business Profile.
    latitude: 6.8511,
    longitude: 79.8656,
    mapsUrl: "https://maps.google.com/?q=Nexmod+71+Sri+Saranankara+Road+Dehiwala",
  },

  /**
   * Opening hours as listed publicly. Friday is not listed as open.
   * Format is used for both display and schema.org openingHoursSpecification.
   */
  hours: [
    { day: "Monday", short: "Mon", opens: "10:00", closes: "19:00" },
    { day: "Tuesday", short: "Tue", opens: "10:00", closes: "19:00" },
    { day: "Wednesday", short: "Wed", opens: "10:00", closes: "19:00" },
    { day: "Thursday", short: "Thu", opens: "10:00", closes: "19:00" },
    { day: "Friday", short: "Fri", opens: null, closes: null },
    { day: "Saturday", short: "Sat", opens: "10:00", closes: "19:00" },
    { day: "Sunday", short: "Sun", opens: "10:30", closes: "19:00" },
  ] as const,

  rating: {
    value: 4.5,
    count: 94,
    source: "Google",
  },

  social: {
    facebook: "https://www.facebook.com/nexmod.lk/",
    instagram: "https://www.instagram.com/nexmod.lk/",
    tiktok: "https://www.tiktok.com/@nexmod.lk",
  },

  /**
   * Payment methods common to Sri Lankan e-commerce. The gateway itself is not
   * wired up yet — see src/lib/orders.ts for the integration seam.
   */
  payments: [
    { id: "cod", label: "Cash on Delivery", note: "Islandwide" },
    { id: "card", label: "Visa / Mastercard / Amex", note: "Secure checkout" },
    { id: "bank", label: "Bank Transfer", note: "Direct deposit" },
    { id: "koko", label: "KOKO", note: "Pay in 3 — 0% interest" },
    { id: "mintpay", label: "Mintpay", note: "Pay in 3 — 0% interest" },
  ],

  delivery: {
    islandwide: true,
    freeThreshold: 15000, // LKR — PLACEHOLDER, confirm policy
    colomboDays: "1–2 working days",
    outstationDays: "2–4 working days",
    courierNote: "Dispatched via tracked courier from Dehiwala.",
  },

  // Used across trust bars and schema
  usps: [
    "Official EZ Lip Sri Lanka agent",
    "In-house professional installation",
    "4.5★ from 94 Google reviews",
    "Islandwide delivery",
  ],
} as const;

export type Site = typeof site;

/** Build a prefilled WhatsApp deep link. */
export function waLink(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Format a LKR amount for display. */
export function lkr(amount: number): string {
  return `${site.currencySymbol} ${amount.toLocaleString("en-LK")}`;
}
