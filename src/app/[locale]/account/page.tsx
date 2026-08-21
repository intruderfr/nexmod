import { Account } from "@/components/Account";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
    title: "My Nexmod",
    description:
      "Your saved vehicles, builds, wishlist and activity — stored in your own browser, with export and import to move between devices.",
    path: "/account",
    locale,
    // Entirely browser state; there is nothing stable here to index.
    noindex: true,
  });
}

export default function AccountPage() {
  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "My Nexmod", path: "/account" }]} />
      </div>

      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <p className="eyebrow mb-5">Your profile</p>
        <h1 className="text-display-2 mb-4">My Nexmod</h1>
        <p className="text-lede">
          Your cars, your saved builds, the things you liked, and a record of what you have sent
          us — all kept on this device.
        </p>
      </section>

      <section className="container-nex py-12 md:py-16">
        <Account />
      </section>
    </>
  );
}
