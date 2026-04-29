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
      <Toaster position="top-center" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Your Tier Lists</h1>
        <button
          type="button"
          onClick={createList}
          className="cursor-pointer rounded-lg border border-orange-300/40 bg-orange-500 px-4 py-2 text-sm font-semibold text-[#251300] transition hover:bg-orange-400"
        >
          New Tier List
        </button>
      </div>

      {tierLists.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
          No tier lists yet. Create your first one.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tierLists.map((tierList) => (
            <article
              key={tierList.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 cursor-pointer"
            >
              <h2 className="truncate text-lg font-semibold text-zinc-100">
                {tierList.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                {new Date(tierList.updatedAt).toLocaleString()}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <Link
                  href={`/tier-lists/${tierList.id}`}
                  className="inline-flex h-9 items-center justify-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => duplicateList(tierList.id)}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() => shareList(tierList.id)}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1 rounded-md border border-orange-300/40 bg-orange-500 px-2.5 py-1.5 font-medium text-[#251300] transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => deleteList(tierList.id)}
                  className="inline-flex h-9 cursor-pointer items-center justify-center gap-1 rounded-md border border-red-900 bg-red-950 px-2.5 py-1.5 font-medium text-red-300 transition hover:border-red-700 hover:bg-red-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
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
