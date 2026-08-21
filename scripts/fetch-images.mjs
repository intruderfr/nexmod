#!/usr/bin/env node
/**
 * Image pipeline.
 *
 * Downloads the curated photography set at full resolution, then emits WebP at
 * three widths plus a tiny blurred LQIP placeholder for each.
 *
 * IMPORTANT — THIS IS STOCK PHOTOGRAPHY, NOT NEXMOD'S CARS.
 * Every image here is licensed for commercial use (Unsplash / Pexels licence,
 * no attribution required) and is standing in until the workshop supplies its
 * own shots. Each entry records its source so it can be swapped or credited.
 * Replace `public/images/` with real work and the manifest keys stay the same.
 *
 * Run: node scripts/fetch-images.mjs
 * Output: public/images/<key>-{sm,md,lg}.webp and the LQIP data in
 *         src/data/images.generated.ts
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = join(root, "public", "images");
const tmpDir = join(root, ".image-tmp");

/**
 * The curated set. `id` is the source photo id; `src` selects the host.
 * `focus` biases the crop so the subject survives a 16:10 or 21:9 cut.
 */
const IMAGES = [
  // Hero / atmosphere
  { key: "hero-main", src: "u", id: "photo-1542362567-b07e54358753", focus: "attention", alt: "Dark sports car at dusk" },
  { key: "hero-alt", src: "u", id: "photo-1503376780353-7e6692767b70", focus: "attention", alt: "Low sports car in profile" },

  // Categories
  { key: "cat-carbon-fibre", src: "p", id: 3802510, focus: "attention", alt: "Carbon-detailed sports car in profile" },
  { key: "cat-ez-lip", src: "u", id: "photo-1542362567-b07e54358753", focus: "south", alt: "Front bumper and lip detail" },
  { key: "cat-spoilers-body", src: "p", id: 3752194, focus: "attention", alt: "Rear wing and body kit" },
  { key: "cat-tyre-stickers", src: "p", id: 244553, focus: "attention", alt: "Alloy wheel and tyre sidewall" },
  { key: "cat-lighting", src: "u", id: "photo-1568844293986-8d0400bd4745", focus: "attention", alt: "Headlights at night" },
  { key: "cat-audio", src: "u", id: "photo-1558537348-c0f8e733989d", focus: "centre", alt: "Speaker close-up" },
  { key: "cat-cameras-safety", src: "p", id: 1149137, focus: "attention", alt: "Vehicle with camera systems" },
  { key: "cat-interior", src: "u", id: "photo-1449965408869-eaa3f722e40d", focus: "attention", alt: "Car interior at night" },
  { key: "cat-essentials", src: "u", id: "photo-1607860108855-64acf2078ed9", focus: "attention", alt: "Car being washed" },
  { key: "cat-body-kits", src: "u", id: "photo-1502877338535-766e1452684a", focus: "attention", alt: "Car in profile showing body lines" },

  // Services
  { key: "svc-wrapping", src: "u", id: "photo-1605559424843-9e4c228bf1c2", focus: "attention", alt: "Wrapped car" },
  { key: "svc-tinting", src: "u", id: "photo-1580273916550-e323be2ae537", focus: "attention", alt: "Tinted windows at dusk" },
  { key: "svc-detailing", src: "u", id: "photo-1607860108855-64acf2078ed9", focus: "attention", alt: "Detailing with foam" },
  { key: "svc-workshop", src: "u", id: "photo-1625047509168-a7026f36de04", focus: "attention", alt: "Technician working on a car" },
  { key: "svc-lift", src: "p", id: 4489749, focus: "attention", alt: "Car on a workshop lift" },
  { key: "svc-tyre", src: "p", id: 3806249, focus: "attention", alt: "Wheel being fitted" },

  // Workshop / about
  { key: "workshop-bay", src: "p", id: 6873084, focus: "attention", alt: "Car in a workshop bay" },

  // Editorial / gallery
  { key: "build-01", src: "u", id: "photo-1552519507-da3b142c6e3d", focus: "attention", alt: "Modified sedan" },
  { key: "build-02", src: "u", id: "photo-1494976388531-d1058494cdd8", focus: "attention", alt: "Modified coupe" },
  { key: "build-03", src: "u", id: "photo-1568605117036-5fe5e7bab0b7", focus: "attention", alt: "Sports car on a road" },
  { key: "build-04", src: "p", id: 210019, focus: "attention", alt: "Car in motion" },
  { key: "build-05", src: "p", id: 244206, focus: "attention", alt: "Car front three-quarter" },
  { key: "build-06", src: "u", id: "photo-1583121274602-3e2820c69888", focus: "attention", alt: "Supercar in a showroom" },
];

const SIZES = { sm: 640, md: 1200, lg: 1920 };

function url({ src, id }) {
  return src === "u"
    ? `https://images.unsplash.com/${id}?w=2400&q=82&fm=jpg`
    : `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  mkdirSync(tmpDir, { recursive: true });

  const manifest = {};
  let ok = 0;
  let failed = 0;

  for (const image of IMAGES) {
    const raw = join(tmpDir, `${image.key}.jpg`);

    try {
      execFileSync("curl", ["-sL", "--max-time", "60", "-o", raw, url(image)], {
        stdio: "ignore",
      });
      if (!existsSync(raw) || readFileSync(raw).length < 10_000) {
        throw new Error("download too small");
      }

      const base = sharp(raw).rotate(); // honour EXIF, then drop it
      const meta = await base.metadata();

      for (const [label, width] of Object.entries(SIZES)) {
        if (meta.width && meta.width < width && label !== "sm") continue;
        await sharp(raw)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: label === "lg" ? 78 : 82, effort: 5 })
          .toFile(join(outDir, `${image.key}-${label}.webp`));
      }

      // LQIP — a 20px blur-up placeholder inlined as a data URI, so cards never
      // flash empty while the real image decodes.
      const lqip = await sharp(raw)
        .rotate()
        .resize({ width: 20 })
        .blur(1.2)
        .webp({ quality: 30 })
        .toBuffer();

      manifest[image.key] = {
        alt: image.alt,
        width: meta.width ?? null,
        height: meta.height ?? null,
        lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
        source: image.src === "u" ? "Unsplash" : "Pexels",
      };

      ok += 1;
      console.log(`  ${image.key.padEnd(22)} ${meta.width}x${meta.height}`);
    } catch (error) {
      failed += 1;
      console.error(`  ${image.key.padEnd(22)} FAILED — ${error.message}`);
    }
  }

  const header = `/**
 * GENERATED FILE — do not edit by hand.
 * Produced by scripts/fetch-images.mjs. Re-run that script to regenerate.
 *
 * STOCK PHOTOGRAPHY placeholder set (Unsplash / Pexels, commercial use, no
 * attribution required). Replace public/images/ with Nexmod's own photography
 * and re-run the script — every key below stays the same, so no component
 * changes are needed.
 */

export interface GeneratedImage {
  alt: string;
  width: number | null;
  height: number | null;
  /** Inline blur-up placeholder. */
  lqip: string;
  source: string;
}

export const generatedImages = ${JSON.stringify(manifest, null, 2)} as const satisfies Record<string, GeneratedImage>;

export type ImageKey = keyof typeof generatedImages;
`;

  writeFileSync(join(root, "src", "data", "images.generated.ts"), header, "utf-8");
  rmSync(tmpDir, { recursive: true, force: true });

  console.log(`\n${ok} images processed, ${failed} failed`);
  console.log("manifest -> src/data/images.generated.ts\n");
}

main();
