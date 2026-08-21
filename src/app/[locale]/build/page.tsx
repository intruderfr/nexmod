import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { BuildStudio } from "@/components/build/BuildStudio";
import { IconCheck, IconShield, IconTool } from "@/components/Icons";
import { Photo } from "@/components/Photo";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMeta({
    title: "Build Studio — Configure Your Car",
    description:
      "Upload a photo of your car, preview window tint and finishes, pick your modifications and see a live price. Body kits, carbon, EZ Lip, lighting and audio — configured in your browser.",
    path: "/build",
    keywords: [
      "car configurator Sri Lanka",
      "build my car Sri Lanka",
      "car modification planner",
      "window tint preview",
      "body kit configurator Sri Lanka",
    ],
    locale,
  });
}

export default function BuildPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-[var(--border)]">
        <Photo
          image="hero-alt"
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
              "linear-gradient(to right, var(--bg) 0%, color-mix(in srgb, var(--bg) 88%, transparent) 45%, color-mix(in srgb, var(--bg) 55%, transparent) 100%)",
          }}
        />

        <div className="container-nex relative pt-6 pb-16 md:pb-20">
          <Breadcrumbs trail={[{ name: "Build Studio", path: "/build" }]} />

          <div className="max-w-2xl mt-10">
            <p className="eyebrow mb-5">Build Studio</p>
            <h1 className="text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.98] mb-6">
              Show us your car.
              <br />
              <span className="text-[var(--accent)]">Build it here.</span>
            </h1>
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-8">
              Upload a photo, preview tint levels and finishes on it, then pick your modifications
              and watch the price build up. Send the whole spec to us on WhatsApp when you are
              happy with it.
            </p>

            <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
              {[
                { Icon: IconShield, text: "Your photo never leaves your device" },
                { Icon: IconTool, text: "Live pricing as you build" },
                { Icon: IconCheck, text: "Send the spec straight to the workshop" },
              ].map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-[13.5px] text-[var(--fg-muted)]">
                  <Icon width={15} height={15} className="text-[var(--accent)] shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-nex py-16 md:py-20">
        <Suspense
          fallback={
            <div className="grid lg:grid-cols-[1fr_380px] gap-8">
              <div className="h-[32rem] rounded-xl bg-[var(--bg-inset)] animate-pulse" />
              <div className="h-64 rounded-xl bg-[var(--bg-inset)] animate-pulse" />
            </div>
          }
        >
          <BuildStudio />
        </Suspense>
      </section>
    </>
  );
}
