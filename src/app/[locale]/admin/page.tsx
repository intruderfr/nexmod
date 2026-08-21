import { AdminPanel } from "@/components/admin/AdminPanel";

/**
 * The admin panel.
 *
 * Ships with the site and works from the live URL, because the thing that
 * protects it is the GitHub token, not the absence of a page. Without a token
 * it can read nothing and write nothing; with one, it commits to the
 * repository and the deploy workflow rebuilds.
 *
 * It is noindex and linked from nowhere, which keeps it out of search results
 * and out of the way — but neither is a security measure and neither is
 * treated as one.
 */
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="container-nex py-12 md:py-16">
      <div className="max-w-2xl mb-10">
        <p className="eyebrow mb-4">Editor</p>
        <h1 className="text-display-3 mb-5">Prices, stock and publishing</h1>
        <p className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed">
          Changes are committed to the repository through the GitHub API and the site rebuilds
          itself. There is no server in between — this page talks to GitHub directly from your
          browser, which is why it needs a token.
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
