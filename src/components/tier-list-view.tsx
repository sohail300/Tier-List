import Image from "next/image";
import type { TierListData } from "@/types/tier-list";

type Props = {
  data: TierListData;
};

export function TierListView({ data }: Props) {
  return (
    <main className="min-h-screen bg-ink-950 p-6">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="font-display mb-6 text-4xl text-foreground">
          {data.title}
        </h1>

        <section className="space-y-3">
          {data.tiers
            .sort((a, b) => a.order - b.order)
            .map((tier) => (
              <div
                key={tier.id}
                className="grid grid-cols-[90px_1fr] overflow-hidden border border-ink-700 bg-ink-950"
              >
                <div
                  className="flex items-center justify-center border-r border-ink-700 p-2"
                  style={{ backgroundColor: tier.bgColor ?? "#3f3f46" }}
                >
                  <span
                    className="font-display text-4xl"
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
                        className="relative h-22 w-22 overflow-hidden border border-ink-700 bg-ink-900"
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
      </div>
    </main>
  );
}
