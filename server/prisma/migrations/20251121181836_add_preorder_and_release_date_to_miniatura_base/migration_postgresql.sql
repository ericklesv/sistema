-- AlterTable for PostgreSQL: Add isPreOrder and releaseDate to miniatura_base

-- Add the new columns
ALTER TABLE "miniatura_base" ADD COLUMN IF NOT EXISTS "isPreOrder" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "miniatura_base" ADD COLUMN IF NOT EXISTS "releaseDate" TIMESTAMP(3);
