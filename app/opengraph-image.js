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
          backgroundColor: "#f8fafc",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background Dot Grid */}
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#cbd5e1" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Soft Background Accents */}
        <div
          style={{
            position: "absolute",
            top: -150,
            right: -50,
            width: 500,
            height: 500,
            backgroundColor: "#00baa4",
            opacity: 0.05,
            borderRadius: "50%",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: 300,
            width: 400,
            height: 400,
            backgroundColor: "#00baa4",
            opacity: 0.08,
            borderRadius: "50%",
            display: "flex",
          }}
        />

        {/* Right side abstract bento graphics */}
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 100,
            bottom: 100,
            width: 400,
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            zIndex: 10,
          }}
        >
          {/* Top Paper Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ffffff",
              width: "100%",
              height: "200px",
              borderRadius: "24px",
              padding: "24px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "#e6fcf9", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00baa4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ width: "140px", height: "10px", backgroundColor: "#cbd5e1", borderRadius: "5px" }} />
                <div style={{ width: "90px", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "4px" }} />
              </div>
            </div>
            <div style={{ width: "100%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", marginBottom: "14px" }} />
            <div style={{ width: "85%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px", marginBottom: "14px" }} />
            <div style={{ width: "60%", height: "8px", backgroundColor: "#f1f5f9", borderRadius: "4px" }} />
          </div>

          {/* Bottom Theme Card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#00baa4",
              width: "360px",
              height: "180px",
              borderRadius: "24px",
              padding: "24px",
              marginLeft: "40px",
              boxShadow: "0 20px 40px -10px rgba(0, 186, 164, 0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, display: "flex" }}>
              <defs>
                <pattern id="cardGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#ffffff" opacity="0.15" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cardGrid)" />
            </svg>
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "auto" }}>
                <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                   </svg>
                </div>
                <div style={{ width: "60px", height: "20px", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "10px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", marginTop: "auto" }}>
                <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: "6px" }} />
                <div style={{ width: "40px", height: "60px", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "6px" }} />
                <div style={{ width: "40px", height: "30px", backgroundColor: "rgba(255,255,255,0.4)", borderRadius: "6px" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
            width: "740px",
            height: "100%",
            zIndex: 10,
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "50px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "56px",
                height: "56px",
                backgroundColor: "#00baa4",
                borderRadius: "14px",
                boxShadow: "0 8px 20px -4px rgba(0, 186, 164, 0.4)",
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <span
              style={{
                fontSize: "38px",
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.04em",
              }}
            >
              Vault
            </span>
          </div>

          {/* Typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "72px",
                fontWeight: 900,
                lineHeight: 1.05,
                color: "#0f172a",
                letterSpacing: "-0.04em",
              }}
            >
              Past Papers, Organized for Fast Revision.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "30px",
                lineHeight: 1.5,
                color: "#475569",
                maxWidth: "600px",
                fontWeight: 500,
              }}
            >
              Search, unlock, and manage semester exam papers in one highly focused academic hub.
            </div>
          </div>

          {/* Domain Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "50px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#00baa4",
                borderRadius: "50%",
                boxShadow: "0 0 12px 2px rgba(0,186,164,0.4)",
              }}
            />
            <span
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#64748b",
                letterSpacing: "-0.01em",
              }}
            >
              paper-vault.app
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
