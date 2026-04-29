import Image from "next/image";
import type { TierListData } from "@/types/tier-list";

type Props = {
  data: TierListData;
};

export function TierListView({ data }: Props) {
  return (
    <main className="mx-auto w-full max-w-6xl p-6">
      <h1 className="mb-5 text-2xl font-bold text-zinc-100">{data.title}</h1>

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
                style={{ backgroundColor: tier.bgColor ?? "#3f3f46" }}
              >
                <span
                  className="text-3xl font-bold"
                  style={{ color: tier.textColor ?? "#f4f4f5" }}
                >
                  {tier.name}
                </span>
              </div>
              <div className="min-h-22">
                <div className="flex min-h-22 flex-wrap gap-0">
                  {tier.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative h-22 w-22 overflow-hidden border border-zinc-700 bg-zinc-900"
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
    </main>
  );
}
