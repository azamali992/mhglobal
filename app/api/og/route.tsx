import { ImageResponse } from "next/og";

export const runtime = "edge";

const NAVY = "#0A2240";
const CRIMSON = "#941C1D";
const CREAM = "#EDE6D6";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Custom Apparel Manufacturing for Global Brands").slice(0, 120);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: NAVY,
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 14, height: 44, backgroundColor: CRIMSON, borderRadius: 3, display: "flex" }} />
          <span style={{ fontSize: 30, fontWeight: 600, color: CREAM, letterSpacing: 4, textTransform: "uppercase" }}>
            MH Global Attire
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <span
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              display: "flex",
            }}
          >
            {title}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22, color: "rgba(237,230,214,0.7)", letterSpacing: 1 }}>
            Faisalabad, Pakistan — Custom &amp; Private-Label Apparel Manufacturing
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
