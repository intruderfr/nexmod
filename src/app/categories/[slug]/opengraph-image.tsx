import { ogContentType, ogImage, ogSize } from "@/components/og";
import { categories, getCategory } from "@/data/categories";
import { productsInCategory } from "@/data/products";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Nexmod category";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  const count = category ? productsInCategory(category.slug).length : 0;

  return ogImage({
    eyebrow: "Shop",
    title: category?.heading ?? "Car accessories",
    footnote: `${count} products · supplied and fitted`,
  });
}
