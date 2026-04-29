import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { UserMenu } from "../../components/user-menu";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    "User";
  const email = user?.emailAddresses[0]?.emailAddress ?? "No email";
  const imageUrl = user?.imageUrl;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="relative z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="font-semibold tracking-tight text-zinc-100"
          >
            Tier List
          </Link>
          <UserMenu fullName={fullName} email={email} imageUrl={imageUrl} />
        </div>
      </header>
      {children}
    </div>
  );
}
