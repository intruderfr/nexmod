"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site, waLink } from "@/data/site";
import { IconClose, IconWhatsApp } from "./Icons";

/**
 * Floating WhatsApp button. Nexmod already takes most enquiries on WhatsApp,
 * so this is the primary conversion path on mobile.
 *
 * The prompt bubble appears once per session after a short delay, and is
 * suppressed on checkout so it cannot distract from a completing order.
 *
 * NOTHING INVISIBLE HERE MAY EAT A CLICK.
 * This is a fixed element sitting over the bottom-right of every page, which
 * is where the footer links and the last row of product cards live. Two parts
 * of it used to swallow clicks while drawing nothing:
 *
 *   - The wrapper is a flex column with a gap. Between the bubble and the
 *     button, and to the left of the button, is wrapper box with no pixels in
 *     it. It is now pointer-events-none, with the two real controls opting
 *     back in.
 *   - The pulse ring animates to twice its size, so a 56px button was
 *     intercepting clicks across 112px. It is decorative, so it is now
 *     pointer-events-none and hidden from assistive tech.
 *
 * The bubble itself still blocks what is behind it, which is correct — it is
 * opaque and visible, it has a dismiss button, and it now takes itself away
 * after a few seconds rather than camping on the footer for the session.
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("nexmod.wa.prompt");
    if (seen) return;
    setDismissed(false);

    const show = window.setTimeout(() => setShowPrompt(true), 9000);

    /*
     * And then retire itself. The bubble is opaque and sits over the bottom
     * right of the page, which on the home page is the footer contact links
     * and the last row of product cards. Left up, it quietly costs the visitor
     * those taps for the rest of the session. Eight seconds is long enough to
     * read fifteen words.
     */
    const hide = window.setTimeout(() => {
      setShowPrompt(false);
      sessionStorage.setItem("nexmod.wa.prompt", "1");
    }, 17000);

    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  function dismiss() {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem("nexmod.wa.prompt", "1");
  }

  if (pathname.startsWith("/checkout")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 print:hidden pointer-events-none">
      {showPrompt && !dismissed && (
        <div className="relative max-w-[16rem] surface p-4 pr-9 shadow-xl animate-fade-up pointer-events-auto">
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-2 right-2 grid place-items-center w-6 h-6 rounded text-[var(--fg-subtle)] hover:text-[var(--fg)]"
            aria-label="Dismiss"
          >
            <IconClose width={13} height={13} />
          </button>
          <p className="text-[13px] font-semibold mb-1">Not sure what fits?</p>
          <p className="text-[12.5px] text-[var(--fg-muted)] leading-relaxed">
            Send a photo of your car and we&rsquo;ll tell you what works — usually within a few
            minutes.
          </p>
        </div>
      )}

      <a
        href={waLink(
          "Hi Nexmod, I'd like to ask about car accessories and fitting for my vehicle.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        onClick={dismiss}
        className="group relative grid place-items-center w-14 h-14 rounded-full pointer-events-auto bg-[#25d366] text-[#05291a] shadow-lg shadow-black/25 hover:scale-105 active:scale-95 transition-transform"
        aria-label={`Message Nexmod on WhatsApp at ${site.contact.phoneDisplay}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-20"
        />
        <IconWhatsApp width={26} height={26} className="relative" />
      </a>
    </div>
  );
}
