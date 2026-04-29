import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardGrid } from "@/components/dashboard-grid";
import { requireDbUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serializeTierList } from "@/lib/tier-list";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
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
    <div
      className={`relative  min-h-screen overflow-hidden bg-[#0c0c11] text-zinc-100`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <main className="relative mx-auto w-full max-w-6xl px-6 py-8 ">
        <DashboardGrid tierLists={tierLists.map(serializeTierList)} />
      </main>
    </div>
  );
}
