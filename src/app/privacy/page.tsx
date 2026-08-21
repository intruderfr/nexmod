import { Breadcrumbs } from "@/components/Breadcrumbs";
import { site } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "How Nexmod collects, uses and protects your personal information when you order car accessories or book a fitting.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const updated = new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <>
      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Privacy", path: "/privacy" }]} />
      </div>

      <section className="container-nex py-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl mb-3">Privacy policy</h1>
          <p className="text-[var(--fg-subtle)] mb-10">Last updated: {updated}</p>

          <div className="prose-nex">
            <p>
              This policy explains what we collect, why, and what we do with it. It is deliberately
              short, because we deliberately collect very little.
            </p>

            <h2>What we collect</h2>
            <p>Only what we need to fulfil an order or a booking:</p>
            <ul>
              <li>Your name, phone number and — if you give it — email address</li>
              <li>A delivery address, when something is being shipped to you</li>
              <li>Your vehicle details, so we can confirm fitment</li>
              <li>What you ordered or booked, and any notes you added</li>
            </ul>
            <p>
              We do not collect or store card details. Where card payment applies, it is handled by
              a licensed payment provider on their own systems.
            </p>

            <h2>How we use it</h2>
            <ul>
              <li>To confirm, prepare and deliver your order</li>
              <li>To arrange and confirm a workshop booking</li>
              <li>To contact you about that specific order or booking</li>
              <li>To honour a warranty claim</li>
              <li>To meet any legal or tax record-keeping requirement</li>
            </ul>
            <p>
              We do not sell your information, we do not rent it, and we do not share it with third
              parties for marketing. We will not add you to a mailing list because you bought
              something.
            </p>

            <h2>Who we share it with</h2>
            <p>Only where it is necessary to complete what you asked for:</p>
            <ul>
              <li>Courier companies, to deliver your order</li>
              <li>Payment providers, to process a payment you initiated</li>
              <li>Authorities, where we are legally required to</li>
            </ul>

            <h2>WhatsApp</h2>
            <p>
              Many customers contact us on WhatsApp, and messages there are subject to
              WhatsApp&rsquo;s own privacy terms as well as this policy. We keep conversation
              history so we have a record of what was agreed for your job — which protects you as
              much as it protects us.
            </p>

            <h2>Cookies and analytics</h2>
            <p>
              This site uses browser local storage to remember your shopping cart and your light or
              dark theme preference. That data stays on your device and is never sent to us. We do
              not use advertising or cross-site tracking cookies.
            </p>

            <h2>How long we keep it</h2>
            <p>
              Order and booking records are kept as long as needed for warranty support and legal
              record-keeping. Beyond that, you can ask us to delete your details at any time.
            </p>

            <h2>Your rights</h2>
            <p>
              You can ask us what we hold about you, ask us to correct it, or ask us to delete it.
              Contact us and we will action it — there is no process to navigate.
            </p>

            <h2>Contact</h2>
            <p>
              {site.legalName}
              <br />
              {site.address.street}, {site.address.locality} {site.address.postalCode}, Sri Lanka
              <br />
              Phone: {site.contact.phoneDisplay}
              <br />
              Email: {site.contact.email}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
