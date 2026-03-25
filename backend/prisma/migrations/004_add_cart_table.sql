-- Create Cart table to store user's cart items
CREATE TABLE IF NOT EXISTS "Cart" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("userId", "productId")
);

-- Add quantity field to OrderItem table
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;
