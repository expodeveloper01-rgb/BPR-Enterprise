-- Migration: Add seller confirmation fields to Order table
-- Orders now require seller confirmation before being available to riders

DO $$
BEGIN
  -- Add sellerConfirmedAt column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Order' AND column_name = 'sellerConfirmedAt'
  ) THEN
    ALTER TABLE "Order" ADD COLUMN "sellerConfirmedAt" TIMESTAMP(3);
  END IF;

  -- Add sellerConfirmationNote column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Order' AND column_name = 'sellerConfirmationNote'
  ) THEN
    ALTER TABLE "Order" ADD COLUMN "sellerConfirmationNote" TEXT NOT NULL DEFAULT '';
  END IF;
END $$;

-- Update existing orders to have confirmed status and confirmed timestamps
UPDATE "Order" SET 
  "order_status" = 'confirmed',
  "sellerConfirmedAt" = "createdAt"
WHERE "order_status" = 'Processing';
