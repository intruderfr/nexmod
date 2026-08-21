"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CategoryIcon,
  IconCheck,
  IconClose,
  IconPlus,
  IconTrash,
} from "@/components/Icons";
import { Photo } from "@/components/Photo";
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
 * Presented as a tool rather than a form: a dark stage that holds the car, a
 * toolbar of treatments across the top, and a docked inspector on the right
 * that only ever shows the settings for the selected layer. That framing is
 * the point — a configurator built out of default browser controls reads as a
 * questionnaire no matter how good the surrounding page is.
 *
 * Everything happens in the browser. The file is read with FileReader, drawn
 * to a canvas and never uploaded — re-encoding through the canvas also strips
 * EXIF, so GPS data in the original does not survive even locally.
 *
 * HONESTY: an illustration, not a render. It does not know where your windows
 * or panels are — you place the regions. Exports are watermarked as such.
 */

const LOOKS = [
  { id: "none", label: "Original", filter: "none" },
  { id: "showroom", label: "Showroom", filter: "contrast(1.12) saturate(1.15) brightness(1.04)" },
  { id: "night", label: "Night", filter: "contrast(1.25) saturate(0.85) brightness(0.7)" },
  { id: "mono", label: "Mono", filter: "grayscale(1) contrast(1.2)" },
  { id: "warm", label: "Golden", filter: "sepia(0.28) saturate(1.3) contrast(1.08)" },
] as const;

type LookId = (typeof LOOKS)[number]["id"];

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

  /* ========================================================= EMPTY STATE */

  if (!image) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border)]">
        {/* A real photograph behind the drop target, not a dashed box */}
        <Photo
          image="hero-alt"
          ratio="free"
          alt=""
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--bg-sunken) 72%, transparent) 0%, color-mix(in srgb, var(--bg-sunken) 92%, transparent) 100%)",
          }}
        />
        <div className="absolute inset-0 carbon-texture opacity-40" aria-hidden="true" />

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
          className="relative block cursor-pointer px-6 py-16 md:py-24 text-center"
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

          {/* Corner registration marks — the frame, without a dashed border */}
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-5 rounded-xl transition-colors duration-300 ${
              dragging ? "ring-2 ring-[var(--accent)]" : "ring-1 ring-white/10"
            }`}
          />

          <span
            className={`relative grid place-items-center w-16 h-16 mx-auto rounded-2xl mb-6 transition-transform duration-300 ${
              dragging ? "scale-110 bg-[var(--accent)] text-white" : "bg-white/10 text-white backdrop-blur"
            }`}
          >
            <IconPlus width={28} height={28} />
          </span>

          <span className="relative block font-[family-name:var(--font-display)] font-extrabold text-white text-2xl md:text-3xl tracking-[-0.03em] mb-2.5">
            {dragging ? "Drop it here" : "Drop a photo of your car"}
          </span>
          <span className="relative block text-white/60 text-[15px] leading-relaxed max-w-sm mx-auto mb-7">
            Or tap to choose one. A straight-on front or side shot in daylight works best.
          </span>

          <span className="relative flex flex-wrap justify-center gap-1.5 max-w-lg mx-auto">
            {LAYER_KINDS.map((k) => (
              <span
                key={k.kind}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur text-white/80 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wider"
              >
                <CategoryIcon name={k.icon} width={11} height={11} />
                {k.label}
              </span>
            ))}
          </span>

          <span className="relative block mt-6 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-white/40">
            JPG · PNG · WebP · never leaves your device
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="relative px-6 pb-6 text-[13.5px] font-medium text-center text-[var(--accent)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  }

  /* ============================================================== STUDIO */

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-raised)]">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 h-14 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <span className="hidden sm:block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] pr-3 mr-1 border-r border-[var(--border)]">
          Add
        </span>

        <div className="flex items-center gap-1 overflow-x-auto scroll-x">
          {LAYER_KINDS.map((k) => (
            <button
              key={k.kind}
              type="button"
              onClick={() => addLayer(k.kind)}
              title={`${k.label} — ${k.represents}`}
              aria-label={`Add ${k.label}`}
              className="tool shrink-0"
            >
              <CategoryIcon name={k.icon} width={17} height={17} />
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0 pl-3">
          <span className="hidden md:inline font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--fg-subtle)] tabular-nums">
            {layers.length} {layers.length === 1 ? "layer" : "layers"}
          </span>
          <button type="button" onClick={download} className="btn btn-sm btn-primary">
            Export
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px]">
        {/* -------------------------------------------------------- stage */}
        <div className="relative bg-[var(--bg-sunken)] p-4 md:p-6">
          <div
            ref={frameRef}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
            onPointerDown={() => setActiveId(null)}
            className="relative overflow-hidden rounded-xl shadow-2xl select-none touch-none"
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
                  <div
                    key={layer.id}
                    className="absolute pointer-events-none"
                    style={layerStyle(layer)}
                  >
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

            {wipe < 100 && (
              <div className="absolute inset-0 -z-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt="" className="block w-full h-auto" />
              </div>
            )}

            {active && !active.hidden && (
              <div
                onPointerDown={(e) => pointerDown(e, active.id, "move")}
                className="absolute cursor-move"
                style={{
                  left: `${active.region.x * 100}%`,
                  top: `${active.region.y * 100}%`,
                  width: `${active.region.w * 100}%`,
                  height: `${active.region.h * 100}%`,
                }}
              >
                <span className="absolute inset-0 ring-1 ring-[var(--accent)] rounded-[3px]" />
                {/* Corner ticks rather than a heavy border */}
                {(
                  [
                    "top-0 left-0 border-t-2 border-l-2 rounded-tl-[3px]",
                    "top-0 right-0 border-t-2 border-r-2 rounded-tr-[3px]",
                    "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[3px]",
                    "bottom-0 right-0 border-b-2 border-r-2 rounded-br-[3px]",
                  ] as const
                ).map((cls) => (
                  <span
                    key={cls}
                    className={`absolute w-3 h-3 border-[var(--accent)] ${cls}`}
                  />
                ))}

                <span className="absolute -top-6 left-0 px-1.5 py-0.5 rounded bg-[var(--accent)] text-white font-[family-name:var(--font-mono)] text-[9.5px] whitespace-nowrap">
                  {activeMeta?.label}
                </span>

                <span
                  onPointerDown={(e) => pointerDown(e, active.id, "resize")}
                  className="absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 rounded-full bg-[var(--accent)] ring-2 ring-white/80 cursor-se-resize"
                />
              </div>
            )}

            {wipe < 100 && (
              <div
                className="absolute inset-y-0 w-0.5 bg-white pointer-events-none shadow-[0_0_10px_rgba(0,0,0,0.6)]"
                style={{ left: `${wipe}%` }}
              />
            )}
          </div>

          {/* Stage footer */}
          <div className="flex items-center gap-4 mt-4">
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--fg-subtle)] truncate max-w-[12rem]">
              {fileName}
            </span>

            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider text-[var(--fg-subtle)] shrink-0">
                A/B
              </span>
              <input
                type="range"
                min={0}
                max={100}
                value={wipe}
                onChange={(e) => setWipe(Number(e.target.value))}
                aria-label="Reveal treatments over the original"
                className="range flex-1"
                style={{ "--fill": `${wipe}%` } as React.CSSProperties}
              />
            </div>

            <button
              type="button"
              onClick={reset}
              className="shrink-0 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wider text-[var(--fg-subtle)] hover:text-[var(--accent)] transition-colors"
            >
              New photo
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------- inspector */}
        <aside className="border-t lg:border-t-0 lg:border-l border-[var(--border)] flex flex-col max-h-[38rem]">
          {/* Look */}
          <div className="p-4 border-b border-[var(--border)]">
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] mb-2.5">
              Look
            </p>
            <div className="flex flex-wrap gap-1">
              {LOOKS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLook(l.id)}
                  aria-pressed={look === l.id}
                  className={`px-2.5 py-1.5 rounded-lg font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wider transition-colors ${
                    look === l.id
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--bg-inset)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Layer list */}
          <div className="flex-1 overflow-y-auto">
            {layers.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-[13.5px] text-[var(--fg-muted)] leading-relaxed">
                  Pick a treatment from the toolbar above, then drag its box onto the right part of
                  the car.
                </p>
              </div>
            ) : (
              <ul className="p-2 space-y-1">
                {layers.map((layer) => {
                  const meta = LAYER_META.get(layer.kind);
                  const isActive = layer.id === activeId;
                  return (
                    <li key={layer.id}>
                      <div
                        className={`flex items-center gap-2 rounded-lg transition-colors ${
                          isActive ? "bg-[var(--accent-subtle)]" : "hover:bg-[var(--bg-inset)]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveId(isActive ? null : layer.id)}
                          className="flex-1 flex items-center gap-2.5 px-2.5 py-2 text-left min-w-0"
                        >
                          <span
                            className="shrink-0 w-4 h-4 rounded-[5px] ring-1 ring-black/20"
                            style={{
                              background:
                                layer.kind === "carbon"
                                  ? "repeating-linear-gradient(45deg,#2a2d33 0 2px,#141619 2px 4px)"
                                  : layer.colour,
                            }}
                          />
                          <span
                            className={`block text-[12.5px] font-medium truncate ${
                              isActive ? "text-[var(--accent)]" : ""
                            }`}
                          >
                            {meta?.label}
                            {layer.kind === "text" && layer.text ? ` · ${layer.text}` : ""}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateLayer(layer.id, { hidden: !layer.hidden })}
                          aria-label={layer.hidden ? "Show layer" : "Hide layer"}
                          className={`shrink-0 w-7 h-7 grid place-items-center rounded font-[family-name:var(--font-mono)] text-[9px] transition-colors ${
                            layer.hidden
                              ? "text-[var(--fg-faint)]"
                              : "text-[var(--fg-subtle)] hover:text-[var(--fg)]"
                          }`}
                        >
                          {layer.hidden ? "OFF" : "ON"}
                        </button>

                        <button
                          type="button"
                          onClick={() => removeLayer(layer.id)}
                          aria-label="Remove treatment"
                          className="shrink-0 grid place-items-center w-7 h-7 mr-1 rounded text-[var(--fg-subtle)] hover:text-[var(--accent)] transition-colors"
                        >
                          <IconTrash width={12} height={12} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Settings for the selected layer */}
          {active && activeMeta && (
            <div className="border-t border-[var(--border)] p-4 space-y-4 bg-[var(--bg-subtle)]">
              <div className="flex items-center justify-between gap-2">
                <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {activeMeta.label}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  aria-label="Close settings"
                  className="grid place-items-center w-6 h-6 rounded text-[var(--fg-subtle)] hover:text-[var(--fg)]"
                >
                  <IconClose width={12} height={12} />
                </button>
              </div>

              {activeMeta.controls.text && (
                <div>
                  <label htmlFor="layer-text" className="label mb-1.5 text-[11.5px]">
                    Text
                  </label>
                  <input
                    id="layer-text"
                    value={active.text ?? ""}
                    onChange={(e) => updateLayer(active.id, { text: e.target.value.slice(0, 18) })}
                    className="field py-1.5 text-[13px]"
                    placeholder="NEXMOD"
                  />
                </div>
              )}

              {activeMeta.controls.colour && (
                <div>
                  <span className="label mb-2 text-[11.5px]">Colour</span>
                  <div className="flex flex-wrap gap-1.5">
                    {SWATCHES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateLayer(active.id, { colour: c })}
                        aria-pressed={active.colour === c}
                        aria-label={`Colour ${c}`}
                        className="swatch"
                        style={{ background: c }}
                      />
                    ))}
                    <input
                      type="color"
                      value={active.colour}
                      onChange={(e) => updateLayer(active.id, { colour: e.target.value })}
                      aria-label="Custom colour"
                      className="swatch-input"
                    />
                  </div>
                </div>
              )}

              {activeMeta.controls.opacity && (
                <Slider
                  label={active.kind === "tint" ? "Darkness" : "Strength"}
                  value={Math.round(active.opacity * 100)}
                  min={5}
                  max={100}
                  suffix="%"
                  onChange={(v) => updateLayer(active.id, { opacity: v / 100 })}
                />
              )}

              {activeMeta.controls.angle && (
                <Slider
                  label="Angle"
                  value={active.angle ?? 0}
                  min={-45}
                  max={45}
                  suffix="°"
                  onChange={(v) => updateLayer(active.id, { angle: v })}
                />
              )}

              {activeMeta.caveat && (
                <p className="text-[11px] text-[var(--fg-subtle)] leading-relaxed pt-3 border-t border-[var(--border)]">
                  {activeMeta.caveat}
                </p>
              )}
            </div>
          )}
        </aside>
      </div>

      <p className="px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg-subtle)] font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--fg-subtle)] text-center">
        Illustration — not a render of the finished job
      </p>
    </div>
  );
}

/** Labelled slider with a live monospace readout. */
function Slider({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="label mb-0 text-[11.5px]">{label}</label>
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-muted)] tabular-nums">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="range"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
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
      ctx.rotate(((layer.angle ?? 0) * Math.PI) / 180);
      ctx.fillStyle = layer.colour;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      break;

    case "text": {
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(((layer.angle ?? 0) * Math.PI) / 180);
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

void IconCheck;
