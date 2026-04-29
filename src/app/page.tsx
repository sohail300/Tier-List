import { Show, SignInButton } from "@clerk/nextjs";
import { Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const heroRows = [
    {
      tier: "S",
      label: "Legendary",
      images: [
        "/hero/s-1.jpg",
        "/hero/s-2.jpg",
        "/hero/s-3.jpg",
        "/hero/s-4.jpg",
      ],
    },
    {
      tier: "A",
      label: "Certified",
      images: ["/hero/a-1.jpg", "/hero/a-2.jpg"],
    },
    { tier: "B", label: "Solid", images: ["/hero/b-1.jpg"] },
    { tier: "C", label: "Mid", images: ["/hero/c-1.jpg", "/hero/c-2.jpg"] },
    {
      tier: "D",
      label: "Uninstall",
      images: ["/hero/d-1.jpg", "/hero/d-2.jpg"],
    },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0c0c11] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="pointer-events-none absolute -left-20 top-12 h-64 w-64 rounded-full bg-orange-500/18 blur-[100px]" />
      <div className="pointer-events-none absolute -right-12 bottom-10 h-72 w-72 rounded-full bg-orange-400/14 blur-[120px]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full border border-orange-300/30 bg-orange-500/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
              Rank. Roast. Repeat.
            </p>

            <h1 className="max-w-3xl text-5xl font-bold uppercase leading-[0.95] tracking-[0.02em] text-zinc-100 sm:text-6xl lg:text-7xl">
              Tier List Arena
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <div className="cursor-pointer rounded-xl border border-orange-300/40 bg-orange-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#251300] transition hover:-translate-y-0.5 hover:bg-orange-400">
                    Sign In with Google
                  </div>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-orange-300/40 bg-orange-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-[#251300] transition hover:-translate-y-0.5 hover:bg-orange-400"
                >
                  Open Dashboard
                </Link>
              </Show>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/8 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(255,173,92,0.2),transparent_45%),radial-gradient(circle_at_90%_100%,rgba(255,255,255,0.14),transparent_40%)]" />
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-300">
                Games I played
              </h2>

              {/* share icon */}
              <Share2 className="h-4 w-4 text-zinc-400" />
            </div>

            <div className="relative space-y-2">
              {heroRows.map((row) => (
                <div
                  key={row.tier}
                  className="grid grid-cols-[52px_1fr] overflow-hidden rounded-xl border border-zinc-700/80 bg-zinc-950/70"
                >
                  <div className="flex items-center justify-center bg-orange-500/20 text-base font-extrabold text-orange-300">
                    {row.tier}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-medium text-zinc-200">
                      {row.label}
                    </span>
                    <div className="flex gap-1.5">
                      {row.images.length > 0 ? (
                        row.images.map((imageSrc) => (
                          <div
                            key={imageSrc}
                            className="relative h-7 w-7 overflow-hidden rounded-sm border border-zinc-700"
                          >
                            <Image
                              src={imageSrc}
                              alt="Game cover"
                              fill
                              className="object-cover"
                              sizes="28px"
                            />
                          </div>
                        ))
                      ) : (
                        <>
                          <span className="h-7 w-7 rounded-sm bg-zinc-800" />
                          <span className="h-7 w-7 rounded-sm bg-zinc-800" />
                          <span className="h-7 w-7 rounded-sm bg-zinc-800" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-3 sm:grid-cols-3">
          <article className="rounded-lg border border-zinc-700 bg-zinc-900/80 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
              Profile Setup
            </p>
            <p className="mt-2 text-sm font-medium text-zinc-200">
              Create your profile instantly with Google sign-in.
            </p>
          </article>
          <article className="rounded-lg border border-zinc-700 bg-zinc-900/80 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
              Autosave
            </p>
            <p className="mt-2 text-sm font-medium text-zinc-200">
              Autosave keeps every rank move safe
            </p>
          </article>
          <article className="rounded-lg border border-zinc-700 bg-zinc-900/80 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
              Public Link
            </p>
            <p className="mt-2 text-sm font-medium text-zinc-200">
              Share your tier instantly with anyone
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
