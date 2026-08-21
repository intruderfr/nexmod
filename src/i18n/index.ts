import { en, type Dictionary } from "./dictionaries/en";
import { si } from "./dictionaries/si";
import { ta } from "./dictionaries/ta";
import { defaultLocale, isLocale, type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, si, ta };

/**
 * Dictionaries are plain objects rather than dynamic imports — the total
 * payload is small, and keeping them synchronous means every page stays
 * statically renderable.
 */
export function getDictionary(locale: string): Dictionary {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

export type { Dictionary };
export * from "./config";
