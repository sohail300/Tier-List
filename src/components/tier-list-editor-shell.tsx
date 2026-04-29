"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TierBoard } from "@/components/tier-board";
import type { TierListData } from "@/types/tier-list";

type Props = {
  initial: TierListData;
};

export function TierListEditorShell({ initial }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [manualSaving, setManualSaving] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [manualSaveHandler, setManualSaveHandler] = useState<
    null | (() => Promise<void>)
  >(null);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 rounded-full text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300 transition hover:border-orange-300/40 hover:text-orange-200"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">
            {viewOnly
              ? "View only mode"
              : isSaving || manualSaving
                ? "Saving..."
                : "All changes saved"}
          </span>
          <button
            type="button"
            onClick={async () => {
              if (!manualSaveHandler || viewOnly) {
                return;
              }
              setManualSaving(true);
              await manualSaveHandler();
              setManualSaving(false);
            }}
            className="rounded-md cursor-pointer border border-orange-300/40 bg-orange-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#251300] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={!manualSaveHandler || manualSaving || viewOnly}
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setViewOnly((prev) => !prev)}
            className="rounded-md cursor-pointer border border-zinc-600 bg-zinc-900 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
          >
            {viewOnly ? "Edit Mode" : "View Only"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/70 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)] sm:p-4">
        <TierBoard
          initial={initial}
          readOnly={viewOnly}
          onSavingChange={setIsSaving}
          onManualSaveReady={(save) => setManualSaveHandler(() => save)}
        />
      </div>
    </>
  );
}
