"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-reveal driver.
 *
 * Mounted once in the root layout. It observes every `[data-reveal]` element on
 * the page and stamps `data-revealed` when it enters the viewport; the CSS in
 * globals.css does the actual animating.
 *
 * Design decisions worth keeping:
 *  - Elements already in view on first paint are revealed immediately with no
 *    delay, so the top of the page never animates in after the user is looking
 *    at it.
 *  - Children of a `[data-reveal-group]` get an incremental delay, which gives
 *    grids a stagger without hard-coding delays into markup.
 *  - A MutationObserver picks up nodes added later by client filtering, so
 *    catalogue results reveal too.
 *  - Reveal is one-way. Re-hiding on scroll-up feels like a gimmick.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No IntersectionObserver, or the user prefers no motion: show everything.
    if (reduced || !("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
        .forEach((el) => el.setAttribute("data-revealed", ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.setAttribute("data-revealed", "");
          observer.unobserve(el);
        }
      },
      // Fire slightly before the element reaches the fold so it is settled by
      // the time it is properly in view.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    const register = (root: ParentNode) => {
      const nodes = root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");

      nodes.forEach((el) => {
        // Stagger within a group, capped so a long list never crawls in.
        const group = el.closest("[data-reveal-group]");
        if (group && !el.style.getPropertyValue("--reveal-delay")) {
          const siblings = Array.from(group.querySelectorAll("[data-reveal]"));
          const index = siblings.indexOf(el);
          if (index > 0) {
            el.style.setProperty("--reveal-delay", `${Math.min(index * 55, 400)}ms`);
          }
        }

        // Anything already on screen at mount should not animate in late.
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          el.style.setProperty("--reveal-delay", "0ms");
          el.setAttribute("data-revealed", "");
          return;
        }

        observer.observe(el);
      });
    };

    register(document);

    // Client-rendered content (filtered products, search results) arrives late.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) register(node as Element);
        }
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
