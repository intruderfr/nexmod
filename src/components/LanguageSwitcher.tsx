"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { href, localeMeta, locales, stripLocale, type Locale } from "@/i18n/config";
import { useDictionary, useLocale } from "@/i18n/client";
import { IconCheck, IconChevronDown } from "./Icons";

/**
 * Language switcher.
 *
 * Switching keeps you on the same page rather than dumping you at the home
 * page — the path is stripped of its locale prefix and re-prefixed. The choice
 * is remembered so a returning visitor lands in their language, but it is never
 * used to override an explicit URL: if someone opens /ta/products, they get
 * Tamil regardless of what is stored.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const locale = useLocale();
  const dict = useDictionary();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(next: Locale) {
    setOpen(false);
    try {
      document.cookie = `nexmod.locale=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      // Cookies blocked — the URL still carries the locale, so this is cosmetic.
    }
    const { path } = stripLocale(pathname);
    router.push(href(next, path));
  }

  const current = localeMeta[locale];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={dict.language.change}
        className={`inline-flex items-center gap-1 h-[var(--hdr-control)] rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-inset)] transition-colors ${
          compact ? "px-2" : "px-2.5"
        }`}
      >
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-wider">
          {current.short}
        </span>
        <IconChevronDown
          width={12}
          height={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={dict.language.label}
          className="absolute right-0 top-full mt-1.5 z-50 min-w-[11rem] surface p-1 shadow-lg animate-fade-in"
        >
          {locales.map((code) => {
            const meta = localeMeta[code];
            const active = code === locale;
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => choose(code)}
                  lang={meta.htmlLang}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded text-left text-[14px] transition-colors ${
                    active
                      ? "text-[var(--accent)] bg-[var(--accent-subtle)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-inset)]"
                  }`}
                >
                  <span>
                    <span className="block font-medium leading-tight">{meta.native}</span>
                    {meta.native !== meta.english && (
                      <span className="block text-[11px] text-[var(--fg-subtle)] mt-0.5">
                        {meta.english}
                      </span>
                    )}
                  </span>
                  {active && <IconCheck width={14} height={14} className="shrink-0" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
