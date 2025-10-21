-- CreateTable: Translation strings (database-driven translations)
CREATE TABLE "public"."translations" (
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

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Translation history for audit trail
CREATE TABLE "public"."translation_history" (
    "id" TEXT NOT NULL,
    "translationId" TEXT NOT NULL,
    "oldValue" TEXT NOT NULL,
    "newValue" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "translation_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Unique constraint on key, namespace, locale combination
CREATE UNIQUE INDEX "translations_key_namespace_locale_key" ON "public"."translations"("key", "namespace", "locale");

-- CreateIndex: Fast lookups by namespace and locale
CREATE INDEX "translations_namespace_locale_idx" ON "public"."translations"("namespace", "locale");

-- CreateIndex: Fast lookups by locale
CREATE INDEX "translations_locale_idx" ON "public"."translations"("locale");

-- CreateIndex: Fast lookups by key
CREATE INDEX "translations_key_idx" ON "public"."translations"("key");

-- CreateIndex: Fast lookups for active translations
CREATE INDEX "translations_isActive_idx" ON "public"."translations"("isActive");

-- CreateIndex: Fast lookups by translation ID
CREATE INDEX "translation_history_translationId_idx" ON "public"."translation_history"("translationId");

-- CreateIndex: Fast lookups by change date
CREATE INDEX "translation_history_changedAt_idx" ON "public"."translation_history"("changedAt");

-- CreateIndex: Fast lookups by user who made changes
CREATE INDEX "translation_history_changedBy_idx" ON "public"."translation_history"("changedBy");

-- AddForeignKey: Link translation history to translation
ALTER TABLE "public"."translation_history" ADD CONSTRAINT "translation_history_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "public"."translations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
