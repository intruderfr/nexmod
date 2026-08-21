import type { Metadata } from "next";
import { site } from "@/data/site";

/**
 * Metadata helpers. Every page uses `pageMeta` so that titles, canonicals,
 * Open Graph and Twitter cards stay consistent and nothing is ever forgotten.
 */

interface PageMetaInput {
  title: string;
  description: string;
  /** Path only, e.g. "/services/window-tinting". Canonical is derived from it. */
  path: string;
  keywords?: string[];
  /** Defaults to "website". Articles should pass "article". */
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Suppress indexing — used for internal tools like /studio. */
  noindex?: boolean;
  /** Overrides the generated OG image. */
  image?: string;
}

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${site.url}${clean === "/" ? "" : clean}`;
}

/**
 * Titles are capped so Google does not truncate them mid-word.
 * The suffix is dropped when the title is already long.
 */
function buildTitle(title: string): string {
  const suffix = ` | ${site.name} Sri Lanka`;
  if (title.length + suffix.length <= 60) return title + suffix;
  if (title.length <= 60) return `${title} | ${site.name}`;
  return title;
}

/** Open Graph image is generated per-page by /opengraph-image routes. */
function ogImageFor(path: string): string {
  return absoluteUrl(path === "/" ? "/opengraph-image" : `${path}/opengraph-image`);
}

export function pageMeta({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  noindex = false,
  image,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? ogImageFor(path);

  return {
    title: buildTitle(title),
    description,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: url },
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
      locale: site.locale,
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
