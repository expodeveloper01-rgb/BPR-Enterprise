-- Add sizeId to Cart table for size variant selection
ALTER TABLE "Cart" ADD COLUMN IF NOT EXISTS "sizeId" TEXT REFERENCES "Size"(id) ON DELETE SET NULL;

-- Add sizeId to OrderItem table to preserve size in orders
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "sizeId" TEXT REFERENCES "Size"(id) ON DELETE SET NULL;

-- Drop old unique constraint if it exists and create new one with sizeId
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Cart_userId_productId_key') THEN
        ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_productId_key";
    END IF;
END $$;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Cart_userId_productId_sizeId_key') THEN
        -- Constraint already exists, do nothing
        NULL;
    ELSE
        ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_productId_sizeId_key" UNIQUE ("userId", "productId", "sizeId");
    END IF;
END $$;
