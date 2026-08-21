import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IconArrowRight, IconWhatsApp } from "@/components/Icons";
import { PackageBuilder } from "@/components/PackageBuilder";
import { PackageCard } from "@/components/PackageCard";
import { Photo } from "@/components/Photo";
import { SectionHead } from "@/components/SectionHead";
import { packageTiers, packages } from "@/data/packages";
import { waLink } from "@/data/site";
import { LocaleLink as Link } from "@/i18n/client";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
    title: "Packages — Bundled & Fitted",
    description:
      "Curated car accessory packages from Nexmod Dehiwala. Daily comfort, exterior styling, lighting, audio and full builds — bundled at a discount and fitted in one visit.",
    path: "/packages",
    keywords: [
      "car accessories package Sri Lanka",
      "car modification package Colombo",
      "car styling bundle Sri Lanka",
      "audio package Sri Lanka",
    ],
    locale,
  });
}

export default function PackagesPage() {
  return (
    <>
      <section className="relative isolate border-b border-[var(--border)]">
        <Photo
          image="cat-carbon-fibre"
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
              "linear-gradient(105deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 88%, transparent) 44%, color-mix(in srgb, var(--bg) 30%, transparent) 100%)",
          }}
        />

        <div className="container-nex relative pt-6 pb-16 md:pb-20">
          <Breadcrumbs trail={[{ name: "Packages", path: "/packages" }]} />

          <div className="max-w-2xl mt-10">
            <p className="eyebrow mb-5">Packages</p>
            <h1 className="text-display-2 mb-6">
              What we&rsquo;d do first,
              <br />
              <span className="text-[var(--accent)]">in what order.</span>
            </h1>
            <p className="text-lede mb-8">
              Most people know what bothers them about the car, not which part to buy. These are the
              combinations we actually recommend — bundled at a discount, and fitted in one visit.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/build" className="btn btn-primary">
                Or build your own
                <IconArrowRight width={16} height={16} />
              </Link>
              <a
                href={waLink("Hi Nexmod, which package would you recommend for my car?")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <IconWhatsApp width={17} height={17} />
                Ask what suits my car
              </a>
            </div>
          </div>
        </div>
      </section>

      {packageTiers.map((tier) => {
        const items = packages.filter((p) => p.tier === tier.id);
        if (items.length === 0) return null;

        return (
          <section
            key={tier.id}
            className="container-nex py-16 md:py-20 border-b border-[var(--border)] last:border-0"
          >
            <SectionHead eyebrow={tier.label} title={tier.blurb} />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" data-reveal-group>
              {items.map((pkg) => (
                <div key={pkg.slug} data-reveal>
                  <PackageCard pkg={pkg} expanded />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/*
        The curated packages above answer "what should I do first". This
        answers the other half — someone who already knows what they want in a
        combination we did not think to bundle, and who should not lose the
        bundle discount for it.
      */}
      <section id="build-your-own" className="border-t border-[var(--border)] scroll-mt-24">
        <div className="container-nex py-16 md:py-24">
          <div className="max-w-2xl mb-10">
            <p className="eyebrow mb-4">Build your own</p>
            <h2 className="text-display-3 mb-5">Or make up your own package</h2>
            <p className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed">
              Pick anything from the catalogue. Two items or more and the bundle discount applies
              the same way it does to the sets above — it comes from fitting everything in one
              visit rather than from how much you spend.
            </p>
          </div>

          <PackageBuilder />
        </div>
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-20 text-center">
          <h2 className="text-display-3 mb-4">None of these quite right?</h2>
          <p className="text-lede mx-auto mb-8">
            Build exactly what you want in the Build Studio, or send us a photo and we will tell you
            what we would do first.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/build" className="btn btn-lg btn-primary">
              Open Build Studio
            </Link>
            <a
              href={waLink("Hi Nexmod, here's my car — what would you recommend?")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-lg btn-whatsapp"
            >
              <IconWhatsApp width={18} height={18} />
              Send a photo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
