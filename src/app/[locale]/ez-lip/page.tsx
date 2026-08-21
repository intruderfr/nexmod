import { LocaleLink as Link } from "@/i18n/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/Cards";
import { Faq } from "@/components/Faq";
import { IconCheck, IconClock, IconShield, IconWhatsApp } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { productsInCategory } from "@/data/products";
import { getService } from "@/data/services";
import { site, waLink } from "@/data/site";
import type { FaqItem } from "@/data/types";
import { absoluteUrl, pageMeta } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "EZ Lip Sri Lanka — Official Agent",
  description:
    "Nexmod is the official Sri Lankan agent for EZ Lip USA. Genuine EZ Lip and EZ Lip Pro universal front lips, supplied and professionally fitted at our Dehiwala workshop. 12-month warranty.",
  path: "/ez-lip",
  keywords: [
    "EZ Lip Sri Lanka",
    "ez lip pro Sri Lanka",
    "genuine ez lip agent Sri Lanka",
    "universal front lip Sri Lanka",
    "ez lip price Sri Lanka",
    "ez lip Colombo",
    "ez lip installation Dehiwala",
  ],
    locale,
  });
}

const faqs: FaqItem[] = [
  {
    q: "Is Nexmod the only place to buy genuine EZ Lip in Sri Lanka?",
    a: "Yes. Nexmod is the official Sri Lankan agent for EZ Lip USA. Genuine product is supplied and installed here only — there is no second authorised outlet on the island. If you are offered an EZ Lip elsewhere in Sri Lanka, it is not genuine.",
  },
  {
    q: "What is EZ Lip actually made of?",
    a: "A high-memory flexible polymer, made in the USA. That flexibility is the entire point — where a fibreglass or ABS lip cracks on impact, EZ Lip deflects and springs back to shape.",
  },
  {
    q: "Will it fit my car?",
    a: "Almost certainly. EZ Lip is universal-fit and bonds to the leading edge of any bumper — hatchbacks, sedans, SUVs and vans. We have fitted it to Vitz, Aqua, Vezel, Swift, Lancer, Axio, Premio, Prado and many more. Send a straight-on photo of your front bumper on WhatsApp and we will confirm before you order.",
  },
  {
    q: "How do I tell genuine from a counterfeit?",
    a: "Genuine product is noticeably softer and springs back instantly when bent; copies feel stiff and stay slightly bent. Genuine arrives in branded EZ Lip USA packaging with factory heat-activated adhesive, while copies ship with generic double-sided tape that fails in Colombo heat. Counterfeit compound also goes chalky and grey under UV within a single dry season.",
  },
  {
    q: "Original or Pro — which should I choose?",
    a: "EZ Lip Original drops 20–25mm and is the daily-driver choice, particularly if you use steep car park ramps every day. EZ Lip Pro drops 30–40mm for a clearly modified stance. The difference in look is smaller than people expect; the difference in daily ramp stress is not.",
  },
  {
    q: "Will it damage my bumper or paint?",
    a: "No. The factory adhesive bonds to the painted surface — the same class of bond used for factory body mouldings — and removes with heat and adhesive remover, leaving paint intact.",
  },
  {
    q: "How long does fitting take?",
    a: "75 to 90 minutes, and you can wait for it. We degrease the bumper edge, dry-fit and mark the run, apply the factory heat-activated adhesive, and clamp the lip while it cures. It is road-ready when you leave.",
  },
  {
    q: "What warranty do I get?",
    a: "12 months against manufacturing defect, honoured locally at our Dehiwala workshop, plus our own guarantee on the bond. That local warranty path is one of the main practical reasons the agency exists.",
  },
];

export default function EzLipPage() {
  const products = productsInCategory("ez-lip");
  const service = getService("ez-lip-installation");

  const brandSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "EZ Lip Sri Lanka — Official Agent",
    url: absoluteUrl("/ez-lip"),
    about: {
      "@type": "Brand",
      name: "EZ Lip USA",
      description: "Universal flexible front lip, made in the USA.",
    },
    mainEntity: {
      "@type": "Organization",
      name: site.name,
      description: "Official Sri Lankan agent for EZ Lip USA.",
    },
  };

  return (
    <>
      <JsonLd data={brandSchema} />
      <JsonLd data={faqSchema(faqs)} />

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "EZ Lip Sri Lanka", path: "/ez-lip" }]} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 carbon-texture opacity-60" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 75% 20%, var(--accent-subtle), transparent 70%)",
          }}
        />

        <div className="container-nex relative py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent-subtle)] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--accent)]">
                Official Sri Lanka agent
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl mb-5 leading-[1.05]">
              EZ Lip Sri Lanka.
              <br />
              <span className="text-[var(--accent)]">Genuine, or nothing.</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--fg-muted)] leading-relaxed mb-8">
              Nexmod is the official Sri Lankan agent for EZ Lip USA. Every genuine EZ Lip and EZ
              Lip Pro on the island is supplied and installed here — with a local warranty and
              fitting included.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/products/ez-lip-pro-universal-front-lip" className="btn btn-lg btn-primary">
                Shop EZ Lip Pro
              </Link>
              <a
                href={waLink(
                  "Hi Nexmod, I'd like to fit an EZ Lip. Here's a photo of my front bumper:",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-whatsapp"
              >
                <IconWhatsApp width={18} height={18} />
                Check my fitment
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why flexible */}
      <section className="container-nex py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="eyebrow mb-3">Why flexible wins here</p>
            <h2 className="text-display-3 mb-5">
              Sri Lankan roads destroy rigid lips.
            </h2>
            <div className="prose-nex max-w-none">
              <p>
                It is not the highways. It is the speed bumps outside every school, the steep ramps
                into hotel and mall car parks, the unmarked road repairs, and the kerb you cannot
                see over the bonnet when parking.
              </p>
              <p>
                A fibreglass or ABS lip is rigid. One badly judged bump and it cracks, or tears off
                entirely — usually taking a strip of bumper paint with it.
              </p>
              <p>
                EZ Lip is a soft, high-memory polymer. It deflects, it scrapes, and it springs back.
                That single property is why it is the right front lip for a car that actually gets
                driven here.
              </p>
            </div>
          </div>

          <div className="surface overflow-hidden">
            <div className="scroll-x">
              <table className="w-full text-left border-collapse min-w-[30rem]">
                <thead>
                  <tr className="bg-[var(--bg-inset)]">
                    <th className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] border-b border-[var(--border)]">
                      Lip type
                    </th>
                    <th className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] border-b border-[var(--border)]">
                      On impact
                    </th>
                    <th className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] border-b border-[var(--border)]">
                      Verdict
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Fibreglass", "Cracks or shatters", "Repairable, but visibly"],
                    ["ABS", "Cracks at stress points", "Usually not repairable neatly"],
                    ["Polyurethane", "Deforms, mostly recovers", "Better, can tear at mounts"],
                    ["EZ Lip", "Deflects and springs back", "Designed for this"],
                  ].map(([type, impact, verdict], i) => (
                    <tr
                      key={type}
                      className={`border-b border-[var(--border)] last:border-0 ${
                        i === 3 ? "bg-[var(--accent-subtle)]" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-[14px] font-medium">{type}</td>
                      <td className="px-4 py-3 text-[14px] text-[var(--fg-muted)]">{impact}</td>
                      <td
                        className={`px-4 py-3 text-[14px] ${
                          i === 3 ? "text-[var(--accent)] font-semibold" : "text-[var(--fg-muted)]"
                        }`}
                      >
                        {verdict}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Agency benefits */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-20">
          <div className="max-w-2xl mb-9">
            <p className="eyebrow mb-3">What the agency means</p>
            <h2 className="text-display-3 mb-3">Why buying genuine matters</h2>
            <p className="text-[var(--fg-muted)] leading-relaxed">
              Counterfeit EZ Lip has circulated in the region for years. It looks correct on day one.
              It stops looking correct within a season.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                Icon: IconShield,
                title: "Verified genuine",
                body: "Factory packaging, factory heat-activated adhesive, direct supply from EZ Lip USA.",
              },
              {
                Icon: IconCheck,
                title: "Local warranty",
                body: "12 months, honoured at Dehiwala. No shipping a claim overseas and hoping.",
              },
              {
                Icon: IconClock,
                title: "Fitting included",
                body: "75–90 minutes, wait-in. Degreased, dry-fitted, bonded and clamped properly.",
              },
              {
                Icon: IconShield,
                title: "Real stock",
                body: "Direct supply means Original and Pro in both lengths, not unpredictable batches.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="surface p-5">
                <span className="grid place-items-center w-10 h-10 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)] mb-4">
                  <Icon width={19} height={19} />
                </span>
                <h3 className="font-semibold text-[15.5px] mb-1.5">{title}</h3>
                <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container-nex py-16 md:py-20">
        <div className="max-w-2xl mb-8">
          <p className="eyebrow mb-3">In stock</p>
          <h2 className="text-display-3 mb-3">Choose your profile</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed">
            Both are genuine EZ Lip USA product. The only real question is how much drop suits how
            you actually use the car.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* Process */}
      {service && (
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="container-nex py-16 md:py-20">
            <div className="max-w-2xl mb-9">
              <p className="eyebrow mb-3">Fitting</p>
              <h2 className="text-display-3 mb-3">How we fit it</h2>
              <p className="text-[var(--fg-muted)] leading-relaxed">
                Ninety minutes, start to finish, and you can wait for it.
              </p>
            </div>

            <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {service.process.map((step, i) => (
                <li key={step.title} className="surface p-5">
                  <span className="block font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--accent)] mb-2.5 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-semibold text-[14.5px] mb-2">{step.title}</h3>
                  <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed">
                    {step.detail}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-8">
              <Link href={`/services/${service.slug}`} className="btn btn-outline">
                Full service detail
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="container-nex py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Questions</p>
          <h2 className="text-display-3 mb-8">EZ Lip, answered</h2>
          <Faq items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-20 text-center">
          <h2 className="text-display-3 mb-3">Send us your bumper.</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed max-w-xl mx-auto mb-7">
            One straight-on photo is all we need to confirm fitment and tell you which profile
            suits your car.
          </p>
          <a
            href={waLink("Hi Nexmod, here's a photo of my front bumper for EZ Lip fitment:")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-lg btn-whatsapp"
          >
            <IconWhatsApp width={18} height={18} />
            WhatsApp {site.contact.phoneDisplay}
          </a>
        </div>
      </section>
    </>
  );
}
