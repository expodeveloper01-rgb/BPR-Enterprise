-- Add multi-select support for Product table
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categoryIds" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "sizeIds" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "kitchenIds" JSONB DEFAULT '[]'::jsonb;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "cuisineIds" JSONB DEFAULT '[]'::jsonb;

-- Migrate existing single ID values to arrays if they exist
UPDATE "Product" SET "categoryIds" = CASE WHEN "categoryId" IS NOT NULL THEN jsonb_build_array("categoryId") ELSE '[]'::jsonb END WHERE "categoryIds" = '[]'::jsonb;
UPDATE "Product" SET "sizeIds" = CASE WHEN "sizeId" IS NOT NULL THEN jsonb_build_array("sizeId") ELSE '[]'::jsonb END WHERE "sizeIds" = '[]'::jsonb;
UPDATE "Product" SET "kitchenIds" = CASE WHEN "kitchenId" IS NOT NULL THEN jsonb_build_array("kitchenId") ELSE '[]'::jsonb END WHERE "kitchenIds" = '[]'::jsonb;
UPDATE "Product" SET "cuisineIds" = CASE WHEN "cuisineId" IS NOT NULL THEN jsonb_build_array("cuisineId") ELSE '[]'::jsonb END WHERE "cuisineIds" = '[]'::jsonb;
