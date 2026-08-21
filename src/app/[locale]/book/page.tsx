import { LocaleLink as Link } from "@/i18n/client";
import { BookingForm } from "@/components/BookingForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CategoryIcon, IconClock, IconMapPin, IconPhone } from "@/components/Icons";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "Book a Fitting at Nexmod Dehiwala",
  description:
    "Book carbon fibre wrapping, EZ Lip fitting, window tinting, car audio, lighting or 360 camera installation at Nexmod, 71 Sri Saranankara Road, Dehiwala. Open six days a week.",
  path: "/book",
  keywords: [
    "book car accessories fitting Sri Lanka",
    "car workshop appointment Colombo",
    "car modification booking Dehiwala",
  ],
    locale,
  });
}

export default function BookPage() {
  const quickJobs = services.filter((s) =>
    ["tyre-lettering", "decals-graphics", "interior-fitting"].includes(s.slug),
  );

  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Book a fitting", path: "/book" }]} />
      </div>

      <section className="container-nex pb-12 md:pb-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div>
            <p className="eyebrow mb-2.5">Booking</p>
            <h1 className="text-4xl md:text-5xl mb-4">Book a slot at the workshop.</h1>
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-8 max-w-2xl">
              Tell us the car, what you want done, and when suits. We will come back to confirm —
              usually within a few hours during opening times.
            </p>

            <BookingForm />
          </div>

          <aside className="space-y-5">
            {/* Visit card */}
            <div className="surface p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
                The workshop
              </h2>
              <ul className="space-y-3.5 text-[13.5px]">
                <li className="flex gap-2.5">
                  <IconMapPin width={15} height={15} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                  <a
                    href={site.address.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent)] leading-snug"
                  >
                    {site.address.street}
                    <br />
                    {site.address.locality} {site.address.postalCode}
                  </a>
                </li>
                <li className="flex gap-2.5">
                  <IconPhone width={15} height={15} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                  <a href={`tel:${site.contact.tel}`} className="hover:text-[var(--accent)]">
                    {site.contact.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-2.5">
                  <IconClock width={15} height={15} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                  <span className="leading-relaxed text-[var(--fg-muted)]">
                    Mon–Thu 10:00–19:00
                    <br />
                    Sat 10:00–19:00
                    <br />
                    Sun 10:30–19:00
                    <br />
                    <span className="text-[var(--fg-subtle)]">Friday closed</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Walk-in card */}
            <div className="surface p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
                No booking needed
              </h2>
              <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed mb-4">
                Quick jobs are walk-in. Turn up during opening hours and we will fit you in.
              </p>
              <ul className="space-y-2">
                {[
                  "Mirror cap wraps — 45 minutes",
                  "Wiper blade replacement — 5 minutes",
                  "Window and sun strip decals — under an hour",
                  "Floor mats and boot liners — minutes",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[13px] text-[var(--fg-muted)]">
                    <span className="shrink-0 w-1.5 h-1.5 mt-1.5 rounded-sm bg-[var(--accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Full-day warning */}
            <div className="surface p-5 border-[var(--accent)]/30 bg-[var(--accent-subtle)]">
              <h2 className="text-[13px] font-bold mb-2">Some jobs take the whole day</h2>
              <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed mb-3">
                Bi-LED retrofits, 360 camera systems, full bonnet wraps and full-car sound
                deadening need the car for a day or more. Please book these ahead rather than
                walking in.
              </p>
              <Link href="/services" className="text-[13px] font-semibold text-[var(--accent)]">
                See timings per service →
              </Link>
            </div>

            {/* Quick job shortcuts */}
            <div className="surface p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
                Popular quick services
              </h2>
              <div className="space-y-2">
                {quickJobs.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors group"
                  >
                    <span className="shrink-0 grid place-items-center w-8 h-8 rounded-md bg-[var(--bg-inset)] text-[var(--accent)]">
                      <CategoryIcon name={s.icon} width={15} height={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold group-hover:text-[var(--accent)] transition-colors truncate">
                        {s.name}
                      </span>
                      <span className="block text-[11.5px] text-[var(--fg-subtle)]">
                        {s.duration}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Map */}
      <section className="border-t border-[var(--border)]">
        <div className="h-[380px] w-full">
          <iframe
            title="Nexmod workshop location — 71 Sri Saranankara Road, Dehiwala"
            src={`https://maps.google.com/maps?q=${site.address.latitude},${site.address.longitude}&z=16&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </>
  );
}
