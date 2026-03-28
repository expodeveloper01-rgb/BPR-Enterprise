-- Fix order timestamps that were stored with incorrect timezone conversion
-- The old timezone utility was using unreliable string parsing for locale conversion
-- This caused timestamps to be stored 8 hours behind Manila time
-- This migration identifies and fixes these timestamps

-- Step 1: Add a temporary column to mark which orders have been fixed
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "timestampCorrected" BOOLEAN DEFAULT false;

-- Step 2: Fix orders where createdAt time appears to be offset incorrectly
-- We identify these by checking if the hour portion suggests UTC storage (low hours when it should be afternoon)
-- and the order is old enough that we're confident it used the old buggy function
UPDATE "Order"
SET "createdAt" = "createdAt" + INTERVAL '8 hours',
    "updatedAt" = CASE 
      WHEN ("updatedAt" - "createdAt") < INTERVAL '1 hour' THEN "updatedAt" + INTERVAL '8 hours'
      ELSE "updatedAt"
    END,
    "timestampCorrected" = true
WHERE "timestampCorrected" = false
  AND EXTRACT(HOUR FROM "createdAt"::time) IN (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)
  -- Only fix orders that look like early morning (likely UTC stored as Manila time)
  AND ("createdAt" + INTERVAL '8 hours' < NOW() - INTERVAL '1 minute');
  -- Ensure it's an old order before fixing

-- Step 3: Fix OrderItem timestamps  
UPDATE "OrderItem" oi
SET "createdAt" = oi."createdAt" + INTERVAL '8 hours',
    "updatedAt" = CASE 
      WHEN (oi."updatedAt" - oi."createdAt") < INTERVAL '1 hour' THEN oi."updatedAt" + INTERVAL '8 hours'
      ELSE oi."updatedAt"
    END
FROM "Order" o
WHERE oi."orderId" = o.id
  AND o."timestampCorrected" = true
  AND EXTRACT(HOUR FROM oi."createdAt"::time) IN (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
