import { notFound } from "next/navigation";

import { AdminPanel } from "@/components/admin/AdminPanel";

/**
 * The local admin panel.
 *
 * Reachable at http://localhost:3000/en/admin while `npm run dev` is running,
 * and nowhere else. Three things keep it that way:
 *
 *   1. This page calls notFound() outside development.
 *   2. scripts/build-static.mjs moves it aside before the export, so it is not
 *      compiled into the deployed site at all.
 *   3. Its API route is stripped the same way, and GitHub Pages cannot execute
 *      a route handler regardless.
 *
 * It is not indexed and not linked from anywhere in the site.
 */
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <div className="container-nex py-12 md:py-16">
      <div className="max-w-2xl mb-10">
        <p className="eyebrow mb-4">Local only</p>
        <h1 className="text-display-3 mb-5">Prices, stock and publishing</h1>
        <p className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed">
          Changes here are written to <code>src/data/overrides.json</code>, which the site reads on
          top of the values in the source files. Nothing is live until the file is committed and
          pushed — the deploy Action rebuilds from it.
        </p>
        <p className="text-[13px] text-[var(--fg-subtle)] leading-relaxed mt-4">
          Leave a field empty to use whatever the source file says. Everything long-form — product
          copy, specs, FAQs, photographs — deliberately stays in the repository, where a change goes
          through review rather than a form field.
        </p>
      </div>

      <AdminPanel />
    </div>
  );
}
