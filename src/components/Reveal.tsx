"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll-reveal driver.
 *
 * Mounted once in the root layout. It observes every `[data-reveal]` element
 * and stamps `data-revealed` when it enters the viewport; the CSS in
 * globals.css does the animating.
 *
 * SAFETY FIRST, THEN THE EFFECT.
 * `[data-reveal]` starts at opacity 0, which means any failure to run this
 * leaves content permanently invisible — a dead-looking, unclickable page.
 * That has to be impossible, so there are four independent ways out:
 *
 *   1. `prefers-reduced-motion` or no IntersectionObserver — reveal everything
 *      immediately.
 *   2. A zero-size viewport (embedded frames, some headless contexts) would
 *      mean the observer never fires — detected and everything revealed.
 *   3. A hard 1200ms failsafe reveals anything still hidden, whatever the
 *      reason.
 *   4. CSS handles the no-JS case entirely, so this file never running at all
 *      still shows the page.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const revealAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")
        .forEach((el) => el.setAttribute("data-revealed", ""));
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noObserver = !("IntersectionObserver" in window);
    // A viewport with no height means nothing can ever intersect it.
    const noViewport = window.innerHeight === 0 || window.innerWidth === 0;

    if (reduced || noObserver || noViewport) {
      revealAll();
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

    /*
     * Failsafe. If anything above went wrong — an observer that never fires,
     * a layout that reports zero heights, a browser quirk — show the content
     * anyway. A missed animation is invisible; missing content is not.
     */
    const failsafe = window.setTimeout(revealAll, 1200);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
