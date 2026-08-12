import { ImageResponse } from "next/og";
import { loadAntonFont } from "@/lib/og-font";
import { prisma } from "@/lib/prisma";
import { SITE_TAGLINE } from "@/lib/seo";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [tierList, anton] = await Promise.all([
    prisma.tierList.findFirst({
      where: { publicSlug: slug, isPublic: true },
      select: {
        title: true,
        tiers: {
          orderBy: { order: "asc" },
          select: {
            name: true,
            bgColor: true,
            textColor: true,
            _count: { select: { items: true } },
          },
        },
      },
    }),
    loadAntonFont(),
  ]);

  const title = tierList?.title || "Untitled Tier List";
  const tiers = tierList?.tiers.slice(0, 6) ?? [];
  const fontFamily = anton ? "Anton" : undefined;
  const fontWeight = anton ? 400 : 800;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "64px 80px",
        background: "#0b0806",
      }}
    >
      <div
        style={{
          display: "flex",
          padding: "8px 18px",
          background: "#ef4123",
          color: "#180800",
          fontSize: 20,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 3,
        }}
      >
        {SITE_TAGLINE}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 24,
          fontSize: 72,
          lineHeight: 1,
          color: "#f5efe7",
          textTransform: "uppercase",
          fontFamily,
          fontWeight,
        }}
      >
        {title}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          marginTop: 40,
        }}
      >
        {tiers.map((tier) => (
          <div
            key={tier.name}
            style={{
              display: "flex",
              alignItems: "center",
              height: 62,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 90,
                height: "100%",
                background: tier.bgColor,
                color: tier.textColor,
                fontSize: 34,
                fontFamily,
                fontWeight,
                textTransform: "uppercase",
              }}
            >
              {tier.name}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                flex: 1,
                paddingLeft: 20,
                background: "#1a130f",
                color: "#b6a89b",
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {tier._count.items} ranked
            </div>
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
