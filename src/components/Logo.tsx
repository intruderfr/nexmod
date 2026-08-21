/**
 * The Nexmod NM monogram.
 *
 * Traced from the official artwork on the company's own Facebook profile
 * picture rather than redrawn by eye, so the angles are the real ones. The
 * outlines came out of the bitmap by edge-chaining and were simplified with
 * Ramer-Douglas-Peucker; the whole mark is two polygons, which is why it is a
 * couple of hundred bytes of markup instead of a raster file.
 *
 * The silver half uses `currentColor` so it inherits from wherever it sits —
 * near-black on a light background, near-white on a dark one — while the M
 * stays the fixed brand red. The original artwork is brushed metal on carbon,
 * an effect that belongs on a print banner and would look cheap at 32px in a
 * header, so the flat treatment here is deliberate rather than a compromise.
 */

/** Sampled from the official artwork: the average of 56,289 red pixels. */
export const BRAND_RED = "#ce2329";

export function LogoMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 1000 367"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M614.4 363.6L384.2 362.2L253.7 205.3L246.3 215.5L184.8 363.6L0.0 363.6L0.0 354.8L140.8 54.3L121.7 32.3L88.0 4.4L344.6 4.4Z"
      />
      <path
        fill={BRAND_RED}
        d="M401.8 2.9L610.0 0.0L718.5 112.9L837.2 0.0L1000.0 0.0L884.2 366.6L733.1 366.6L799.1 156.9L636.4 310.9Z"
      />
    </svg>
  );
}

/**
 * Monogram plus wordmark, as used in the header and footer.
 *
 * The wordmark is live text in the display face rather than an image of the
 * original lettering: it stays crisp at any size, it can be read by a screen
 * reader, and it does not need a second file. The red X echoes the artwork,
 * where the X of NEXMOD is the one red letter.
 */
export function LogoLockup({
  className,
  showTagline = false,
}: {
  className?: string;
  /** The strapline is wide; only show it where there is genuinely room. */
  showTagline?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-[18px] w-auto shrink-0 text-[var(--fg)]" />

      <span className="block leading-none">
        <span className="block font-[family-name:var(--font-display)] font-extrabold tracking-[-0.03em] text-[17px]">
          NE<span style={{ color: BRAND_RED }}>X</span>MOD
        </span>
        {showTagline && (
          <span className="block font-[family-name:var(--font-mono)] text-[8px] tracking-[0.18em] uppercase text-[var(--fg-subtle)] mt-[3px]">
            Premium Car Accessories
          </span>
        )}
      </span>
    </span>
  );
}
