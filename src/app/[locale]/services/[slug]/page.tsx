import { LocaleLink as Link } from "@/i18n/client";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/Cards";
import { Faq } from "@/components/Faq";
import {
  CategoryIcon,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconShield,
  IconWhatsApp,
} from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { Visual } from "@/components/Visual";
import { serviceImage } from "@/data/imagery";
import { getProduct } from "@/data/products";
import { getService, services } from "@/data/services";
import { lkr, waLink } from "@/data/site";
import { clampDescription, pageMeta } from "@/lib/seo";
import { faqSchema, serviceSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const service = getService(slug);
  if (!service) return {};

  return pageMeta({
    title: `${service.name} Sri Lanka`,
    description: clampDescription(`${service.tagline} ${service.body[0] ?? ""}`),
    path: `/services/${service.slug}`,
    keywords: service.keywords,
    locale,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const photo = serviceImage(service.slug);

  const related = (service.relatedProducts ?? [])
    .map(getProduct)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const alsoServices = (service.relatedServices ?? [])
    .map(getService)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const booking = waLink(
    `Hi Nexmod, I'd like to book ${service.name.toLowerCase()} for my car. When do you have a slot?`,
  );

  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={faqSchema(service.faqs)} />

      {photo && (
        <div className="relative isolate border-b border-[var(--border)]">
          <Photo
            image={photo}
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
                "linear-gradient(105deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 88%, transparent) 42%, color-mix(in srgb, var(--bg) 35%, transparent) 100%)",
            }}
          />
          <div className="container-nex relative pt-6 pb-16 md:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Services", path: "/services" },
                { name: service.name, path: `/services/${service.slug}` },
              ]}
            />
          </div>
        </div>
      )}

      {!photo && (
        <div className="container-nex pt-6 pb-4">
          <Breadcrumbs
            trail={[
              { name: "Services", path: "/services" },
              { name: service.name, path: `/services/${service.slug}` },
            ]}
          />
        </div>
      )}

      {/* ======================================================== HERO */}
      <section className="container-nex pt-10 md:pt-14 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="grid place-items-center w-11 h-11 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)]">
                <CategoryIcon name={service.icon} width={22} height={22} />
              </span>
              <span className="badge capitalize">{service.category}</span>
            </div>

            <h1 className="text-4xl md:text-5xl mb-4">{service.name}</h1>
            <p className="text-xl text-[var(--fg-muted)] leading-relaxed mb-8 max-w-2xl">
              {service.tagline}
            </p>

            <div className="prose-nex max-w-2xl">
              {service.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Booking card */}
          <aside>
            <div className="surface p-6 sticky top-24">
              {service.fromPrice && (
                <>
                  <span className="block text-[11px] uppercase tracking-wider text-[var(--fg-subtle)] mb-1">
                    Starting from
                  </span>
                  <span className="block text-3xl font-bold tabular-nums leading-none mb-2">
                    {lkr(service.fromPrice)}
                  </span>
                </>
              )}
              {service.priceNote && (
                <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed mb-5">
                  {service.priceNote}
                </p>
              )}

              <dl className="space-y-3 pb-5 mb-5 border-b border-[var(--border)]">
                <div className="flex items-start gap-2.5">
                  <IconClock width={15} height={15} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                  <div>
                    <dt className="text-[11px] uppercase tracking-wider text-[var(--fg-subtle)]">
                      Time needed
                    </dt>
                    <dd className="text-[13.5px] font-medium">{service.duration}</dd>
                  </div>
                </div>
                {service.warranty && (
                  <div className="flex items-start gap-2.5">
                    <IconShield width={15} height={15} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider text-[var(--fg-subtle)]">
                        Warranty
                      </dt>
                      <dd className="text-[13.5px] font-medium leading-snug">{service.warranty}</dd>
                    </div>
                  </div>
                )}
              </dl>

              <div className="space-y-2">
                <Link href="/book" className="btn btn-primary w-full">
                  Book this service
                </Link>
                <a
                  href={booking}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp w-full"
                >
                  <IconWhatsApp width={17} height={17} />
                  Ask for a quote
                </a>
              </div>

              <p className="text-[11.5px] text-[var(--fg-subtle)] text-center mt-3.5 leading-relaxed">
                Open Mon–Thu &amp; Sat 10:00–19:00, Sun 10:30–19:00. Friday closed.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* =================================================== INCLUDES */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-20">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12">
            <div>
              <p className="eyebrow mb-3">Included as standard</p>
              <h2 className="text-2xl md:text-3xl mb-6">What you actually get</h2>
              <ul className="space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <IconCheck
                      width={17}
                      height={17}
                      className="shrink-0 mt-0.5 text-[var(--accent)]"
                    />
                    <span className="text-[15px] text-[var(--fg-muted)] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {service.suitableFor && service.suitableFor.length > 0 && (
              <div>
                <p className="eyebrow mb-3">Suitable for</p>
                <h2 className="text-2xl md:text-3xl mb-6">When this is the right job</h2>
                <ul className="space-y-2.5">
                  {service.suitableFor.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 p-3.5 rounded-lg border border-[var(--border)] bg-[var(--bg-raised)]"
                    >
                      <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-sm bg-[var(--accent)]" />
                      <span className="text-[14.5px] leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================== PROCESS */}
      <section className="container-nex py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-3">The process</p>
          <h2 className="text-3xl md:text-4xl mb-3">Step by step, start to finish</h2>
          <p className="text-[var(--fg-muted)] leading-relaxed">
            We publish this because the steps most shops skip are invisible at handover — and they
            are exactly the steps that decide whether the work lasts.
          </p>
        </div>

        <ol className="relative border-l-2 border-[var(--border)] ml-4 md:ml-6 space-y-8">
          {service.process.map((step, i) => (
            <li key={step.title} className="relative pl-8 md:pl-10">
              <span className="absolute -left-[calc(0.75rem+1px)] top-0 grid place-items-center w-6 h-6 rounded-full bg-[var(--accent)] text-white text-[11px] font-bold tabular-nums">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold mb-1.5">{step.title}</h3>
              <p className="text-[15px] text-[var(--fg-muted)] leading-relaxed max-w-2xl">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ====================================================== SPECS */}
      {service.specs && service.specs.length > 0 && (
        <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="container-nex py-16 md:py-20">
            <h2 className="text-2xl md:text-3xl mb-7">Technical detail</h2>
            <dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 max-w-5xl">
              {service.specs.map((spec) => (
                <div key={spec.label} className="pb-4 border-b border-[var(--border)]">
                  <dt className="text-[11.5px] uppercase tracking-wider text-[var(--fg-subtle)] mb-1">
                    {spec.label}
                  </dt>
                  <dd className="text-[14.5px] font-medium leading-snug">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {/* =================================================== AFTERCARE */}
      {service.aftercare && service.aftercare.length > 0 && (
        <section className="container-nex py-16 md:py-20">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">
            <div>
              <p className="eyebrow mb-3">Looking after it</p>
              <h2 className="text-2xl md:text-3xl mb-3">Aftercare</h2>
              <p className="text-[var(--fg-muted)] leading-relaxed">
                We go through this with you at handover too. Following it is most of what decides
                how long the work lasts.
              </p>
            </div>
            <ul className="space-y-2.5">
              {service.aftercare.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="shrink-0 grid place-items-center w-5 h-5 mt-0.5 rounded-full border border-[var(--accent)] text-[var(--accent)]">
                    <IconCheck width={11} height={11} strokeWidth={2.5} />
                  </span>
                  <span className="text-[15px] text-[var(--fg-muted)] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ======================================================== FAQ */}
      <section className="border-t border-[var(--border)]">
        <div className="container-nex py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">Questions</p>
            <h2 className="text-2xl md:text-3xl mb-7">
              What people ask about {service.name.toLowerCase()}
            </h2>
            <Faq items={service.faqs} />
          </div>
        </div>
      </section>

      {/* =================================================== PRODUCTS */}
      {related.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="container-nex py-16 md:py-20">
            <h2 className="text-2xl md:text-3xl mb-2">Products we use for this</h2>
            <p className="text-[var(--fg-muted)] mb-7">
              Buy the part with fitting included, or just the part for islandwide delivery.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ OTHER SERVICES */}
      {alsoServices.length > 0 && (
        <section className="border-t border-[var(--border)]">
          <div className="container-nex py-16 md:py-20">
            <h2 className="text-2xl md:text-3xl mb-7">Often done at the same time</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alsoServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="surface surface-hover overflow-hidden group"
                >
                  <Visual variant={s.category} icon={s.icon} ratio="wide" />
                  <div className="p-5">
                    <h3 className="flex items-center gap-1.5 font-semibold text-[15.5px] mb-1.5 group-hover:text-[var(--accent)] transition-colors">
                      {s.name}
                      <IconArrowRight
                        width={14}
                        height={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </h3>
                    <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
                      {s.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
