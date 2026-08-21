"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { defaultLocale, href, isLocale, type Locale } from "./config";
import { getDictionary, type Dictionary } from "./index";

/**
 * Locale-aware client helpers.
 *
 * `usePathname()` is available during server rendering as well as on the
 * client, so these components emit correct locale-prefixed HTML for crawlers
 * without every page having to thread a `locale` prop down through its tree.
 */

/** The locale of the page currently being rendered. */
export function useLocale(): Locale {
  const pathname = usePathname() ?? "/";
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isLocale(first) ? first : defaultLocale;
}

/** The dictionary for the current locale. */
export function useDictionary(): Dictionary {
  return getDictionary(useLocale());
}

/**
 * Drop-in replacement for next/link that prefixes the current locale.
 *
 * Pass locale-agnostic paths — `/products`, not `/en/products`. External,
 * mailto:, tel: and hash links pass through untouched.
 */
export function LocaleLink({
  href: to,
  ...props
}: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const locale = useLocale();

  const resolved =
    to.startsWith("http") ||
    to.startsWith("mailto:") ||
    to.startsWith("tel:") ||
    to.startsWith("#")
      ? to
      : href(locale, to);

  return <NextLink href={resolved} {...props} />;
}
