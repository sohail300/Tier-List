import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardGrid } from "@/components/dashboard-grid";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeTierList } from "@/lib/tier-list";

export const metadata: Metadata = {
  title: "Your Tier Lists",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const dbUser = await requireDbUser();
  const tierLists = await prisma.tierList.findMany({
    where: { userId: dbUser.id },
    include: {
      tiers: {
        include: { items: true },
      },
      items: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <main className="relative mx-auto w-full max-w-6xl px-6 py-10">
        <DashboardGrid tierLists={tierLists.map(serializeTierList)} />
      </main>
    </div>
  );
}
