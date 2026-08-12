"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TierBoard } from "@/components/tier-board";
import { TierListView } from "@/components/tier-list-view";
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
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-muted transition hover:text-accent"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-subtle">
            {viewOnly
              ? "View only mode"
              : isSaving || manualSaving
                ? "Saving..."
                : "All changes saved"}
          </span>
          {!viewOnly && (
            <button
              type="button"
              onClick={async () => {
                if (!manualSaveHandler) {
                  return;
                }
                setManualSaving(true);
                await manualSaveHandler();
                setManualSaving(false);
              }}
              className="cursor-pointer bg-accent px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-accent-ink transition hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
              disabled={!manualSaveHandler || manualSaving}
            >
              Save
            </button>
          )}
          <button
            type="button"
            onClick={() => setViewOnly((prev) => !prev)}
            className="cursor-pointer border border-ink-600 bg-ink-900 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-foreground transition hover:border-ink-500 hover:bg-ink-800"
          >
            {viewOnly ? "Edit Mode" : "View Only"}
          </button>
        </div>
      </div>

      {viewOnly ? (
        <TierListView data={initial} />
      ) : (
        <div className="border border-ink-700 bg-ink-950 p-3 sm:p-4">
          <TierBoard
            initial={initial}
            onSavingChange={setIsSaving}
            onManualSaveReady={(save) => setManualSaveHandler(() => save)}
          />
        </div>
      )}
    </>
  );
}
