"use client";

import { useCallback, useRef, useState } from "react";
import type { ImageKey } from "@/data/images.generated";
import { Photo } from "./Photo";

/**
 * Before / after comparison slider.
 *
 * Drag, click anywhere on the track, or use the arrow keys once the handle has
 * focus. The handle is a real range input underneath a styled overlay, so
 * keyboard and screen-reader support come for free rather than being bolted on.
 *
 * The two images are labelled BEFORE and AFTER on the image itself, because a
 * slider with no labels is ambiguous the moment someone drags it to an end.
 */
export function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  ratio = "wide",
  afterOverlay,
}: {
  before: ImageKey;
  /** Omit to compare the same image with only `afterOverlay` differing. */
  after?: ImageKey;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  ratio?: "wide" | "square" | "hero";
  /**
   * CSS colour laid over the "after" side. Lets one photograph honestly show a
   * treatment that only changes tone — window tint being the obvious case —
   * without pretending two different cars are the same car.
   */
  afterOverlay?: string;
}) {
  const afterKey = after ?? before;
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    setPosition(Math.min(100, Math.max(0, ((clientX - box.left) / box.width) * 100)));
  }, []);

  return (
    <figure className="m-0">
      <div
        ref={frameRef}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        className="relative overflow-hidden rounded-xl border border-[var(--border)] select-none touch-none cursor-ew-resize"
      >
        {/* After sits underneath and fills the frame */}
        <div className="relative">
          <Photo image={afterKey} ratio={ratio} sizes="(max-width: 1024px) 100vw, 48rem" />
          {afterOverlay && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: afterOverlay }}
            />
          )}
        </div>

        {/* Before is clipped from the left */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Photo
            image={before}
            ratio={ratio}
            sizes="(max-width: 1024px) 100vw, 48rem"
            className="h-full w-full"
          />
        </div>

        <span className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 text-white font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider pointer-events-none">
          {beforeLabel}
        </span>
        <span className="absolute top-3 right-3 px-2 py-1 rounded bg-black/70 text-white font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider pointer-events-none">
          {afterLabel}
        </span>

        {/* Divider */}
        <div
          className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full bg-white text-black shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m9 6-5 6 5 6M15 6l5 6-5 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        {/* The real control — invisible, but keyboard and AT accessible. */}
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label={`Reveal ${afterLabel} over ${beforeLabel}`}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>

      {caption && (
        <figcaption className="mt-3 text-[12.5px] text-[var(--fg-subtle)] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
