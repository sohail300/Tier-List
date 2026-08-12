"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import Image from "next/image";

type Props = {
  id: string;
  imageUrl: string;
};

export function DraggableItem({ id, imageUrl }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={clsx(
        "relative h-22 w-22 overflow-hidden border border-ink-700 bg-ink-900 transition",
        isDragging
          ? "z-50 scale-105 border-accent shadow-lg shadow-black/60"
          : "hover:border-ink-500",
      )}
      {...attributes}
      {...listeners}
    >
      <Image
        src={imageUrl}
        alt="Tier item"
        fill
        className="object-cover"
        sizes="80px"
      />
    </button>
  );
}
