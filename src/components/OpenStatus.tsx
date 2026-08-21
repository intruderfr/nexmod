"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/**
 * Live open/closed indicator.
 *
 * Computes against Sri Lanka Standard Time (UTC+5:30) rather than the
 * visitor's clock — someone browsing from Dubai or London still needs to know
 * whether the Dehiwala workshop is open right now, not whether it would be
 * open in their timezone.
 *
 * Renders nothing on the server pass to avoid a hydration mismatch: the
 * server's "now" and the client's "now" are never the same instant.
 */

const SL_OFFSET_MINUTES = 5 * 60 + 30;

interface Status {
  open: boolean;
  label: string;
  detail: string;
}

function slNow(): { day: number; minutes: number } {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const sl = new Date(utc + SL_OFFSET_MINUTES * 60_000);
  return { day: sl.getDay(), minutes: sl.getHours() * 60 + sl.getMinutes() };
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** site.hours is Monday-first; getDay() is Sunday-first. */
function hoursForDay(day: number) {
  const index = day === 0 ? 6 : day - 1;
  return site.hours[index];
}

function computeStatus(): Status {
  const { day, minutes } = slNow();
  const today = hoursForDay(day);

  if (today?.opens && today.closes) {
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);

    if (minutes >= opens && minutes < closes) {
      const left = closes - minutes;
      return {
        open: true,
        label: "Open now",
        detail:
          left <= 60
            ? `Closes in ${left} min`
            : `Closes ${today.closes}`,
      };
    }
    if (minutes < opens) {
      return { open: false, label: "Closed", detail: `Opens today ${today.opens}` };
    }
  }

  // Walk forward to the next day that has opening hours.
  for (let step = 1; step <= 7; step += 1) {
    const next = hoursForDay((day + step) % 7);
    if (next?.opens) {
      return {
        open: false,
        label: "Closed",
        detail: step === 1 ? `Opens tomorrow ${next.opens}` : `Opens ${next.short} ${next.opens}`,
      };
    }
  }

  return { open: false, label: "Closed", detail: "" };
}

export function OpenStatus({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    setStatus(computeStatus());
    // Re-check each minute so "closes in 12 min" stays truthful.
    const id = window.setInterval(() => setStatus(computeStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) {
    // Reserve the line so the bar does not jump when this appears.
    return <span className="inline-block h-4" aria-hidden="true" />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${compact ? "text-[11.5px]" : "text-xs"}`}
      title={`${status.label} · ${status.detail}`}
    >
      <span className="relative flex w-1.5 h-1.5 shrink-0">
        {status.open && (
          <span className="absolute inset-0 rounded-full bg-[var(--ok)] animate-ping opacity-60" />
        )}
        <span
          className={`relative w-1.5 h-1.5 rounded-full ${
            status.open ? "bg-[var(--ok)]" : "bg-[var(--fg-faint)]"
          }`}
        />
      </span>
      <span className="font-medium">{status.label}</span>
      {status.detail && (
        <span className="opacity-60 hidden sm:inline">· {status.detail}</span>
      )}
    </span>
  );
}
