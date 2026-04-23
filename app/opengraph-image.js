import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vault - Exam Paper Hub";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #0f172a 0%, #0f766e 55%, #14b8a6 100%)",
          color: "#ffffff",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.15,
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #99f6e4 0%, transparent 35%), radial-gradient(circle at 80% 70%, #67e8f9 0%, transparent 35%)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "70px 84px",
            gap: 18,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.45)",
              fontSize: 24,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#ccfbf1",
            }}
          >
            Vault
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 74,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: 900,
            }}
          >
            Past Papers, Organized for Fast Revision
          </div>

          <div
            style={{
              display: "flex",
              maxWidth: 860,
              fontSize: 32,
              lineHeight: 1.35,
              color: "#e2e8f0",
            }}
          >
            Search, unlock, and manage semester exam papers in one focused academic hub.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
