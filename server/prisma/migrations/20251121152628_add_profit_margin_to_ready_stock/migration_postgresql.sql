-- AlterTable for PostgreSQL: Rename price column to cost and add profitMargin
-- This script should be run on production PostgreSQL database

-- Step 1: Add the new profitMargin column
ALTER TABLE "ready_stock" ADD COLUMN "profitMargin" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Step 2: Rename price column to cost
ALTER TABLE "ready_stock" RENAME COLUMN "price" TO "cost";
