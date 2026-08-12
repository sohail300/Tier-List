"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Palette, Trash2 } from "lucide-react";
import { DraggableItem } from "@/components/draggable-item";
import type { TierData } from "@/types/tier-list";

type Props = {
  tier: TierData;
  onTierNameChange: (tierId: string, name: string) => void;
  onTierColorChange: (tierId: string, bgColor: string) => void;
  onRemoveTier: (tierId: string) => void;
  removable: boolean;
  readOnly?: boolean;
};

export function TierRow({
  tier,
  onTierNameChange,
  onTierColorChange,
  onRemoveTier,
  removable,
  readOnly = false,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: tier.id,
  });

  return (
    <div className="grid grid-cols-[90px_1fr] overflow-hidden border border-ink-700 bg-ink-950">
      <div
        className="flex flex-col justify-center border-r border-ink-700 p-2"
        style={{ backgroundColor: tier.bgColor ?? "#3f3f46" }}
      >
        <input
          disabled={readOnly}
          value={tier.name}
          onChange={(event) => onTierNameChange(tier.id, event.target.value)}
          className="font-display w-full border border-black/15 bg-transparent px-2 py-1 text-center text-xl outline-none focus:ring-2 focus:ring-black/30 disabled:opacity-90"
          style={{ color: tier.textColor ?? "#f4f4f5" }}
        />
        {removable && (
          <div className="mt-2 flex gap-1">
            <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 border border-black/20 bg-black/10 px-1.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-current transition hover:bg-black/20">
              <Palette className="h-3 w-3" />
              <input
                type="color"
                value={tier.bgColor ?? "#3f3f46"}
                onChange={(event) =>
                  onTierColorChange(tier.id, event.target.value)
                }
                className="sr-only"
              />
            </label>
            <button
              type="button"
              onClick={() => onRemoveTier(tier.id)}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1 border border-black/20 bg-black/10 px-1.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-current transition hover:bg-red-900 hover:text-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
      <SortableContext
        items={tier.items.map((item) => item.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div
          id={tier.id}
          ref={setNodeRef}
          className={`min-h-22 transition ${isOver ? "bg-ink-800" : "bg-transparent"}`}
        >
          <div className="flex min-h-22 flex-wrap gap-0">
            {tier.items.map((item) => (
              <DraggableItem
                key={item.id}
                id={item.id}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </div>
      </SortableContext>
    </div>
  );
}
