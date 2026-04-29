import { NextResponse } from "next/server";
import { z } from "zod";
import { requireDbUser } from "@/lib/auth";
import { DEFAULT_TIER_COLORS, DEFAULT_TIERS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { serializeTierList } from "@/lib/tier-list";

const createSchema = z.object({
  title: z.string().min(1).max(120),
});

export async function GET() {
  try {
    const dbUser = await requireDbUser();
    const tierLists = await prisma.tierList.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: "desc" },
      include: {
        tiers: {
          include: { items: true },
        },
        items: true,
      },
    });

    return NextResponse.json({
      tierLists: tierLists.map(serializeTierList),
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const dbUser = await requireDbUser();
    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const tierList = await prisma.tierList.create({
      data: {
        title: parsed.data.title,
        userId: dbUser.id,
        tiers: {
          create: DEFAULT_TIERS.map((name, index) => ({
            name,
            bgColor: DEFAULT_TIER_COLORS[name]?.bgColor ?? "#3f3f46",
            textColor: DEFAULT_TIER_COLORS[name]?.textColor ?? "#f4f4f5",
            order: index,
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

    return NextResponse.json(
      { tierList: serializeTierList(tierList) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
