"use client";

import { Copy, Pencil, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import type { TierListData } from "@/types/tier-list";

type Props = {
  tierLists: TierListData[];
};

export function DashboardGrid({ tierLists }: Props) {
  const router = useRouter();

  const createList = async () => {
    const response = await fetch("/api/tier-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled Tier List" }),
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    router.push(`/tier-lists/${data.tierList.id}`);
    router.refresh();
  };

  const deleteList = async (id: string) => {
    await fetch(`/api/tier-lists/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const duplicateList = async (id: string) => {
    const response = await fetch(`/api/tier-lists/${id}/duplicate`, {
      method: "POST",
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    router.push(`/tier-lists/${data.tierList.id}`);
    router.refresh();
  };

  const shareList = async (id: string) => {
    const response = await fetch(`/api/tier-lists/${id}/share`, {
      method: "POST",
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    await navigator.clipboard.writeText(
      `${window.location.origin}/share/${data.publicSlug}`,
    );
    toast.success("Share link copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--ink-800)",
            color: "var(--foreground)",
            border: "1px solid var(--ink-600)",
            borderRadius: 0,
            fontWeight: 600,
          },
        }}
      />
      <div className="flex items-center justify-between border-b border-ink-700 pb-4">
        <h1 className="font-display text-3xl text-foreground">
          Your Tier Lists
        </h1>
        <button
          type="button"
          onClick={createList}
          className="cursor-pointer bg-accent px-4 py-2.5 text-sm font-bold uppercase tracking-[0.1em] text-accent-ink transition hover:-translate-y-0.5 hover:bg-accent-strong"
        >
          New Tier List
        </button>
      </div>

      {tierLists.length === 0 ? (
        <div className="border border-dashed border-ink-600 bg-ink-900 p-10 text-center">
          <p className="font-display text-xl text-muted">No tier lists yet</p>
          <p className="mt-1 text-sm text-subtle">
            Create your first one to start ranking.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tierLists.map((tierList) => (
            <article
              key={tierList.id}
              className="group cursor-pointer border border-ink-700 bg-ink-900 p-4 transition hover:border-accent"
            >
              <h2 className="truncate text-lg font-bold text-foreground">
                {tierList.title}
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-subtle">
                {new Date(tierList.updatedAt).toLocaleString()}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Link
                  href={`/tier-lists/${tierList.id}`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 border border-ink-600 bg-ink-800 px-2.5 py-1.5 font-semibold text-foreground transition hover:border-ink-500 hover:bg-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => duplicateList(tierList.id)}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 border border-ink-600 bg-ink-800 px-2.5 py-1.5 font-semibold text-foreground transition hover:border-ink-500 hover:bg-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => shareList(tierList.id)}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 bg-accent px-2.5 py-1.5 font-bold text-accent-ink transition hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => deleteList(tierList.id)}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 border border-red-900 bg-red-950 px-2.5 py-1.5 font-semibold text-red-300 transition hover:border-red-700 hover:bg-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
