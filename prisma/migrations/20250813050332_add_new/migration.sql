-- AlterEnum
ALTER TYPE "public"."UserRole" ADD VALUE 'DRIVER';

-- DropIndex
DROP INDEX "public"."cron_runs_taskName_key";

-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "trackingCode" TEXT,
ADD COLUMN     "trackingCodeExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "reservations_date_time_status_idx" ON "public"."reservations"("date", "time", "status");
