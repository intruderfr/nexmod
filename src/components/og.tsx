import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Shared Open Graph card renderer.
 *
 * Every page that needs a social card calls this with its own eyebrow, title
 * and footnote, so all cards share one visual system. Uses only system fonts
 * and flat colour so it renders fast at the edge with no font fetch.
 */
export function ogImage({
  eyebrow,
  title,
  footnote,
  accent = "#ff2d20",
}: {
  eyebrow: string;
  title: string;
  footnote?: string;
  accent?: string;
}) {
  // Long titles need a smaller face to stay on the card.
  const titleSize = title.length > 78 ? 54 : title.length > 48 ? 66 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(140deg, #14181f 0%, #08090b 62%)",
          position: "relative",
        }}
      >
        {/* Accent sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 620,
            height: 630,
            display: "flex",
            background: `linear-gradient(200deg, ${accent}22 0%, transparent 62%)`,
          }}
        />

        {/* Top rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 200,
            height: 8,
            background: accent,
            display: "flex",
          }}
        />

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ffffff",
              color: "#08090b",
              fontSize: 34,
              fontWeight: 800,
              borderRadius: 10,
            }}
          >
            N
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
              NEXMOD
            </div>
            <div style={{ fontSize: 15, color: "#98a1af", letterSpacing: "0.14em" }}>
              PREMIUM CAR ACCESSORIES
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: accent,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 22,
              display: "flex",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#98a1af",
          }}
        >
          <div style={{ display: "flex" }}>{footnote ?? "nexmod.lk"}</div>
          <div style={{ display: "flex" }}>Dehiwala, Sri Lanka · 075 774 0404</div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
