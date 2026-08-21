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
 *
 * TWO THINGS HERE EXIST TO UNSTICK A BROKEN CACHE.
 *
 * The registration URL carries ?v=<build>. Browsers decide whether a worker is
 * "new" by byte-comparing the script at its URL; a changed query string is a
 * changed URL, so every deploy is guaranteed to be picked up rather than
 * silently reusing the installed worker.
 *
 * And when a new worker takes control of a page that already had one, we
 * reload once. Without that, a visitor whose cache is serving mismatched
 * chunks sits on a dead page — hydration has thrown, so nothing on it
 * responds to a click — with no way back short of a manual hard refresh.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    const build = process.env.NEXT_PUBLIC_BUILD_ID || "dev";

    // Only reload if this page was already controlled. On a first install the
    // worker claims an uncontrolled page, and reloading there is a pointless
    // flash — and, if anything ever goes wrong, an infinite loop.
    const hadController = Boolean(navigator.serviceWorker.controller);
    let reloaded = false;

    const onControllerChange = () => {
      if (!hadController || reloaded) return;
      reloaded = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    const register = () => {
      navigator.serviceWorker
        .register(`${base}/sw.js?v=${encodeURIComponent(build)}`, { scope: `${base}/` })
        .then((registration) => {
          // Catches the case where the browser has the worker cached and would
          // not otherwise check for a new one this session.
          registration.update().catch(() => undefined);

          // A worker stuck in "waiting" would not apply until every tab closed.
          const waiting = registration.waiting;
          if (waiting) waiting.postMessage("SKIP_WAITING");
        })
        .catch(() => {
          // Registration fails on insecure origins and in some private modes.
          // The site works fine without it, so this is not worth surfacing.
        });
    };

    if (document.readyState === "complete") {
      register();
      return () => {
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      };
    }

    window.addEventListener("load", register, { once: true });
    return () => {
      window.removeEventListener("load", register);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  return null;
}
