import { LocaleLink as Link } from "@/i18n/client";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DeliveryEstimator } from "@/components/DeliveryEstimator";
import { ProductCard } from "@/components/Cards";
import { Faq } from "@/components/Faq";
import { IconArrowRight, IconCheck, IconClock, IconShield, IconTool } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { Photo } from "@/components/Photo";
import { RecentlyViewed, TrackProductView } from "@/components/RecentlyViewed";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { Visual } from "@/components/Visual";
import { productImage } from "@/data/imagery";
import { getCategory } from "@/data/categories";
import { getProduct, products, relatedProducts } from "@/data/products";
import { getService } from "@/data/services";
import { clampDescription, pageMeta } from "@/lib/seo";
import { faqSchema, productSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return pageMeta({
    title: product.name,
    description: clampDescription(
      `${product.tagline} ${product.body[0] ?? ""}`.replace(/\s+/g, " ").trim(),
    ),
    path: `/products/${product.slug}`,
    keywords: product.keywords,
    locale,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const related = relatedProducts(product, 4);
  const photo = productImage(product.slug, product.category);
  const service = product.installation?.serviceSlug
    ? getService(product.installation.serviceSlug)
    : undefined;

  return (
    <>
      <JsonLd data={productSchema(product)} />
      <TrackProductView slug={product.slug} />
      <StickyBuyBar product={product} />
      {product.faqs && product.faqs.length > 0 && <JsonLd data={faqSchema(product.faqs)} />}

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs
          trail={[
            { name: "Products", path: "/products" },
            ...(category
              ? [{ name: category.name, path: `/categories/${category.slug}` }]
              : []),
            { name: product.name, path: `/products/${product.slug}` },
          ]}
        />
      </div>

      {/* =============================================== BUY SECTION */}
      <section className="container-nex pb-16 md:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Visual column */}
          <div>
            <div className="surface overflow-hidden sticky top-24">
              {photo ? (
                <Photo
                  image={photo}
                  ratio="square"
                  priority
                  sizes="(max-width: 1024px) 100vw, 46vw"
                />
              ) : (
                <Visual
                  variant={product.category}
                  icon={category?.icon ?? "tool"}
                  label={category?.name}
                  ratio="square"
                />
              )}
              {product.badges && product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 border-t border-[var(--border)]">
                  {product.badges.map((b) => (
                    <span key={b} className="badge badge-accent">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Detail column */}
          <div>
            {product.brand && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--accent)] mb-3">
                {product.brand}
              </span>
            )}

            <h1 className="text-display-3 mb-3">{product.name}</h1>
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed mb-7">{product.tagline}</p>

            <AddToCart product={product} />

            {/* Highlights */}
            <div className="mt-8">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
                Key points
              </h2>
              <ul className="space-y-2.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5">
                    <IconCheck
                      width={16}
                      height={16}
                      className="shrink-0 mt-1 text-[var(--accent)]"
                    />
                    <span className="text-[14.5px] text-[var(--fg-muted)] leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= DESCRIPTION */}
      <section className="border-t border-[var(--border)]">
        <div className="container-nex py-16 md:py-20">
          <div className="grid lg:grid-cols-[1fr_360px] gap-12">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">About this product</p>
              <h2 className="text-heading mb-6">The detail that matters</h2>
              <div className="prose-nex">
                {product.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {product.fitment && product.fitment.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg mb-3">Commonly fitted to</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.fitment.map((f) => (
                      <span key={f} className="badge">
                        {f}
                      </span>
                    ))}
                  </div>
                  <p className="text-[13px] text-[var(--fg-subtle)] mt-3 leading-relaxed">
                    Not listed? Send us a photo of your car on WhatsApp and we will confirm fitment
                    before you order.
                  </p>
                </div>
              )}
            </div>

            {/* Spec sidebar */}
            <aside>
              <div className="surface p-5 sticky top-24">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--fg-subtle)] mb-4">
                  Specifications
                </h3>
                <dl className="space-y-3.5">
                  {product.specs.map((spec) => (
                    <div key={spec.label}>
                      <dt className="text-[12px] text-[var(--fg-subtle)] mb-0.5">{spec.label}</dt>
                      <dd className="text-[13.5px] font-medium leading-snug">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                {(product.warranty || product.installation?.available) && (
                  <div className="mt-5 pt-5 border-t border-[var(--border)] space-y-3">
                    {product.warranty && (
                      <div className="flex gap-2.5">
                        <IconShield
                          width={15}
                          height={15}
                          className="shrink-0 mt-0.5 text-[var(--accent)]"
                        />
                        <span className="text-[13px] text-[var(--fg-muted)] leading-snug">
                          {product.warranty}
                        </span>
                      </div>
                    )}
                    {product.installation?.duration && (
                      <div className="flex gap-2.5">
                        <IconClock
                          width={15}
                          height={15}
                          className="shrink-0 mt-0.5 text-[var(--accent)]"
                        />
                        <span className="text-[13px] text-[var(--fg-muted)] leading-snug">
                          Fitting takes {product.installation.duration}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5">
                <DeliveryEstimator />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ==================================================== SERVICE */}
      {service && (
        <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="container-nex py-16 md:py-20">
            <div className="surface p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
              <span className="shrink-0 grid place-items-center w-14 h-14 rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)]">
                <IconTool width={26} height={26} />
              </span>
              <div className="flex-1">
                <p className="eyebrow mb-2">Fitted by us</p>
                <h2 className="text-xl md:text-2xl mb-2">{service.name}</h2>
                <p className="text-[var(--fg-muted)] leading-relaxed max-w-2xl">
                  {service.tagline} Read exactly how we do it, step by step, and what we do
                  differently.
                </p>
              </div>
              <Link href={`/services/${service.slug}`} className="btn btn-outline shrink-0">
                See the process
                <IconArrowRight width={16} height={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================== FAQ */}
      {product.faqs && product.faqs.length > 0 && (
        <section className="border-t border-[var(--border)]">
          <div className="container-nex py-16 md:py-20">
            <div className="max-w-3xl">
              <p className="eyebrow mb-3">Questions</p>
              <h2 className="text-heading mb-7">
                What people ask about the {product.name.toLowerCase()}
              </h2>
              <Faq items={product.faqs} />
            </div>
          </div>
        </section>
      )}

      {/* ==================================================== RELATED */}
      {related.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--bg-subtle)]">
          <div className="container-nex py-16 md:py-20">
            <h2 className="text-heading mb-7">Goes well with this</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <RecentlyViewed exclude={product.slug} />
    </>
  );
}
