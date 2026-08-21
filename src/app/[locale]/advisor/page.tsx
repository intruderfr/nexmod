import { Advisor } from "@/components/Advisor";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IconWhatsApp } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { waLink } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
    title: "Advisor — What Should I Do First?",
    description:
      "Tell us what bothers you about your car and your budget, and we will say what to do first, in what order, and what to leave alone. Honest advice from the Nexmod workshop.",
    path: "/advisor",
    keywords: [
      "car upgrade advice Sri Lanka",
      "what car modification first",
      "car accessories budget Sri Lanka",
      "car improvement priority",
    ],
    locale,
  });
}

export default function AdvisorPage() {
  return (
    <>
      <section className="relative isolate border-b border-[var(--border)]">
        <Photo
          image="svc-workshop"
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
          <Breadcrumbs trail={[{ name: "Advisor", path: "/advisor" }]} />

          <div className="max-w-2xl mt-10">
            <p className="eyebrow mb-5">Advisor</p>
            <h1 className="text-display-2 mb-6">
              What should I
              <br />
              <span className="text-[var(--accent)]">do first?</span>
            </h1>
            <p className="text-lede mb-8">
              The most common question at the counter. Tell us what actually bothers you about the
              car and what you are happy to spend — we will tell you the order we would do it in,
              and what to leave alone for now.
            </p>

            <a
              href={waLink("Hi Nexmod, what would you recommend for my car?")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <IconWhatsApp width={17} height={17} />
              Or just ask us directly
            </a>
          </div>
        </div>
      </section>

      <section className="container-nex py-16 md:py-20">
        <Advisor />
      </section>
    </>
  );
}
