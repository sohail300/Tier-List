import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TierListView } from "@/components/tier-list-view";
import { prisma } from "@/lib/prisma";
import { SITE_NAME } from "@/lib/seo";
import { serializeTierList } from "@/lib/tier-list";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tierList = await prisma.tierList.findFirst({
    where: { publicSlug: slug, isPublic: true },
    select: { title: true },
  });

  if (!tierList) {
    return { title: "Tier list not found" };
  }

  const title = tierList.title || "Untitled Tier List";
  const description = `See how "${title}" was ranked S to D on ${SITE_NAME}. Drag, drop, and share your own in seconds.`;
  const url = `/share/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicSharePage({ params }: Props) {
  const { slug } = await params;
  const tierList = await prisma.tierList.findFirst({
    where: {
      publicSlug: slug,
      isPublic: true,
    },
    include: {
      tiers: {
        include: { items: true },
      },
      items: true,
    },
  });

  if (!tierList) {
    notFound();
  }
  const data = serializeTierList(tierList);

  return <TierListView data={data} />;
}
