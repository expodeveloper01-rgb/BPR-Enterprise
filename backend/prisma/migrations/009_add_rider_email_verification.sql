-- Add email verification fields to Rider table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Rider' AND column_name = 'verifyCode'
  ) THEN
    ALTER TABLE "Rider" ADD COLUMN "verifyCode" TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Rider' AND column_name = 'verifyCodeExpires'
  ) THEN
    ALTER TABLE "Rider" ADD COLUMN "verifyCodeExpires" TIMESTAMP(3);
  END IF;
END $$;
