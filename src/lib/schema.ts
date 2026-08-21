import { site } from "@/data/site";
import type { Article, Category, FaqItem, Product, Service } from "@/data/types";
import { absoluteUrl } from "./seo";

/**
 * JSON-LD structured data.
 *
 * Everything is emitted as a connected @graph where possible so Google can
 * resolve entity relationships (organisation → local business → product →
 * offer) rather than treating each block in isolation.
 */

const ORG_ID = `${site.url}/#organization`;
const BUSINESS_ID = `${site.url}/#localbusiness`;
const WEBSITE_ID = `${site.url}/#website`;

/** Opening hours in the shape schema.org expects, skipping closed days. */
function openingHours() {
  return site.hours
    .filter((h) => h.opens && h.closes)
    .map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.opens,
      closes: h.closes,
    }));
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    description: site.description,
    foundingDate: site.founded,
    telephone: site.contact.phoneIntl,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    sameAs: [site.social.facebook, site.social.instagram, site.social.tiktok],
  };
}

export function localBusinessSchema() {
  return {
    "@type": ["AutoPartsStore", "AutoBodyShop", "LocalBusiness"],
    "@id": BUSINESS_ID,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.contact.phoneIntl,
    email: site.contact.email,
    priceRange: "$$",
    currenciesAccepted: site.currency,
    paymentAccepted: site.payments.map((p) => p.label).join(", "),
    parentOrganization: { "@id": ORG_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.latitude,
      longitude: site.address.longitude,
    },
    hasMap: site.address.mapsUrl,
    openingHoursSpecification: openingHours(),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    areaServed: [
      { "@type": "City", name: "Colombo" },
      { "@type": "City", name: "Dehiwala-Mount Lavinia" },
      { "@type": "Country", name: "Sri Lanka" },
    ],
    sameAs: [site.social.facebook, site.social.instagram, site.social.tiktok],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description: site.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-LK",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** The site-wide graph, emitted once in the root layout. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), localBusinessSchema(), websiteSchema()],
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function productSchema(product: Product) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const prices = product.variants?.length
    ? product.variants.map((v) => v.price)
    : [product.price];

  const offers =
    product.variants && product.variants.length > 1
      ? {
          "@type": "AggregateOffer",
          priceCurrency: site.currency,
          lowPrice: Math.min(...prices),
          highPrice: Math.max(...prices),
          offerCount: product.variants.length,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: { "@id": ORG_ID },
        }
      : {
          "@type": "Offer",
          url,
          priceCurrency: site.currency,
          price: product.price,
          availability: product.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": ORG_ID },
        };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.tagline,
    url,
    sku: product.slug,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    category: product.category,
    offers,
    ...(product.warranty
      ? {
          hasMerchantReturnPolicy: undefined,
          additionalProperty: [
            { "@type": "PropertyValue", name: "Warranty", value: product.warranty },
          ],
        }
      : {}),
  };
}

export function serviceSchema(service: Service) {
  const url = absoluteUrl(`/services/${service.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.tagline,
    url,
    serviceType: service.name,
    provider: { "@id": BUSINESS_ID },
    areaServed: [
      { "@type": "City", name: "Colombo" },
      { "@type": "Country", name: "Sri Lanka" },
    ],
    ...(service.fromPrice
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: site.currency,
            price: service.fromPrice,
            priceSpecification: {
              "@type": "PriceSpecification",
              priceCurrency: site.currency,
              minPrice: service.fromPrice,
              valueAddedTaxIncluded: true,
            },
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.name} — what's included`,
      itemListElement: service.includes.map((item, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: item },
      })),
    },
  };
}

export function articleSchema(article: Article) {
  const url = absoluteUrl(`/articles/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", name: article.author, "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    keywords: article.keywords.join(", "),
    articleSection: article.category,
    inLanguage: "en-LK",
    wordCount: article.readingMinutes * 220,
    image: [absoluteUrl(`/articles/${article.slug}/opengraph-image`)],
  };
}

export function collectionSchema(category: Category, products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.heading,
    description: category.tagline,
    url: absoluteUrl(`/categories/${category.slug}`),
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/products/${p.slug}`),
        name: p.name,
      })),
    },
  };
}

/** Serialise safely for inline <script> — escapes the sequence that could break out. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
