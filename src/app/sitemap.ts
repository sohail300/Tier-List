import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  };

  try {
    const publicTierLists = await prisma.tierList.findMany({
      where: { isPublic: true, publicSlug: { not: null } },
      select: { publicSlug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });

    return [
      home,
      ...publicTierLists.map((tierList) => ({
        url: `${SITE_URL}/share/${tierList.publicSlug}`,
        lastModified: tierList.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return [home];
  }
}
