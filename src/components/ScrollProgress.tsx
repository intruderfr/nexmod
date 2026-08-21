"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Reading-progress hairline pinned to the very top of the viewport.
 *
 * Only shown on long-form routes — on a product grid it would be noise. Driven
 * by a rAF-throttled scroll listener writing a CSS scaleX, so it never triggers
 * layout.
 */
const LONG_FORM = ["/articles/", "/services/", "/about", "/faq", "/delivery-returns", "/privacy", "/terms"];

export function ScrollProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  const active =
    LONG_FORM.some((prefix) => pathname.startsWith(prefix)) &&
    pathname !== "/articles/" &&
    pathname !== "/services/";

  useEffect(() => {
    if (!active) return;

    const bar = barRef.current;
    if (!bar) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      bar.style.transform = `scaleX(${ratio})`;
      bar.style.opacity = ratio > 0.005 ? "1" : "0";
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [active, pathname]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] pointer-events-none print:hidden"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-[var(--accent)] opacity-0 transition-opacity duration-300"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
