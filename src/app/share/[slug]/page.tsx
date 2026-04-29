import { notFound } from "next/navigation";
import { TierListView } from "@/components/tier-list-view";
import { prisma } from "@/lib/prisma";
import { serializeTierList } from "@/lib/tier-list";

export default async function PublicSharePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
