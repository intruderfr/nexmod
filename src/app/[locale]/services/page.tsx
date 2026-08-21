import { LocaleLink as Link } from "@/i18n/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ServiceCard } from "@/components/Cards";
import { IconCheck, IconWhatsApp } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { serviceCategories, services } from "@/data/services";
import { waLink } from "@/data/site";
import { absoluteUrl, pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "Car Modification & Installation Services",
  description:
    "Carbon fibre wrapping, EZ Lip fitting, window tinting, car audio, sound deadening, lighting, 360 cameras and detailing — all carried out in-house at our Dehiwala workshop, Colombo.",
  path: "/services",
  keywords: [
    "car modification services Sri Lanka",
    "car accessories installation Colombo",
    "car workshop Dehiwala",
    "car wrapping service Sri Lanka",
    "car audio installation Sri Lanka",
  ],
    locale,
  });
}

export default function ServicesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nexmod workshop services",
    numberOfItems: services.length,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/services/${s.slug}`),
      name: s.name,
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Services", path: "/services" }]} />
      </div>

      {/* Hero */}
      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="eyebrow mb-2.5">Workshop</p>
            <h1 className="text-display-2 mb-5">
              Twelve services.
              <br />
              All done in-house.
            </h1>
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-7">
              We do not subcontract. The people who sell you the work are the people who carry it
              out, at 71 Sri Saranankara Road in Dehiwala.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-primary">
                Book a fitting
              </Link>
              <a
                href={waLink("Hi Nexmod, I'd like to ask about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <IconWhatsApp width={17} height={17} />
                Ask a question
              </a>
            </div>
          </div>

          <div className="surface carbon-texture p-6 md:p-7">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
              How we work
            </h2>
            <ul className="space-y-3.5">
              {[
                "We tell you honestly when something is not worth doing on your car.",
                "Bonded not bolted, plug-and-play not cut looms — reversible wherever possible.",
                "We do the unglamorous steps other shops skip, and every service page explains which.",
                "Everything is warrantied, and we fix our own work without argument.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <IconCheck
                    width={16}
                    height={16}
                    className="shrink-0 mt-0.5 text-[var(--accent)]"
                  />
                  <span className="text-[14px] text-[var(--fg-muted)] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Grouped by discipline */}
      {serviceCategories.map((group) => {
        const groupServices = services.filter((s) => s.category === group.id);
        if (groupServices.length === 0) return null;

        return (
          <section key={group.id} className="container-nex py-12 md:py-16 border-b border-[var(--border)] last:border-0">
            <div className="mb-7">
              <h2 className="text-heading mb-2">{group.label}</h2>
              <p className="text-[var(--fg-muted)]">{group.blurb}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
              {groupServices.map((s) => (
                <ServiceCard key={s.slug} service={s} />
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-20 text-center">
          <h2 className="text-display-3 mb-3">Not sure what your car needs?</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed max-w-xl mx-auto mb-7">
            Send us a photo and tell us what bothers you about the car. We will tell you what we
            would do first, and what we would leave alone.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={waLink("Hi Nexmod, here's my car. What would you recommend?")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-whatsapp"
            >
              <IconWhatsApp width={18} height={18} />
              Send a photo
            </a>
            <Link href="/book" className="btn btn-lg btn-outline">
              Book a slot
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
