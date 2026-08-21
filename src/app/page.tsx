import Link from "next/link";
import { ArticleCard, CategoryCard, ProductCard, ServiceCard } from "@/components/Cards";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import {
  IconArrowRight,
  IconCheck,
  IconClock,
  IconMapPin,
  IconShield,
  IconStar,
  IconTool,
  IconTruck,
  IconWhatsApp,
} from "@/components/Icons";
import { SectionHead } from "@/components/SectionHead";
import { categories } from "@/data/categories";
import { featuredProducts, productsInCategory } from "@/data/products";
import { featuredServices } from "@/data/services";
import { lkr, site, waLink } from "@/data/site";
import { featuredArticles } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Premium Car Accessories Sri Lanka",
  description:
    "Nexmod, Dehiwala — carbon fibre wraps, EZ Lip, spoilers, tyre stickers, lighting, car audio and 360 cameras. Supplied and professionally fitted. Official EZ Lip Sri Lanka agent. 4.5★, 94 reviews.",
  path: "/",
  keywords: [
    "car accessories Sri Lanka",
    "car accessories Dehiwala",
    "carbon fibre wrap Sri Lanka",
    "EZ Lip Sri Lanka",
    "car modification Colombo",
    "tyre stickers Sri Lanka",
    "premium car accessories",
  ],
});

export default function HomePage() {
  const products = featuredProducts(8);
  const services = featuredServices(6);
  const articles = featuredArticles(4);

  return (
    <>
      {/* ============================================================== HERO */}
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <HeroAtmosphere />
        <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
        <div className="absolute inset-0 carbon-texture opacity-30" aria-hidden="true" />
        {/* Grounds the type against the light field */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to right, var(--bg) 0%, color-mix(in srgb, var(--bg) 72%, transparent) 44%, transparent 78%)",
          }}
        />

        <div className="container-nex relative">
          <div className="min-h-[80vh] lg:min-h-[86vh] flex flex-col justify-center py-20 lg:py-24">
            <div className="max-w-[54rem]">
              <p className="eyebrow mb-8 animate-fade-in">
                Dehiwala · Colombo · Since {site.founded}
              </p>

              <h1
                className="text-[clamp(2.75rem,8vw,6.25rem)] leading-[0.94] mb-8 animate-fade-up"
                style={{ animationDelay: "60ms" }}
              >
                Premium car accessories,
                <br />
                <span className="text-[var(--accent)]">properly fitted.</span>
              </h1>

              <p
                className="text-lg md:text-xl text-[var(--fg-muted)] leading-relaxed max-w-2xl mb-10 animate-fade-up"
                style={{ animationDelay: "140ms" }}
              >
                Carbon fibre, EZ Lip, spoilers, tyre lettering, lighting, audio and 360 cameras —
                supplied and installed in-house at our Dehiwala workshop. We will tell you honestly
                what is worth doing, and what is not.
              </p>

              <div
                className="flex flex-wrap gap-3 animate-fade-up"
                style={{ animationDelay: "220ms" }}
              >
                <a
                  href={waLink("Hi Nexmod, I'd like a quote. Here's a photo of my car:")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg btn-primary"
                >
                  <IconWhatsApp width={18} height={18} />
                  Get a quote
                </a>
                <Link href="/products" className="btn btn-lg btn-outline">
                  Shop products
                  <IconArrowRight width={17} height={17} />
                </Link>
              </div>
            </div>
          </div>

          {/* Proof strip, seated on the hairline at the base of the hero.
              A 1px gap over a border-coloured ground draws the dividers, so
              every cell keeps identical padding on all four sides — no text
              ever sits flush against a rule. */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border-t border-[var(--border)] animate-fade-in"
            style={{ animationDelay: "320ms" }}
          >
            {[
              {
                Icon: IconStar,
                value: `${site.rating.value} / 5`,
                label: `${site.rating.count} Google reviews`,
              },
              { Icon: IconShield, value: "Official", label: "EZ Lip Sri Lanka agent" },
              { Icon: IconTool, value: "In-house", label: "Nothing subcontracted" },
              {
                Icon: IconTruck,
                value: "Islandwide",
                label: `Free over ${lkr(site.delivery.freeThreshold)}`,
              },
            ].map(({ Icon, value, label }) => (
              <div key={label} className="bg-[var(--bg)] px-5 py-7 first:pl-0">
                <Icon width={16} height={16} className="text-[var(--accent)] mb-3.5" />
                <p className="font-[family-name:var(--font-display)] font-bold text-lg leading-none mb-2">
                  {value}
                </p>
                <p className="text-[12.5px] text-[var(--fg-subtle)] leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== CATEGORIES */}
      <section className="container-nex py-16 md:py-20">
        <SectionHead
          eyebrow="Shop"
          title="Browse by category"
          action={{ href: "/products", label: "All products" }}
        />

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          data-reveal-group
        >
          {categories.slice(0, 5).map((c) => (
            <div key={c.slug} data-reveal>
              <CategoryCard
                slug={c.slug}
                name={c.name}
                tagline={c.tagline}
                icon={c.icon}
                count={productsInCategory(c.slug).length}
              />
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================== EZ LIP */}
      <section className="relative isolate overflow-hidden border-y border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="absolute inset-0 carbon-texture opacity-60" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(60% 80% at 15% 50%, var(--accent-subtle), transparent 70%)",
          }}
        />

        <div className="container-nex relative py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div data-reveal>
              <p className="eyebrow mb-5">Exclusive to Nexmod</p>
              <h2 className="text-[clamp(2rem,4.4vw,3.25rem)] mb-6 max-w-lg">
                Sri Lanka&rsquo;s only authorised EZ Lip agent.
              </h2>
              <p className="text-[var(--fg-muted)] text-lg leading-relaxed mb-8 max-w-lg">
                A flexible universal front lip, made in the USA. It drops your visual ride height by
                up to 40mm and — unlike a rigid fibreglass lip — it survives the speed bumps and
                hotel ramps that shatter the alternatives.
              </p>

              <ul className="space-y-3 mb-9">
                {[
                  "Genuine product in factory packaging, with local warranty",
                  "No cutting, no drilling, no bumper removal",
                  "Fitted in 90 minutes — you can wait for it",
                  "Fully removable, paint left intact",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <IconCheck
                      width={16}
                      height={16}
                      className="shrink-0 mt-1 text-[var(--accent)]"
                    />
                    <span className="text-[15px] text-[var(--fg-muted)] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link href="/ez-lip" className="btn btn-primary">
                  About EZ Lip Sri Lanka
                </Link>
                <Link href="/products/ez-lip-pro-universal-front-lip" className="btn btn-outline">
                  Shop EZ Lip Pro
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4" data-reveal-group>
              {productsInCategory("ez-lip").map((p) => (
                <div key={p.slug} data-reveal>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= SERVICES */}
      <section className="container-nex py-16 md:py-20">
        <SectionHead
          eyebrow="Workshop"
          title="Services, done properly"
          lede="Twelve disciplines, all carried out in-house at Dehiwala. Every service page explains exactly what we do, in what order, and why the steps other shops skip actually matter."
          action={{ href: "/services", label: "All 12 services" }}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal-group>
          {services.map((s) => (
            <div key={s.slug} data-reveal>
              <ServiceCard service={s} />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= PRODUCTS */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-20">
          <SectionHead
            eyebrow="Best sellers"
            title="What people are fitting"
            action={{ href: "/products", label: "Shop all" }}
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5" data-reveal-group>
            {products.map((p) => (
              <div key={p.slug} data-reveal>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== PROCESS */}
      <section className="container-nex py-16 md:py-20">
        <SectionHead
          eyebrow="How it works"
          title="From photo to fitted"
          lede="Most jobs start with a photo on WhatsApp and finish the same day you book."
        />

        {/* Genuinely a sequence, so it is genuinely numbered. */}
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden" data-reveal-group>
          {[
            {
              n: "01",
              title: "Send a photo",
              body: "WhatsApp us a photo of your car and tell us what you have in mind. We reply with what will fit and what it costs.",
            },
            {
              n: "02",
              title: "Get an honest answer",
              body: "If something is not worth doing on your car, we will say so. We would rather lose one job than sell you the wrong thing.",
            },
            {
              n: "03",
              title: "Book a slot",
              body: "Pick a day that suits. Quick jobs are wait-in; bigger work takes the car for a day. We are open six days a week.",
            },
            {
              n: "04",
              title: "Fitted and checked",
              body: "We walk the car with you before you leave, explain the aftercare, and back the work with a warranty.",
            },
          ].map((step) => (
            <li key={step.n} className="bg-[var(--bg-raised)] p-7" data-reveal>
              <span className="step-marker block mb-6">{step.n}</span>
              <h3 className="text-lg mb-2.5">{step.title}</h3>
              <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ========================================================= ARTICLES */}
      <section className="border-t border-[var(--border)]">
        <div className="container-nex py-16 md:py-20">
          <SectionHead
            eyebrow="Articles & news"
            title="Know before you spend"
            lede="Honest guides to what things cost, how long they last, and which upgrades are worth your money in Sri Lankan conditions."
            action={{ href: "/articles", label: "All articles" }}
          />

          {articles.length > 0 && (
            <div className="space-y-5">
              <div data-reveal>
                <ArticleCard article={articles[0]} featured />
              </div>
              <div className="grid sm:grid-cols-3 gap-5" data-reveal-group>
                {articles.slice(1, 4).map((a) => (
                  <div key={a.slug} data-reveal>
                    <ArticleCard article={a} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ VISIT */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-14">
            <div data-reveal>
              <p className="eyebrow mb-5">Find us</p>
              <h2 className="text-[clamp(2rem,4.4vw,3.25rem)] mb-5">
                71 Sri Saranankara Road,
                <br />
                Dehiwala.
              </h2>
              <p className="text-[var(--fg-muted)] text-lg leading-relaxed mb-10 max-w-md">
                Walk in for quick jobs — mirror caps, wipers, tyre lettering. Book ahead for
                anything that takes the car for a day.
              </p>

              <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-7 mb-10">
                <div>
                  <dt className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] mb-2.5">
                    Opening hours
                  </dt>
                  <dd className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed">
                    Mon–Thu 10:00–19:00
                    <br />
                    Sat 10:00–19:00
                    <br />
                    Sun 10:30–19:00
                    <br />
                    <span className="text-[var(--fg-faint)]">Friday closed</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] mb-2.5">
                    Contact
                  </dt>
                  <dd className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed">
                    <a
                      href={`tel:${site.contact.tel}`}
                      className="figure hover:text-[var(--accent)] transition-colors"
                    >
                      {site.contact.phoneDisplay}
                    </a>
                    <br />
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="hover:text-[var(--accent)] break-all transition-colors"
                    >
                      {site.contact.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap gap-3">
                <a
                  href={site.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <IconMapPin width={16} height={16} />
                  Open in Google Maps
                </a>
                <Link href="/book" className="btn btn-outline">
                  <IconClock width={16} height={16} />
                  Book a fitting
                </Link>
              </div>
            </div>

            <div className="surface overflow-hidden min-h-[360px]" data-reveal>
              <iframe
                title="Nexmod location map — 71 Sri Saranankara Road, Dehiwala"
                src={`https://maps.google.com/maps?q=${site.address.latitude},${site.address.longitude}&z=16&output=embed`}
                className="w-full h-full min-h-[360px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
