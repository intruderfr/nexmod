"use client";

import { LocaleLink as Link, useDictionary } from "@/i18n/client";
import { usePathname } from "next/navigation";
import { stripLocale } from "@/i18n/config";
import { useEffect, useState } from "react";
import { categories } from "@/data/categories";
import { services, serviceCategories } from "@/data/services";
import { site } from "@/data/site";
import { useCart } from "@/lib/cart";
import {
  CategoryIcon,
  IconCart,
  IconChevronDown,
  IconClose,
  IconMenu,
  IconPhone,
  IconWhatsApp,
} from "./Icons";
import { CommandPalette } from "./CommandPalette";
import { GarageMenu } from "./GarageMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const dict = useDictionary();

  const nav = [
    { label: dict.nav.products, href: "/products", mega: "products" as const },
    { label: dict.nav.services, href: "/services", mega: "services" as const },
    { label: dict.nav.ezLip, href: "/ez-lip" },
    { label: dict.nav.build, href: "/build" },
    { label: dict.nav.articles, href: "/articles" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  const { totals, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mega, setMega] = useState<"products" | "services" | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close every overlay on navigation.
  useEffect(() => {
    setMobileOpen(false);
    setMega(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMega(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // pathname includes the locale prefix (/si/products); nav hrefs do not.
  const path = stripLocale(pathname ?? "/").path;
  const isActive = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href);

  return (
    <>
      {/* Announcement bar — the single strongest differentiator gets top billing */}
      <div className="hidden md:block bg-[var(--fg)] text-[var(--bg)] text-xs">
        <div className="container-nex flex items-center justify-between h-9">
          <p className="font-medium">
{dict.nav.announcement}
          </p>
          <div className="flex items-center gap-5">
            <a href={`tel:${site.contact.tel}`} className="inline-flex items-center gap-1.5 hover:opacity-70">
              <IconPhone width={13} height={13} />
              {site.contact.phoneDisplay}
            </a>
            <span className="opacity-60">{site.address.locality}, Colombo</span>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--bg)]/85 backdrop-blur-xl border-b border-[var(--border)]"
            : "bg-transparent border-b border-transparent"
        }`}
        onMouseLeave={() => setMega(null)}
      >
        <div className="container-nex">
          <div className="flex items-center justify-between h-16 lg:h-[70px]">
            {/* Wordmark */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Nexmod home">
              <span className="relative grid place-items-center w-9 h-9 rounded-md bg-[var(--fg)] text-[var(--bg)] overflow-hidden">
                <span className="font-[family-name:var(--font-display)] font-extrabold text-[15px] leading-none">
                  N
                </span>
                <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--accent)]" />
              </span>
              <span className="leading-none">
                <span className="block font-[family-name:var(--font-display)] font-extrabold tracking-tight text-[19px]">
                  NEXMOD
                </span>
                <span className="block text-[9.5px] tracking-[0.18em] uppercase text-[var(--fg-subtle)] mt-0.5">
                  Premium Car Accessories
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5" aria-label="Main">
              {nav.map((item) => (
                <div key={item.href} onMouseEnter={() => setMega(item.mega ?? null)}>
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-md text-[14.5px] font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-[var(--fg)]"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                    aria-expanded={item.mega ? mega === item.mega : undefined}
                  >
                    {item.label}
                    {item.mega && (
                      <IconChevronDown
                        width={13}
                        height={13}
                        className={`transition-transform duration-200 ${
                          mega === item.mega ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5">
              <CommandPalette />
              <GarageMenu />

              <LanguageSwitcher />

              <ThemeToggle />

              <a
                href={`https://wa.me/${site.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex btn btn-sm btn-whatsapp"
              >
                <IconWhatsApp width={15} height={15} />
                WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative grid place-items-center w-10 h-10 rounded-md text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-inset)] transition-colors"
                aria-label={`Cart, ${totals.itemCount} items`}
              >
                <IconCart width={19} height={19} />
                {totals.itemCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[17px] h-[17px] px-1 grid place-items-center rounded-full bg-[var(--accent)] text-white text-[10px] font-bold tabular-nums">
                    {totals.itemCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden grid place-items-center w-10 h-10 rounded-md text-[var(--fg-muted)] hover:text-[var(--fg)]"
                aria-label={dict.nav.openMenu}
              >
                <IconMenu />
              </button>
            </div>
          </div>
        </div>

        {/* Mega menu */}
        {mega && (
          <div className="hidden lg:block absolute inset-x-0 top-full bg-[var(--bg-raised)] border-y border-[var(--border)] shadow-2xl animate-fade-in">
            <div className="container-nex py-8">
              {mega === "products" ? (
                <div className="grid grid-cols-4 gap-x-8 gap-y-1">
                  <div className="col-span-1 pr-8 border-r border-[var(--border)]">
                    <p className="eyebrow mb-3">{dict.home.shopEyebrow}</p>
                    <h3 className="text-xl mb-2">{dict.nav.everyCategory}</h3>
                    <p className="text-sm text-[var(--fg-muted)] mb-5 leading-relaxed">
                      {dict.nav.megaProducts}
                    </p>
                    <Link href="/products" className="btn btn-sm btn-outline">
                      {dict.nav.allProducts}
                    </Link>
                  </div>
                  <div className="col-span-3 grid grid-cols-3 gap-1">
                    {categories.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/categories/${c.slug}`}
                        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--bg-inset)] transition-colors"
                      >
                        <span className="shrink-0 grid place-items-center w-9 h-9 rounded-md bg-[var(--bg-inset)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                          <CategoryIcon name={c.icon} width={17} height={17} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{c.name}</span>
                          <span className="block text-xs text-[var(--fg-subtle)] mt-0.5 leading-snug line-clamp-2">
                            {c.tagline}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-x-8">
                  <div className="col-span-1 pr-8 border-r border-[var(--border)]">
                    <p className="eyebrow mb-3">{dict.home.servicesEyebrow}</p>
                    <h3 className="text-xl mb-2">{dict.nav.whatWeDo}</h3>
                    <p className="text-sm text-[var(--fg-muted)] mb-5 leading-relaxed">
                      {dict.nav.megaServices}
                    </p>
                    <Link href="/services" className="btn btn-sm btn-outline">
                      {dict.nav.allServices}
                    </Link>
                  </div>
                  <div className="col-span-3 grid grid-cols-4 gap-x-6">
                    {serviceCategories.map((sc) => (
                      <div key={sc.id}>
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--fg-subtle)] mb-2.5">
                          {sc.label}
                        </p>
                        <ul className="space-y-0.5">
                          {services
                            .filter((s) => s.category === sc.id)
                            .map((s) => (
                              <li key={s.slug}>
                                <Link
                                  href={`/services/${s.slug}`}
                                  className="block py-1.5 text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors leading-snug"
                                >
                                  {s.name}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-[var(--bg)] border-l border-[var(--border)] flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between h-16 px-5 border-b border-[var(--border)] shrink-0">
              <span className="font-[family-name:var(--font-display)] font-extrabold text-lg">
                Menu
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid place-items-center w-10 h-10 rounded-md hover:bg-[var(--bg-inset)]"
                aria-label={dict.nav.closeMenu}
              >
                <IconClose />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav className="space-y-0.5 mb-8" aria-label="Mobile">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block py-3 text-lg font-semibold border-b border-[var(--border)] ${
                      isActive(item.href) ? "text-[var(--accent)]" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <p className="eyebrow mb-3">{dict.nav.shopBy}</p>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border)] text-[13px] font-medium"
                  >
                    <CategoryIcon name={c.icon} width={15} height={15} className="text-[var(--accent)] shrink-0" />
                    <span className="truncate">{c.name}</span>
                  </Link>
                ))}
              </div>

              <div className="space-y-2">
                <a
                  href={`https://wa.me/${site.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp w-full"
                >
                  <IconWhatsApp width={17} height={17} />
                  {dict.actions.whatsappUs}
                </a>
                <a href={`tel:${site.contact.tel}`} className="btn btn-outline w-full">
                  <IconPhone width={16} height={16} />
                  {site.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
