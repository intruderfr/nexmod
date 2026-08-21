import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

import { OVERRIDE_SECTIONS } from "@/data/overrides";

/**
 * The admin panel's backend.
 *
 * LOCAL ONLY, BY CONSTRUCTION. There are three independent reasons this can
 * never be reachable from the deployed site, and that redundancy is deliberate
 * for an unauthenticated endpoint that writes to disk:
 *
 *   1. It refuses to run unless NODE_ENV is "development".
 *   2. scripts/build-static.mjs moves src/app/api aside before the export, so
 *      it is not compiled into the build at all.
 *   3. GitHub Pages serves static files and cannot execute a route handler
 *      even if one were somehow present.
 *
 * There is no authentication and there should not be: the only way to reach it
 * is to already have the repository and a terminal on the owner's machine, at
 * which point a password protects nothing.
 */

const FILE = join(process.cwd(), "src", "data", "overrides.json");

/** Everything this endpoint will write. Anything else is dropped silently. */
const NUMERIC_FIELDS = new Set([
  "price",
  "compareAt",
  "fromPrice",
  "monthly",
  "annual",
  "discountPct",
  "warrantyBonusMonths",
]);
const BOOLEAN_FIELDS = new Set(["inStock", "featured"]);
const STRING_FIELDS = new Set(["priceNote", "publishedAt"]);

function devOnly() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  return null;
}

export async function GET() {
  const blocked = devOnly();
  if (blocked) return blocked;

  try {
    const text = await readFile(FILE, "utf-8");
    return NextResponse.json(JSON.parse(text));
  } catch {
    return NextResponse.json({ products: {}, services: {}, articles: {}, care: {} });
  }
}

/**
 * Rebuilds the payload field by field rather than trusting what arrived.
 *
 * The input is local and the risk is low, but a malformed number written into
 * a file that every page imports would break the whole build — and it would
 * break it at `next build` time, long after the person who typed it had
 * stopped looking. Rejecting it here is much kinder than a red CI run.
 */
function clean(input: unknown): Record<string, unknown> {
  const source = (input ?? {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};

  for (const section of OVERRIDE_SECTIONS) {
    const entries = source[section];
    if (typeof entries !== "object" || entries === null) continue;

    const cleaned: Record<string, Record<string, unknown>> = {};

    for (const [slug, patch] of Object.entries(entries as Record<string, unknown>)) {
      if (typeof patch !== "object" || patch === null) continue;
      const fields: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
        if (value === null) {
          // An explicit clear — kept, because it means "use the source value".
          fields[key] = null;
        } else if (NUMERIC_FIELDS.has(key)) {
          const n = Number(value);
          if (Number.isFinite(n) && n >= 0) fields[key] = Math.round(n);
        } else if (BOOLEAN_FIELDS.has(key)) {
          if (typeof value === "boolean") fields[key] = value;
        } else if (STRING_FIELDS.has(key)) {
          if (typeof value === "string" && value.length <= 400) fields[key] = value;
        } else if (key === "variants" && typeof value === "object" && value !== null) {
          const variants: Record<string, Record<string, unknown>> = {};
          for (const [id, v] of Object.entries(value as Record<string, unknown>)) {
            if (typeof v !== "object" || v === null) continue;
            const vf: Record<string, unknown> = {};
            const price = Number((v as Record<string, unknown>).price);
            if (Number.isFinite(price) && price >= 0) vf.price = Math.round(price);
            const stock = (v as Record<string, unknown>).inStock;
            if (typeof stock === "boolean") vf.inStock = stock;
            if (Object.keys(vf).length) variants[id] = vf;
          }
          if (Object.keys(variants).length) fields.variants = variants;
        }
      }

      // An entry with nothing left in it is noise in the diff.
      if (Object.keys(fields).length) cleaned[slug] = fields;
    }

    out[section] = cleaned;
  }

  return out;
}

export async function POST(request: Request) {
  const blocked = devOnly();
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body was not valid JSON" }, { status: 400 });
  }

  const payload = {
    $comment:
      "Edited by the local admin panel — see src/data/overrides.ts. Safe to hand-edit. Commit and push to publish.",
    updatedAt: new Date().toISOString(),
    ...clean(body),
  };

  try {
    await writeFile(FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  } catch (error) {
    return NextResponse.json(
      { error: `Could not write overrides.json: ${(error as Error).message}` },
      { status: 500 },
    );
  }

  const sections = payload as unknown as Record<string, Record<string, unknown> | undefined>;
  const counts = Object.fromEntries(
    OVERRIDE_SECTIONS.map((section) => [section, Object.keys(sections[section] ?? {}).length]),
  );

  return NextResponse.json({ ok: true, updatedAt: payload.updatedAt, counts });
}
