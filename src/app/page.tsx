import { Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { auth, signIn } from "@/auth";

export default async function Home() {
  const session = await auth();
  const heroRows = [
    {
      tier: "S",
      color: "var(--tier-s)",
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
      color: "var(--tier-a)",
      label: "Certified",
      images: ["/hero/a-1.jpg", "/hero/a-2.jpg"],
    },
    {
      tier: "B",
      color: "var(--tier-b)",
      label: "Solid",
      images: ["/hero/b-1.jpg"],
    },
    {
      tier: "C",
      color: "var(--tier-c)",
      label: "Mid",
      images: ["/hero/c-1.jpg", "/hero/c-2.jpg"],
    },
    {
      tier: "D",
      color: "var(--tier-d)",
      label: "Uninstall",
      images: ["/hero/d-1.jpg", "/hero/d-2.jpg"],
    },
  ] as const;

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-10">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <p
              className="inline-flex items-center gap-2 bg-accent px-4 py-1.5 text-sm font-bold uppercase tracking-[0.2em] text-accent-ink"
              style={{ clipPath: "polygon(0 0, 100% 0, 96% 100%, 0% 100%)" }}
            >
              Drag. Rank. Share.
            </p>

            <h1 className="font-display max-w-3xl text-6xl leading-[0.88] text-foreground sm:text-7xl lg:text-8xl">
              Tier List
              <br />
            </h1>

            <p className="max-w-md text-base font-medium text-muted">
              Drag it. Rank it. Slap a label on it.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {session?.user ? (
                <Link
                  href="/dashboard"
                  className="cursor-pointer bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-accent-ink transition hover:-translate-y-0.5 hover:bg-accent-strong"
                  style={{
                    clipPath:
                      "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)",
                  }}
                >
                  Open Dashboard
                </Link>
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/dashboard" });
                  }}
                >
                  <button
                    type="submit"
                    className="cursor-pointer bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-accent-ink transition hover:-translate-y-0.5 hover:bg-accent-strong"
                    style={{
                      clipPath:
                        "polygon(0 0, 100% 0, 100% 70%, 92% 100%, 0 100%)",
                    }}
                  >
                    Sign In with Google
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="relative border border-ink-600 bg-ink-900 p-5">
            <div className="mb-4 flex items-center justify-between border-b border-ink-700 pb-3">
              <h2 className="font-display text-sm text-muted">
                Games I played
              </h2>
              <Share2 className="h-4 w-4 text-subtle" />
            </div>

            <div className="space-y-2">
              {heroRows.map((row) => (
                <div
                  key={row.tier}
                  className="grid grid-cols-[52px_1fr] overflow-hidden border border-ink-700 bg-ink-950"
                >
                  <div
                    className="font-display flex items-center justify-center text-lg"
                    style={{
                      backgroundColor: row.color,
                      color: "var(--tier-ink)",
                    }}
                  >
                    {row.tier}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-semibold text-foreground">
                      {row.label}
                    </span>
                    <div className="flex gap-1.5">
                      {row.images.length > 0 ? (
                        row.images.map((imageSrc) => (
                          <div
                            key={imageSrc}
                            className="relative h-7 w-7 overflow-hidden border border-ink-600"
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
                          <span className="h-7 w-7 bg-ink-700" />
                          <span className="h-7 w-7 bg-ink-700" />
                          <span className="h-7 w-7 bg-ink-700" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-px overflow-hidden border border-ink-700 bg-ink-700 sm:grid-cols-3">
          <article className="bg-ink-900 p-5">
            <p className="font-display text-3xl text-accent">01</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Profile Setup
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Create your profile instantly with Google sign-in.
            </p>
          </article>
          <article className="bg-ink-900 p-5">
            <p className="font-display text-3xl text-accent">02</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Autosave
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Autosave keeps every rank move safe.
            </p>
          </article>
          <article className="bg-ink-900 p-5">
            <p className="font-display text-3xl text-accent">03</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Public Link
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Share your tier instantly with anyone.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
