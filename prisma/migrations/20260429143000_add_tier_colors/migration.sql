-- Add persisted tier colors
ALTER TABLE "Tier"
ADD COLUMN "bgColor" TEXT NOT NULL DEFAULT '#3f3f46',
ADD COLUMN "textColor" TEXT NOT NULL DEFAULT '#f4f4f5';

-- Backfill default S-D palette for existing rows
UPDATE "Tier" SET "bgColor" = '#ea7a79', "textColor" = '#2f3440' WHERE "name" = 'S';
UPDATE "Tier" SET "bgColor" = '#ebb777', "textColor" = '#2f3440' WHERE "name" = 'A';
UPDATE "Tier" SET "bgColor" = '#e2e86d', "textColor" = '#2f3440' WHERE "name" = 'B';
UPDATE "Tier" SET "bgColor" = '#7ee375', "textColor" = '#2f3440' WHERE "name" = 'C';
UPDATE "Tier" SET "bgColor" = '#77a9dc', "textColor" = '#2f3440' WHERE "name" = 'D';
