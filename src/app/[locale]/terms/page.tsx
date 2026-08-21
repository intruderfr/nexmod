import { LocaleLink as Link } from "@/i18n/client";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "Terms & Conditions",
  description:
    "The terms that apply when you buy car accessories from Nexmod or book work at our Dehiwala workshop.",
  path: "/terms",
    locale,
  });
}

export default function TermsPage() {
  const updated = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Terms", path: "/terms" }]} />
      </div>

      <section className="container-nex py-12 md:py-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl mb-3">Terms &amp; conditions</h1>
          <p className="text-[var(--fg-subtle)] mb-10">Last updated: {updated}</p>

          <div className="prose-nex">
            <h2>Who we are</h2>
            <p>
              {site.legalName}, {site.address.street}, {site.address.locality}{" "}
              {site.address.postalCode}, Sri Lanka. Contact {site.contact.phoneDisplay} or{" "}
              {site.contact.email}.
            </p>

            <h2>Orders</h2>
            <p>
              An order placed on this site is a request, not a completed contract. We confirm stock
              and availability by phone or WhatsApp before dispatch or fitting, and the contract
              forms at that confirmation. If we cannot fulfil an order we will tell you promptly and
              refund anything already paid.
            </p>

            <h2>Prices</h2>
            <p>
              Prices are in Sri Lankan Rupees and include VAT. We try hard to keep them accurate,
              but if a price is clearly wrong we will contact you before proceeding rather than
              silently charging a different amount. Prices can change without notice; the price
              confirmed to you at order confirmation is the price you pay.
            </p>

            <h2>Fitting</h2>
            <p>
              Fitting times quoted on this site are estimates based on typical vehicles. Some cars
              take longer — older vehicles, previously modified vehicles, and anything where we find
              a problem underneath. We will tell you as soon as we know.
            </p>
            <p>
              Where we find pre-existing damage, corrosion, poor previous work, or anything else
              that affects what we were asked to do, we will stop and speak to you before
              continuing.
            </p>
            <p>
              We may decline work where we believe the part is unsafe, the result would be
              unreliable, or the modification would be illegal to use on the road. We will explain
              why rather than simply refusing.
            </p>

            <h2>Your vehicle</h2>
            <p>
              Vehicles are left with us at your own risk in respect of pre-existing faults and items
              left inside. Please remove valuables. We are responsible for damage we cause, and we
              take that responsibility seriously.
            </p>

            <h2>Warranty</h2>
            <p>
              Warranty terms are stated on each product and service page. In summary: 12 months on
              supplied products, 6 months on wrap and sticker adhesion, 5 years on ceramic window
              film, and for as long as you own the car on our own wiring work.
            </p>
            <p>
              Warranty does not cover accident or impact damage, damage from automatic brush car
              washes, solvent damage from incorrect cleaning products, normal wear and UV ageing
              within a film&rsquo;s stated life, or work that has been altered by someone else after
              we completed it.
            </p>

            <h2>Returns</h2>
            <p>
              Set out in full on our{" "}
              <Link href="/delivery-returns">delivery and returns page</Link>, which forms part of
              these terms.
            </p>

            <h2>Legal use</h2>
            <p>
              Some modifications are regulated in Sri Lanka — window tint levels and forward-facing
              light colours in particular. We fit within the legal limits and will tell you what
              those limits are. It remains your responsibility to keep your vehicle road-legal and
              correctly insured, and to declare modifications to your insurer where required.
            </p>

            <h2>Liability</h2>
            <p>
              Our liability is limited to the value of the goods and services supplied. We are not
              liable for indirect or consequential loss, such as loss of use of the vehicle. Nothing
              here limits liability that cannot be limited by law.
            </p>

            <h2>Content on this site</h2>
            <p>
              Guides and articles on this site are general information based on our workshop
              experience. They are not a substitute for advice about your specific vehicle. Prices
              quoted in articles are indicative and change over time.
            </p>

            <h2>Governing law</h2>
            <p>These terms are governed by the laws of Sri Lanka.</p>
          </div>
        </div>
      </section>
    </>
  );
}
