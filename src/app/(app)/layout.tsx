import Link from "next/link";
import { auth } from "@/auth";
import { UserMenu } from "../../components/user-menu";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const fullName = session?.user?.name || "User";
  const email = session?.user?.email ?? "No email";
  const imageUrl = session?.user?.image ?? undefined;

  return (
    <div className="min-h-screen bg-ink-950 text-foreground">
      <header className="relative z-50 border-b border-ink-700 bg-ink-950">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="font-display flex items-center gap-2 text-xl text-foreground"
          >
            <span className="bg-accent px-1.5 py-0.5 text-accent-ink">TL</span>
            Tier List
          </Link>
          <UserMenu fullName={fullName} email={email} imageUrl={imageUrl} />
        </div>
      </header>
      {children}
    </div>
  );
}
