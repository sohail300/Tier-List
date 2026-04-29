"use client";

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import debounce from "lodash.debounce";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DraggableItem } from "@/components/draggable-item";
import { TierRow } from "@/components/tier-row";
import { DEFAULT_TIER_COLORS } from "@/lib/constants";
import type { TierData, TierItem, TierListData } from "@/types/tier-list";

type Props = {
  initial: TierListData;
  readOnly?: boolean;
  onSavingChange?: (isSaving: boolean) => void;
  onManualSaveReady?: (save: () => Promise<void>) => void;
};

const FALLBACK_TIER_COLOR = {
  bgColor: "#3f3f46",
  textColor: "#f4f4f5",
};

function normalizeHexColor(value: string) {
  const withHash = value.startsWith("#") ? value : `#${value}`;
  return /^#[0-9a-fA-F]{6}$/.test(withHash) ? withHash : "#3f3f46";
}

function getContrastTextColor(bgColor: string) {
  const hex = normalizeHexColor(bgColor).replace("#", "");
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 140 ? "#2f3440" : "#f4f4f5";
}

function withTierColor(tier: TierData): TierData {
  if (tier.bgColor && tier.textColor) {
    return tier;
  }
  const preset = DEFAULT_TIER_COLORS[tier.name.trim().toUpperCase()];
  return {
    ...tier,
    bgColor: preset?.bgColor ?? FALLBACK_TIER_COLOR.bgColor,
    textColor: preset?.textColor ?? FALLBACK_TIER_COLOR.textColor,
  };
}

function normalize(tiers: TierData[], poolItems: TierItem[]) {
  return {
    tiers: tiers.map((tier, tierIndex) => ({
      ...tier,
      order: tierIndex,
      items: tier.items.map((item, itemIndex) => ({
        ...item,
        order: itemIndex,
        tierId: tier.id,
      })),
    })),
    poolItems: poolItems.map((item, index) => ({
      ...item,
      order: index,
      tierId: null,
    })),
  };
}

export function TierBoard({
  initial,
  readOnly = false,
  onSavingChange,
  onManualSaveReady,
}: Props) {
  const [title, setTitle] = useState(initial.title);
  const [tiers, setTiers] = useState<TierData[]>(() =>
    initial.tiers.map(withTierColor),
  );
  const [poolItems, setPoolItems] = useState<TierItem[]>(initial.poolItems);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const sensors = useSensors(...(readOnly ? [] : [pointerSensor]));
  const { setNodeRef: setPoolRef, isOver: isPoolOver } = useDroppable({
    id: "pool",
  });

  const allItems = useMemo(
    () => [...poolItems, ...tiers.flatMap((tier) => tier.items)],
    [poolItems, tiers],
  );

  useEffect(() => {
    onSavingChange?.(isSaving);
  }, [isSaving, onSavingChange]);

  const saveTierList = useCallback(
    async (
      nextTitle: string,
      nextTiers: TierData[],
      nextPoolItems: TierItem[],
    ) => {
      if (readOnly) {
        return;
      }

      const payload = normalize(nextTiers, nextPoolItems);
      setIsSaving(true);
      await fetch(`/api/tier-lists/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: nextTitle,
          tiers: payload.tiers.map((tier) => ({
            id: tier.id,
            name: tier.name,
            bgColor: tier.bgColor ?? FALLBACK_TIER_COLOR.bgColor,
            textColor: tier.textColor ?? FALLBACK_TIER_COLOR.textColor,
            order: tier.order,
          })),
          items: [
            ...payload.poolItems,
            ...payload.tiers.flatMap((tier) => tier.items),
          ].map((item) => ({
            id: item.id,
            imageUrl: item.imageUrl,
            tierId: item.tierId,
            order: item.order,
          })),
        }),
      });
      setIsSaving(false);
    },
    [initial.id, readOnly],
  );

  const debouncedSave = useMemo(
    () =>
      debounce(
        (
          nextTitle: string,
          nextTiers: TierData[],
          nextPoolItems: TierItem[],
        ) => {
          void saveTierList(nextTitle, nextTiers, nextPoolItems);
        },
        550,
      ),
    [saveTierList],
  );

  const manualSave = useCallback(async () => {
    if (readOnly) {
      return;
    }
    debouncedSave.cancel();
    await saveTierList(title, tiers, poolItems);
  }, [debouncedSave, poolItems, readOnly, saveTierList, tiers, title]);

  useEffect(() => {
    onManualSaveReady?.(manualSave);
  }, [manualSave, onManualSaveReady]);

  const queueSave = (
    nextTitle: string,
    nextTiers: TierData[],
    nextPoolItems: TierItem[],
  ) => {
    setTitle(nextTitle);
    setTiers(nextTiers);
    setPoolItems(nextPoolItems);
    debouncedSave(nextTitle, nextTiers, nextPoolItems);
  };

  const findContainer = (itemId: string) => {
    if (poolItems.some((item) => item.id === itemId)) {
      return "pool";
    }
    const tier = tiers.find((candidate) =>
      candidate.items.some((item) => item.id === itemId),
    );
    return tier?.id ?? null;
  };

  const getItemsForContainer = (containerId: string) => {
    if (containerId === "pool") {
      return poolItems;
    }
    return tiers.find((tier) => tier.id === containerId)?.items ?? [];
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (readOnly) {
      return;
    }
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (readOnly) {
      setActiveId(null);
      return;
    }
    const active = String(event.active.id);
    const over = event.over ? String(event.over.id) : null;
    setActiveId(null);
    if (!over) {
      return;
    }

    const sourceContainer = findContainer(active);
    const targetContainer =
      over === "pool" || tiers.some((tier) => tier.id === over)
        ? over
        : findContainer(over);

    if (!sourceContainer || !targetContainer) {
      return;
    }

    const sourceItems = [...getItemsForContainer(sourceContainer)];
    const targetItems =
      sourceContainer === targetContainer
        ? sourceItems
        : [...getItemsForContainer(targetContainer)];

    const sourceIndex = sourceItems.findIndex((item) => item.id === active);
    if (sourceIndex < 0) {
      return;
    }

    if (sourceContainer === targetContainer) {
      const targetIndex = targetItems.findIndex((item) => item.id === over);
      const moved = arrayMove(
        sourceItems,
        sourceIndex,
        targetIndex < 0 ? sourceItems.length - 1 : targetIndex,
      );
      if (sourceContainer === "pool") {
        queueSave(
          title,
          tiers,
          moved.map((item, index) => ({ ...item, order: index, tierId: null })),
        );
      } else {
        const nextTiers = tiers.map((tier) =>
          tier.id === sourceContainer
            ? {
                ...tier,
                items: moved.map((item, index) => ({
                  ...item,
                  order: index,
                  tierId: sourceContainer,
                })),
              }
            : tier,
        );
        queueSave(title, nextTiers, poolItems);
      }
      return;
    }

    const [movedItem] = sourceItems.splice(sourceIndex, 1);
    const targetIndex = targetItems.findIndex((item) => item.id === over);
    targetItems.splice(
      targetIndex < 0 ? targetItems.length : targetIndex,
      0,
      movedItem,
    );

    const sourceNormalized =
      sourceContainer === "pool"
        ? sourceItems.map((item, index) => ({
            ...item,
            order: index,
            tierId: null,
          }))
        : sourceItems.map((item, index) => ({
            ...item,
            order: index,
            tierId: sourceContainer,
          }));
    const targetNormalized =
      targetContainer === "pool"
        ? targetItems.map((item, index) => ({
            ...item,
            order: index,
            tierId: null,
          }))
        : targetItems.map((item, index) => ({
            ...item,
            order: index,
            tierId: targetContainer,
          }));

    const nextTiers = tiers.map((tier) => {
      if (tier.id === sourceContainer) {
        return { ...tier, items: sourceNormalized };
      }
      if (tier.id === targetContainer) {
        return { ...tier, items: targetNormalized };
      }
      return tier;
    });
    const nextPool =
      sourceContainer === "pool"
        ? sourceNormalized
        : targetContainer === "pool"
          ? targetNormalized
          : poolItems;
    queueSave(title, nextTiers, nextPool);
  };

  const addTier = () => {
    const nextTiers = [
      ...tiers,
      {
        id: crypto.randomUUID(),
        name: "New",
        order: tiers.length,
        bgColor: FALLBACK_TIER_COLOR.bgColor,
        textColor: FALLBACK_TIER_COLOR.textColor,
        items: [],
      },
    ];
    queueSave(title, nextTiers, poolItems);
  };

  const removeTier = (tierId: string) => {
    const removedTier = tiers.find((tier) => tier.id === tierId);
    if (!removedTier) {
      return;
    }
    const nextTiers = tiers.filter((tier) => tier.id !== tierId);
    const nextPool = [
      ...poolItems,
      ...removedTier.items.map((item) => ({ ...item, tierId: null })),
    ];
    queueSave(title, nextTiers, nextPool);
  };

  const renameTier = (tierId: string, name: string) => {
    const nextTiers = tiers.map((tier) =>
      tier.id === tierId ? { ...tier, name } : tier,
    );
    queueSave(title, nextTiers, poolItems);
  };

  const changeTierColor = (tierId: string, bgColor: string) => {
    const normalizedBgColor = normalizeHexColor(bgColor);
    const nextTiers = tiers.map((tier) =>
      tier.id === tierId
        ? {
            ...tier,
            bgColor: normalizedBgColor,
            textColor: getContrastTextColor(normalizedBgColor),
          }
        : tier,
    );
    queueSave(title, nextTiers, poolItems);
  };

  const onTitleBlur = () => {
    queueSave(title, tiers, poolItems);
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0 || readOnly) {
      return;
    }

    const signatureResponse = await fetch("/api/upload/signature", {
      method: "POST",
    });
    if (!signatureResponse.ok) {
      return;
    }
    const signatureData = await signatureResponse.json();

    const uploads = await Promise.all(
      Array.from(files).map(async (file) => {
        const form = new FormData();
        form.append("file", file);
        form.append("api_key", signatureData.apiKey);
        form.append("timestamp", String(signatureData.timestamp));
        form.append("signature", signatureData.signature);
        form.append("folder", signatureData.folder);
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
          {
            method: "POST",
            body: form,
          },
        );
        return response.json();
      }),
    );

    const valid = uploads
      .filter((upload) => upload?.secure_url)
      .map((upload) => upload.secure_url as string);
    if (valid.length === 0) {
      return;
    }

    const nextPool = [
      ...poolItems,
      ...valid.map((imageUrl, index) => ({
        id: crypto.randomUUID(),
        imageUrl,
        order: poolItems.length + index,
        tierId: null,
      })),
    ];
    queueSave(title, tiers, nextPool);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          disabled={readOnly}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={onTitleBlur}
          className="min-w-[260px] flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-lg font-semibold text-zinc-100 outline-none ring-indigo-500 focus:ring-2 disabled:opacity-80"
        />
        {!readOnly && (
          <button
            type="button"
            onClick={addTier}
            className="rounded-lg cursor-pointer border border-orange-300/40 bg-orange-500 px-4 py-2 text-sm font-semibold text-[#251300] transition hover:bg-orange-400"
          >
            Add Tier
          </button>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-3">
          {tiers
            .sort((a, b) => a.order - b.order)
            .map((tier) => (
              <TierRow
                key={tier.id}
                tier={tier}
                onTierNameChange={renameTier}
                onTierColorChange={changeTierColor}
                onRemoveTier={removeTier}
                removable={!readOnly && tiers.length > 1}
                readOnly={readOnly}
              />
            ))}
        </div>

        <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <p className="mb-2 text-sm font-medium text-zinc-300">Image Pool</p>
          <SortableContext
            items={poolItems.map((item) => item.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div
              id="pool"
              ref={setPoolRef}
              className={`flex min-h-24 flex-wrap gap-2 rounded-lg p-1 transition ${isPoolOver ? "bg-zinc-900" : ""}`}
            >
              {poolItems.map((item) => (
                <DraggableItem
                  key={item.id}
                  id={item.id}
                  imageUrl={item.imageUrl}
                />
              ))}
              {!readOnly && (
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-orange-300/40 bg-orange-500/10 text-orange-200 transition hover:border-orange-300/70 hover:bg-orange-500/20">
                  <Plus className="h-6 w-6" />
                  <span className="sr-only">Upload images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => uploadImages(event.target.files)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-600 bg-zinc-900 opacity-90">
              <Image
                src={
                  allItems.find((item) => item.id === activeId)?.imageUrl ?? ""
                }
                alt="Dragging item"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
