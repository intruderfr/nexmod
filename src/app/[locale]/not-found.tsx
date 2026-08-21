import { LocaleLink as Link } from "@/i18n/client";
import { IconArrowRight, IconWhatsApp } from "@/components/Icons";
import { categories } from "@/data/categories";
import { waLink } from "@/data/site";

export default function NotFound() {
  return (
    <section className="container-nex py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="font-[family-name:var(--font-display)] text-7xl md:text-8xl font-extrabold text-[var(--accent)] leading-none mb-6">
          404
        </p>
        <h1 className="text-3xl md:text-4xl mb-4">This page took a wrong turn.</h1>
        <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-8">
          The page you were after does not exist, or it has moved. Try the catalogue, or just ask us
          directly — it is usually faster.
        </p>

        <div className="flex flex-wrap gap-3 mb-12">
          <Link href="/products" className="btn btn-primary">
            Shop products
            <IconArrowRight width={16} height={16} />
          </Link>
          <Link href="/services" className="btn btn-outline">
            View services
          </Link>
          <a
            href={waLink("Hi Nexmod, I was looking for something on your website.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            <IconWhatsApp width={17} height={17} />
            Ask us
          </a>
        </div>

        <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
          Browse categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-[13.5px] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
