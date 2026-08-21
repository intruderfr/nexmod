import type { CareTier } from "./care";
import type { Article, Product, Service } from "./types";
import raw from "./overrides.json";

/**
 * The editable layer.
 *
 * WHY THIS EXISTS. The site is a static export on GitHub Pages: no server, no
 * database, and therefore nowhere for a hosted admin panel to write to. The
 * catalogue lives in TypeScript files, which is fine for developers and no use
 * at all to the person who needs to change a price on a Tuesday.
 *
 * So the fields that actually change — prices, stock, publish dates, plan fees
 * — are read through this file. The editor at /admin writes overrides.json by
 * committing to the repository through the GitHub API, straight from the
 * browser, and the deploy Action rebuilds from the commit. That is the whole
 * mechanism, and it survives having no backend of our own.
 *
 * WHY A SEPARATE JSON FILE rather than rewriting the .ts sources. Editing
 * TypeScript from a form means parsing and re-emitting code, which fails badly
 * and silently the first time someone types a quote mark into a product name.
 * JSON has no such failure mode, the diff in a pull request is readable, and
 * deleting a key cleanly restores whatever the code says.
 *
 * WHAT IS DELIBERATELY NOT OVERRIDABLE. Body copy, specs, FAQs and images stay
 * in the source files. They are long-form content that belongs in review, not
 * in a form field — and keeping the overridable surface small is what makes
 * this safe to hand to someone who is not a developer.
 */

export interface ProductOverride {
  price?: number;
  compareAt?: number | null;
  inStock?: boolean;
  featured?: boolean;
  /** Keyed by variant id. */
  variants?: Record<string, { price?: number; inStock?: boolean }>;
}

export interface ServiceOverride {
  fromPrice?: number | null;
  priceNote?: string;
  featured?: boolean;
}

export interface ArticleOverride {
  /** ISO date. A future date hides the article until that day. */
  publishedAt?: string;
  featured?: boolean;
}

export interface CareOverride {
  monthly?: number;
  annual?: number;
  discountPct?: number;
  warrantyBonusMonths?: number;
}

export interface Overrides {
  updatedAt: string | null;
  products: Record<string, ProductOverride>;
  services: Record<string, ServiceOverride>;
  articles: Record<string, ArticleOverride>;
  care: Record<string, CareOverride>;
}

/**
 * Read once at module load.
 *
 * The JSON is checked in and bundled, so this is a build-time value on the
 * static export — exactly what we want. Nothing here reads the filesystem at
 * request time, because at request time there is no filesystem.
 */
export const overrides: Overrides = {
  updatedAt: (raw as Partial<Overrides>).updatedAt ?? null,
  products: (raw as Partial<Overrides>).products ?? {},
  services: (raw as Partial<Overrides>).services ?? {},
  articles: (raw as Partial<Overrides>).articles ?? {},
  care: (raw as Partial<Overrides>).care ?? {},
};

/** Every key the admin panel is allowed to write, for validation. */
export const OVERRIDE_SECTIONS = ["products", "services", "articles", "care"] as const;

/**
 * `null` means "clear this back to the source value", which is different from
 * `undefined` meaning "no opinion". Only the former should erase a field.
 */
function pick<T>(value: T | null | undefined, fallback: T | undefined): T | undefined {
  if (value === null) return undefined;
  return value === undefined ? fallback : value;
}

export function applyProductOverrides(list: Product[]): Product[] {
  return list.map((product) => {
    const patch = overrides.products[product.slug];
    if (!patch) return product;

    const variants = product.variants?.map((variant) => {
      const vp = patch.variants?.[variant.id];
      if (!vp) return variant;
      return {
        ...variant,
        price: vp.price ?? variant.price,
        inStock: vp.inStock ?? variant.inStock,
      };
    });

    return {
      ...product,
      price: patch.price ?? product.price,
      compareAt: pick(patch.compareAt, product.compareAt),
      inStock: patch.inStock ?? product.inStock,
      featured: patch.featured ?? product.featured,
      ...(variants ? { variants } : {}),
    };
  });
}

export function applyServiceOverrides(list: Service[]): Service[] {
  return list.map((service) => {
    const patch = overrides.services[service.slug];
    if (!patch) return service;
    return {
      ...service,
      fromPrice: pick(patch.fromPrice, service.fromPrice),
      priceNote: patch.priceNote ?? service.priceNote,
      featured: patch.featured ?? service.featured,
    };
  });
}

export function applyCareOverrides(list: CareTier[]): CareTier[] {
  return list.map((tier) => {
    const patch = overrides.care[tier.id];
    if (!patch) return tier;
    return {
      ...tier,
      monthly: patch.monthly ?? tier.monthly,
      annual: patch.annual ?? tier.annual,
      discountPct: patch.discountPct ?? tier.discountPct,
      warrantyBonusMonths: patch.warrantyBonusMonths ?? tier.warrantyBonusMonths,
    };
  });
}

export function applyArticleOverrides(list: Article[]): Article[] {
  return list.map((article) => {
    const patch = overrides.articles[article.slug];
    if (!patch) return article;
    return {
      ...article,
      publishedAt: patch.publishedAt ?? article.publishedAt,
      featured: patch.featured ?? article.featured,
    };
  });
}
