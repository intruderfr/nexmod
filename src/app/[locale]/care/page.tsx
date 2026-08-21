import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CarePlans } from "@/components/care/CarePlans";
import { Faq } from "@/components/Faq";
import { IconArrowRight, IconShield, IconWhatsApp } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { careTiers } from "@/data/care";
import { lkr, site, waLink } from "@/data/site";
import type { FaqItem } from "@/data/types";
import { LocaleLink as Link } from "@/i18n/client";
import { faqSchema } from "@/lib/schema";
import { absoluteUrl, pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
    title: "Nexmod Care — Membership Plans",
    description:
      "Monthly and annual care plans from Nexmod Dehiwala: member pricing on parts and fitting, washes, re-bond checks, interior detailing, coating top-ups and extended warranty on fitted work.",
    path: "/care",
    keywords: [
      "car care plan Sri Lanka",
      "car detailing subscription Colombo",
      "car accessory membership Sri Lanka",
      "car maintenance plan Dehiwala",
    ],
    locale,
  });
}

const faqs: FaqItem[] = [
  {
    q: "Is this a contract?",
    a: "No. Monthly plans run month to month and you can stop at the end of any month. An annual plan is paid up front for twelve months, which is why it is priced as ten — if you stop part-way we refund the unused months minus any allowance you have already used at full counter price.",
  },
  {
    q: "Do unused visits roll over?",
    a: "No, and we would rather say so plainly than bury it. Allowances reset each year on your join date. If you are not going to use four washes, take the tier below — a plan you do not use is worse value than no plan at all.",
  },
  {
    q: "Can I use it on more than one car?",
    a: "A plan covers one vehicle, recorded when you join. If you sell the car you can move the remaining term to the replacement at no charge. Second cars are a second plan, and we discount those — ask.",
  },
  {
    q: "Does the member discount stack with package pricing?",
    a: "Yes. Packages are already discounted against the sum of their parts, and the member percentage comes off after that. It also applies to workshop labour, which most discounts do not.",
  },
  {
    q: "What happens to my extended warranty if I cancel?",
    a: "Cover already earned stays. Anything fitted while the plan was active keeps the bonus months for its full term. What stops is the bonus on anything fitted after you leave.",
  },
  {
    q: "How do I pay?",
    a: "Directly with Nexmod, the same way you pay for anything else at the counter. There is no card form on this website and no card details are ever stored here. Choosing a plan opens WhatsApp so we can set it up and confirm the first payment with you.",
  },
];

export default function CarePage() {
  const from = Math.min(...careTiers.map((t) => t.monthly));

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Nexmod Care",
          serviceType: "Vehicle care and maintenance membership",
          provider: { "@id": absoluteUrl("/#business") },
          areaServed: "Sri Lanka",
          url: absoluteUrl("/care"),
          description:
            "Membership plans covering washes, re-bond checks, detailing, coating top-ups and extended warranty on work fitted by Nexmod.",
          offers: careTiers.map((tier) => ({
            "@type": "Offer",
            name: tier.name,
            price: tier.monthly,
            priceCurrency: "LKR",
            description: tier.tagline,
            url: absoluteUrl("/care"),
          })),
        }}
      />

      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate border-b border-[var(--border)]">
        <Photo
          image="cat-interior"
          ratio="free"
          priority
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(105deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 88%, transparent) 44%, color-mix(in srgb, var(--bg) 30%, transparent) 100%)",
          }}
        />

        <div className="container-nex relative pt-6 pb-16 md:pb-20">
          <Breadcrumbs trail={[{ name: "Nexmod Care", path: "/care" }]} />

          <div className="max-w-2xl mt-10">
            <p className="eyebrow mb-5">Nexmod Care</p>
            <h1 className="text-display-2 mb-6">
              The work does not
              <br />
              end at fitting.
            </h1>
            <p className="text-lede mb-8">
              A lip needs re-bonding. Coating wears off before the monsoon. The car that looked
              finished in March looks tired by August. Care plans cover the visits that keep a build
              looking like it did the day you drove it out, and take a percentage off everything you
              buy while you are on one.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <a href="#plans" className="btn btn-primary">
                See the plans
                <IconArrowRight width={16} height={16} />
              </a>
              <a
                href={waLink("Hi Nexmod, I have a question about the Care plans.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <IconWhatsApp width={16} height={16} />
                Ask first
              </a>
            </div>

            <p className="text-[13px] text-[var(--fg-subtle)] mt-6 tabular-nums">
              From {lkr(from)} a month · cancel monthly plans any time · one vehicle per plan
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- plans */}
      <section id="plans" className="container-nex py-16 md:py-24 scroll-mt-24">
        <CarePlans />
      </section>

      {/* ------------------------------------------------------------- faq */}
      <section className="border-t border-[var(--border)]">
        <div className="container-nex py-16 md:py-24">
          <div className="grid lg:grid-cols-[22rem_1fr] gap-10 lg:gap-16">
            <div>
              <p className="eyebrow mb-4">Questions</p>
              <h2 className="text-display-3 mb-5">The things worth asking before you join</h2>
              <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed mb-6">
                If a plan is not right for how you use the car, we would rather tell you now than
                take a year of payments for visits you never book.
              </p>
              <Link href="/warranty" className="btn btn-outline btn-sm">
                <IconShield width={15} height={15} />
                Warranty cover explained
              </Link>
            </div>

            <Faq items={faqs} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- cta */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-14 md:py-16 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-heading mb-2">Not sure which tier?</h2>
            <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed">
              Tell us what is on the car and roughly how often you would bring it in. If the answer
              is that no plan is worth it for you, that is the answer you will get.
            </p>
          </div>
          <a
            href={waLink(
              `Hi ${site.name}, which Care plan makes sense for my car? Here is what is fitted so far:`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp btn-lg shrink-0"
          >
            <IconWhatsApp width={18} height={18} />
            Ask the workshop
          </a>
        </div>
      </section>
    </>
  );
}
