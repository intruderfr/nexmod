/**
 * Locale configuration.
 *
 * Sri Lanka has two official languages — Sinhala and Tamil — with English as a
 * link language. All three are prefixed in the URL (`/en`, `/si`, `/ta`) rather
 * than leaving one at the root, so hreflang stays unambiguous and no locale is
 * implicitly privileged in the URL structure.
 */

export const locales = ["en", "si", "ta"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export interface LocaleMeta {
  code: Locale;
  /** Name in the language itself — never translated. */
  native: string;
  /** Name in English, for the switcher's accessible label. */
  english: string;
  /** BCP 47 tag used in <html lang> and hreflang. */
  htmlLang: string;
  dir: "ltr";
  /** Short label for the compact switcher. */
  short: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    native: "English",
    english: "English",
    htmlLang: "en-LK",
    dir: "ltr",
    short: "EN",
  },
  si: {
    code: "si",
    native: "සිංහල",
    english: "Sinhala",
    htmlLang: "si-LK",
    dir: "ltr",
    short: "සිං",
  },
  ta: {
    code: "ta",
    native: "தமிழ்",
    english: "Tamil",
    htmlLang: "ta-LK",
    dir: "ltr",
    short: "தமி",
  },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Build a locale-prefixed path.
 *
 * Every internal link goes through this so a locale can never be dropped by
 * accident. Pass paths without a leading locale: href("si", "/products").
 */
export function href(locale: Locale, path = "/"): string {
  if (path.startsWith("http") || path.startsWith("mailto:") || path.startsWith("tel:")) {
    return path;
  }
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/**
 * Strip the locale prefix from a pathname, returning the locale-agnostic path.
 * Used by the language switcher to stay on the same page across locales.
 */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) {
    const rest = segments.slice(1).join("/");
    return { locale: first, path: rest ? `/${rest}` : "/" };
  }
  return { locale: defaultLocale, path: pathname || "/" };
}
