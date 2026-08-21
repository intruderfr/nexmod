"use client";

import { useCallback, useEffect, useState } from "react";
import { IconMoon, IconSun } from "./Icons";

type Theme = "light" | "dark" | "system";

/**
 * Theme toggle. Cycles light → dark → system.
 *
 * The initial theme is applied by an inline script in the root layout before
 * first paint, so there is no flash. This component mirrors and updates it.
 *
 * The icon reflects the *resolved* theme (what is actually on screen), which
 * for "system" means following the OS preference live.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  const resolve = useCallback((t: Theme): "light" | "dark" => {
    if (t !== "system") return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem("nexmod.theme") as Theme | null) ?? "system";
    setTheme(stored);
    setResolved(resolve(stored));
    setMounted(true);
  }, [resolve]);

  // Follow the OS preference while in system mode.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(mq.matches ? "dark" : "light");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  function apply(next: Theme) {
    setTheme(next);
    setResolved(resolve(next));
    const root = document.documentElement;
    if (next === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem("nexmod.theme");
    } else {
      root.setAttribute("data-theme", next);
      localStorage.setItem("nexmod.theme", next);
    }
  }

  function cycle() {
    apply(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  }

  // Fixed-size placeholder so layout does not shift on hydration.
  if (!mounted) {
    return <span className="w-[var(--hdr-control)] h-[var(--hdr-control)] shrink-0" aria-hidden="true" />;
  }

  const label =
    theme === "system" ? "Theme: system" : theme === "dark" ? "Theme: dark" : "Theme: light";

  return (
    <button
      type="button"
      onClick={cycle}
      title={label}
      aria-label={`${label}. Click to change.`}
      className="relative hdr-btn"
    >
      {resolved === "dark" ? (
        <IconMoon width={18} height={18} />
      ) : (
        <IconSun width={18} height={18} />
      )}
      {theme === "system" && (
        <span className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-[var(--accent)]" />
      )}
    </button>
  );
}
