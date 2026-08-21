import { LocaleLink as Link } from "@/i18n/client";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IconArrowRight } from "@/components/Icons";
import { CategoryIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { ProductBrowser } from "@/components/ProductBrowser";
import { categoryImage } from "@/data/imagery";
import { categories, getCategory } from "@/data/categories";
import { allFitments, productsInCategory } from "@/data/products";
import { services } from "@/data/services";
import { clampDescription, pageMeta } from "@/lib/seo";
import { collectionSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return pageMeta({
    title: category.heading,
    description: clampDescription(`${category.tagline} ${category.description[0]}`),
    path: `/categories/${category.slug}`,
    keywords: category.keywords,
    locale,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = productsInCategory(category.slug);
  const photo = categoryImage(category.slug);

  // Services whose related products live in this category.
  const relatedServices = services.filter((s) =>
    (s.relatedProducts ?? []).some((p) => items.some((i) => i.slug === p)),
  );

  return (
    <>
      <JsonLd data={collectionSchema(category, items)} />

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs
          trail={[
            { name: "Products", path: "/products" },
            { name: category.name, path: `/categories/${category.slug}` },
          ]}
        />
      </div>

      {photo && (
        <div className="relative isolate -mt-4 mb-10 border-y border-[var(--border)]">
          <Photo
            image={photo}
            ratio="hero"
            priority
            alt=""
            sizes="100vw"
            className="h-full w-full"
          />
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(to top, var(--bg) 2%, color-mix(in srgb, var(--bg) 40%, transparent) 60%, transparent 100%)",
            }}
          />
        </div>
      )}

      <section className="container-nex pb-12 md:pb-16 border-b border-[var(--border)]">
        <div className="flex items-start gap-4 mb-5">
          <span className="shrink-0 grid place-items-center w-12 h-12 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)]">
            <CategoryIcon name={category.icon} width={24} height={24} />
          </span>
          <div>
            <p className="eyebrow mb-1.5">{items.length} products</p>
            <h1 className="text-display-3">{category.heading}</h1>
          </div>
        </div>

        <div className="prose-nex max-w-3xl">
          {category.description.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      <section className="container-nex py-12 md:py-16">
        <ProductBrowser
          products={items}
          categories={categories}
          fitments={allFitments()}
          lockedCategory={category.slug}
        />
      </section>

      {/* Related services */}
      {relatedServices.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="container-nex py-16 md:py-20">
            <h2 className="text-heading mb-2">We fit all of this</h2>
            <p className="text-[var(--fg-muted)] mb-7 max-w-2xl leading-relaxed">
              Buying the part is half of it. Here is exactly how we install it, and the steps that
              decide whether the work lasts.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="surface surface-hover p-5 flex items-start gap-3.5 group"
                >
                  <span className="shrink-0 grid place-items-center w-10 h-10 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)]">
                    <CategoryIcon name={s.icon} width={18} height={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-semibold text-[15px] mb-1 group-hover:text-[var(--accent)] transition-colors">
                      {s.name}
                      <IconArrowRight
                        width={14}
                        height={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </span>
                    <span className="block text-[13px] text-[var(--fg-muted)] leading-relaxed">
                      {s.tagline}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other categories */}
      <section className="border-t border-[var(--border)]">
        <div className="container-nex py-12 md:py-16">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
            Other categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[var(--border)] text-[13.5px] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  <CategoryIcon name={c.icon} width={15} height={15} />
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
