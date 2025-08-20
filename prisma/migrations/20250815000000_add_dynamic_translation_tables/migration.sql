-- CreateTable
CREATE TABLE "public"."content_schemas" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "fields" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_schemas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."languages" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rtl" BOOLEAN NOT NULL DEFAULT false,
    "fallback" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."namespaces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "namespaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fallback_rules" (
    "id" TEXT NOT NULL,
    "sourceLocale" TEXT NOT NULL,
    "targetLocale" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fallback_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_schemas_slug_locale_key" ON "public"."content_schemas"("slug", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "public"."languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "namespaces_name_locale_key" ON "public"."namespaces"("name", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "fallback_rules_sourceLocale_targetLocale_key" ON "public"."fallback_rules"("sourceLocale", "targetLocale");

-- CreateIndex
CREATE INDEX "languages_priority_idx" ON "public"."languages"("priority");

-- CreateIndex
CREATE INDEX "languages_isActive_idx" ON "public"."languages"("isActive");

-- CreateIndex
CREATE INDEX "namespaces_locale_idx" ON "public"."namespaces"("locale");

-- CreateIndex
CREATE INDEX "namespaces_isActive_idx" ON "public"."namespaces"("isActive");

-- CreateIndex
CREATE INDEX "fallback_rules_sourceLocale_idx" ON "public"."fallback_rules"("sourceLocale");

-- CreateIndex
CREATE INDEX "fallback_rules_priority_idx" ON "public"."fallback_rules"("priority");

-- CreateIndex
CREATE INDEX "fallback_rules_isActive_idx" ON "public"."fallback_rules"("isActive");