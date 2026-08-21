"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconCheck, IconClose, IconPlus, IconTool } from "@/components/Icons";

/**
 * Photo studio.
 *
 * Upload a photo of your car and preview treatments on it. Everything happens
 * in the browser — the file is read with FileReader, drawn to a canvas and
 * never uploaded anywhere. Re-encoding through the canvas also strips EXIF,
 * so location data in the original never survives even locally.
 *
 * HONESTY: this is an illustration, not a render. The tint preview shows what a
 * given VLT roughly looks like over a region you choose; it does not know where
 * your windows are and it is not a simulation of the finished job. The UI says
 * so, because a customer who expects a render and gets an approximation is a
 * customer who feels misled.
 */

/** Visible light transmission steps, darkest last. */
export const TINT_LEVELS = [
  { vlt: 70, label: "70%", note: "Very light — near clear" },
  { vlt: 50, label: "50%", note: "Light" },
  { vlt: 35, label: "35%", note: "Medium" },
  { vlt: 20, label: "20%", note: "Dark" },
  { vlt: 5, label: "5%", note: "Limo — not road legal" },
] as const;

const LOOKS = [
  { id: "none", label: "Original", filter: "none" },
  { id: "showroom", label: "Showroom", filter: "contrast(1.12) saturate(1.15) brightness(1.04)" },
  { id: "night", label: "Night", filter: "contrast(1.25) saturate(0.85) brightness(0.7)" },
  { id: "mono", label: "Mono", filter: "grayscale(1) contrast(1.2)" },
  { id: "warm", label: "Golden", filter: "sepia(0.28) saturate(1.3) contrast(1.08)" },
] as const;

type LookId = (typeof LOOKS)[number]["id"];

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

const DEFAULT_REGION: Region = { x: 0.22, y: 0.2, w: 0.56, h: 0.3 };

/** Longest edge the working canvas is downscaled to — keeps things responsive. */
const MAX_EDGE = 1600;

export function PhotoStudio({
  onPhotoChange,
}: {
  /** Told whether a photo is loaded, so the parent can gate later steps. */
  onPhotoChange?: (hasPhoto: boolean) => void;
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const [look, setLook] = useState<LookId>("none");
  const [vlt, setVlt] = useState<number | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [wipe, setWipe] = useState(100);

  const frameRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ mode: "move" | "resize"; sx: number; sy: number; start: Region } | null>(
    null,
  );

  useEffect(() => {
    onPhotoChange?.(Boolean(image));
  }, [image, onPhotoChange]);

  /* ------------------------------------------------------------- loading */

  const loadFile = useCallback((file: File) => {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("That is not an image. JPG, PNG or WebP please.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("That image is over 15MB. Try a smaller one straight from your phone.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setError("Could not read that file. Try another.");
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => setError("That image could not be decoded. Try a JPG.");
      img.onload = () => {
        // Re-encode through a canvas: downscales for performance and drops
        // EXIF, including any GPS coordinates in the original.
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Your browser could not process that image.");
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const clean = new Image();
        clean.onload = () => {
          setImage(clean);
          setRegion(DEFAULT_REGION);
          setWipe(100);
        };
        clean.src = canvas.toDataURL("image/jpeg", 0.9);
      };
      img.src = reader.result as string;
    };

    setFileName(file.name);
    reader.readAsDataURL(file);
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }

  function reset() {
    setImage(null);
    setFileName("");
    setLook("none");
    setVlt(null);
    setRegion(DEFAULT_REGION);
    setWipe(100);
    setError("");
  }

  /* ----------------------------------------------- tint region dragging */

  function pointerDown(e: React.PointerEvent, mode: "move" | "resize") {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { mode, sx: e.clientX, sy: e.clientY, start: { ...region } };
  }

  function pointerMove(e: React.PointerEvent) {
    const state = dragState.current;
    const frame = frameRef.current;
    if (!state || !frame) return;

    const box = frame.getBoundingClientRect();
    const dx = (e.clientX - state.sx) / box.width;
    const dy = (e.clientY - state.sy) / box.height;

    if (state.mode === "move") {
      setRegion({
        ...state.start,
        x: Math.min(Math.max(0, state.start.x + dx), 1 - state.start.w),
        y: Math.min(Math.max(0, state.start.y + dy), 1 - state.start.h),
      });
    } else {
      setRegion({
        ...state.start,
        w: Math.min(Math.max(0.08, state.start.w + dx), 1 - state.start.x),
        h: Math.min(Math.max(0.06, state.start.h + dy), 1 - state.start.y),
      });
    }
  }

  function pointerUp() {
    dragState.current = null;
  }

  /* ------------------------------------------------------------- export */

  function download() {
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.filter = LOOKS.find((l) => l.id === look)?.filter ?? "none";
    ctx.drawImage(image, 0, 0);
    ctx.filter = "none";

    if (vlt !== null) {
      ctx.fillStyle = `rgba(6,8,12,${tintAlpha(vlt)})`;
      ctx.fillRect(
        region.x * canvas.width,
        region.y * canvas.height,
        region.w * canvas.width,
        region.h * canvas.height,
      );
    }

    // Watermark, so a shared preview is never mistaken for a finished job.
    const pad = Math.round(canvas.width * 0.025);
    ctx.font = `600 ${Math.round(canvas.width * 0.022)}px sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.textBaseline = "bottom";
    ctx.fillText("NEXMOD — illustration, not a render", pad, canvas.height - pad);

    const link = document.createElement("a");
    link.download = `nexmod-preview-${Date.now()}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    link.click();
  }

  const activeFilter = LOOKS.find((l) => l.id === look)?.filter ?? "none";

  /* -------------------------------------------------------------- empty */

  if (!image) {
    return (
      <div>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center text-center gap-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors px-6 py-16 md:py-24 ${
            dragging
              ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
              : "border-[var(--border-strong)] hover:border-[var(--accent)] bg-[var(--bg-subtle)]"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) loadFile(file);
            }}
          />

          <span className="grid place-items-center w-14 h-14 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
            <IconPlus width={26} height={26} />
          </span>

          <span>
            <span className="block font-[family-name:var(--font-display)] font-bold text-xl mb-1.5">
              Drop a photo of your car
            </span>
            <span className="block text-[var(--fg-muted)] text-[15px] leading-relaxed max-w-sm">
              Or tap to choose one. A straight-on front or side shot in daylight works best.
            </span>
          </span>

          <span className="flex flex-wrap justify-center gap-2 mt-1">
            <span className="badge">JPG, PNG, WebP</span>
            <span className="badge">Up to 15MB</span>
            <span className="badge badge-stock">
              <IconCheck width={11} height={11} />
              Never leaves your device
            </span>
          </span>
        </label>

        {error && (
          <p role="alert" className="mt-3 text-[13.5px] font-medium text-[var(--accent)]">
            {error}
          </p>
        )}

        <p className="mt-4 text-[12.5px] text-[var(--fg-subtle)] leading-relaxed">
          Your photo is processed entirely in your browser and is never uploaded to us or anyone
          else. Location data in the original file is stripped when the image is loaded.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------- loaded */

  return (
    <div className="space-y-5">
      {/* Canvas */}
      <div
        ref={frameRef}
        onPointerMove={pointerMove}
        onPointerUp={pointerUp}
        onPointerCancel={pointerUp}
        className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-sunken)] select-none touch-none"
      >
        {/* Treated layer, revealed by the wipe */}
        <div
          className="relative"
          style={{ clipPath: `inset(0 ${100 - wipe}% 0 0)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt="Your car"
            className="block w-full h-auto"
            style={{ filter: activeFilter }}
          />

          {vlt !== null && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${region.x * 100}%`,
                top: `${region.y * 100}%`,
                width: `${region.w * 100}%`,
                height: `${region.h * 100}%`,
                background: `rgba(6,8,12,${tintAlpha(vlt)})`,
              }}
            />
          )}
        </div>

        {/* Untreated original sits underneath, visible to the right of the wipe */}
        {wipe < 100 && (
          <div className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" className="block w-full h-auto" />
          </div>
        )}

        {/* Draggable tint region */}
        {vlt !== null && (
          <div
            onPointerDown={(e) => pointerDown(e, "move")}
            className="absolute cursor-move border-2 border-[var(--accent)] rounded-sm"
            style={{
              left: `${region.x * 100}%`,
              top: `${region.y * 100}%`,
              width: `${region.w * 100}%`,
              height: `${region.h * 100}%`,
            }}
          >
            <span className="absolute -top-7 left-0 px-2 py-0.5 rounded bg-[var(--accent)] text-white text-[10.5px] font-[family-name:var(--font-mono)] whitespace-nowrap">
              {vlt}% VLT — drag to your windows
            </span>
            <span
              onPointerDown={(e) => pointerDown(e, "resize")}
              className="absolute -right-2 -bottom-2 w-4 h-4 rounded-sm bg-[var(--accent)] cursor-se-resize"
            />
          </div>
        )}

        {/* Wipe handle */}
        {wipe < 100 && (
          <div
            className="absolute inset-y-0 w-0.5 bg-white/80 pointer-events-none"
            style={{ left: `${wipe}%` }}
          >
            <span className="absolute top-3 left-2 px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-[family-name:var(--font-mono)]">
              AFTER
            </span>
            <span className="absolute top-3 right-2 translate-x-full px-1.5 py-0.5 rounded bg-black/70 text-white text-[10px] font-[family-name:var(--font-mono)]">
              BEFORE
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={reset}
          aria-label="Remove photo"
          className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-lg bg-black/60 text-white backdrop-blur hover:bg-black/80 transition-colors"
        >
          <IconClose width={16} height={16} />
        </button>
      </div>

      <p className="text-[12px] text-[var(--fg-subtle)] flex items-center gap-2">
        <IconTool width={13} height={13} className="text-[var(--accent)] shrink-0" />
        <span className="truncate">{fileName}</span>
        <span className="ml-auto shrink-0">Illustration only — not a render of the finished job</span>
      </p>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-5">
        <fieldset className="surface p-5">
          <legend className="label mb-3">Window tint preview</legend>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              type="button"
              onClick={() => setVlt(null)}
              className={`btn btn-sm ${vlt === null ? "btn-primary" : "btn-outline"}`}
            >
              Off
            </button>
            {TINT_LEVELS.map((t) => (
              <button
                key={t.vlt}
                type="button"
                onClick={() => setVlt(t.vlt)}
                className={`btn btn-sm ${vlt === t.vlt ? "btn-primary" : "btn-outline"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-[12.5px] text-[var(--fg-muted)] leading-relaxed">
            {vlt === null
              ? "Pick a level, then drag the box over your windows."
              : TINT_LEVELS.find((t) => t.vlt === vlt)?.note}
            {vlt === 5 && (
              <strong className="block text-[var(--accent)] mt-1">
                5% is below the Sri Lankan legal limit. We will not fit it.
              </strong>
            )}
          </p>
        </fieldset>

        <fieldset className="surface p-5">
          <legend className="label mb-3">Look</legend>
          <div className="flex flex-wrap gap-2 mb-4">
            {LOOKS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLook(l.id)}
                className={`btn btn-sm ${look === l.id ? "btn-primary" : "btn-outline"}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <label htmlFor="wipe" className="label mb-2">
            Before / after
          </label>
          <input
            id="wipe"
            type="range"
            min={0}
            max={100}
            value={wipe}
            onChange={(e) => setWipe(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </fieldset>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={download} className="btn btn-outline">
          Download preview
        </button>
        <button type="button" onClick={reset} className="btn btn-ghost">
          Use a different photo
        </button>
      </div>
    </div>
  );
}

/**
 * VLT to overlay opacity.
 *
 * VLT is how much light passes through, so 70% VLT is light and 5% is nearly
 * opaque. Glass already blocks some light before any film, so the mapping is
 * deliberately gentler than a straight 1 − VLT.
 */
function tintAlpha(vlt: number): number {
  return Math.min(0.88, (1 - vlt / 100) * 0.82);
}
