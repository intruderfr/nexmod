import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq } from "@/components/Faq";
import { IconWhatsApp } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { lkr, site, waLink } from "@/data/site";
import type { FaqItem } from "@/data/types";
import { pageMeta } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";

export const metadata = pageMeta({
  title: "Frequently Asked Questions",
  description:
    "Delivery, payment, warranty, fitting times, walk-ins and returns — everything customers ask Nexmod before ordering car accessories in Sri Lanka.",
  path: "/faq",
  keywords: [
    "Nexmod FAQ",
    "car accessories delivery Sri Lanka",
    "car accessories warranty Sri Lanka",
    "KOKO Mintpay car accessories",
  ],
});

const groups: { title: string; items: FaqItem[] }[] = [
  {
    title: "Ordering & payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Three ways, all equally fine with us. Add to cart and check out on this site; send us the order on WhatsApp (the cart has a button that formats it for you); or simply walk into the workshop at 71 Sri Saranankara Road, Dehiwala.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Cash on delivery islandwide, Visa/Mastercard/Amex, direct bank transfer, and KOKO or Mintpay for pay-in-three. For card and BNPL orders placed online we send a secure payment link once we have confirmed stock.",
      },
      {
        q: "Do KOKO and Mintpay cost me extra?",
        a: "No. The instalment commission is built into our list prices rather than added at checkout, so paying in three costs you the same as paying at once.",
      },
      {
        q: "Are prices inclusive of VAT?",
        a: "Yes, every price shown includes VAT. Installation is shown separately where it is charged separately, and is marked as included where it is free.",
      },
      {
        q: "Do you do trade or bulk pricing?",
        a: "Yes, for workshops, dealerships and fleet operators. Message us on WhatsApp with what you need and we will quote.",
      },
    ],
  },
  {
    title: "Delivery",
    items: [
      {
        q: "Do you deliver islandwide?",
        a: `Yes. Colombo and suburbs typically ${site.delivery.colomboDays}; outstation ${site.delivery.outstationDays}. ${site.delivery.courierNote}`,
      },
      {
        q: "Is delivery free?",
        a: `Delivery is free on orders over ${lkr(site.delivery.freeThreshold)}. Below that a flat courier fee applies, shown at checkout. Anything being fitted at the workshop has no delivery charge at all, because nothing ships.`,
      },
      {
        q: "Can I collect from the workshop instead?",
        a: "Yes, and it is free. Choose workshop fitting at checkout, or just tell us on WhatsApp that you will collect.",
      },
      {
        q: "Do you ship overseas?",
        a: "Not currently. We serve Sri Lanka only.",
      },
    ],
  },
  {
    title: "Fitting & the workshop",
    items: [
      {
        q: "Do I need to book, or can I walk in?",
        a: "Quick jobs are walk-in — mirror caps, wipers, tyre lettering, mats, window decals. Anything that takes the car for a day should be booked: bi-LED retrofits, 360 camera systems, full bonnet wraps and full-car sound deadening.",
      },
      {
        q: "How long will my car be with you?",
        a: "Every product and service page lists the time it takes. Quick jobs are 30 minutes to two hours and you can wait. Mid-size jobs are half a day. Full-day jobs are booked as a full day, and we will tell you honestly if a job is likely to run into a second.",
      },
      {
        q: "Are you really closed on Fridays?",
        a: "Yes. We are open Monday to Thursday and Saturday 10:00–19:00, and Sunday 10:30–19:00. Friday is our closed day.",
      },
      {
        q: "Can I wait at the workshop?",
        a: "For shorter jobs, absolutely. For anything over a couple of hours you will be more comfortable leaving the car with us — we will message you when it is ready.",
      },
      {
        q: "Will you fit parts I bought elsewhere?",
        a: "Usually yes, and we will quote fitting only. The one exception is where the part itself is unsafe or so poorly made that we cannot stand behind the result — in which case we will tell you why rather than fit it and warranty nothing.",
      },
    ],
  },
  {
    title: "Warranty & returns",
    items: [
      {
        q: "What warranty do I get?",
        a: "Typically 12 months on supplied products, 6 months on wrap and sticker adhesion, and 5 years on ceramic window film. Our own wiring work is guaranteed for as long as you own the car. Exact terms are listed on every product and service page.",
      },
      {
        q: "What if something goes wrong with the fitting?",
        a: "Bring it back and we will fix it. A lifted wrap edge, a rattling trim panel, a flickering light — these are our work and our responsibility, and we do not argue about them.",
      },
      {
        q: "Can I return something I changed my mind about?",
        a: "Unopened, unfitted products in original packaging can be returned within 7 days for exchange or refund. Anything that has been fitted, cut to size, or custom-made to your vehicle or specification cannot be returned unless it is faulty.",
      },
      {
        q: "What is not covered?",
        a: "Accident and impact damage, damage from automatic brush car washes, solvent damage from incorrect cleaning products, and normal wear. Our aftercare guidance on each service page exists precisely so you do not run into these.",
      },
    ],
  },
  {
    title: "Products & fitment",
    items: [
      {
        q: "How do I know something fits my car?",
        a: "Product pages list the vehicles a part is commonly fitted to, and universal-fit items are marked as such. If yours is not listed, send us a photo on WhatsApp — we will confirm before you order rather than after.",
      },
      {
        q: "Is Nexmod really the only EZ Lip agent in Sri Lanka?",
        a: "Yes. We are the official Sri Lankan agent for EZ Lip USA. Genuine EZ Lip and EZ Lip Pro are sold and installed here only, with local warranty support.",
      },
      {
        q: "Is your carbon fibre real carbon?",
        a: "No, and we say so plainly on every page. We work in 8D carbon vinyl film — genuine three-dimensional weave texture under a gloss lacquer. Real dry carbon parts cost fifteen to thirty times more. Film gives you the look at a fraction of the cost, with no added weight, and it comes off cleanly.",
      },
      {
        q: "Can you source something you do not stock?",
        a: "Often, yes. Tell us what you are after on WhatsApp. Ordered-in parts usually take one to three weeks depending on origin.",
      },
      {
        q: "Will modifications affect my resale value?",
        a: "Quality, reversible work generally does not, and tasteful interior work often helps. Irreversible changes — cut looms, unsealed drilled panels, poor respray — reliably hurt. That is why we bond rather than bolt and use plug-and-play harnesses wherever we can.",
      },
    ],
  },
];

export default function FaqPage() {
  const allItems = groups.flatMap((g) => g.items);

  return (
    <>
      <JsonLd data={faqSchema(allItems)} />

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "FAQ", path: "/faq" }]} />
      </div>

      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <p className="eyebrow mb-2.5">FAQ</p>
        <h1 className="text-4xl md:text-5xl mb-4 max-w-2xl">Questions, answered properly.</h1>
        <p className="text-lg text-[var(--fg-muted)] leading-relaxed max-w-2xl">
          Delivery, payment, warranty, fitting times and returns. If your question is not here,
          WhatsApp us — we answer quickly and we do not do sales pressure.
        </p>
      </section>

      <section className="container-nex py-12 md:py-16">
        <div className="grid lg:grid-cols-[220px_1fr] gap-10">
          {/* Jump nav */}
          <nav aria-label="FAQ sections" className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-3">
                Sections
              </h2>
              <ul className="space-y-2 border-l border-[var(--border)]">
                {groups.map((g) => (
                  <li key={g.title}>
                    <a
                      href={`#${g.title.toLowerCase().replace(/[^\w]+/g, "-")}`}
                      className="block pl-3 -ml-px border-l border-transparent text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                    >
                      {g.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="max-w-3xl space-y-12">
            {groups.map((group) => (
              <section
                key={group.title}
                id={group.title.toLowerCase().replace(/[^\w]+/g, "-")}
                className="scroll-mt-24"
              >
                <h2 className="text-2xl mb-5">{group.title}</h2>
                <Faq items={group.items} defaultOpen={null} />
              </section>
            ))}

            <div className="surface carbon-texture p-6 md:p-7">
              <h2 className="text-xl md:text-2xl mb-2.5">Still not sure?</h2>
              <p className="text-[var(--fg-muted)] leading-relaxed mb-5">
                Send us a photo of your car and tell us what you are thinking. We will give you a
                straight answer, including when the answer is that you should not bother.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={waLink("Hi Nexmod, I have a question that isn't in your FAQ:")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <IconWhatsApp width={17} height={17} />
                  Ask on WhatsApp
                </a>
                <Link href="/contact" className="btn btn-outline">
                  All contact details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
