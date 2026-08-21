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
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("nexmod.wa.prompt");
    if (seen) return;
    setDismissed(false);
    const t = window.setTimeout(() => setShowPrompt(true), 9000);
    return () => window.clearTimeout(t);
  }, []);

  function dismiss() {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem("nexmod.wa.prompt", "1");
  }

  if (pathname.startsWith("/checkout")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 print:hidden">
      {showPrompt && !dismissed && (
        <div className="relative max-w-[16rem] surface p-4 pr-9 shadow-xl animate-fade-up">
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
        className="group relative grid place-items-center w-14 h-14 rounded-full bg-[#25d366] text-[#05291a] shadow-lg shadow-black/25 hover:scale-105 active:scale-95 transition-transform"
        aria-label={`Message Nexmod on WhatsApp at ${site.contact.phoneDisplay}`}
      >
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-20" />
        <IconWhatsApp width={26} height={26} className="relative" />
      </a>
    </div>
  );
}
