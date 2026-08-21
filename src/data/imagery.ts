import { generatedImages, type ImageKey } from "./images.generated";

/**
 * Slug → photograph mapping.
 *
 * Kept separate from the generated manifest so re-running the image pipeline
 * never clobbers editorial decisions about which photo represents what.
 *
 * Products inherit their category's photo unless they name their own, which
 * keeps 36 products looking coherent without needing 36 separate shots.
 */

export const categoryImages: Record<string, ImageKey> = {
  "carbon-fibre": "cat-carbon-fibre",
  "ez-lip": "cat-ez-lip",
  "spoilers-body": "cat-spoilers-body",
  "body-kits": "cat-body-kits",
  "tyre-stickers": "cat-tyre-stickers",
  lighting: "cat-lighting",
  audio: "cat-audio",
  "cameras-safety": "cat-cameras-safety",
  interior: "cat-interior",
  essentials: "cat-essentials",
};

export const serviceImages: Record<string, ImageKey> = {
  "carbon-fibre-wrapping": "svc-wrapping",
  "ez-lip-installation": "cat-ez-lip",
  "spoiler-body-kit-fitting": "cat-spoilers-body",
  "body-kit-fitting": "cat-body-kits",
  "tyre-lettering": "svc-tyre",
  "decals-graphics": "svc-wrapping",
  "window-tinting": "svc-tinting",
  "lighting-installation": "cat-lighting",
  "car-audio-installation": "cat-audio",
  "sound-deadening": "svc-lift",
  "camera-safety-installation": "cat-cameras-safety",
  "interior-fitting": "cat-interior",
  "detailing-protection": "svc-detailing",
};

/** Only products that deserve a photo different from their category's. */
export const productImages: Record<string, ImageKey> = {
  "ez-lip-pro-universal-front-lip": "cat-ez-lip",
  "ez-lip-original-front-lip": "hero-alt",
  "carbon-fibre-bonnet-wrap": "svc-wrapping",
  "carbon-fibre-mirror-caps": "build-05",
  "ducktail-spoiler-abs": "cat-spoilers-body",
  "roof-wing-spoiler": "build-01",
  "tyredeckz-tyre-stickers-set": "cat-tyre-stickers",
  "sequential-drl-strip": "cat-lighting",
  "bi-led-projector-conversion": "build-02",
  "camera-360-3d-system": "cat-cameras-safety",
  "seven-d-floor-mats": "cat-interior",
  "custom-seat-covers": "cat-interior",
  "sound-deadening-doors": "svc-lift",
  "hydrophobic-glass-coating": "svc-tinting",
  "ceramic-spray-sealant": "svc-detailing",
  "microfibre-detailing-kit": "svc-detailing",
};

export const articleImages: Record<string, ImageKey> = {
  "carbon-fibre-wrap-guide-sri-lanka": "svc-wrapping",
  "ez-lip-vs-fibreglass-lip-sri-lanka": "cat-ez-lip",
  "window-tint-law-sri-lanka": "svc-tinting",
  "sound-deadening-explained-sri-lanka": "cat-audio",
  "led-headlight-upgrade-mistake": "cat-lighting",
  "car-modification-trends-sri-lanka-2026": "build-03",
  "monsoon-car-care-checklist-sri-lanka": "svc-detailing",
  "how-to-choose-android-head-unit": "cat-interior",
  "360-camera-worth-it-sri-lanka": "cat-cameras-safety",
  "tyre-stickers-guide-sri-lanka": "cat-tyre-stickers",
  "modifications-that-hurt-resale-value": "build-06",
  "nexmod-official-ez-lip-agent-sri-lanka": "cat-ez-lip",
  "ambient-lighting-guide-sri-lanka": "cat-interior",
  "new-car-first-90-days-protection": "svc-detailing",
};

/** The showcase strip on the home page and the gallery. */
export const galleryImages: ImageKey[] = [
  "build-01",
  "cat-spoilers-body",
  "build-02",
  "cat-lighting",
  "build-03",
  "cat-ez-lip",
  "build-04",
  "cat-carbon-fibre",
  "build-05",
  "workshop-bay",
  "build-06",
  "cat-tyre-stickers",
];

/* ----------------------------------------------------------------- lookups */

function valid(key: string | undefined): ImageKey | undefined {
  return key && key in generatedImages ? (key as ImageKey) : undefined;
}

export function categoryImage(slug: string): ImageKey | undefined {
  return valid(categoryImages[slug]);
}

export function serviceImage(slug: string): ImageKey | undefined {
  return valid(serviceImages[slug]);
}

/** Falls back to the product's category photo. */
export function productImage(slug: string, categorySlug: string): ImageKey | undefined {
  return valid(productImages[slug]) ?? valid(categoryImages[categorySlug]);
}

export function articleImage(slug: string): ImageKey | undefined {
  return valid(articleImages[slug]);
}
