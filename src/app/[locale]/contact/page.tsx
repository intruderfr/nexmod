import { LocaleLink as Link } from "@/i18n/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconTikTok,
  IconWhatsApp,
} from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { site, waLink } from "@/data/site";
import { absoluteUrl, pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "Contact Nexmod — Dehiwala, Colombo",
  description:
    "Visit Nexmod at 71 Sri Saranankara Road, Dehiwala, or call 075 774 0404. Open Mon–Thu and Sat 10:00–19:00, Sunday 10:30–19:00. Friday closed.",
  path: "/contact",
  keywords: [
    "Nexmod contact",
    "car accessories shop Dehiwala address",
    "Nexmod phone number",
    "car accessories near me Colombo",
  ],
    locale,
  });
}

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Nexmod",
    url: absoluteUrl("/contact"),
    mainEntity: {
      "@type": "Organization",
      name: site.name,
      telephone: site.contact.phoneIntl,
      email: site.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.locality,
        postalCode: site.address.postalCode,
        addressCountry: site.address.countryCode,
      },
    },
  };

  return (
    <>
      <JsonLd data={contactSchema} />

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Contact", path: "/contact" }]} />
      </div>

      <section className="container-nex pb-12 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <p className="eyebrow mb-2.5">Contact</p>
            <h1 className="text-display-2 mb-5">Come and see us.</h1>
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-9 max-w-lg">
              We are on Sri Saranankara Road in Dehiwala, open six days a week. Walk in for quick
              jobs, or send a photo on WhatsApp first and we will tell you what your car needs.
            </p>

            {/* Primary contact methods */}
            <div className="grid sm:grid-cols-2 gap-4 mb-9">
              <a
                href={waLink("Hi Nexmod, I'd like to ask about my car.")}
                target="_blank"
                rel="noopener noreferrer"
                className="surface surface-hover p-5 group"
              >
                <span className="grid place-items-center w-10 h-10 rounded-md bg-[#25d366]/12 text-[#25d366] mb-3.5">
                  <IconWhatsApp width={19} height={19} />
                </span>
                <span className="block font-semibold text-[15px] mb-1 group-hover:text-[var(--accent)] transition-colors">
                  WhatsApp
                </span>
                <span className="block text-[13px] text-[var(--fg-muted)] leading-relaxed">
                  Fastest way to reach us. Send a photo and we usually reply within minutes during
                  opening hours.
                </span>
              </a>

              <a href={`tel:${site.contact.tel}`} className="surface surface-hover p-5 group">
                <span className="grid place-items-center w-10 h-10 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)] mb-3.5">
                  <IconPhone width={19} height={19} />
                </span>
                <span className="block font-semibold text-[15px] mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {site.contact.phoneDisplay}
                </span>
                <span className="block text-[13px] text-[var(--fg-muted)] leading-relaxed">
                  Call during opening hours to check stock or availability for today.
                </span>
              </a>
            </div>

            {/* Details */}
            <dl className="space-y-6">
              <div className="flex gap-3.5">
                <IconMapPin width={18} height={18} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-1.5">
                    Address
                  </dt>
                  <dd className="text-[15px] leading-relaxed">
                    {site.address.street}
                    <br />
                    {site.address.locality}-Mount Lavinia {site.address.postalCode}
                    <br />
                    {site.address.country}
                    <br />
                    <a
                      href={site.address.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-[14px] font-semibold text-[var(--accent)]"
                    >
                      Get directions →
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex gap-3.5">
                <IconClock width={18} height={18} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-1.5">
                    Opening hours
                  </dt>
                  <dd>
                    <table className="text-[14px]">
                      <tbody>
                        {site.hours.map((h) => (
                          <tr key={h.day}>
                            <th scope="row" className="text-left font-medium pr-8 py-0.5">
                              {h.day}
                            </th>
                            <td
                              className={`py-0.5 tabular-nums ${
                                h.opens ? "text-[var(--fg-muted)]" : "text-[var(--fg-subtle)]"
                              }`}
                            >
                              {h.opens ? `${h.opens} – ${h.closes}` : "Closed"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </dd>
                </div>
              </div>

              <div className="flex gap-3.5">
                <IconMail width={18} height={18} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-1.5">
                    Email
                  </dt>
                  <dd className="text-[15px]">
                    <a href={`mailto:${site.contact.email}`} className="hover:text-[var(--accent)]">
                      {site.contact.email}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            {/* Social */}
            <div className="mt-9 pt-8 border-t border-[var(--border)]">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
                See our work
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { href: site.social.instagram, Icon: IconInstagram, label: "Instagram" },
                  { href: site.social.facebook, Icon: IconFacebook, label: "Facebook" },
                  { href: site.social.tiktok, Icon: IconTikTok, label: "TikTok" },
                ].map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] text-[14px] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    <Icon width={16} height={16} />
                    {label}
                  </a>
                ))}
              </div>
              <p className="text-[13px] text-[var(--fg-subtle)] mt-3 leading-relaxed">
                We post finished builds most days — it is the fastest way to see what a job actually
                looks like on a car like yours.
              </p>
            </div>
          </div>

          {/* Map + booking */}
          <div className="space-y-5">
            <div className="surface overflow-hidden">
              <iframe
                title="Nexmod location map — 71 Sri Saranankara Road, Dehiwala"
                src={`https://maps.google.com/maps?q=${site.address.latitude},${site.address.longitude}&z=16&output=embed`}
                className="w-full h-[420px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>

            <div className="surface p-6">
              <h2 className="text-lg mb-2">Booking a bigger job?</h2>
              <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed mb-4">
                Bi-LED retrofits, 360 camera systems, full bonnet wraps and full-car sound deadening
                take the car for a day or more. Book those ahead so we can hold a bay for you.
              </p>
              <Link href="/book" className="btn btn-primary w-full">
                Book a fitting
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
