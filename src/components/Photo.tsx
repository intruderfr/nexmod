import { generatedImages, type ImageKey } from "@/data/images.generated";

/**
 * Photo.
 *
 * A plain <img> with a hand-built srcset rather than next/image, because the
 * static export runs with `images.unoptimized` — next/image would emit a single
 * source and throw away the three widths the pipeline already produced.
 *
 * Every image renders over its own inlined blur-up placeholder, so a card never
 * flashes an empty rectangle while the photo decodes.
 *
 * Base path is applied manually since this bypasses next/image, which would
 * normally do it.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Ratio = "square" | "wide" | "tall" | "hero" | "portrait" | "free";

const ratioClass: Record<Ratio, string> = {
  square: "aspect-square",
  wide: "aspect-[16/10]",
  tall: "aspect-[4/5]",
  hero: "aspect-[21/9]",
  portrait: "aspect-[3/4]",
  free: "",
};

export interface PhotoProps {
  image: ImageKey;
  ratio?: Ratio;
  /** Sizes attribute — tell the browser how wide this renders so it picks well. */
  sizes?: string;
  className?: string;
  /** Above-the-fold images should not lazy-load. */
  priority?: boolean;
  /** Overrides the manifest alt. Pass "" for purely decorative images. */
  alt?: string;
  /** Darkening scrim, for images that sit behind text. */
  scrim?: "none" | "soft" | "strong" | "bottom";
  /** Slow zoom on hover of an ancestor marked `group`. */
  zoom?: boolean;
}

const scrimClass: Record<NonNullable<PhotoProps["scrim"]>, string> = {
  none: "",
  soft: "after:absolute after:inset-0 after:bg-black/25",
  strong: "after:absolute after:inset-0 after:bg-black/50",
  bottom:
    "after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/80 after:via-black/25 after:to-transparent",
};

export function Photo({
  image,
  ratio = "wide",
  sizes = "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw",
  className = "",
  priority = false,
  alt,
  scrim = "none",
  zoom = false,
}: PhotoProps) {
  const meta = generatedImages[image];
  const src = (size: string) => `${BASE}/images/${image}-${size}.webp`;

  return (
    <div
      className={`relative overflow-hidden isolate ${ratioClass[ratio]} ${scrimClass[scrim]} ${className}`}
      style={{
        backgroundImage: `url("${meta.lqip}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={src("md")}
        srcSet={`${src("sm")} 640w, ${src("md")} 1200w, ${src("lg")} 1920w`}
        sizes={sizes}
        alt={alt ?? meta.alt}
        width={meta.width ?? undefined}
        height={meta.height ?? undefined}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={`absolute inset-0 h-full w-full object-cover ${
          zoom
            ? "transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            : ""
        }`}
      />
    </div>
  );
}

/** True when a photo exists for this key — call sites fall back to Visual. */
export function hasPhoto(key: string): key is ImageKey {
  return key in generatedImages;
}
