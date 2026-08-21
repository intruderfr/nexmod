"use client";

import { useEffect } from "react";

/**
 * Registers the service worker.
 *
 * Deliberately deferred until after load: registering during page load
 * competes with the page's own requests for bandwidth on the exact connection
 * that most needs it — a phone on mobile data in Colombo.
 *
 * Skipped entirely in development, where a stale cached shell is far more
 * annoying than offline support is useful.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

    const register = () => {
      navigator.serviceWorker
        .register(`${base}/sw.js`, { scope: `${base}/` })
        .catch(() => {
          // Registration fails on insecure origins and in some private modes.
          // The site works fine without it, so this is not worth surfacing.
        });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
