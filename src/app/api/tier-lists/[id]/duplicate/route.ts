import { NextResponse } from "next/server";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTierListById } from "@/lib/queries";
import { serializeTierList } from "@/lib/tier-list";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const dbUser = await requireDbUser();
    const { id } = await params;
    const source = await getTierListById(id);

    if (!source || source.userId !== dbUser.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const duplicate = await prisma.tierList.create({
      data: {
        title: `${source.title} (Copy)`,
        userId: dbUser.id,
        tiers: {
          create: source.tiers
            .sort((a, b) => a.order - b.order)
            .map((tier) => ({
              name: tier.name,
              bgColor: tier.bgColor,
              textColor: tier.textColor,
              order: tier.order,
            })),
        },
      },
      include: {
        tiers: {
          include: { items: true },
        },
        items: true,
      },
    });

    const tierByOrder = duplicate.tiers.reduce<Record<number, string>>(
      (acc, tier) => {
        acc[tier.order] = tier.id;
        return acc;
      },
      {},
    );

    const sourceTierById = source.tiers.reduce<Record<string, number>>(
      (acc, tier) => {
        acc[tier.id] = tier.order;
        return acc;
      },
      {},
    );

    await prisma.$transaction(
      source.items.map((item) =>
        prisma.item.create({
          data: {
            imageUrl: item.imageUrl,
            order: item.order,
            tierListId: duplicate.id,
            tierId:
              item.tierId && sourceTierById[item.tierId] !== undefined
                ? tierByOrder[sourceTierById[item.tierId]]
                : null,
          },
        }),
      ),
    );

    const finalized = await getTierListById(duplicate.id);
    if (!finalized) {
      return NextResponse.json(
        { error: "Failed to duplicate" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { tierList: serializeTierList(finalized) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
