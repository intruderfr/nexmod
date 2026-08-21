import { ogContentType, ogImage, ogSize } from "@/components/og";
import { categories, getCategory } from "@/data/categories";
import { productsInCategory } from "@/data/products";

/** Required so this route can be emitted by `output: export`. */
export const dynamic = "force-static";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Nexmod category";

export function generateStaticParams() {
  // One locale only: OG art carries no language, and metadata points
  // every locale at the /en image.
  return categories.map((c) => ({ locale: "en", slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  const count = category ? productsInCategory(category.slug).length : 0;

  return ogImage({
    eyebrow: "Shop",
    title: category?.heading ?? "Car accessories",
    footnote: `${count} products · supplied and fitted`,
  });
}
