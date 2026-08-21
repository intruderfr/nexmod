import { LocaleLink as Link } from "@/i18n/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IconCheck, IconMapPin, IconStar, IconWhatsApp } from "@/components/Icons";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { site, waLink } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "About Nexmod — Car Accessories Dehiwala",
  description:
    "Nexmod is a premium car accessories studio in Dehiwala, Colombo. Official EZ Lip Sri Lanka agent, 4.5 stars from 94 Google reviews, everything fitted in-house since 2020.",
  path: "/about",
  keywords: [
    "about Nexmod",
    "car accessories shop Dehiwala",
    "car modification workshop Colombo",
    "Nexmod Sri Lanka",
  ],
    locale,
  });
}

export default function AboutPage() {
  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "About", path: "/about" }]} />
      </div>

      {/* Hero */}
      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <div className="max-w-3xl">
          <p className="eyebrow mb-2.5">About</p>
          <h1 className="text-display-2 mb-6 leading-[1.08]">
            We would rather lose a job than sell you the wrong thing.
          </h1>
          <p className="text-lg text-[var(--fg-muted)] leading-relaxed">
            Nexmod is a premium car accessories studio on Sri Saranankara Road in Dehiwala. We have
            been fitting carbon, lips, spoilers, lighting, audio and cameras since 2020, and we do
            all of it ourselves.
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-b border-[var(--border)]">
        <div className="container-nex py-12 md:py-16">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { value: site.rating.value.toString(), label: `From ${site.rating.count} Google reviews`, star: true },
              { value: `${services.length}`, label: "Services, all in-house" },
              { value: `${products.length}+`, label: `Products across ${categories.length} categories` },
              { value: "2020", label: "Fitting cars in Dehiwala since" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="flex items-center gap-1.5 font-[family-name:var(--font-display)] text-display-2 font-extrabold text-[var(--accent)] tabular-nums leading-none mb-2">
                    {stat.value}
                    {stat.star && <IconStar width={22} height={22} />}
                  </span>
                  <span className="block text-[13.5px] text-[var(--fg-muted)] leading-snug">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story */}
      <section className="container-nex py-16 md:py-20">
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          <div className="max-w-2xl">
            <div className="prose-nex">
              <h2>How we work</h2>
              <p>
                Most of what separates a good accessory job from a bad one is invisible when you
                collect the car. The wrap edge that was post-heated. The drilled hole that was
                primed and sealed. The 360 camera that was actually calibrated. The loom that was
                soldered instead of scotch-locked.
              </p>
              <p>
                None of that shows at handover. All of it decides whether the work is still right
                in two years. So we publish it — every service page on this site explains exactly
                what we do, in what order, and which step other shops skip.
              </p>

              <h2>What we will tell you not to buy</h2>
              <p>
                We turn down work regularly, and it is worth being specific about when. We will
                talk you out of LED bulbs in halogen reflector housings, because they make your
                night vision worse. We will suggest door sound deadening before a more expensive
                speaker, because that is where the money actually goes further. We will tell you a
                360 camera on a small hatchback is a solution looking for a problem.
              </p>
              <p>
                None of that is generosity. It is that a customer who was told the truth once comes
                back, and a customer who was upsold does not.
              </p>

              <h2>Reversible by default</h2>
              <p>
                Import restrictions mean people are keeping cars far longer than they planned, and
                selling into a more discerning market when they finally do. That makes one question
                more important than any styling decision: can it be undone?
              </p>
              <p>
                So we bond rather than bolt wherever a design allows it. We use plug-and-play CANbus
                harnesses rather than cutting factory looms. We use film rather than paint. Your car
                can go back to standard, and your resale value stays intact.
              </p>

              <h2>The EZ Lip agency</h2>
              <p>
                Nexmod is the official Sri Lankan agent for EZ Lip USA. Every genuine EZ Lip and EZ
                Lip Pro on the island comes through us, with local warranty support and fitting
                included.
              </p>
              <p>
                That matters because counterfeits have circulated regionally for years. They look
                correct on day one and go chalky and brittle within a season — which defeats the
                entire point of choosing a flexible lip in the first place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-9">
              <Link href="/services" className="btn btn-primary">
                See what we do
              </Link>
              <Link href="/ez-lip" className="btn btn-outline">
                About EZ Lip Sri Lanka
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="surface carbon-texture p-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
                What you can count on
              </h2>
              <ul className="space-y-3">
                {[
                  "Everything fitted in-house — we do not subcontract",
                  "Honest recommendations, including when to spend nothing",
                  "Reversible installs that protect resale value",
                  "Warranty on parts and on our workmanship",
                  "We fix our own mistakes without argument",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <IconCheck
                      width={15}
                      height={15}
                      className="shrink-0 mt-0.5 text-[var(--accent)]"
                    />
                    <span className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface p-6">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
                Find us
              </h2>
              <p className="text-[14px] leading-relaxed text-[var(--fg-muted)] mb-4">
                {site.address.street}
                <br />
                {site.address.locality} {site.address.postalCode}
                <br />
                Sri Lanka
              </p>
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline w-full"
              >
                <IconMapPin width={14} height={14} />
                Open in Maps
              </a>
            </div>

            <div className="surface p-6">
              <h2 className="text-[13px] font-bold mb-2">Have a question?</h2>
              <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed mb-4">
                Send a photo of your car. We will tell you what we would do and what we would leave
                alone.
              </p>
              <a
                href={waLink("Hi Nexmod, I have a question about my car.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-whatsapp w-full"
              >
                <IconWhatsApp width={15} height={15} />
                WhatsApp us
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
