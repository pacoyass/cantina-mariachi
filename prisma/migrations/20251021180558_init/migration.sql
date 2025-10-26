-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('TAKEOUT', 'DELIVERY');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'AWAITING_PAYMENT', 'PAYMENT_DISPUTED');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'OWNER', 'ADMIN', 'CASHIER', 'DRIVER');

-- CreateTable
CREATE TABLE "public.users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "public.users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ip" TEXT,

    CONSTRAINT "public.refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.blacklisted_tokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public.blacklisted_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.drivers" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deliveryZone" TEXT,
    "vehicleDetails" TEXT,
    "currentStatus" TEXT,
    "availabilitySchedule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.activity_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public.activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.login_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public.login_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.error_logs" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "context" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public.error_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.notification_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public.notification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.system_logs" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public.system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.cash_transactions" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "adminVerified" BOOLEAN NOT NULL DEFAULT false,
    "discrepancyAmount" DOUBLE PRECISION,
    "paymentTimestamp" TIMESTAMP(3),
    "customerNotes" TEXT,
    "discrepancyNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.cash_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.cash_summary" (
    "id" TEXT NOT NULL,
    "driverId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "unconfirmedCount" INTEGER NOT NULL,
    "discrepancyTotal" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.cash_summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.app_config" (
    "id" TEXT NOT NULL,
    "restaurantName" TEXT,
    "operatingHours" JSONB,
    "taxRate" DOUBLE PRECISION,
    "deliveryRadius" DOUBLE PRECISION,
    "minOrderAmount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.app_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "public.audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "content" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "pushConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.cron_locks" (
    "id" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.cron_locks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.cron_runs" (
    "id" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "lastRunAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.cron_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.webhooks" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lastSync" TIMESTAMP(3),
    "integrationId" TEXT,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "public.webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.webhook_logs" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "attempts" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public.webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.integrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "public.integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT,
    "shortcuts" JSONB,
    "accessibility" JSONB,
    "defaultAddress" TEXT,
    "preferredContactMethod" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.localizations" (
    "id" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "translations" JSONB NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.localizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.content_schemas" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "fields" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.content_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.languages" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rtl" BOOLEAN NOT NULL DEFAULT false,
    "fallback" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.namespaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.namespaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.fallback_rules" (
    "id" TEXT NOT NULL,
    "sourceLocale" TEXT NOT NULL,
    "targetLocale" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.fallback_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.page_contents" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "data" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.page_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.translations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "namespace" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT,
    "updatedBy" TEXT,

    CONSTRAINT "public.translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.translation_history" (
    "id" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "public.translation_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "public.categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.menu_items" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isVegan" BOOLEAN NOT NULL DEFAULT false,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isSpecial" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "public.menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.orders" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "type" "OrderType" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "deliveryAddress" TEXT,
    "deliveryInstructions" TEXT,
    "deliveryTimeEstimate" TIMESTAMP(3),
    "driverId" TEXT,
    "cashierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "trackingCode" TEXT,
    "trackingCodeExpiresAt" TIMESTAMP(3),

    CONSTRAINT "public.orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,

    CONSTRAINT "public.order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public.reservations" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public.reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public.users_email_key" ON "public.users"("email");

-- CreateIndex
CREATE INDEX "public.users_role_idx" ON "public.users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "public.refresh_tokens_token_key" ON "public.refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "public.refresh_tokens_userId_idx" ON "public.refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "public.refresh_tokens_expiresAt_idx" ON "public.refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "public.refresh_tokens_userId_expiresAt_idx" ON "public.refresh_tokens"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "public.blacklisted_tokens_tokenHash_key" ON "public.blacklisted_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "public.blacklisted_tokens_expiresAt_idx" ON "public.blacklisted_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "public.drivers_userId_key" ON "public.drivers"("userId");

-- CreateIndex
CREATE INDEX "public.drivers_active_deliveryZone_idx" ON "public.drivers"("active", "deliveryZone");

-- CreateIndex
CREATE INDEX "public.drivers_currentStatus_idx" ON "public.drivers"("currentStatus");

-- CreateIndex
CREATE INDEX "public.activity_logs_type_createdAt_idx" ON "public.activity_logs"("type", "createdAt");

-- CreateIndex
CREATE INDEX "public.login_logs_status_createdAt_idx" ON "public.login_logs"("status", "createdAt");

-- CreateIndex
CREATE INDEX "public.error_logs_createdAt_idx" ON "public.error_logs"("createdAt");

-- CreateIndex
CREATE INDEX "public.notification_logs_type_status_createdAt_idx" ON "public.notification_logs"("type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "public.system_logs_source_event_createdAt_idx" ON "public.system_logs"("source", "event", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "public.cash_transactions_orderId_key" ON "public.cash_transactions"("orderId");

-- CreateIndex
CREATE INDEX "public.cash_transactions_driverId_createdAt_idx" ON "public.cash_transactions"("driverId", "createdAt");

-- CreateIndex
CREATE INDEX "public.cash_transactions_orderId_idx" ON "public.cash_transactions"("orderId");

-- CreateIndex
CREATE INDEX "public.cash_summary_driverId_date_idx" ON "public.cash_summary"("driverId", "date");

-- CreateIndex
CREATE INDEX "public.cash_summary_date_idx" ON "public.cash_summary"("date");

-- CreateIndex
CREATE UNIQUE INDEX "public.cash_summary_driverId_date_key" ON "public.cash_summary"("driverId", "date");

-- CreateIndex
CREATE INDEX "public.audit_logs_action_createdAt_idx" ON "public.audit_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "public.notifications_userId_read_createdAt_idx" ON "public.notifications"("userId", "read", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "public.cron_locks_taskName_key" ON "public.cron_locks"("taskName");

-- CreateIndex
CREATE INDEX "public.cron_locks_lockedAt_idx" ON "public.cron_locks"("lockedAt");

-- CreateIndex
CREATE INDEX "public.cron_runs_taskName_lastRunAt_idx" ON "public.cron_runs"("taskName", "lastRunAt");

-- CreateIndex
CREATE INDEX "public.webhook_logs_webhookId_status_createdAt_idx" ON "public.webhook_logs"("webhookId", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "public.user_preferences_userId_key" ON "public.user_preferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "public.content_schemas_slug_locale_key" ON "public.content_schemas"("slug", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "public.languages_code_key" ON "public.languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "public.namespaces_name_locale_key" ON "public.namespaces"("name", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "public.fallback_rules_sourceLocale_targetLocale_key" ON "public.fallback_rules"("sourceLocale", "targetLocale");

-- CreateIndex
CREATE UNIQUE INDEX "public.page_contents_slug_locale_key" ON "public.page_contents"("slug", "locale");

-- CreateIndex
CREATE INDEX "public.translations_namespace_locale_idx" ON "public.translations"("namespace", "locale");

-- CreateIndex
CREATE INDEX "public.translations_locale_idx" ON "public.translations"("locale");

-- CreateIndex
CREATE INDEX "public.translations_key_idx" ON "public.translations"("key");

-- CreateIndex
CREATE INDEX "public.translations_isActive_idx" ON "public.translations"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "public.translations_key_namespace_locale_key" ON "public.translations"("key", "namespace", "locale");

-- CreateIndex
CREATE INDEX "public.translation_history_translationId_idx" ON "public.translation_history"("translationId");

-- CreateIndex
CREATE INDEX "public.translation_history_changedAt_idx" ON "public.translation_history"("changedAt");

-- CreateIndex
CREATE INDEX "public.translation_history_changedBy_idx" ON "public.translation_history"("changedBy");

-- CreateIndex
CREATE UNIQUE INDEX "public.categories_name_key" ON "public.categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "public.orders_orderNumber_key" ON "public.orders"("orderNumber");

-- CreateIndex
CREATE INDEX "public.orders_status_createdAt_idx" ON "public.orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "public.orders_driverId_idx" ON "public.orders"("driverId");

-- CreateIndex
CREATE INDEX "public.orders_customerPhone_idx" ON "public.orders"("customerPhone");

-- CreateIndex
CREATE INDEX "public.orders_userId_idx" ON "public.orders"("userId");

-- CreateIndex
CREATE INDEX "public.orders_createdAt_idx" ON "public.orders"("createdAt");

-- CreateIndex
CREATE INDEX "public.orders_customerEmail_idx" ON "public.orders"("customerEmail");

-- CreateIndex
CREATE INDEX "public.orders_type_status_idx" ON "public.orders"("type", "status");

-- CreateIndex
CREATE INDEX "public.orders_cashierId_status_idx" ON "public.orders"("cashierId", "status");

-- CreateIndex
CREATE INDEX "public.reservations_date_time_status_idx" ON "public.reservations"("date", "time", "status");

-- AddForeignKey
ALTER TABLE "public.refresh_tokens" ADD CONSTRAINT "public.refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.drivers" ADD CONSTRAINT "public.drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.activity_logs" ADD CONSTRAINT "public.activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.login_logs" ADD CONSTRAINT "public.login_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.notification_logs" ADD CONSTRAINT "public.notification_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.cash_transactions" ADD CONSTRAINT "public.cash_transactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public.orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.cash_transactions" ADD CONSTRAINT "public.cash_transactions_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public.drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.cash_summary" ADD CONSTRAINT "public.cash_summary_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public.drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.audit_logs" ADD CONSTRAINT "public.audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.notifications" ADD CONSTRAINT "public.notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.webhooks" ADD CONSTRAINT "public.webhooks_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "public.integrations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.webhook_logs" ADD CONSTRAINT "public.webhook_logs_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "public.webhooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.user_preferences" ADD CONSTRAINT "public.user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.translation_history" ADD CONSTRAINT "public.translation_history_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "public.translations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.menu_items" ADD CONSTRAINT "public.menu_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public.categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.orders" ADD CONSTRAINT "public.orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.orders" ADD CONSTRAINT "public.orders_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "public.drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.order_items" ADD CONSTRAINT "public.order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public.orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.order_items" ADD CONSTRAINT "public.order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "public.menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public.reservations" ADD CONSTRAINT "public.reservations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public.users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
