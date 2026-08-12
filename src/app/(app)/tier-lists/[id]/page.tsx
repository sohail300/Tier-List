import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { TierListEditorShell } from "@/components/tier-list-editor-shell";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeTierList } from "@/lib/tier-list";

export const metadata: Metadata = {
  title: "Edit Tier List",
  robots: { index: false, follow: false },
};

export default async function TierListEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const dbUser = await requireDbUser();
  const { id } = await params;
  const tierList = await prisma.tierList.findUnique({
    where: { id },
    include: {
      tiers: {
        include: { items: true },
      },
      items: true,
    },
  });

  if (!tierList || tierList.userId !== dbUser.id) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <main className="relative mx-auto w-full max-w-6xl px-6 py-8">
        <TierListEditorShell initial={serializeTierList(tierList)} />
      </main>
    </div>
  );
}
