import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteSearch } from "@/components/SiteSearch";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "Search",
  description:
    "Search Nexmod for car accessories, workshop services and guides — carbon fibre, EZ Lip, tinting, audio, lighting and more.",
  path: "/search",
  // Search result pages are thin and near-duplicate; keep them out of the index
  // while still letting crawlers follow through to the real pages.
  noindex: true,
    locale,
  });
}

export default function SearchPage() {
  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Search", path: "/search" }]} />
      </div>

      <section className="container-nex pb-16 md:pb-20">
        <p className="eyebrow mb-2.5">Search</p>
        <h1 className="text-4xl md:text-5xl mb-6">Find it fast.</h1>

        <Suspense fallback={<div className="h-14 rounded-lg bg-[var(--bg-inset)] max-w-xl" />}>
          <SiteSearch />
        </Suspense>
      </section>
    </>
  );
}
