import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/Gallery";
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
    title: "Gallery — Work from the Workshop",
    description:
      "Carbon wraps, body kits, lighting retrofits, tyre lettering and detailing. A look at the kind of work that comes through Nexmod in Dehiwala.",
    path: "/gallery",
    keywords: [
      "car modification gallery Sri Lanka",
      "body kit photos Sri Lanka",
      "carbon wrap examples Colombo",
      "modified cars Sri Lanka",
    ],
    locale,
  });
}

export default function GalleryPage() {
  return (
    <>
      <section className="relative isolate border-b border-[var(--border)]">
        <Photo
          image="workshop-bay"
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
              "linear-gradient(105deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 86%, transparent) 44%, color-mix(in srgb, var(--bg) 30%, transparent) 100%)",
          }}
        />

        <div className="container-nex relative pt-6 pb-16 md:pb-20">
          <Breadcrumbs trail={[{ name: "Gallery", path: "/gallery" }]} />

          <div className="max-w-2xl mt-10">
            <p className="eyebrow mb-5">Gallery</p>
            <h1 className="text-display-2 mb-6">
              What comes out
              <br />
              <span className="text-[var(--accent)]">of the bay.</span>
            </h1>
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-8">
              Carbon, kits, lighting, lettering and paint protection. Filter by discipline, and tap
              anything to see it larger.
            </p>

            <a
              href={waLink("Hi Nexmod, I saw something in your gallery I'd like on my car.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <IconWhatsApp width={17} height={17} />
              Ask about a look
            </a>
          </div>
        </div>
      </section>

      <section className="container-nex py-16 md:py-20">
        <Gallery />

        <p className="mt-10 text-[12.5px] text-[var(--fg-subtle)] leading-relaxed max-w-2xl">
          Reference imagery showing the disciplines we work in. Replace with the workshop&rsquo;s own
          photography before launch — see the note in <code>scripts/fetch-images.mjs</code>.
        </p>
      </section>
    </>
  );
}
