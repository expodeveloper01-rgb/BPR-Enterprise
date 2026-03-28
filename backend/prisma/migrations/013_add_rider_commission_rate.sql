-- Add riderCommissionRate to Kitchen table
ALTER TABLE "Kitchen" 
ADD COLUMN "riderCommissionRate" FLOAT NOT NULL DEFAULT 15;

-- Set rates for existing kitchens
-- Uncle Brew: 15%
-- Diomedes: 15% (same default)
-- Local: 15% (same default)
-- Western: 15% (same default)

COMMENT ON COLUMN "Kitchen"."riderCommissionRate" IS 'Rider commission percentage (0-100)';
