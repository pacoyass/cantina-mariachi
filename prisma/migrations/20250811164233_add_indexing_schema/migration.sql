/*
  Warnings:

  - A unique constraint covering the columns `[driverId,date]` on the table `cash_summary` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."user_preferences" DROP CONSTRAINT "user_preferences_userId_fkey";

-- DropIndex
DROP INDEX "public"."notifications_userId_createdAt_idx";

-- CreateIndex
CREATE INDEX "blacklisted_tokens_expiresAt_idx" ON "public"."blacklisted_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "cash_summary_driverId_date_key" ON "public"."cash_summary"("driverId", "date");

-- CreateIndex
CREATE INDEX "notifications_userId_read_createdAt_idx" ON "public"."notifications"("userId", "read", "createdAt");

-- CreateIndex
CREATE INDEX "orders_customerEmail_idx" ON "public"."orders"("customerEmail");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "public"."refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "public"."refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_expiresAt_idx" ON "public"."refresh_tokens"("userId", "expiresAt");

-- AddForeignKey
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
