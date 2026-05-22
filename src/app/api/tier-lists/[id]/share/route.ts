import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTierListById } from "@/lib/queries";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const dbUser = await requireDbUser();
    const { id } = await params;
    const tierList = await getTierListById(id);

    if (!tierList || tierList.userId !== dbUser.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.tierList.update({
      where: { id },
      data: {
        isPublic: true,
        publicSlug: tierList.publicSlug ?? randomUUID(),
      },
    });

    return NextResponse.json({
      isPublic: updated.isPublic,
      publicSlug: updated.publicSlug,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
