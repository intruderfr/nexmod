import type { Metadata } from "next";
import { site } from "@/data/site";
import { defaultLocale, isLocale, localeMeta, locales, type Locale } from "@/i18n/config";

/**
 * Metadata helpers. Every page routes through `pageMeta` so titles, canonicals,
 * hreflang, Open Graph and Twitter cards stay consistent and nothing is ever
 * forgotten.
 */

interface PageMetaInput {
  title: string;
  description: string;
  /**
   * Locale-agnostic path, e.g. "/services/window-tinting". The locale prefix
   * and the full hreflang set are derived from it.
   */
  path: string;
  /** Locale of the page being rendered. Defaults to English. */
  locale?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Suppress indexing — used for internal tools like /studio. */
  noindex?: boolean;
  image?: string;
}

/** Absolute URL for a locale-agnostic path within a given locale. */
export function absoluteUrl(path: string, locale: Locale = defaultLocale): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${site.url}/${locale}${clean}`;
}

/**
 * Titles are capped so Google does not truncate them mid-word.
 * The suffix is dropped when the title is already long.
 */
function buildTitle(title: string, locale: Locale): string {
  const suffix = locale === "en" ? " | Nexmod Sri Lanka" : " | Nexmod";
  if (title.length + suffix.length <= 60) return title + suffix;
  if (title.length <= 60) return `${title} | Nexmod`;
  return title;
}

/** OG images live at the English path — they are language-neutral artwork. */
function ogImageFor(path: string): string {
  const clean = path === "/" ? "" : path;
  return `${site.url}/en${clean}/opengraph-image`;
}

export function pageMeta({
  title,
  description,
  path,
  locale: rawLocale = defaultLocale,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
  image,
}: PageMetaInput): Metadata {
  const locale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const url = absoluteUrl(path, locale);
  const ogImage = image ?? ogImageFor(path);
  const meta = localeMeta[locale];

  return {
    title: buildTitle(title, locale),
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: {
      canonical: url,
      // The same page in every locale, plus x-default. Reciprocal sets are
      // what make Google trust hreflang.
      languages: noindex
        ? undefined
        : {
            ...Object.fromEntries(
              locales.map((l) => [localeMeta[l].htmlLang, absoluteUrl(path, l)]),
            ),
            "x-default": absoluteUrl(path, "en"),
          },
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: site.name,
      locale: meta.htmlLang.replace("-", "_"),
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Clamp a description to a length Google will not truncate. */
export function clampDescription(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
}
