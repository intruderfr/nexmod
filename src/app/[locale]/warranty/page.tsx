import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { IconArrowRight, IconCheck, IconClose, IconStar, IconWhatsApp } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { WarrantyCentre } from "@/components/warranty/WarrantyCentre";
import { careTiers } from "@/data/care";
import { lkr, waLink } from "@/data/site";
import type { FaqItem } from "@/data/types";
import {
  BASE_COVER_MONTHS,
  WORKMANSHIP_COVER_MONTHS,
  claimSteps,
  coverage,
  extendedCover,
} from "@/data/warranty";
import { LocaleLink as Link } from "@/i18n/client";
import { faqSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
    title: "Warranty — Cover, Claims & Registration",
    description:
      "What Nexmod covers and for how long: cover periods by category, workmanship cover, extended options, what is excluded, and how to raise a claim from Dehiwala.",
    path: "/warranty",
    keywords: [
      "car accessory warranty Sri Lanka",
      "EZ Lip warranty Sri Lanka",
      "fitting warranty Colombo",
      "car accessories guarantee Dehiwala",
    ],
    locale,
  });
}

const faqs: FaqItem[] = [
  {
    q: "Do I have to register to be covered?",
    a: "No. Cover starts the day the work is done whether or not you register anything here. Registering just means that when something fails you have the date, the term and the reference in one message instead of hunting for a slip from eighteen months ago.",
  },
  {
    q: "Where is my registration stored?",
    a: "In your own browser, on this device, and nowhere else. There is no account and no server behind this page. If you clear site data or change phone it is gone, so export your profile from the account page if you want a copy you keep.",
  },
  {
    q: "What if the part was fine but the fitting failed?",
    a: "That is the workmanship cover, and it runs for six months on anything fitted at our workshop regardless of the part term. Adhesion failures on a bonded part are covered under both, so it rarely matters which one applies.",
  },
  {
    q: "The lip is scuffed from a speed bump. Is that covered?",
    a: "No, and no lip warranty anywhere covers it. A flexible lip is designed to survive contact rather than avoid it — that is why we recommend them here — but a scrape is impact damage, not a defect. We will re-bond a lifted edge, and we do that under cover.",
  },
  {
    q: "Can I buy extended cover later?",
    a: "Yes, at any point inside the original term. The price is worked out on the item price, so it does not get more expensive as the term runs down, but once cover has lapsed it cannot be restarted.",
  },
  {
    q: "Does a Care plan change my warranty?",
    a: "It adds to it. Anything fitted while a plan is active gets extra months on top of the standard term, and those months stay with the item for its full life even if the plan ends later.",
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  "ez-lip": "EZ Lip",
  "body-kits": "Body kits",
  "spoilers-body": "Spoilers and body",
  "carbon-fibre": "Carbon fibre",
  lighting: "Lighting",
  audio: "Audio",
  "cameras-safety": "Cameras and safety",
  interior: "Interior",
  "tyre-stickers": "Tyre stickers",
  essentials: "Essentials",
};

export default function WarrantyPage() {
  const covered = coverage.filter((c) => c.covered);
  const excluded = coverage.filter((c) => !c.covered);
  const bonusRange = careTiers.map((t) => t.warrantyBonusMonths);

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <section className="relative isolate border-b border-[var(--border)]">
        <Photo
          image="cat-ez-lip"
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
          <Breadcrumbs trail={[{ name: "Warranty", path: "/warranty" }]} />

          <div className="max-w-2xl mt-10">
            <p className="eyebrow mb-5">Warranty</p>
            <h1 className="text-display-2 mb-6">
              What we cover,
              <br />
              and what we do not.
            </h1>
            <p className="text-lede mb-8">
              Both halves matter. A warranty that reads as though it covers everything is a warranty
              nobody trusts, so the exclusions are on this page at the same size as the cover — and
              the fitting itself is covered separately from the part.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <a href="#register" className="btn btn-primary">
                Register or check an item
                <IconArrowRight width={16} height={16} />
              </a>
              <Link href="/care" className="btn btn-outline">
                <IconStar width={16} height={16} />
                Add {Math.min(...bonusRange)}–{Math.max(...bonusRange)} months with Care
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- the terms */}
      <section className="container-nex py-16 md:py-24">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16">
          <div data-reveal>
            <p className="eyebrow mb-4">Covered</p>
            <h2 className="text-heading mb-6">What a claim succeeds on</h2>
            <ul className="space-y-4">
              {covered.map((rule) => (
                <li key={rule.label} className="flex items-start gap-3">
                  <span
                    className="shrink-0 grid place-items-center w-6 h-6 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)] mt-0.5"
                    aria-hidden="true"
                  >
                    <IconCheck width={13} height={13} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[14.5px]">{rule.label}</span>
                    <span className="block text-[13.5px] text-[var(--fg-muted)] leading-relaxed mt-1">
                      {rule.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <p className="eyebrow mb-4">Not covered</p>
            <h2 className="text-heading mb-6">What it does not</h2>
            <ul className="space-y-4">
              {excluded.map((rule) => (
                <li key={rule.label} className="flex items-start gap-3">
                  <span
                    className="shrink-0 grid place-items-center w-6 h-6 rounded-md bg-[var(--bg-inset)] text-[var(--fg-subtle)] mt-0.5"
                    aria-hidden="true"
                  >
                    <IconClose width={13} height={13} />
                  </span>
                  <span>
                    <span className="block font-semibold text-[14.5px]">{rule.label}</span>
                    <span className="block text-[13.5px] text-[var(--fg-muted)] leading-relaxed mt-1">
                      {rule.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ terms */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-20">
          <p className="eyebrow mb-4">Standard terms</p>
          <h2 className="text-heading mb-8">How long each thing is covered for</h2>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
            {Object.entries(BASE_COVER_MONTHS).map(([category, months]) => (
              <div
                key={category}
                data-reveal
                className="surface p-4 flex items-baseline justify-between gap-3"
              >
                <span className="font-semibold text-[14px]">
                  {CATEGORY_LABELS[category] ?? category}
                </span>
                <span className="tabular-nums text-[var(--fg-muted)] text-[13.5px] shrink-0">
                  {months} months
                </span>
              </div>
            ))}
            <div className="surface p-4 flex items-baseline justify-between gap-3 border-l-2 border-l-[var(--accent)]">
              <span className="font-semibold text-[14px]">Fitting and workmanship</span>
              <span className="tabular-nums text-[var(--fg-muted)] text-[13.5px] shrink-0">
                {WORKMANSHIP_COVER_MONTHS} months
              </span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-10">
            {extendedCover.map((cover) => (
              <div key={cover.id} className="surface p-6">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h3 className="text-subheading">{cover.label}</h3>
                  <span className="badge shrink-0 tabular-nums">
                    from {lkr(cover.minimumFee)}
                  </span>
                </div>
                <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed mb-3">
                  {cover.detail}
                </p>
                <p className="text-[12.5px] text-[var(--fg-subtle)] tabular-nums">
                  Priced at {Math.round(cover.rate * 100)}% of the item price, minimum{" "}
                  {lkr(cover.minimumFee)}.
                </p>
              </div>
            ))}
          </div>

          <p className="text-[12.5px] text-[var(--fg-subtle)] mt-6 max-w-2xl leading-relaxed">
            Cover periods run from the date the work was done, not the date of purchase. Terms here
            are the standard ones — an individual product page will say if that item carries
            something different.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- register */}
      <section id="register" className="container-nex py-16 md:py-24 scroll-mt-24">
        <div className="max-w-2xl mb-10">
          <p className="eyebrow mb-4">Your record</p>
          <h2 className="text-display-3 mb-5">Register what is on the car</h2>
          <p className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed">
            This lives in your browser and nowhere else — no account, no server, nothing to leak.
            When something fails, one tap sends Nexmod the item, the date and the term over
            WhatsApp.
          </p>
        </div>

        <WarrantyCentre />
      </section>

      {/* ------------------------------------------------------------ claim */}
      <section className="border-t border-[var(--border)]">
        <div className="container-nex py-16 md:py-24">
          <p className="eyebrow mb-4">Claims</p>
          <h2 className="text-heading mb-10">How a claim actually goes</h2>

          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" data-reveal-group>
            {claimSteps.map((step, index) => (
              <li key={step.title} data-reveal>
                <span className="step-marker mb-4">{index + 1}</span>
                <h3 className="font-semibold text-[15px] mb-2">{step.title}</h3>
                <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap gap-2.5">
            <a
              href={waLink("Hi Nexmod, I would like to raise a warranty claim.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <IconWhatsApp width={16} height={16} />
              Start a claim
            </a>
            <Link href="/faq" className="btn btn-outline">
              Read the full FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- faq */}
      <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
        <div className="container-nex py-16 md:py-24">
          <div className="grid lg:grid-cols-[22rem_1fr] gap-10 lg:gap-16">
            <div>
              <p className="eyebrow mb-4">Questions</p>
              <h2 className="text-display-3 mb-5">Warranty questions</h2>
              <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed">
                If something here is unclear, ask before you buy rather than after something fails.
              </p>
            </div>
            <Faq items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
