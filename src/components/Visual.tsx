import { CategoryIcon } from "./Icons";

/**
 * GENERATED IMAGERY
 *
 * Nexmod has no product photography supplied yet. Rather than ship broken
 * <img> tags or grey boxes, every product and service renders a generated
 * material sample: a category-specific gradient base, a carbon weave, a
 * specular sweep that shifts on hover, registration marks, a vignette, and the
 * category glyph.
 *
 * The intent is that it reads as a considered material study rather than a
 * placeholder. When real photos arrive, swap this for next/image — every call
 * site passes the same props, so nothing else changes.
 */

/** Base, mid and specular tint per category. Tuned so no two neighbours clash. */
const palettes: Record<string, { base: string; mid: string; tint: string }> = {
  "carbon-fibre": { base: "#1c2028", mid: "#0d1014", tint: "255,255,255" },
  "ez-lip": { base: "#2c1512", mid: "#120708", tint: "255,90,60" },
  "spoilers-body": { base: "#18202c", mid: "#0a0e14", tint: "150,190,255" },
  "tyre-stickers": { base: "#211c28", mid: "#0d0b11", tint: "230,220,255" },
  lighting: { base: "#2c2414", mid: "#120e07", tint: "255,200,110" },
  audio: { base: "#12222c", mid: "#070f14", tint: "120,210,255" },
  "cameras-safety": { base: "#152622", mid: "#08120f", tint: "130,240,200" },
  interior: { base: "#261e15", mid: "#120d08", tint: "255,215,170" },
  essentials: { base: "#1b2028", mid: "#0b0e12", tint: "200,215,235" },
  // Service categories
  styling: { base: "#26141a", mid: "#0f070b", tint: "255,120,110" },
  protection: { base: "#12202c", mid: "#070e14", tint: "140,200,255" },
  electronics: { base: "#2c2414", mid: "#120e07", tint: "255,200,110" },
};

const FALLBACK = { base: "#1b2028", mid: "#0b0e12", tint: "200,215,235" };

type Ratio = "square" | "wide" | "tall" | "hero";

const ratioClass: Record<Ratio, string> = {
  square: "aspect-square",
  wide: "aspect-[16/10]",
  tall: "aspect-[4/5]",
  hero: "aspect-[21/9]",
};

interface VisualProps {
  /** Category or service-category slug — selects the palette. */
  variant: string;
  /** Icon key from the Icons iconMap. */
  icon: string;
  /** Short text stamped in the corner. */
  label?: string;
  ratio?: Ratio;
  className?: string;
}

export function Visual({ variant, icon, label, ratio = "wide", className = "" }: VisualProps) {
  const { base, mid, tint } = palettes[variant] ?? FALLBACK;

  return (
    <div
      className={`nex-visual relative overflow-hidden isolate ${ratioClass[ratio]} ${className}`}
      style={{
        background: `radial-gradient(120% 100% at 22% 8%, ${base} 0%, ${mid} 62%, #050608 100%)`,
      }}
      aria-hidden="true"
    >
      {/* Carbon weave — two opposed diagonals, fine pitch */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 4px),
            repeating-linear-gradient(-45deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 4px)
          `,
        }}
      />

      {/* Specular sweep. Slides across on hover of the parent card. */}
      <div
        className="nex-visual-sweep absolute inset-y-0 -left-1/3 w-2/3"
        style={{
          background: `linear-gradient(104deg, transparent 0%, rgba(${tint},0.13) 45%, rgba(${tint},0.2) 52%, transparent 100%)`,
        }}
      />

      {/* Ambient tint pooling top-right */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 60% at 82% 12%, rgba(${tint},0.13), transparent 65%)`,
        }}
      />

      {/* Registration marks — technical drawing language */}
      <svg
        className="absolute inset-0 h-full w-full text-white/[0.09]"
        preserveAspectRatio="none"
        viewBox="0 0 100 60"
        fill="none"
      >
        <path d="M0 0h9M0 0v5.5" stroke="currentColor" strokeWidth="0.35" />
        <path d="M100 0h-9M100 0v5.5" stroke="currentColor" strokeWidth="0.35" />
        <path d="M0 60h9M0 60v-5.5" stroke="currentColor" strokeWidth="0.35" />
        <path d="M100 60h-9M100 60v-5.5" stroke="currentColor" strokeWidth="0.35" />
      </svg>

      {/* Glyph */}
      <div className="absolute inset-0 grid place-items-center">
        <CategoryIcon
          name={icon}
          className="nex-visual-glyph w-[34%] h-[34%] max-w-[132px] max-h-[132px] text-white/[0.16]"
          strokeWidth={0.75}
        />
      </div>

      {/* Vignette — seats the sample into the card */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 110% at 50% 42%, transparent 42%, rgba(0,0,0,0.42) 100%)",
        }}
      />

      {label && (
        <span className="absolute bottom-3 left-3.5 font-[family-name:var(--font-mono)] text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
          {label}
        </span>
      )}
    </div>
  );
}
