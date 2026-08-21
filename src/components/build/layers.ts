/**
 * Photo studio layer model.
 *
 * Each treatment is a layer with a region and its own settings, rather than a
 * single global effect. That is what lets someone tint the windows, gloss-black
 * the pillars, add a carbon bonnet panel and place tyre lettering on one photo
 * — which is the actual job, and was the thing the first version could not do.
 *
 * Regions are normalised 0–1 so they survive the canvas being resized between
 * editing and export.
 */

export type LayerKind =
  | "tint"
  | "carbon"
  | "gloss"
  | "colour"
  | "glow"
  | "text"
  | "stripe";

export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Layer {
  id: string;
  kind: LayerKind;
  region: Region;
  /** 0–1. What each layer means by opacity differs; see the renderers. */
  opacity: number;
  colour: string;
  /** `text` and `stripe` only. */
  text?: string;
  /** Degrees. `stripe` and `text` only. */
  angle?: number;
  hidden?: boolean;
}

export interface LayerKindMeta {
  kind: LayerKind;
  label: string;
  /** What this actually represents on a real car. */
  represents: string;
  icon: string;
  defaultRegion: Region;
  defaultOpacity: number;
  defaultColour: string;
  /** `text` layers only. */
  text?: string;
  /** Degrees. `text` and `stripe` only. */
  angle?: number;
  /** Which controls to show for this kind. */
  controls: {
    opacity: boolean;
    colour: boolean;
    text: boolean;
    angle: boolean;
  };
  /** Shown under the controls — the honest caveat for this treatment. */
  caveat?: string;
}

export const LAYER_KINDS: LayerKindMeta[] = [
  {
    kind: "tint",
    label: "Window tint",
    represents: "Ceramic or carbon film at a given VLT",
    icon: "tint",
    defaultRegion: { x: 0.24, y: 0.2, w: 0.5, h: 0.26 },
    defaultOpacity: 0.45,
    defaultColour: "#06080c",
    controls: { opacity: true, colour: false, text: false, angle: false },
    caveat:
      "Shows darkness only. Heat rejection is the part you feel and a photo cannot show it.",
  },
  {
    kind: "carbon",
    label: "Carbon fibre",
    represents: "8D gloss carbon wrap on a panel",
    icon: "carbon",
    defaultRegion: { x: 0.3, y: 0.42, w: 0.4, h: 0.16 },
    defaultOpacity: 0.85,
    defaultColour: "#141619",
    controls: { opacity: true, colour: false, text: false, angle: false },
    caveat: "The weave is drawn to scale, but real film follows the panel contour.",
  },
  {
    kind: "gloss",
    label: "Gloss black",
    represents: "Chrome delete — pillars, grille surround, badges",
    icon: "spoiler",
    defaultRegion: { x: 0.42, y: 0.24, w: 0.06, h: 0.2 },
    defaultOpacity: 0.92,
    defaultColour: "#0b0d10",
    controls: { opacity: true, colour: false, text: false, angle: false },
  },
  {
    kind: "colour",
    label: "Colour wrap",
    represents: "A colour-change wrap on a panel",
    icon: "decal",
    defaultRegion: { x: 0.3, y: 0.4, w: 0.4, h: 0.2 },
    defaultOpacity: 0.6,
    defaultColour: "#c81e2a",
    controls: { opacity: true, colour: true, text: false, angle: false },
    caveat: "Blends with the panel underneath, so shadows and highlights still read through.",
  },
  {
    kind: "glow",
    label: "Lighting",
    represents: "DRL strip or headlight glow",
    icon: "light",
    defaultRegion: { x: 0.3, y: 0.55, w: 0.16, h: 0.06 },
    defaultOpacity: 0.75,
    defaultColour: "#ffffff",
    controls: { opacity: true, colour: true, text: false, angle: false },
  },
  {
    kind: "text",
    label: "Tyre lettering",
    represents: "Rubber sidewall lettering, or a decal",
    icon: "tyre",
    defaultRegion: { x: 0.16, y: 0.64, w: 0.14, h: 0.05 },
    defaultOpacity: 0.92,
    defaultColour: "#ffffff",
    text: "NEXMOD",
    angle: 0,
    controls: { opacity: true, colour: true, text: true, angle: true },
  },
  {
    kind: "stripe",
    label: "Stripe / decal",
    represents: "A cut-vinyl side stripe or flash",
    icon: "decal",
    defaultRegion: { x: 0.2, y: 0.52, w: 0.6, h: 0.03 },
    defaultOpacity: 0.85,
    defaultColour: "#c81e2a",
    angle: 0,
    controls: { opacity: true, colour: true, text: false, angle: true },
  },
];

export const LAYER_META = new Map(LAYER_KINDS.map((k) => [k.kind, k]));

export function createLayer(kind: LayerKind): Layer {
  const meta = LAYER_META.get(kind);
  if (!meta) throw new Error(`unknown layer kind: ${kind}`);

  return {
    // Not crypto.randomUUID — unavailable on some http:// origins, and this
    // only needs to be unique within one editing session.
    id: `l${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`,
    kind,
    region: { ...meta.defaultRegion },
    opacity: meta.defaultOpacity,
    colour: meta.defaultColour,
    text: meta.text,
    angle: meta.angle ?? 0,
  };
}

/* -------------------------------------------------------------- CSS layers */

/**
 * Inline styles for a layer as rendered in the DOM preview.
 * The canvas export in PhotoStudio mirrors each of these.
 */
export function layerStyle(layer: Layer): React.CSSProperties {
  const base: React.CSSProperties = {
    left: `${layer.region.x * 100}%`,
    top: `${layer.region.y * 100}%`,
    width: `${layer.region.w * 100}%`,
    height: `${layer.region.h * 100}%`,
  };

  switch (layer.kind) {
    case "tint":
    case "gloss":
      return {
        ...base,
        background: layer.colour,
        opacity: layer.opacity,
      };

    case "carbon":
      return {
        ...base,
        opacity: layer.opacity,
        backgroundColor: layer.colour,
        backgroundImage: `
          repeating-linear-gradient(45deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 4px),
          repeating-linear-gradient(-45deg, rgba(0,0,0,0.55) 0 1px, transparent 1px 4px)
        `,
      };

    case "colour":
      return {
        ...base,
        background: layer.colour,
        opacity: layer.opacity,
        mixBlendMode: "color",
      };

    case "glow":
      return {
        ...base,
        opacity: layer.opacity,
        background: `radial-gradient(ellipse at center, ${layer.colour} 0%, ${hexToRgba(
          layer.colour,
          0.5,
        )} 35%, transparent 72%)`,
        mixBlendMode: "screen",
        filter: "blur(2px)",
      };

    case "stripe":
      return {
        ...base,
        background: layer.colour,
        opacity: layer.opacity,
        transform: `rotate(${layer.angle ?? 0}deg)`,
      };

    case "text":
      return {
        ...base,
        opacity: layer.opacity,
        transform: `rotate(${layer.angle ?? 0}deg)`,
      };

    default:
      return base;
  }
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = Number.parseInt(full, 16);
  if (Number.isNaN(num)) return `rgba(255,255,255,${alpha})`;
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

/** Preset swatches for colour-driven layers. */
export const SWATCHES = [
  "#c81e2a",
  "#0b0d10",
  "#f5f6f8",
  "#1b4fa0",
  "#127a4a",
  "#e8a020",
  "#7a2f8f",
  "#b8b9bd",
];
