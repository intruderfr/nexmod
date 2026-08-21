import { ogContentType, ogImage, ogSize } from "@/components/og";
import { getCategory } from "@/data/categories";
import { getProduct, products } from "@/data/products";
import { lkr } from "@/data/site";

/** Required so this route can be emitted by `output: export`. */
export const dynamic = "force-static";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Nexmod product";

export function generateStaticParams() {
  // One locale only: OG art carries no language, and metadata points
  // every locale at the /en image.
  return products.map((p) => ({ locale: "en", slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  const category = product ? getCategory(product.category) : undefined;

  return ogImage({
    eyebrow: category?.name ?? "Car accessories",
    title: product?.name ?? "Nexmod",
    footnote: product ? `From ${lkr(product.price)} · fitted at Dehiwala` : "nexmod.lk",
  });
}
