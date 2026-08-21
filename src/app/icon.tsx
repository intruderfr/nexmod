import { ImageResponse } from "next/og";

/** Required so this route can be emitted by `output: export`. */
export const dynamic = "force-static";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Favicon / app icon — the Nexmod "N" mark with its accent underline. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(145deg, #1a1d24 0%, #08090b 100%)",
        }}
      >
        <div
          style={{
            fontSize: 300,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.06em",
            lineHeight: 1,
            display: "flex",
          }}
        >
          N
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 62,
            left: 96,
            width: 320,
            height: 28,
            background: "#ff2d20",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
