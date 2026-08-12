import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTierListById } from "@/lib/queries";
import { serializeTierList } from "@/lib/tier-list";

const updateSchema = z.object({
  title: z.string().min(1).max(120),
  tiers: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1).max(20),
      bgColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
      order: z.number().int().min(0),
    }),
  ),
  items: z.array(
    z.object({
      id: z.string(),
      imageUrl: z.string().url(),
      tierId: z.string().nullable(),
      order: z.number().int().min(0),
    }),
  ),
  isPublic: z.boolean().optional(),
});

async function getAuthorizedTierList(id: string) {
  const dbUser = await requireDbUser();
  const tierList = await getTierListById(id);
  if (!tierList || tierList.userId !== dbUser.id) {
    return null;
  }
  return tierList;
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tierList = await getAuthorizedTierList(id);
    if (!tierList) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ tierList: serializeTierList(tierList) });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tierList = await getAuthorizedTierList(id);
    if (!tierList) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { title, tiers, items, isPublic } = parsed.data;
    const existingTierIds = new Set(tierList.tiers.map((tier) => tier.id));
    const incomingTierIds = new Set(tiers.map((tier) => tier.id));
    const existingItemIds = new Set(tierList.items.map((item) => item.id));
    const incomingItemIds = new Set(items.map((item) => item.id));

    for (const item of items) {
      if (item.tierId && !incomingTierIds.has(item.tierId)) {
        return NextResponse.json(
          { error: "Invalid tier reference in items" },
          { status: 400 },
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.tierList.update({
        where: { id },
        data: {
          title,
          isPublic: isPublic ?? tierList.isPublic,
          publicSlug:
            (isPublic ?? tierList.isPublic)
              ? (tierList.publicSlug ?? randomUUID())
              : tierList.publicSlug,
        },
      });

      await Promise.all(
        [...existingTierIds]
          .filter((tierId) => !incomingTierIds.has(tierId))
          .map((tierId) => tx.tier.delete({ where: { id: tierId } })),
      );

      await Promise.all(
        [...existingItemIds]
          .filter((itemId) => !incomingItemIds.has(itemId))
          .map((itemId) => tx.item.delete({ where: { id: itemId } })),
      );

      await Promise.all(
        tiers.map((tier) =>
          existingTierIds.has(tier.id)
            ? tx.tier.update({
                where: { id: tier.id },
                data: {
                  name: tier.name,
                  bgColor: tier.bgColor,
                  textColor: tier.textColor,
                  order: tier.order,
                },
              })
            : tx.tier.create({
                data: {
                  id: tier.id,
                  name: tier.name,
                  bgColor: tier.bgColor,
                  textColor: tier.textColor,
                  order: tier.order,
                  tierListId: id,
                },
              }),
        ),
      );

      await Promise.all(
        items.map((item) =>
          existingItemIds.has(item.id)
            ? tx.item.update({
                where: { id: item.id },
                data: {
                  imageUrl: item.imageUrl,
                  tierId: item.tierId,
                  order: item.order,
                },
              })
            : tx.item.create({
                data: {
                  id: item.id,
                  imageUrl: item.imageUrl,
                  tierId: item.tierId,
                  order: item.order,
                  tierListId: id,
                },
              }),
        ),
      );
    });

    const updated = await getTierListById(id);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ tierList: serializeTierList(updated) });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const tierList = await getAuthorizedTierList(id);
    if (!tierList) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.tierList.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
