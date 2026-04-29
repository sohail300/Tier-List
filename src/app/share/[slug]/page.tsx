import Image from "next/image";
import { notFound } from "next/navigation";
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

  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="mb-1 text-2xl font-bold text-zinc-100">{data.title}</h1>
      <p className="mb-5 text-sm text-zinc-400">Shared Tier List</p>

      <section className="space-y-3">
        {data.tiers
          .sort((a, b) => a.order - b.order)
          .map((tier) => (
            <div
              key={tier.id}
              className="grid grid-cols-[90px_1fr] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
            >
              <div
                className="flex items-center justify-center border-r border-zinc-800 p-2"
                style={{ backgroundColor: tier.bgColor }}
              >
                <span
                  className="text-3xl font-bold"
                  style={{ color: tier.textColor }}
                >
                  {tier.name}
                </span>
              </div>
              <div className="min-h-24 p-3">
                <div className="flex min-h-18 flex-wrap gap-2">
                  {tier.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900"
                    >
                      <Image
                        src={item.imageUrl}
                        alt="Tier item"
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </section>

      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
        <p className="mb-2 text-sm font-medium text-zinc-300">Image Pool</p>
        <div className="flex min-h-24 flex-wrap gap-2 rounded-lg p-1">
          {data.poolItems.map((item) => (
            <div
              key={item.id}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900"
            >
              <Image
                src={item.imageUrl}
                alt="Pool item"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
