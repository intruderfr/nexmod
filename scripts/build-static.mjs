#!/usr/bin/env node
/**
 * Static export for GitHub Pages.
 *
 * GitHub Pages serves files, not a server, so three things cannot come along:
 *
 *   1. Route handlers (/api/bookings, /api/orders) — no server to run them.
 *      The booking and checkout forms detect the static build and route
 *      straight to WhatsApp instead of POSTing into the void.
 *   2. The locale proxy (src/proxy.ts) — no middleware runtime. A generated
 *      root index.html redirects to the preferred locale on the client instead.
 *   3. ISR — `revalidate` becomes build-time only. Scheduled articles publish
 *      when the site rebuilds, which the GitHub Action does daily on a cron.
 *
 * Those files are moved aside for the build and restored afterwards, so the
 * default server build is never affected. On CI the checkout is ephemeral
 * anyway, but the restore keeps local runs clean.
 */

import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const stash = join(root, ".static-build-stash");

/** Server-only paths that break `output: "export"`. */
const SERVER_ONLY = [
  { from: join(root, "src", "app", "api"), name: "api" },
  { from: join(root, "src", "proxy.ts"), name: "proxy.ts" },
  /*
   * The admin panel. It already refuses to render outside development and its
   * API route already refuses to run, but the strongest guarantee is simply
   * not compiling it into the thing that gets published.
   */
  { from: join(root, "src", "app", "[locale]", "admin"), name: "admin" },
];

const BASE_PATH = process.env.BASE_PATH ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "";

/**
 * Cache namespace for the service worker, unique per deploy.
 *
 * The git SHA when there is one, a timestamp otherwise. It is passed to
 * `next build` (so the client registers /sw.js?v=<id>) and stamped into
 * out/sw.js (so the worker's cache keys match). Both halves must agree or a
 * returning visitor can be served a previous build's chunks against this
 * build's HTML — which throws during hydration and leaves a page that renders
 * but does not respond to clicks.
 */
const BUILD_ID = (() => {
  if (process.env.BUILD_ID) return process.env.BUILD_ID;
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return Date.now().toString(36);
  }
})();

function moveAside() {
  mkdirSync(stash, { recursive: true });
  for (const { from, name } of SERVER_ONLY) {
    if (existsSync(from)) {
      renameSync(from, join(stash, name));
      console.log(`  stashed  src/app/${name}`);
    }
  }
}

function restore() {
  for (const { from, name } of SERVER_ONLY) {
    const stashed = join(stash, name);
    if (existsSync(stashed)) {
      renameSync(stashed, from);
      console.log(`  restored src/app/${name}`);
    }
  }
  rmSync(stash, { recursive: true, force: true });
}

/**
 * `/` has no page — every route lives under `/[locale]` — so the export
 * produces no root index.html. This one picks a locale the same way the proxy
 * would (stored choice, then browser language, then English) and redirects.
 *
 * The <noscript> path and the meta refresh both fall back to English, so the
 * root is never a dead end.
 */
function writeRootRedirect(outDir) {
  const b = BASE_PATH;
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nexmod — Premium Car Accessories Sri Lanka</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${SITE_URL || ""}/en/">
<meta http-equiv="refresh" content="0; url=${b}/en/">
<style>
  html{background:#08090b;color:#f2f4f7;font-family:system-ui,sans-serif}
  body{display:grid;place-items:center;min-height:100vh;margin:0}
  a{color:#ff4a2e}
</style>
<script>
(function () {
  try {
    var supported = ["en", "si", "ta"];
    var stored = (document.cookie.match(/nexmod\\.locale=(\\w+)/) || [])[1];
    var pick = supported.indexOf(stored) > -1 ? stored : null;
    if (!pick) {
      var langs = navigator.languages || [navigator.language || "en"];
      for (var i = 0; i < langs.length && !pick; i++) {
        var base = String(langs[i]).toLowerCase().split("-")[0];
        if (supported.indexOf(base) > -1) pick = base;
      }
    }
    location.replace("${b}/" + (pick || "en") + "/");
  } catch (e) {
    location.replace("${b}/en/");
  }
})();
</script>
</head>
<body>
<p>Redirecting to <a href="${b}/en/">Nexmod</a>&hellip;</p>
</body>
</html>
`;
  writeFileSync(join(outDir, "index.html"), html, "utf-8");
  console.log("  wrote    out/index.html (locale redirect)");
}

/**
 * Replaces the __BUILD_ID__ placeholder in the exported service worker.
 *
 * A miss here is silent and dangerous — the worker would keep a constant cache
 * key, stop evicting old builds, and start serving stale chunks — so it is a
 * hard failure rather than a warning.
 */
function stampServiceWorker(outDir) {
  const swPath = join(outDir, "sw.js");
  if (!existsSync(swPath)) {
    throw new Error("out/sw.js is missing — the service worker was not exported.");
  }

  const source = readFileSync(swPath, "utf-8");
  if (!source.includes("__BUILD_ID__")) {
    throw new Error("out/sw.js has no __BUILD_ID__ placeholder to stamp.");
  }

  writeFileSync(swPath, source.replaceAll("__BUILD_ID__", BUILD_ID), "utf-8");
  console.log(`  stamped  out/sw.js (build ${BUILD_ID})`);
}

/**
 * Drops .next/dev before the export.
 *
 * `next dev` writes a route-type validator under .next/dev/types that imports
 * every route handler by path. Those handlers have just been stashed, so a
 * validator left over from a dev session fails type checking with "Cannot find
 * module .../api/bookings/route.js" and takes the whole build down. It is
 * dev-only output and safe to remove.
 */
function clearDevArtifacts() {
  const dev = join(root, ".next", "dev");
  if (existsSync(dev)) {
    rmSync(dev, { recursive: true, force: true });
    console.log("  cleared  .next/dev");
  }
}

function main() {
  console.log("\nStatic export for GitHub Pages");
  console.log(`  basePath ${BASE_PATH || "(none)"}`);
  console.log(`  siteUrl  ${SITE_URL || "(default)"}\n`);
  console.log(`  buildId  ${BUILD_ID}`);

  moveAside();
  clearDevArtifacts();

  let failed = false;
  try {
    execSync("npx next build", {
      stdio: "inherit",
      env: { ...process.env, STATIC_EXPORT: "1", BUILD_ID },
    });
  } catch (error) {
    failed = true;
    console.error("\nBuild failed.");
    console.error(error.message);
  } finally {
    restore();
  }

  if (failed) process.exit(1);

  const outDir = join(root, "out");

  // Without this, Pages runs Jekyll, which ignores every _next/ directory and
  // the whole site loads unstyled.
  writeFileSync(join(outDir, ".nojekyll"), "", "utf-8");
  console.log("  wrote    out/.nojekyll");

  writeRootRedirect(outDir);

  stampServiceWorker(outDir);

  // Pages has no server-side 404 routing; it serves 404.html for any miss.
  const notFound = join(outDir, "en", "404.html");
  if (existsSync(notFound)) {
    cpSync(notFound, join(outDir, "404.html"));
    console.log("  wrote    out/404.html");
  }

  console.log("\nDone. Output in ./out\n");
}

main();
