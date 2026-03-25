-- Add reset password columns to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetCode" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "resetCodeExpires" TIMESTAMP;
