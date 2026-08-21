import { LocaleLink as Link } from "@/i18n/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DeliveryEstimator } from "@/components/DeliveryEstimator";
import { IconTruck, IconWhatsApp } from "@/components/Icons";
import { lkr, site, waLink } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "Delivery & Returns",
  description:
    "Nexmod delivery times and costs across Sri Lanka, workshop collection, and our returns and warranty policy for car accessories.",
  path: "/delivery-returns",
  keywords: [
    "car accessories delivery Sri Lanka",
    "Nexmod returns policy",
    "islandwide delivery car parts Sri Lanka",
  ],
    locale,
  });
}

export default function DeliveryReturnsPage() {
  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Delivery & returns", path: "/delivery-returns" }]} />
      </div>

      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <p className="eyebrow mb-2.5">Policy</p>
        <h1 className="text-display-2 mb-4">Delivery &amp; returns</h1>
        <p className="text-lede">
          Plain terms, no small print games. If something we did is wrong, we fix it.
        </p>
      </section>

      <section className="container-nex py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="mb-10">
            <DeliveryEstimator />
          </div>

          {/* Delivery table */}
          <div className="surface p-6 mb-10">
            <h2 className="flex items-center gap-2.5 text-xl mb-5">
              <IconTruck width={20} height={20} className="text-[var(--accent)]" />
              Delivery at a glance
            </h2>
            <div className="scroll-x">
              <table className="w-full text-left border-collapse min-w-[30rem]">
                <thead>
                  <tr className="bg-[var(--bg-inset)]">
                    {["Destination", "Time", "Cost"].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-3 text-[11.5px] font-bold uppercase tracking-wider text-[var(--fg-subtle)] border-b border-[var(--border)]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Workshop collection, Dehiwala", "Same day once confirmed", "Free"],
                    ["Colombo and suburbs", site.delivery.colomboDays, `Free over ${lkr(site.delivery.freeThreshold)}`],
                    ["Outstation, islandwide", site.delivery.outstationDays, `Free over ${lkr(site.delivery.freeThreshold)}`],
                    ["Fitted at our workshop", "Booked slot", "No delivery charge"],
                  ].map(([dest, time, cost]) => (
                    <tr key={dest} className="border-b border-[var(--border)] last:border-0">
                      <td className="px-4 py-3 text-[14px] font-medium">{dest}</td>
                      <td className="px-4 py-3 text-[14px] text-[var(--fg-muted)]">{time}</td>
                      <td className="px-4 py-3 text-[14px] text-[var(--fg-muted)]">{cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="prose-nex">
            <h2>Delivery</h2>
            <p>
              We dispatch by tracked courier from our workshop in Dehiwala. Orders confirmed before
              15:00 on a working day usually go out the same day. We confirm every order by phone or
              WhatsApp before dispatch, so you always know it is on its way.
            </p>
            <p>
              Cash on delivery is available islandwide. Larger or fragile items — spoilers, body
              parts, subwoofer enclosures — may take a day longer as they need careful packing, and
              we will tell you at confirmation if that applies.
            </p>

            <h2>Collection and fitting</h2>
            <p>
              Anything you are having fitted at the workshop carries no delivery charge, because
              nothing ships. Choose workshop fitting at checkout and we will contact you to arrange
              a slot.
            </p>
            <p>
              Quick jobs are walk-in during opening hours. Anything that takes the car for a day
              needs a booking so we can hold a bay.
            </p>

            <h2>Returns</h2>
            <p>
              Unopened, unfitted products in their original packaging can be returned within 7 days
              of delivery for exchange or refund. Return postage is yours unless the item is faulty
              or we sent the wrong thing, in which case we cover it.
            </p>
            <p>These cannot be returned unless faulty, for reasons we think are fair:</p>
            <ul>
              <li>Anything already fitted to a vehicle</li>
              <li>Film, vinyl or lettering cut to size for your car</li>
              <li>Custom-made items — seat covers, painted spoilers, bespoke graphics</li>
              <li>Items damaged by incorrect fitting or misuse after delivery</li>
            </ul>

            <h2>Faulty items</h2>
            <p>
              If something arrives faulty or fails within its warranty period, tell us and we will
              repair, replace or refund it. Bring it to the workshop where practical — it is almost
              always faster to resolve in person than by courier.
            </p>
            <p>
              Warranty periods are listed on every product and service page. Typically that is 12
              months on supplied products, 6 months on wrap and sticker adhesion, 5 years on
              ceramic window film, and for as long as you own the car on our own wiring work.
            </p>

            <h2>What warranty does not cover</h2>
            <ul>
              <li>Accident and impact damage</li>
              <li>Damage from automatic brush car washes — these tear wrap edges</li>
              <li>Solvent damage from incorrect cleaning products</li>
              <li>Normal wear, and normal UV ageing beyond the stated life of a film</li>
              <li>Work altered or re-fitted by someone else after we did it</li>
            </ul>
            <p>
              The aftercare guidance on every service page exists precisely so you never meet this
              list. We go through it with you at handover too.
            </p>

            <h2>Cancelling an order</h2>
            <p>
              Before dispatch, just tell us — no charge, no questions. After dispatch it becomes a
              return under the terms above. Custom-made and cut-to-size items cannot be cancelled
              once work has started, because they cannot be sold to anyone else.
            </p>
          </div>

          <div className="surface p-6 mt-10">
            <h2 className="text-lg mb-2">Need to sort something out?</h2>
            <p className="text-[14px] text-[var(--fg-muted)] leading-relaxed mb-4">
              Message us with your order reference and we will deal with it. We would much rather
              fix a problem than have you leave unhappy.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={waLink("Hi Nexmod, I need help with an order.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <IconWhatsApp width={17} height={17} />
                WhatsApp us
              </a>
              <Link href="/contact" className="btn btn-outline">
                Contact details
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
