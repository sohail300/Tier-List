import type { User } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireDbUser(): Promise<User> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const email = session.user.email;
  if (!email) {
    throw new Error("No email found on account");
  }

  return prisma.user.upsert({
    where: { authId: session.user.id },
    update: { email },
    create: {
      authId: session.user.id,
      email,
    },
  });
}
