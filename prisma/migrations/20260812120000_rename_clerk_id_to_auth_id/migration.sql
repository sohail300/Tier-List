-- RenameColumn
ALTER TABLE "User" RENAME COLUMN "clerkId" TO "authId";

-- RenameIndex
ALTER INDEX "User_clerkId_key" RENAME TO "User_authId_key";
