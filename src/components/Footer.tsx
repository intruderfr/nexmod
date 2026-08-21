"use client";

import { LocaleLink as Link, useDictionary } from "@/i18n/client";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { site } from "@/data/site";
import {
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconStar,
  IconTikTok,
  IconWhatsApp,
} from "./Icons";

export function Footer() {
  const dict = useDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
      {/* Conversion strip */}
      <div className="border-b border-[var(--border)]">
        <div className="container-nex py-12 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-xl">
              <p className="eyebrow mb-3">{dict.footer.ctaEyebrow}</p>
              <h2 className="text-3xl md:text-4xl mb-3">
                {dict.footer.ctaTitle1}
                <br />
                {dict.footer.ctaTitle2}
              </h2>
              <p className="text-[var(--fg-muted)] leading-relaxed">
{dict.footer.ctaLede}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href={`https://wa.me/${site.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-whatsapp"
              >
                <IconWhatsApp width={18} height={18} />
                {dict.actions.whatsappUs}
              </a>
              <Link href="/book" className="btn btn-lg btn-outline">
                {dict.actions.bookFitting}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-nex py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5" aria-label="Nexmod home">
              <span className="relative grid place-items-center w-9 h-9 rounded-md bg-[var(--fg)] text-[var(--bg)] overflow-hidden">
                <span className="font-[family-name:var(--font-display)] font-extrabold text-[15px] leading-none">
                  N
                </span>
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--accent)]" />
              </span>
              <span className="font-[family-name:var(--font-display)] font-extrabold tracking-tight text-[19px]">
                NEXMOD
              </span>
            </Link>

            <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-5 max-w-xs">
              {dict.footer.blurb} {dict.footer.officialAgent}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-raised)] mb-6">
              <span className="flex text-[var(--color-nex-amber)]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <IconStar key={i} width={13} height={13} />
                ))}
              </span>
              <span className="text-xs font-semibold">
                {site.rating.value}
                <span className="text-[var(--fg-subtle)] font-normal">
                  {" "}
                  · {site.rating.count} {dict.common.googleReviews}
                </span>
              </span>
            </div>

            <div className="flex gap-2">
              {[
                { href: site.social.facebook, Icon: IconFacebook, label: "Facebook" },
                { href: site.social.instagram, Icon: IconInstagram, label: "Instagram" },
                { href: site.social.tiktok, Icon: IconTikTok, label: "TikTok" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Nexmod on ${label}`}
                  className="grid place-items-center w-9 h-9 rounded-md border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                >
                  <Icon width={16} height={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
              {dict.nav.products}
            </h3>
            <ul className="space-y-2.5">
              {categories.slice(0, 7).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="text-[13.5px] font-medium hover:text-[var(--accent)]">
                  All products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
              {dict.nav.services}
            </h3>
            <ul className="space-y-2.5">
              {services.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-[13.5px] font-medium hover:text-[var(--accent)]">
                  All services →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
              {dict.common.company}
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/build", label: dict.nav.build },
                { href: "/gallery", label: "Gallery" },
                { href: "/about", label: dict.nav.about },
                { href: "/ez-lip", label: "EZ Lip Sri Lanka" },
                { href: "/articles", label: dict.nav.articles },
                { href: "/book", label: dict.actions.bookFitting },
                { href: "/contact", label: dict.nav.contact },
                { href: "/faq", label: dict.footer.faqLink },
                { href: "/delivery-returns", label: dict.footer.deliveryLink },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
              {dict.common.visitWorkshop}
            </h3>
            <ul className="space-y-3.5 text-[13.5px] text-[var(--fg-muted)]">
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
                <IconMail width={15} height={15} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                <a href={`mailto:${site.contact.email}`} className="hover:text-[var(--accent)] break-all">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex gap-2.5">
                <IconClock width={15} height={15} className="shrink-0 mt-0.5 text-[var(--accent)]" />
                <span className="leading-snug">
                  Mon–Thu, Sat 10:00–19:00
                  <br />
                  Sun 10:30–19:00
                  <br />
                  <span className="text-[var(--fg-subtle)]">Friday closed</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payments + legal */}
      <div className="border-t border-[var(--border)]">
        <div className="container-nex py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[var(--fg-subtle)] mr-1">
                {dict.common.weAccept}
              </span>
              {site.payments.map((p) => (
                <span key={p.id} className="badge">
                  {p.label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--fg-subtle)]">
              <Link href="/privacy" className="hover:text-[var(--fg)]">
                {dict.footer.privacy}
              </Link>
              <Link href="/terms" className="hover:text-[var(--fg)]">
                {dict.footer.terms}
              </Link>
              <span>
                © {year} {site.legalName}. {dict.footer.rights}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
