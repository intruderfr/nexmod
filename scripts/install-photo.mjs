#!/usr/bin/env node
/**
 * Installs a real photograph over one of the generated image keys.
 *
 * The catalogue shipped with stock photography as a placeholder, and every
 * component references images by key rather than by path — so replacing a
 * photograph is a matter of regenerating the three widths and the blur-up
 * placeholder for that key, and touching nothing else.
 *
 * `withoutEnlargement` is inherited from the main pipeline on purpose. Nexmod's
 * own photographs come off social media at 640px, and a 1920px file upscaled
 * from that looks worse than a 640px one served honestly — the browser scales
 * it down either way, but the upscale bakes in the softness and triples the
 * bytes.
 *
 *   node scripts/install-photo.mjs <source> <key> "<alt text>"
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SIZES = { sm: 640, md: 1200, lg: 1920 };
const OUT_DIR = join(process.cwd(), "public", "images");
const MANIFEST = join(process.cwd(), "src", "data", "images.generated.ts");

const [source, key, alt] = process.argv.slice(2);

if (!source || !key || !alt) {
  console.error('Usage: node scripts/install-photo.mjs <source> <key> "<alt text>"');
  process.exit(1);
}

const raw = readFileSync(source);
const meta = await sharp(raw).metadata();

for (const [label, width] of Object.entries(SIZES)) {
  const out = join(OUT_DIR, `${key}-${label}.webp`);
  await sharp(raw)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: label === "lg" ? 78 : 82, effort: 5 })
    .toFile(out);
}

const lqip = await sharp(raw).resize({ width: 20 }).webp({ quality: 30 }).toBuffer();

/*
 * The manifest is a generated TypeScript file, so the entry is rewritten by
 * matching the key's own block rather than by parsing the module. The blocks
 * are uniform, which makes the match reliable, and a miss throws instead of
 * silently leaving the old metadata pointing at a new photograph.
 */
let manifest = readFileSync(MANIFEST, "utf-8");
// The final entry in the manifest carries no trailing comma, so the closing
// brace is matched with the comma optional. Requiring it silently skipped
// whichever key happened to be last.
const block = new RegExp(`(  "${key}": \\{)[\\s\\S]*?(\\n  \\},?)`);
if (!block.test(manifest)) {
  console.error(`Key "${key}" not found in images.generated.ts`);
  process.exit(1);
}

const entry =
  `\n    "alt": ${JSON.stringify(alt)},` +
  `\n    "width": ${meta.width ?? null},` +
  `\n    "height": ${meta.height ?? null},` +
  `\n    "lqip": "data:image/webp;base64,${lqip.toString("base64")}",` +
  `\n    "source": "Nexmod"`;

manifest = manifest.replace(block, `$1${entry}$2`);
writeFileSync(MANIFEST, manifest, "utf-8");

console.log(`${key}: ${meta.width}x${meta.height} from ${source}`);
