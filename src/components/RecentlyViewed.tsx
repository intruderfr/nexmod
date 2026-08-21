"use client";

import { getProduct } from "@/data/products";
import { usePrefs, useTrackView } from "@/lib/prefs";
import { ProductCard } from "./Cards";

/**
 * Recently viewed products.
 *
 * Renders nothing until there is something worth showing — an empty "recently
 * viewed" heading on a first visit is noise. The current product is excluded so
 * the strip never shows you the page you are already on.
 */
export function RecentlyViewed({ exclude }: { exclude?: string }) {
  const { recent, ready } = usePrefs();

  if (!ready) return null;

  const items = recent
    .filter((slug) => slug !== exclude)
    .map((slug) => getProduct(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  if (items.length < 2) return null;

  return (
    <section className="border-t border-[var(--border)]">
      <div className="container-nex py-12 md:py-16">
        <h2 className="text-heading mb-7">Recently viewed</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Records the view. Separate so the product page can track without rendering. */
export function TrackProductView({ slug }: { slug: string }) {
  useTrackView(slug);
  return null;
}
