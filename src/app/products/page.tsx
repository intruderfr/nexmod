import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ProductBrowser } from "@/components/ProductBrowser";
import { categories } from "@/data/categories";
import { allFitments, products } from "@/data/products";
import { site } from "@/data/site";
import { absoluteUrl, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Car Accessories & Parts",
  description:
    "Shop premium car accessories in Sri Lanka — carbon fibre, EZ Lip, spoilers, tyre stickers, DRL lighting, car audio, 360 cameras, 7D mats and more. Islandwide delivery or fitted at our Dehiwala workshop.",
  path: "/products",
  keywords: [
    "car accessories Sri Lanka",
    "buy car accessories online Sri Lanka",
    "car parts Colombo",
    "car accessories price Sri Lanka",
    "premium car accessories Dehiwala",
  ],
});

export default function ProductsPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Nexmod car accessories",
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/products/${p.slug}`),
      name: p.name,
    })),
  };

  return (
    <>
      <JsonLd data={itemList} />

      <div className="container-nex pt-6 pb-4">
        <Breadcrumbs trail={[{ name: "Products", path: "/products" }]} />
      </div>

      <section className="container-nex pb-10 border-b border-[var(--border)]">
        <p className="eyebrow mb-2.5">Shop</p>
        <h1 className="text-4xl md:text-5xl mb-4 max-w-2xl">
          Every accessory, supplied and fitted.
        </h1>
        <p className="text-lg text-[var(--fg-muted)] leading-relaxed max-w-2xl">
          {products.length} products across {categories.length} categories. Everything here can be
          delivered islandwide, or fitted properly at our Dehiwala workshop — most of it the same
          day.
        </p>

        <div className="flex flex-wrap gap-2 mt-6">
          {site.usps.map((usp) => (
            <span key={usp} className="badge">
              {usp}
            </span>
          ))}
        </div>
      </section>

      <section className="container-nex py-10">
        <ProductBrowser products={products} categories={categories} fitments={allFitments()} />
      </section>
    </>
  );
}
