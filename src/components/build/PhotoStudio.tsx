"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CategoryIcon,
  IconCheck,
  IconClose,
  IconPlus,
  IconTrash,
} from "@/components/Icons";
import {
  createLayer,
  hexToRgba,
  LAYER_KINDS,
  LAYER_META,
  layerStyle,
  SWATCHES,
  type Layer,
  type LayerKind,
  type Region,
} from "./layers";

/**
 * Photo studio.
 *
 * Upload a photo of your car and stack treatments on it: window tint, carbon
 * panels, gloss-black trim, a colour wrap, lighting glow, tyre lettering and
 * vinyl stripes. Each is a layer with its own region and settings, so you can
 * build up a whole look rather than toggling one effect.
 *
 * Everything happens in the browser. The file is read with FileReader, drawn
 * to a canvas and never uploaded — re-encoding through the canvas also strips
 * EXIF, so GPS data in the original does not survive even locally.
 *
 * HONESTY: this is an illustration, not a render. It does not know where your
 * windows or panels are — you place the regions. Every export is watermarked
 * as such, and each treatment carries its own caveat where one is warranted.
 */

const LOOKS = [
  { id: "none", label: "Original", filter: "none" },
  { id: "showroom", label: "Showroom", filter: "contrast(1.12) saturate(1.15) brightness(1.04)" },
  { id: "night", label: "Night", filter: "contrast(1.25) saturate(0.85) brightness(0.7)" },
  { id: "mono", label: "Mono", filter: "grayscale(1) contrast(1.2)" },
  { id: "warm", label: "Golden", filter: "sepia(0.28) saturate(1.3) contrast(1.08)" },
] as const;

type LookId = (typeof LOOKS)[number]["id"];

/** Longest edge the working canvas is downscaled to. */
const MAX_EDGE = 1600;

export function PhotoStudio({
  onPhotoChange,
}: {
  onPhotoChange?: (hasPhoto: boolean) => void;
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [look, setLook] = useState<LookId>("none");
  const [wipe, setWipe] = useState(100);
  const [adding, setAdding] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    id: string;
    mode: "move" | "resize";
    sx: number;
    sy: number;
    start: Region;
  } | null>(null);

  useEffect(() => {
    onPhotoChange?.(Boolean(image));
  }, [image, onPhotoChange]);

  const active = layers.find((l) => l.id === activeId) ?? null;
  const activeMeta = active ? LAYER_META.get(active.kind) : null;

  /* ------------------------------------------------------------- loading */

  const loadFile = useCallback((file: File) => {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("That is not an image. JPG, PNG or WebP please.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("That image is over 15MB. Try one straight from your phone camera.");
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
          setLayers([]);
          setActiveId(null);
          setWipe(100);
        };
        clean.src = canvas.toDataURL("image/jpeg", 0.9);
      };
      img.src = reader.result as string;
    };

    setFileName(file.name);
    reader.readAsDataURL(file);
  }, []);

  function reset() {
    setImage(null);
    setFileName("");
    setLayers([]);
    setActiveId(null);
    setLook("none");
    setWipe(100);
    setError("");
  }

  /* -------------------------------------------------------------- layers */

  function addLayer(kind: LayerKind) {
    const layer = createLayer(kind);
    setLayers((prev) => [...prev, layer]);
    setActiveId(layer.id);
    setAdding(false);
  }

  function updateLayer(id: string, patch: Partial<Layer>) {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function removeLayer(id: string) {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    setActiveId((current) => (current === id ? null : current));
  }

  /* ------------------------------------------------------- region drag */

  function pointerDown(e: React.PointerEvent, id: string, mode: "move" | "resize") {
    e.preventDefault();
    e.stopPropagation();
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setActiveId(id);
    dragState.current = { id, mode, sx: e.clientX, sy: e.clientY, start: { ...layer.region } };
  }

  function pointerMove(e: React.PointerEvent) {
    const state = dragState.current;
    const box = frameRef.current?.getBoundingClientRect();
    if (!state || !box) return;

    const dx = (e.clientX - state.sx) / box.width;
    const dy = (e.clientY - state.sy) / box.height;

    if (state.mode === "move") {
      updateLayer(state.id, {
        region: {
          ...state.start,
          x: Math.min(Math.max(0, state.start.x + dx), 1 - state.start.w),
          y: Math.min(Math.max(0, state.start.y + dy), 1 - state.start.h),
        },
      });
    } else {
      updateLayer(state.id, {
        region: {
          ...state.start,
          w: Math.min(Math.max(0.03, state.start.w + dx), 1 - state.start.x),
          h: Math.min(Math.max(0.015, state.start.h + dy), 1 - state.start.y),
        },
      });
    }
  }

  function pointerUp() {
    dragState.current = null;
  }

  /* -------------------------------------------------------------- export */

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

    for (const layer of layers) {
      if (layer.hidden) continue;
      drawLayer(ctx, layer, canvas.width, canvas.height);
    }

    // Watermark, so a shared preview is never mistaken for a finished job.
    const pad = Math.round(canvas.width * 0.025);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.font = `600 ${Math.round(canvas.width * 0.021)}px sans-serif`;
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
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) loadFile(file);
          }}
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

        <div className="mt-5 flex flex-wrap gap-2">
          {LAYER_KINDS.map((k) => (
            <span key={k.kind} className="badge">
              <CategoryIcon name={k.icon} width={11} height={11} />
              {k.label}
            </span>
          ))}
        </div>
        <p className="mt-2.5 text-[12.5px] text-[var(--fg-subtle)] leading-relaxed">
          Seven treatments you can stack on your own photo. Processed entirely in your browser —
          location data in the original file is stripped when the image loads.
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
        onPointerDown={() => setActiveId(null)}
        className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-sunken)] select-none touch-none"
      >
        <div className="relative" style={{ clipPath: `inset(0 ${100 - wipe}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt="Your car"
            className="block w-full h-auto"
            style={{ filter: activeFilter }}
          />

          {layers.map((layer) =>
            layer.hidden ? null : (
              <div key={layer.id} className="absolute pointer-events-none" style={layerStyle(layer)}>
                {layer.kind === "text" && (
                  <span
                    className="absolute inset-0 grid place-items-center font-bold uppercase tracking-[0.08em] whitespace-nowrap"
                    style={{
                      color: layer.colour,
                      fontSize: "min(100%, 1.4vw)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                    }}
                  >
                    {layer.text}
                  </span>
                )}
              </div>
            ),
          )}
        </div>

        {/* Untreated original, revealed to the right of the wipe */}
        {wipe < 100 && (
          <div className="absolute inset-0 -z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" className="block w-full h-auto" />
          </div>
        )}

        {/* Region handles for the selected layer */}
        {active && !active.hidden && (
          <div
            onPointerDown={(e) => pointerDown(e, active.id, "move")}
            className="absolute cursor-move border-2 border-[var(--accent)] rounded-sm"
            style={{
              left: `${active.region.x * 100}%`,
              top: `${active.region.y * 100}%`,
              width: `${active.region.w * 100}%`,
              height: `${active.region.h * 100}%`,
            }}
          >
            <span className="absolute -top-6 left-0 px-1.5 py-0.5 rounded bg-[var(--accent)] text-white font-[family-name:var(--font-mono)] text-[9.5px] whitespace-nowrap">
              {activeMeta?.label} — drag to place
            </span>
            <span
              onPointerDown={(e) => pointerDown(e, active.id, "resize")}
              className="absolute -right-2 -bottom-2 w-4 h-4 rounded-sm bg-[var(--accent)] cursor-se-resize"
            />
          </div>
        )}

        {wipe < 100 && (
          <div
            className="absolute inset-y-0 w-0.5 bg-white/80 pointer-events-none"
            style={{ left: `${wipe}%` }}
          >
            <span className="absolute top-3 left-2 px-1.5 py-0.5 rounded bg-black/70 text-white font-[family-name:var(--font-mono)] text-[10px]">
              AFTER
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

      <p className="flex items-center gap-2 text-[12px] text-[var(--fg-subtle)]">
        <span className="truncate">{fileName}</span>
        <span className="ml-auto shrink-0">Illustration only — not a render of the finished job</span>
      </p>

      {/* Layer controls */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        <div className="surface p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h3 className="font-[family-name:var(--font-display)] font-bold text-[15px]">
              Treatments
              {layers.length > 0 && (
                <span className="ml-2 font-[family-name:var(--font-mono)] text-[11px] font-normal text-[var(--fg-subtle)]">
                  {layers.length}
                </span>
              )}
            </h3>
            <button
              type="button"
              onClick={() => setAdding((a) => !a)}
              className="btn btn-sm btn-outline"
            >
              <IconPlus width={13} height={13} />
              Add
            </button>
          </div>

          {adding && (
            <div className="grid sm:grid-cols-2 gap-2 mb-4 pb-4 border-b border-[var(--border)]">
              {LAYER_KINDS.map((k) => (
                <button
                  key={k.kind}
                  type="button"
                  onClick={() => addLayer(k.kind)}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] text-left transition-colors"
                >
                  <span className="shrink-0 grid place-items-center w-7 h-7 rounded-md bg-[var(--accent-subtle)] text-[var(--accent)]">
                    <CategoryIcon name={k.icon} width={14} height={14} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold leading-tight">{k.label}</span>
                    <span className="block text-[11px] text-[var(--fg-subtle)] leading-snug mt-0.5">
                      {k.represents}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {layers.length === 0 ? (
            <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed py-2">
              Nothing added yet. Press <strong className="text-[var(--fg)]">Add</strong> and pick a
              treatment — tint, carbon, gloss black, a colour wrap, lighting, lettering or a stripe.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {layers.map((layer) => {
                const meta = LAYER_META.get(layer.kind);
                const isActive = layer.id === activeId;
                return (
                  <li key={layer.id}>
                    <div
                      className={`flex items-center gap-2 rounded-lg border transition-colors ${
                        isActive
                          ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                          : "border-[var(--border)]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveId(isActive ? null : layer.id)}
                        className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-left min-w-0"
                      >
                        <span
                          className="shrink-0 w-4 h-4 rounded border border-[var(--border-strong)]"
                          style={{
                            background:
                              layer.kind === "carbon"
                                ? "repeating-linear-gradient(45deg,#2a2d33 0 2px,#141619 2px 4px)"
                                : layer.colour,
                          }}
                        />
                        <span className="min-w-0">
                          <span className="block text-[13px] font-medium truncate">
                            {meta?.label}
                            {layer.kind === "text" && layer.text ? ` — ${layer.text}` : ""}
                          </span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateLayer(layer.id, { hidden: !layer.hidden })}
                        aria-label={layer.hidden ? "Show layer" : "Hide layer"}
                        className="shrink-0 px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--fg-subtle)] hover:text-[var(--fg)]"
                      >
                        {layer.hidden ? "OFF" : "ON"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeLayer(layer.id)}
                        aria-label="Remove treatment"
                        className="shrink-0 grid place-items-center w-8 h-8 mr-1 rounded text-[var(--fg-subtle)] hover:text-[var(--accent)]"
                      >
                        <IconTrash width={13} height={13} />
                      </button>
                    </div>

                    {/* Settings for the selected layer */}
                    {isActive && meta && (
                      <div className="mt-2 mb-1 mx-1 p-3 rounded-lg bg-[var(--bg-inset)] space-y-3">
                        {meta.controls.text && (
                          <div>
                            <label className="label mb-1.5 text-[12px]">Text</label>
                            <input
                              value={layer.text ?? ""}
                              onChange={(e) =>
                                updateLayer(layer.id, { text: e.target.value.slice(0, 18) })
                              }
                              className="field py-1.5 text-[13px]"
                              placeholder="NEXMOD"
                            />
                          </div>
                        )}

                        {meta.controls.colour && (
                          <div>
                            <span className="label mb-1.5 text-[12px]">Colour</span>
                            <div className="flex flex-wrap gap-1.5">
                              {SWATCHES.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => updateLayer(layer.id, { colour: c })}
                                  aria-label={`Colour ${c}`}
                                  className={`w-6 h-6 rounded-md border-2 transition-transform ${
                                    layer.colour === c
                                      ? "border-[var(--accent)] scale-110"
                                      : "border-[var(--border-strong)]"
                                  }`}
                                  style={{ background: c }}
                                />
                              ))}
                              <input
                                type="color"
                                value={layer.colour}
                                onChange={(e) => updateLayer(layer.id, { colour: e.target.value })}
                                aria-label="Custom colour"
                                className="w-6 h-6 rounded-md border border-[var(--border-strong)] bg-transparent cursor-pointer"
                              />
                            </div>
                          </div>
                        )}

                        {meta.controls.opacity && (
                          <div>
                            <label className="label mb-1 text-[12px]">
                              {layer.kind === "tint" ? "Darkness" : "Strength"}{" "}
                              <span className="font-[family-name:var(--font-mono)] font-normal text-[var(--fg-subtle)]">
                                {Math.round(layer.opacity * 100)}%
                              </span>
                            </label>
                            <input
                              type="range"
                              min={5}
                              max={100}
                              value={Math.round(layer.opacity * 100)}
                              onChange={(e) =>
                                updateLayer(layer.id, { opacity: Number(e.target.value) / 100 })
                              }
                              className="w-full accent-[var(--accent)]"
                            />
                          </div>
                        )}

                        {meta.controls.angle && (
                          <div>
                            <label className="label mb-1 text-[12px]">
                              Angle{" "}
                              <span className="font-[family-name:var(--font-mono)] font-normal text-[var(--fg-subtle)]">
                                {layer.angle ?? 0}°
                              </span>
                            </label>
                            <input
                              type="range"
                              min={-45}
                              max={45}
                              value={layer.angle ?? 0}
                              onChange={(e) =>
                                updateLayer(layer.id, { angle: Number(e.target.value) })
                              }
                              className="w-full accent-[var(--accent)]"
                            />
                          </div>
                        )}

                        {meta.caveat && (
                          <p className="text-[11px] text-[var(--fg-subtle)] leading-relaxed pt-1 border-t border-[var(--border)]">
                            {meta.caveat}
                          </p>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Look + wipe + export */}
        <div className="space-y-5">
          <fieldset className="surface p-5">
            <legend className="label mb-3">Look</legend>
            <div className="flex flex-wrap gap-1.5 mb-4">
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

            <label htmlFor="wipe" className="label mb-1.5">
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

          <div className="space-y-2">
            <button type="button" onClick={download} className="btn btn-outline w-full">
              Download preview
            </button>
            <button type="button" onClick={reset} className="btn btn-ghost btn-sm w-full">
              Use a different photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ canvas draw */

/**
 * Canvas equivalent of `layerStyle`. Kept beside it so the two stay in step —
 * a preview that does not match its own export is worse than no export.
 */
function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  width: number,
  height: number,
): void {
  const x = layer.region.x * width;
  const y = layer.region.y * height;
  const w = layer.region.w * width;
  const h = layer.region.h * height;

  ctx.save();
  ctx.globalAlpha = layer.opacity;

  switch (layer.kind) {
    case "tint":
    case "gloss":
      ctx.fillStyle = layer.colour;
      ctx.fillRect(x, y, w, h);
      break;

    case "carbon": {
      ctx.fillStyle = layer.colour;
      ctx.fillRect(x, y, w, h);
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      const pitch = Math.max(3, width / 400);
      ctx.lineWidth = Math.max(1, pitch / 4);
      for (const [angle, stroke] of [
        [1, "rgba(255,255,255,0.10)"],
        [-1, "rgba(0,0,0,0.55)"],
      ] as const) {
        ctx.strokeStyle = stroke;
        ctx.beginPath();
        for (let i = -h; i < w + h; i += pitch) {
          ctx.moveTo(x + i, y);
          ctx.lineTo(x + i + angle * h, y + h);
        }
        ctx.stroke();
      }
      ctx.restore();
      break;
    }

    case "colour":
      ctx.globalCompositeOperation = "color";
      ctx.fillStyle = layer.colour;
      ctx.fillRect(x, y, w, h);
      break;

    case "glow": {
      ctx.globalCompositeOperation = "screen";
      const cx = x + w / 2;
      const cy = y + h / 2;
      const r = Math.max(w, h) / 2;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, layer.colour);
      gradient.addColorStop(0.35, hexToRgba(layer.colour, 0.5));
      gradient.addColorStop(1, hexToRgba(layer.colour, 0));
      ctx.fillStyle = gradient;
      ctx.fillRect(x - r, y - r, w + r * 2, h + r * 2);
      break;
    }

    case "stripe":
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate((((layer.angle ?? 0) * Math.PI) / 180));
      ctx.fillStyle = layer.colour;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      break;

    case "text": {
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate((((layer.angle ?? 0) * Math.PI) / 180));
      const size = Math.min(h * 0.8, (w / Math.max(1, (layer.text ?? "").length)) * 1.5);
      ctx.font = `700 ${size}px sans-serif`;
      ctx.fillStyle = layer.colour;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = size * 0.12;
      ctx.fillText((layer.text ?? "").toUpperCase(), 0, 0);
      break;
    }
  }

  ctx.restore();
}
