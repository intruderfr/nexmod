"use client";

import { LocaleLink as Link, useDictionary, useLocale } from "@/i18n/client";
import {
  categoryName,
  categoryTagline,
  productTagline,
  serviceName,
  serviceTagline,
} from "@/i18n/content";
import { getCategory } from "@/data/categories";
import { lkr } from "@/data/site";
import type { Article, Product, Service } from "@/data/types";
import { formatDateShort } from "@/lib/content";
import { priceRange } from "@/data/products";
import { CategoryIcon, IconArrowRight, IconClock, IconTool } from "./Icons";
import { Photo } from "./Photo";
import { Visual } from "./Visual";
import {
  articleImage,
  categoryImage,
  productImage,
  serviceImage,
} from "@/data/imagery";

/* ------------------------------------------------------------------ Product */

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const dict = useDictionary();
  const category = getCategory(product.category);
  const range = priceRange(product);
  const hasRange = range.min !== range.max;
  const photo = productImage(product.slug, product.category);

  return (
    <article className="surface surface-hover overflow-hidden flex flex-col group">
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden">
        {photo ? (
          <Photo
            image={photo}
            ratio="wide"
            zoom
            scrim="soft"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <Visual
            variant={product.category}
            icon={category?.icon ?? "tool"}
            label={category ? categoryName(category.slug, locale, category.name) : undefined}
            ratio="wide"
          />
        )}
        {product.badges && product.badges.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 max-w-[calc(100%-1.25rem)]">
            {product.badges.slice(0, 2).map((b) => (
              <span
                key={b}
                className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-[var(--accent)] text-white"
              >
                {b}
              </span>
            ))}
          </div>
        )}
        {product.compareAt && product.compareAt > product.price && (
          <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded text-[10px] font-bold bg-white text-black">
            −{Math.round((1 - product.price / product.compareAt) * 100)}%
          </span>
        )}
      </Link>

      <div className="flex-1 flex flex-col p-4">
        {product.brand && (
          <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-[var(--accent)] mb-1.5">
            {product.brand}
          </span>
        )}

        <h3 className="font-semibold text-[15px] leading-snug mb-1.5">
          <Link href={`/products/${product.slug}`} className="hover:text-[var(--accent)] transition-colors">
            {product.name}
          </Link>
        </h3>

        <p className="text-[13px] text-[var(--fg-muted)] leading-relaxed line-clamp-2 mb-3">
          {productTagline(product.slug, locale, product.tagline)}
        </p>

        <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-end justify-between gap-3">
          <div>
            <span className="block text-[10.5px] uppercase tracking-wider text-[var(--fg-subtle)]">
              {hasRange ? dict.commerce.from : dict.commerce.price}
            </span>
            <span className="text-lg font-bold tabular-nums leading-tight">
              {lkr(range.min)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="ml-1.5 text-xs text-[var(--fg-subtle)] line-through tabular-nums">
                {lkr(product.compareAt)}
              </span>
            )}
          </div>

          {product.installation?.available && (
            <span className="badge shrink-0">
              <IconTool width={11} height={11} />
              {dict.commerce.fitting}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Service */

export function ServiceCard({ service }: { service: Service }) {
  const locale = useLocale();
  const dict = useDictionary();
  const photo = serviceImage(service.slug);

  return (
    <article className="surface surface-hover overflow-hidden flex flex-col group">
      <Link href={`/services/${service.slug}`} className="block overflow-hidden">
        {photo ? (
          <Photo
            image={photo}
            ratio="wide"
            zoom
            scrim="soft"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <Visual variant={service.category} icon={service.icon} ratio="wide" />
        )}
      </Link>

      <div className="flex-1 flex flex-col p-5">
        <div className="flex items-start gap-3 mb-2.5">
          <span className="shrink-0 grid place-items-center w-9 h-9 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)]">
            <CategoryIcon name={service.icon} width={17} height={17} />
          </span>
          <h3 className="font-semibold text-[16px] leading-snug pt-1.5">
            <Link href={`/services/${service.slug}`} className="hover:text-[var(--accent)] transition-colors">
              {serviceName(service.slug, locale, service.name)}
            </Link>
          </h3>
        </div>

        <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed mb-4 line-clamp-2">
          {serviceTagline(service.slug, locale, service.tagline)}
        </p>

        <div className="mt-auto pt-3.5 border-t border-[var(--border)] flex items-center justify-between gap-3">
          <div className="min-w-0">
            {service.fromPrice && (
              <span className="block text-[15px] font-bold tabular-nums leading-tight">
                {dict.commerce.from} {lkr(service.fromPrice)}
              </span>
            )}
            <span className="flex items-center gap-1 text-[11.5px] text-[var(--fg-subtle)] mt-0.5">
              <IconClock width={11} height={11} />
              <span className="truncate">{service.duration}</span>
            </span>
          </div>
          <IconArrowRight
            width={17}
            height={17}
            className="shrink-0 text-[var(--fg-subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all"
          />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Article */

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  const dict = useDictionary();
  const photo = articleImage(article.slug);

  const categoryIcon =
    article.category === "news"
      ? "essentials"
      : article.category === "care"
        ? "detail"
        : article.category === "trends"
          ? "spoiler"
          : "carbon";

  return (
    <article
      className={`surface surface-hover overflow-hidden flex flex-col group ${
        featured ? "md:flex-row" : ""
      }`}
    >
      <Link
        href={`/articles/${article.slug}`}
        className={featured ? "block md:w-[46%] shrink-0 overflow-hidden" : "block overflow-hidden"}
      >
        {photo ? (
          <Photo
            image={photo}
            ratio="wide"
            zoom
            scrim="soft"
            className={featured ? "md:h-full md:aspect-auto" : ""}
            sizes={featured ? "(max-width: 768px) 100vw, 46vw" : "(max-width: 640px) 100vw, 33vw"}
          />
        ) : (
          <Visual
            variant={article.category === "news" ? "ez-lip" : "carbon-fibre"}
            icon={categoryIcon}
            label={article.category}
            ratio="wide"
            className={featured ? "md:h-full" : ""}
          />
        )}
      </Link>

      <div className={`flex-1 flex flex-col p-5 ${featured ? "md:p-7 md:justify-center" : ""}`}>
        <div className="flex items-center gap-2.5 text-[11.5px] text-[var(--fg-subtle)] mb-2.5">
          <span className="badge badge-accent capitalize">{article.category}</span>
          <time dateTime={article.publishedAt}>{formatDateShort(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>
            {article.readingMinutes} {dict.common.minRead}
          </span>
        </div>

        <h3
          className={`font-semibold leading-snug mb-2 ${
            featured ? "text-xl md:text-2xl" : "text-[16px]"
          }`}
        >
          <Link href={`/articles/${article.slug}`} className="hover:text-[var(--accent)] transition-colors">
            {article.title}
          </Link>
        </h3>

        <p
          className={`text-[var(--fg-muted)] leading-relaxed ${
            featured ? "text-[15px] line-clamp-3" : "text-[13.5px] line-clamp-2"
          }`}
        >
          {article.excerpt}
        </p>

        {featured && (
          <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-[var(--accent)]">
            {dict.actions.readGuide}
            <IconArrowRight width={15} height={15} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------- Category */

export function CategoryCard({
  slug,
  name,
  tagline,
  icon,
  count,
}: {
  slug: string;
  name: string;
  tagline: string;
  icon: string;
  count: number;
}) {
  const locale = useLocale();
  const photo = categoryImage(slug);

  return (
    <Link
      href={`/categories/${slug}`}
      className="surface surface-hover overflow-hidden flex flex-col group"
    >
      {photo ? (
        <Photo
          image={photo}
          ratio="square"
          zoom
          scrim="bottom"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      ) : (
        <Visual variant={slug} icon={icon} ratio="square" />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-semibold text-[15px] group-hover:text-[var(--accent)] transition-colors">
            {categoryName(slug, locale, name)}
          </h3>
          <span className="text-[11px] text-[var(--fg-subtle)] tabular-nums shrink-0">{count}</span>
        </div>
        <p className="text-[12.5px] text-[var(--fg-muted)] leading-snug line-clamp-2">
          {categoryTagline(slug, locale, tagline)}
        </p>
      </div>
    </Link>
  );
}
