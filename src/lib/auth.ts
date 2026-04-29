import { currentUser } from "@clerk/nextjs/server";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function requireDbUser(): Promise<User> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email found on account");
  }

  return prisma.user.upsert({
    where: { clerkId: user.id },
    update: { email },
    create: {
      clerkId: user.id,
      email,
    },
  });
}
