import { prisma } from "@/lib/prisma";

export async function getTierListById(id: string) {
  return prisma.tierList.findUnique({
    where: { id },
    include: {
      tiers: {
        include: {
          items: true,
        },
      },
      items: true,
    },
  });
}
