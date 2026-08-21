import { CheckoutForm } from "@/components/CheckoutForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Checkout",
  description: "Complete your Nexmod order — cash on delivery, card, bank transfer, KOKO or Mintpay.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutPage() {
  return (
    <section className="container-nex py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl mb-8">Checkout</h1>
      <CheckoutForm />
    </section>
  );
}
