-- Add statusMessage column to Order table (if not exists)
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "statusMessage" VARCHAR(255) DEFAULT '';

-- Add statusHistory JSON column to Order table (if not exists)
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "statusHistory" JSONB DEFAULT '[]'::jsonb;
