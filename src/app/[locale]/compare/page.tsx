import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CompareTable } from "@/components/CompareTable";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
    title: "Compare Products",
    description:
      "Compare Nexmod car accessories side by side — price, fitting time, warranty, specifications and vehicle fitment.",
    path: "/compare",
    locale,
    // A comparison built from browser state has no stable content to index.
    noindex: true,
  });
}

export default function ComparePage() {
  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Compare", path: "/compare" }]} />
      </div>

      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <p className="eyebrow mb-5">Compare</p>
        <h1 className="text-display-2 mb-4">Side by side.</h1>
        <p className="text-lede">
          Everything that actually differs between the products you picked — price, fitting time,
          warranty and full specifications.
        </p>
      </section>

      <section className="container-nex py-12 md:py-16 pb-32">
        <CompareTable />
      </section>
    </>
  );
}
