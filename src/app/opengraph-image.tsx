import { ImageResponse } from "next/og";
import { loadAntonFont } from "@/lib/og-font";
import { SITE_TAGLINE } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TIERS = [
  { label: "S", color: "#ff3b30" },
  { label: "A", color: "#ff8a00" },
  { label: "B", color: "#ffd400" },
  { label: "C", color: "#3ddc66" },
  { label: "D", color: "#3b8bff" },
];

export default async function OpengraphImage() {
  const anton = await loadAntonFont();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "72px 88px",
        background: "#0b0806",
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "10px 22px",
          background: "#ef4123",
          color: "#180800",
          fontSize: 26,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 4,
        }}
      >
        {SITE_TAGLINE}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 28,
          fontSize: 132,
          lineHeight: 0.9,
          color: "#f5efe7",
          textTransform: "uppercase",
          fontFamily: anton ? "Anton" : undefined,
          fontWeight: anton ? 400 : 800,
        }}
      >
        Tier List
      </div>
      <div style={{ display: "flex", marginTop: 48, gap: 10 }}>
        {TIERS.map((tier) => (
          <div
            key={tier.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              background: tier.color,
              color: "#140c06",
              fontSize: 40,
              fontFamily: anton ? "Anton" : undefined,
              fontWeight: anton ? 400 : 800,
              textTransform: "uppercase",
            }}
          >
            {tier.label}
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
      fonts: anton
        ? [{ name: "Anton", data: anton, style: "normal", weight: 400 }]
        : undefined,
    },
  );
}
