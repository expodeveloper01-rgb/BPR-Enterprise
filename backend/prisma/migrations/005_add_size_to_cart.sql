-- Add sizeId to Cart table for size variant selection
ALTER TABLE "Cart" ADD COLUMN IF NOT EXISTS "sizeId" TEXT REFERENCES "Size"(id) ON DELETE SET NULL;

-- Add sizeId to OrderItem table to preserve size in orders
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "sizeId" TEXT REFERENCES "Size"(id) ON DELETE SET NULL;

-- Drop old unique constraint and create new one with sizeId
ALTER TABLE "Cart" DROP CONSTRAINT IF EXISTS "Cart_userId_productId_key";
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_productId_sizeId_key" UNIQUE ("userId", "productId", "sizeId");
