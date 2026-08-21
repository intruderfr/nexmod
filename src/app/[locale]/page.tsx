import { LocaleLink as Link } from "@/i18n/client";
import { ArticleCard, CategoryCard, ProductCard, ServiceCard } from "@/components/Cards";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import { Photo } from "@/components/Photo";
import { galleryImages } from "@/data/imagery";
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
import { getDictionary } from "@/i18n";
import { categoryName, categoryTagline } from "@/i18n/content";
import { isLocale, type Locale } from "@/i18n/config";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
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
    locale,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";
  const dict = getDictionary(locale);

  const products = featuredProducts(8);
  const services = featuredServices(6);
  const articles = featuredArticles(4);

  return (
    <>
      {/* ============================================================== HERO */}
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        {/* Photograph first, then the light field over it, then a gradient that
            keeps the left-hand column readable at every viewport width. */}
        <Photo
          image="hero-main"
          ratio="free"
          priority
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <HeroAtmosphere className="mix-blend-screen opacity-70" />
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(100deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 92%, transparent) 34%, color-mix(in srgb, var(--bg) 55%, transparent) 60%, color-mix(in srgb, var(--bg) 20%, transparent) 100%)",
          }}
        />

        <div className="container-nex relative">
          <div className="min-h-[80vh] lg:min-h-[86vh] flex flex-col justify-center py-20 lg:py-24">
            <div className="max-w-[54rem]">
              <p className="eyebrow mb-5 animate-fade-in">
                {dict.home.since} {site.founded}
              </p>

              <h1
                className="text-display-1 mb-6 animate-fade-up"
                style={{ animationDelay: "60ms" }}
              >
                {dict.home.heroTitle1}
                <br />
                <span className="text-[var(--accent)]">{dict.home.heroTitle2}</span>
              </h1>

              <p
                className="text-lg md:text-xl text-[var(--fg-muted)] leading-relaxed max-w-2xl mb-8 animate-fade-up"
                style={{ animationDelay: "140ms" }}
              >
                {dict.home.heroLede}
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
                  {dict.actions.getQuote}
                </a>
                <Link href="/products" className="btn btn-lg btn-outline">
                  {dict.actions.shopProducts}
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
                label: `${site.rating.count} ${dict.common.googleReviews}`,
              },
              { Icon: IconShield, value: dict.home.proofOfficial, label: dict.home.proofAgent },
              { Icon: IconTool, value: dict.home.proofInHouse, label: dict.home.proofSubcontract },
              {
                Icon: IconTruck,
                value: dict.home.proofIslandwide,
                label: `${dict.home.proofFreeOver} ${lkr(site.delivery.freeThreshold)}`,
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
          eyebrow={dict.home.shopEyebrow}
          title={dict.home.shopTitle}
          action={{ href: "/products", label: dict.nav.allProducts }}
        />

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          data-reveal-group
        >
          {categories.slice(0, 5).map((c) => (
            <div key={c.slug} data-reveal>
              <CategoryCard
                slug={c.slug}
                name={categoryName(c.slug, locale, c.name)}
                tagline={categoryTagline(c.slug, locale, c.tagline)}
                icon={c.icon}
                count={productsInCategory(c.slug).length}
              />
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================== EZ LIP */}
      <section className="relative isolate overflow-hidden border-y border-[var(--border)] bg-[var(--bg-subtle)]">
        <Photo
          image="cat-ez-lip"
          ratio="free"
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full opacity-[0.16]"
        />
        <div className="absolute inset-0 carbon-texture opacity-50" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(70% 90% at 12% 50%, color-mix(in srgb, var(--bg-subtle) 92%, transparent), transparent 72%)",
          }}
        />

        <div className="container-nex relative py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div data-reveal>
              <p className="eyebrow mb-5">{dict.home.ezLipEyebrow}</p>
              <h2 className="text-display-3 mb-4 max-w-lg">
                {dict.home.ezLipTitle}
              </h2>
              <p className="text-[var(--fg-muted)] text-lg leading-relaxed mb-8 max-w-lg">
                {dict.home.ezLipLede}
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  dict.home.ezLipPoint1,
                  dict.home.ezLipPoint2,
                  dict.home.ezLipPoint3,
                  dict.home.ezLipPoint4,
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
                  {dict.home.ezLipCta}
                </Link>
                <Link href="/products/ez-lip-pro-universal-front-lip" className="btn btn-outline">
                  {dict.home.ezLipShop}
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
          eyebrow={dict.home.servicesEyebrow}
          title={dict.home.servicesTitle}
          lede={dict.home.servicesLede}
          action={{ href: "/services", label: dict.home.servicesAction }}
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
            eyebrow={dict.home.bestSellers}
            title={dict.home.bestSellersTitle}
            action={{ href: "/products", label: dict.home.shopAll }}
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


      {/* ========================================================== GALLERY */}
      <section className="border-b border-[var(--border)]">
        <div className="container-nex pt-16 md:pt-20">
          <SectionHead
            eyebrow={dict.home.gallery}
            title={dict.home.galleryTitle}
            lede={dict.home.galleryLede}
            action={{ href: "/build", label: dict.home.buildCta }}
          />
        </div>

        {/* Full-bleed mosaic — the widest thing on the page, so it reads as a
            change of pace rather than another card grid. */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[var(--border)] border-y border-[var(--border)]">
          {galleryImages.map((key, i) => (
            <div
              key={key}
              className={`group relative overflow-hidden bg-[var(--bg)] ${
                i === 0 || i === 7 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <Photo
                image={key}
                ratio={i === 0 || i === 7 ? "square" : "square"}
                zoom
                scrim="soft"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 17vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================== PROCESS */}
      <section className="container-nex py-16 md:py-20">
        <SectionHead
          eyebrow={dict.home.processEyebrow}
          title={dict.home.processTitle}
          lede={dict.home.processLede}
        />

        {/* Genuinely a sequence, so it is genuinely numbered. */}
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden" data-reveal-group>
          {[
            {
              n: "01",
              title: dict.home.step1Title,
              body: dict.home.step1Body,
            },
            {
              n: "02",
              title: dict.home.step2Title,
              body: dict.home.step2Body,
            },
            {
              n: "03",
              title: dict.home.step3Title,
              body: dict.home.step3Body,
            },
            {
              n: "04",
              title: dict.home.step4Title,
              body: dict.home.step4Body,
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
            eyebrow={dict.home.articlesEyebrow}
            title={dict.home.articlesTitle}
            lede={dict.home.articlesLede}
            action={{ href: "/articles", label: dict.actions.allArticles }}
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
          <div className="grid lg:grid-cols-2 gap-12">
            <div data-reveal>
              <p className="eyebrow mb-5">{dict.common.findUs}</p>
              <h2 className="text-display-3 mb-4">
                {dict.home.visitTitle}
              </h2>
              <p className="text-[var(--fg-muted)] text-lg leading-relaxed mb-8 max-w-md">
                {dict.home.visitLede}
              </p>

              <dl className="grid sm:grid-cols-2 gap-x-12 gap-y-8 mb-8">
                <div>
                  <dt className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] mb-2.5">
                    {dict.common.openingHours}
                  </dt>
                  <dd className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed">
                    Mon–Thu 10:00–19:00
                    <br />
                    Sat 10:00–19:00
                    <br />
                    Sun 10:30–19:00
                    <br />
                    <span className="text-[var(--fg-faint)]">{dict.common.fridayClosed}</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] mb-2.5">
                    {dict.common.contactLabel}
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
                  {dict.actions.openInMaps}
                </a>
                <Link href="/book" className="btn btn-outline">
                  <IconClock width={16} height={16} />
                  {dict.actions.bookFitting}
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
