-- Migration: Add minOrderAmount to Kitchen table
-- Adds a minimum order amount field to track the lowest order value for profitability

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Kitchen' AND column_name = 'minOrderAmount'
  ) THEN
    ALTER TABLE "Kitchen" ADD COLUMN "minOrderAmount" FLOAT NOT NULL DEFAULT 100;
  END IF;
END $$;

-- Set specific minimum amounts for existing kitchens
UPDATE "Kitchen" SET "minOrderAmount" = 150 WHERE name = 'Uncle Brew';
UPDATE "Kitchen" SET "minOrderAmount" = 200 WHERE name = 'Diomedes';
