export type Money = number; // LKR, integer rupees

export interface ProductVariant {
  id: string;
  label: string;
  price: Money;
  compareAt?: Money;
  sku?: string;
  inStock?: boolean;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Product {
  slug: string;
  name: string;
  /** Short line used on cards and in meta descriptions. */
  tagline: string;
  category: string; // category slug
  brand?: string;
  /** Base price, or the "from" price when variants exist. */
  price: Money;
  compareAt?: Money;
  variants?: ProductVariant[];
  /** Marketing copy, 2–4 paragraphs. Rendered as <p> blocks. */
  body: string[];
  highlights: string[];
  specs: SpecRow[];
  faqs?: FaqItem[];
  /** Vehicles this is commonly fitted to — powers the fitment filter. */
  fitment?: string[];
  installation?: {
    available: boolean;
    /** Fitting fee at the Dehiwala workshop, if charged separately. */
    fee?: Money;
    duration?: string;
    serviceSlug?: string;
  };
  warranty?: string;
  badges?: string[];
  featured?: boolean;
  inStock: boolean;
  /** Related product slugs. */
  related?: string[];
  keywords: string[];
}

export interface Category {
  slug: string;
  name: string;
  /** Plural heading used on the category page. */
  heading: string;
  tagline: string;
  description: string[];
  icon: string;
  keywords: string[];
  featured?: boolean;
}

export interface ServiceStep {
  title: string;
  detail: string;
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  category: "styling" | "protection" | "electronics" | "audio";
  /** "from" price; many jobs are quoted per vehicle. */
  fromPrice?: Money;
  priceNote?: string;
  duration: string;
  body: string[];
  includes: string[];
  process: ServiceStep[];
  specs?: SpecRow[];
  faqs: FaqItem[];
  suitableFor?: string[];
  aftercare?: string[];
  warranty?: string;
  icon: string;
  featured?: boolean;
  relatedProducts?: string[];
  relatedServices?: string[];
  keywords: string[];
}

export interface Article {
  slug: string;
  title: string;
  /** Used for meta description and card excerpt. Keep under 160 chars. */
  excerpt: string;
  category: "guides" | "news" | "trends" | "builds" | "care";
  publishedAt: string; // ISO date
  updatedAt?: string;
  author: string;
  readingMinutes: number;
  tags: string[];
  /** Body as an ordered list of blocks — keeps content data-driven. */
  body: ArticleBlock[];
  faqs?: FaqItem[];
  featured?: boolean;
  relatedProducts?: string[];
  relatedServices?: string[];
  keywords: string[];
}

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] };
