"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/data/categories";
import { productsInCategory } from "@/data/products";
import { serviceCategories, services } from "@/data/services";
import { site } from "@/data/site";
import { categoryImage } from "@/data/imagery";
import { LocaleLink as Link, useDictionary } from "@/i18n/client";
import { stripLocale } from "@/i18n/config";
import { useCart } from "@/lib/cart";
import { CommandPalette } from "./CommandPalette";
import { GarageMenu } from "./GarageMenu";
import {
  CategoryIcon,
  IconArrowRight,
  IconCart,
  IconChevronDown,
  IconClose,
  IconMapPin,
  IconMenu,
  IconPhone,
  IconUser,
  IconWhatsApp,
} from "./Icons";
import { LogoMark, BRAND_RED } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { OpenStatus } from "./OpenStatus";
import { Photo } from "./Photo";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Site header.
 *
 * Three horizontal zones, each with one job:
 *
 *   UTILITY BAR  proof and contact — trust signals, before anyone clicks
 *   MAIN BAR     wordmark, primary navigation, tools, one CTA
 *   MEGA MENU    browse surfaces for the two branching sections
 *
 * The action cluster is grouped and divided rather than a run of seven loose
 * icons: tools (search, garage) | preferences (language, theme) | cart, then
 * the CTA. Every control is the same 36px square so they share one optical
 * line — that alignment is what makes a busy header read as designed rather
 * than accumulated.
 *
 * Primary nav is capped at five. About and Contact sit in the utility bar,
 * because they are destinations people seek out rather than browse.
 */
export function Header() {
  const pathname = usePathname();
  const dict = useDictionary();
  const { totals, setOpen } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mega, setMega] = useState<"products" | "services" | null>(null);
  const closeTimer = useRef<number | null>(null);

  /*
   * `core` items stay in the bar from lg up; the rest appear only from xl.
   *
   * Measured at 1024px the bar has about 451px between the wordmark and the
   * action cluster, and all eight items want 597px. Before this split the
   * overflow was silent — "Build Studio" simply wrapped onto a second line
   * inside a 32px-tall bar, which reads as a rendering fault rather than a
   * design. Below xl the menu button stays put, so nothing becomes
   * unreachable; it just moves into the sheet.
   */
  const nav = [
    { label: dict.nav.products, href: "/products", mega: "products" as const, core: true },
    { label: dict.nav.services, href: "/services", mega: "services" as const, core: true },
    { label: "Packages", href: "/packages", core: true },
    { label: dict.nav.build, href: "/build", core: true },
    { label: "Care", href: "/care", core: true },
    { label: "Advisor", href: "/advisor" },
    { label: "Gallery", href: "/gallery" },
    { label: dict.nav.articles, href: "/articles" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  /**
   * A short close delay stops the panel snapping shut while the pointer
   * crosses the gap between trigger and panel.
   */
  function openMega(which: "products" | "services" | null) {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMega(which);
  }
  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(null), 120);
  }

  const path = stripLocale(pathname ?? "/").path;
  const isActive = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const mobileNav = [
    ...nav,
    { label: dict.nav.ezLip, href: "/ez-lip" },
    { label: "Warranty", href: "/warranty" },
    { label: "My Nexmod", href: "/account" },
    { label: dict.nav.about, href: "/about" },
    { label: dict.nav.contact, href: "/contact" },
  ];

  return (
    <>
      {/* ========================================================= UTILITY */}
      <div className="hidden lg:block border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex">
          <div className="flex items-center justify-between h-8 text-xs text-[var(--fg-muted)]">
            <p className="flex items-center gap-2 min-w-0">
              <span className="w-1 h-1 rounded-sm bg-[var(--accent)] shrink-0" aria-hidden="true" />
              <span className="truncate">
                Official <strong className="font-semibold text-[var(--fg)]">EZ Lip USA</strong>{" "}
                agent for Sri Lanka
              </span>
            </p>

            <div className="flex items-center gap-5 shrink-0">
              <OpenStatus />
              <Divider />
              <Link href="/about" className="hover:text-[var(--fg)] transition-colors">
                {dict.nav.about}
              </Link>
              <Link href="/contact" className="hover:text-[var(--fg)] transition-colors">
                {dict.nav.contact}
              </Link>
              <Divider />
              <a
                href={`tel:${site.contact.tel}`}
                className="inline-flex items-center gap-1.5 font-medium text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
              >
                <IconPhone width={12} height={12} />
                <span className="figure">{site.contact.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ MAIN */}
      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled
            ? "glass border-[var(--border)] shadow-[0_1px_0_0_var(--border),0_8px_24px_-16px_rgba(0,0,0,0.4)]"
            : "bg-[var(--bg)] border-[var(--border)]"
        }`}
        onMouseLeave={scheduleClose}
      >
        <div className="container-nex">
          <div
            className={`flex items-center gap-4 transition-[height] duration-300 ${
              scrolled ? "h-[52px]" : "h-[60px]"
            }`}
          >
            {/* Wordmark */}
            <Link
              href="/"
              /*
                gap-2 rather than gap-2.5: the real monogram is wider than the
                placeholder tile it replaced, which pushed the bar 1px over at
                1280. Two pixels back here is cheaper than shrinking the mark.
              */
              className="flex items-center gap-2 shrink-0"
              aria-label={`${site.name} home`}
            >
              {/*
                The real NM monogram, traced from the company artwork. It
                replaces the placeholder "N" tile that stood in while nobody
                had the actual logo.
              */}
              <LogoMark className="h-[19px] w-auto shrink-0 text-[var(--fg)]" />
              <span className="block leading-none">
                <span className="block font-[family-name:var(--font-display)] font-extrabold tracking-[-0.03em] text-[17px]">
                  NE<span style={{ color: BRAND_RED }}>X</span>MOD
                </span>
                {/*
                  The tagline is set in 8px mono with wide tracking, which makes
                  it about 45px wider than NEXMOD itself — so it, not the brand
                  name, sets the wordmark's width. Between lg and xl that width
                  is the difference between the nav fitting and not, and a
                  strapline is the cheapest thing in the bar to give up.
                */}
                <span className="hidden xl:block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.18em] uppercase text-[var(--fg-subtle)] mt-[2px]">
                  Premium Car Accessories
                </span>
              </span>
            </Link>

            {/* Primary nav */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-2" aria-label="Main">
              {nav.map((item) => (
                <div
                  key={item.href}
                  onMouseEnter={() => openMega(item.mega ?? null)}
                  className={item.core ? undefined : "hidden xl:block"}
                >
                  <Link
                    href={item.href}
                    aria-expanded={item.mega ? mega === item.mega : undefined}
                    className={`inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-[13.5px] font-medium whitespace-nowrap transition-colors ${
                      isActive(item.href)
                        ? "text-[var(--fg)] bg-[var(--bg-inset)]"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-inset)]"
                    }`}
                  >
                    {item.label}
                    {item.mega && (
                      <IconChevronDown
                        width={12}
                        height={12}
                        className={`transition-transform duration-200 ${
                          mega === item.mega ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Actions — grouped, divided, all on one line */}
            <div className="flex items-center gap-0.5 ml-auto shrink-0">
              <CommandPalette />

              {/*
                Desktop-only. A phone header has room for about three targets
                at a thumb-friendly size, and search, cart and menu earn those
                places. Garage, account, language and theme are all reachable
                from the menu sheet, labelled, which is easier to hit than a
                32px icon and easier to understand than one too.
              */}
              <div className="hidden lg:flex items-center gap-0.5">
                <Divider className="mx-2 h-5" />

                <GarageMenu />

                <Link href="/account" aria-label="My Nexmod" className="hdr-btn">
                  <IconUser width={18} height={18} />
                </Link>

                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              <Divider className="mx-2 h-5" />

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`${dict.commerce.cart}, ${totals.itemCount}`}
                className="relative hdr-btn"
              >
                <IconCart width={18} height={18} />
                {totals.itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 grid place-items-center rounded-full bg-[var(--accent)] text-white font-[family-name:var(--font-mono)] text-[10px] font-semibold tabular-nums ring-2 ring-[var(--bg)]">
                    {totals.itemCount}
                  </span>
                )}
              </button>

              <a
                href={`https://wa.me/${site.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden min-[1440px]:inline-flex btn btn-sm btn-whatsapp ml-2.5"
              >
                <IconWhatsApp width={15} height={15} />
                WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label={dict.nav.openMenu}
                className="xl:hidden hdr-btn ml-1"
              >
                <IconMenu width={19} height={19} />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ MEGA */}
        {mega && (
          <div
            onMouseEnter={() => openMega(mega)}
            /*
              Opaque, not glass. This panel covers the top third of the page
              over product cards and headings, and a translucent one leaves
              two sets of text stacked on each other — which is exactly what
              it was doing, because the blur never applied.
            */
            className="hidden lg:block absolute inset-x-0 top-full bg-[var(--bg)] border-b border-[var(--border)] shadow-2xl animate-fade-in"
          >
            <div className="container-nex py-7">
              <div className="grid grid-cols-12 gap-8">
                {/* Featured rail */}
                <div className="col-span-3">
                  {mega === "products" ? (
                    <FeatureCard
                      href="/ez-lip"
                      image="cat-ez-lip"
                      eyebrow="Exclusive"
                      title="EZ Lip Sri Lanka"
                      body="We are the island's only authorised agent."
                    />
                  ) : (
                    <FeatureCard
                      href="/build"
                      image="hero-alt"
                      eyebrow="New"
                      title="Build Studio"
                      body="Upload your car and configure it live."
                    />
                  )}
                </div>

                {/* Panel body */}
                <div className="col-span-9">
                  <div className="flex items-baseline justify-between mb-4">
                    <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                      {mega === "products" ? dict.nav.shopBy : dict.nav.whatWeDo}
                    </p>
                    <Link
                      href={mega === "products" ? "/products" : "/services"}
                      className="group inline-flex items-center gap-1.5 text-[13px] font-semibold hover:text-[var(--accent)] transition-colors"
                    >
                      {mega === "products" ? dict.nav.allProducts : dict.nav.allServices}
                      <IconArrowRight
                        width={13}
                        height={13}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>

                  {mega === "products" ? (
                    <div className="grid grid-cols-5 gap-3">
                      {categories.map((c) => {
                        const photo = categoryImage(c.slug);
                        return (
                          <Link
                            key={c.slug}
                            href={`/categories/${c.slug}`}
                            className="group surface surface-hover overflow-hidden"
                          >
                            {photo ? (
                              <Photo image={photo} ratio="wide" zoom scrim="soft" sizes="12rem" />
                            ) : (
                              <span className="block aspect-[16/10] bg-[var(--bg-inset)]" />
                            )}
                            <span className="flex items-center gap-2 p-2.5">
                              <CategoryIcon
                                name={c.icon}
                                width={14}
                                height={14}
                                className="shrink-0 text-[var(--accent)]"
                              />
                              <span className="min-w-0">
                                <span className="block text-[12.5px] font-semibold truncate group-hover:text-[var(--accent)] transition-colors">
                                  {c.name}
                                </span>
                                <span className="block font-[family-name:var(--font-mono)] text-[10px] text-[var(--fg-subtle)]">
                                  {productsInCategory(c.slug).length}
                                </span>
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-x-6">
                      {serviceCategories.map((sc) => (
                        <div key={sc.id}>
                          <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--accent)] mb-2.5 pb-2 border-b border-[var(--border)]">
                            {sc.label}
                          </p>
                          <ul className="space-y-0.5">
                            {services
                              .filter((s) => s.category === sc.id)
                              .map((s) => (
                                <li key={s.slug}>
                                  <Link
                                    href={`/services/${s.slug}`}
                                    className="group flex items-start gap-2 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
                                  >
                                    <CategoryIcon
                                      name={s.icon}
                                      width={13}
                                      height={13}
                                      className="shrink-0 mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity"
                                    />
                                    <span className="leading-snug">{s.name}</span>
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================== MOBILE */}
      {mobileOpen && (
        <div className="xl:hidden fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-[var(--bg)] border-l border-[var(--border)] flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between gap-2 h-16 px-4 border-b border-[var(--border)] shrink-0">
              <OpenStatus compact />

              <div className="flex items-center gap-0.5 shrink-0">
                <GarageMenu />
                <LanguageSwitcher compact />
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label={dict.nav.closeMenu}
                  className="hdr-btn"
                >
                  <IconClose />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav className="mb-8" aria-label="Mobile">
                <ul className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                  {mobileNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between py-3.5 font-[family-name:var(--font-display)] text-[17px] font-semibold ${
                          isActive(item.href) ? "text-[var(--accent)]" : ""
                        }`}
                      >
                        {item.label}
                        <IconArrowRight width={15} height={15} className="text-[var(--fg-subtle)]" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] mb-3">
                {dict.nav.shopBy}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-8">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-[var(--border)] text-[13px] font-medium"
                  >
                    <CategoryIcon
                      name={c.icon}
                      width={15}
                      height={15}
                      className="text-[var(--accent)] shrink-0"
                    />
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
                  <span className="figure">{site.contact.phoneDisplay}</span>
                </a>
                <a
                  href={site.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost btn-sm w-full"
                >
                  <IconMapPin width={15} height={15} />
                  {site.address.street}, {site.address.locality}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Divider({ className = "" }: { className?: string }) {
  return <span className={`w-px h-3.5 bg-[var(--border)] ${className}`} aria-hidden="true" />;
}

function FeatureCard({
  href,
  image,
  eyebrow,
  title,
  body,
}: {
  href: string;
  image: Parameters<typeof Photo>[0]["image"];
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Link href={href} className="group block surface surface-hover overflow-hidden">
      <Photo image={image} ratio="wide" zoom scrim="bottom" sizes="18rem" />
      <span className="block p-4">
        <span className="eyebrow mb-2">{eyebrow}</span>
        <span className="block font-semibold text-[15px] mb-1 group-hover:text-[var(--accent)] transition-colors">
          {title}
        </span>
        <span className="block text-[12.5px] text-[var(--fg-muted)] leading-snug">{body}</span>
      </span>
    </Link>
  );
}
