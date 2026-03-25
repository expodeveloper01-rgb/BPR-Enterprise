-- Add description column to Category, Size, Kitchen, Cuisine tables
-- Make value column optional with default empty string

-- Add description to Category if not exists
ALTER TABLE "Category"
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add description to Size if not exists
ALTER TABLE "Size"
ADD COLUMN IF NOT EXISTS description TEXT;

-- Alter Size value column to have default
ALTER TABLE "Size"
ALTER COLUMN value SET DEFAULT '';

-- Add description to Kitchen if not exists
ALTER TABLE "Kitchen"
ADD COLUMN IF NOT EXISTS description TEXT;

-- Alter Kitchen value column to have default
ALTER TABLE "Kitchen"
ALTER COLUMN value SET DEFAULT '';

-- Add description to Cuisine if not exists
ALTER TABLE "Cuisine"
ADD COLUMN IF NOT EXISTS description TEXT;

-- Alter Cuisine value column to have default
ALTER TABLE "Cuisine"
ALTER COLUMN value SET DEFAULT '';
