-- Create Rider table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS "Rider" (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  phone TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active',
  rating DOUBLE PRECISION NOT NULL DEFAULT 5,
  "totalDeliveries" INTEGER NOT NULL DEFAULT 0,
  earnings DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add delivery tracking fields to Order table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Order' AND column_name = 'delivery_status'
  ) THEN
    ALTER TABLE "Order" ADD COLUMN "delivery_status" TEXT NOT NULL DEFAULT 'pending';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Order' AND column_name = 'riderId'
  ) THEN
    ALTER TABLE "Order" ADD COLUMN "riderId" TEXT;
  END IF;
END $$;

-- Add foreign key constraint for riderId if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'Order_riderId_fkey'
  ) THEN
    ALTER TABLE "Order" ADD CONSTRAINT "Order_riderId_fkey" FOREIGN KEY ("riderId") REFERENCES "Rider"(id) ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
