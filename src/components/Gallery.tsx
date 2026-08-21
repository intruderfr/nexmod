"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { generatedImages, type ImageKey } from "@/data/images.generated";
import { waLink } from "@/data/site";
import { IconArrowRight, IconClose, IconWhatsApp } from "./Icons";
import { Photo } from "./Photo";

/**
 * Gallery with a lightbox.
 *
 * Filterable by discipline, keyboard-navigable, and honest about what it is:
 * the caption on every item makes clear these are reference images rather than
 * photographs of Nexmod's own completed jobs. Replacing public/images with the
 * workshop's own shots and updating this list is all it takes to make it real.
 */

interface Shot {
  key: ImageKey;
  title: string;
  discipline: Discipline;
  note: string;
}

type Discipline = "all" | "carbon" | "body" | "lighting" | "wheels" | "workshop";

const FILTERS: { id: Discipline; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "carbon", label: "Carbon & wraps" },
  { id: "body", label: "Body & kits" },
  { id: "lighting", label: "Lighting" },
  { id: "wheels", label: "Wheels & tyres" },
  { id: "workshop", label: "In the workshop" },
];

const SHOTS: Shot[] = [
  { key: "cat-carbon-fibre", title: "Carbon accents, full car", discipline: "carbon", note: "8D gloss carbon on bumper trim and mirror caps." },
  { key: "svc-wrapping", title: "Full wrap", discipline: "carbon", note: "Panel-by-panel wrap, edges post-heated and sealed." },
  { key: "cat-ez-lip", title: "Front lip", discipline: "body", note: "Flexible lip bonded to the bumper leading edge." },
  { key: "cat-spoilers-body", title: "Rear wing and diffuser", discipline: "body", note: "Bonded and sealed, boot seal integrity verified." },
  { key: "cat-body-kits", title: "Three-piece lip kit", discipline: "body", note: "Front lip, skirts and diffuser fitted as one set." },
  { key: "build-05", title: "OEM-plus front end", discipline: "body", note: "Sport-trim bumper and grille conversion." },
  { key: "build-01", title: "Coupe build", discipline: "body", note: "Lip kit, spoiler and tyre lettering together." },
  { key: "build-02", title: "Front-end refresh", discipline: "lighting", note: "Bi-LED projector retrofit, beam aimed on a board." },
  { key: "cat-lighting", title: "Night lighting", discipline: "lighting", note: "Sequential DRL and indicator sweep." },
  { key: "svc-tinting", title: "Ceramic tint", discipline: "lighting", note: "Nano-ceramic film, computer-cut, within legal VLT." },
  { key: "cat-tyre-stickers", title: "Wheel and sidewall", discipline: "wheels", note: "TyreDeckz rubber lettering on a cleaned sidewall." },
  { key: "svc-tyre", title: "Wheels off", discipline: "wheels", note: "Lettering applied with the wheel off the car." },
  { key: "cat-interior", title: "Cabin at night", discipline: "carbon", note: "Fibre-optic ambient lighting, source hidden in the trim." },
  { key: "svc-detailing", title: "Decontamination wash", discipline: "workshop", note: "Two-bucket wash before any correction or coating." },
  { key: "svc-lift", title: "On the lift", discipline: "workshop", note: "Sound deadening and underbody access." },
  { key: "svc-workshop", title: "Electrical work", discipline: "workshop", note: "Loom routed and soldered, never scotch-locked." },
  { key: "workshop-bay", title: "The bay", discipline: "workshop", note: "Where the work actually happens." },
  { key: "build-03", title: "Finished and out", discipline: "body", note: "Collected after a full styling package." },
  { key: "build-04", title: "On the road", discipline: "body", note: "Lip kit and lettering, daily driven." },
  { key: "build-06", title: "Showroom finish", discipline: "carbon", note: "Corrected paint under a ceramic coating." },
];

export function Gallery() {
  const [filter, setFilter] = useState<Discipline>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const shots = useMemo(
    () => (filter === "all" ? SHOTS : SHOTS.filter((s) => s.discipline === filter)),
    [filter],
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((i) => (i === null ? null : (i + delta + shots.length) % shots.length)),
    [shots.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  // Filtering can shorten the list under an open lightbox.
  useEffect(() => setOpenIndex(null), [filter]);

  const active = openIndex === null ? null : shots[openIndex];

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter gallery">
        {FILTERS.map((f) => {
          const count = f.id === "all" ? SHOTS.length : SHOTS.filter((s) => s.discipline === f.id).length;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`btn btn-sm ${filter === f.id ? "btn-primary" : "btn-outline"}`}
            >
              {f.label}
              <span className="figure text-[11px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-reveal-group>
        {shots.map((shot, i) => (
          <li key={shot.key + shot.title} data-reveal>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full text-left surface surface-hover overflow-hidden"
              aria-label={`Open ${shot.title}`}
            >
              <Photo
                image={shot.key}
                ratio="square"
                zoom
                scrim="bottom"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <span className="block p-3.5">
                <span className="block text-[13.5px] font-semibold leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {shot.title}
                </span>
                <span className="block text-[11.5px] text-[var(--fg-subtle)] mt-0.5 line-clamp-1">
                  {shot.note}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <div className="absolute inset-0 bg-black/90 animate-fade-in" onClick={close} />

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 grid place-items-center w-11 h-11 rounded-lg bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors"
          >
            <IconClose width={20} height={20} />
          </button>

          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
            className="absolute left-3 md:left-6 z-10 grid place-items-center w-11 h-11 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors rotate-180"
          >
            <IconArrowRight width={20} height={20} />
          </button>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
            className="absolute right-3 md:right-6 z-10 grid place-items-center w-11 h-11 rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors"
          >
            <IconArrowRight width={20} height={20} />
          </button>

          <figure className="relative max-w-5xl w-full animate-fade-up">
            <Photo
              image={active.key}
              ratio="wide"
              priority
              alt={generatedImages[active.key].alt}
              sizes="(max-width: 1024px) 100vw, 64rem"
              className="rounded-xl"
            />
            <figcaption className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-[family-name:var(--font-display)] font-bold text-white text-lg">
                  {active.title}
                </p>
                <p className="text-[13.5px] text-white/70 mt-1 max-w-xl leading-relaxed">
                  {active.note}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="figure text-[11.5px] text-white/50">
                  {(openIndex ?? 0) + 1} / {shots.length}
                </span>
                <a
                  href={waLink(`Hi Nexmod, I like this look — ${active.title}. Can you do this on my car?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-whatsapp"
                >
                  <IconWhatsApp width={14} height={14} />
                  Ask about this
                </a>
              </div>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
