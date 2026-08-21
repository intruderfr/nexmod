import { CheckoutForm } from "@/components/CheckoutForm";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
  title: "Checkout",
  description: "Complete your Nexmod order — cash on delivery, card, bank transfer, KOKO or Mintpay.",
  path: "/checkout",
  noindex: true,
    locale,
  });
}

export default function CheckoutPage() {
  return (
    <section className="container-nex py-12 md:py-16">
      <h1 className="text-display-3 mb-8">Checkout</h1>
      <CheckoutForm />
    </section>
  );
}
