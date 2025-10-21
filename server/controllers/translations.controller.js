import prisma from '../config/database.js';
import { createError, createResponse } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all translations with filtering and pagination
 * GET /api/cms/admin/translations
 */
export const getTranslations = async (req, res) => {
  try {
    const {
      locale,
      namespace,
      key,
      search,
      isActive = 'true',
      page = '1',
      limit = '50'
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};
    if (locale) where.locale = locale;
    if (namespace) where.namespace = namespace;
    if (key) where.key = { contains: key };
    if (isActive !== 'all') where.isActive = isActive === 'true';
    if (search) {
      where.OR = [
        { key: { contains: search, mode: 'insensitive' } },
        { value: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get translations with pagination
    const [translations, total] = await Promise.all([
      prisma.translation.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: [
          { namespace: 'asc' },
          { locale: 'asc' },
          { key: 'asc' }
        ]
      }),
      prisma.translation.count({ where })
    ]);

    return createResponse(res, 200, 'dataRetrieved', {
      translations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    }, req, {}, 'api');
  } catch (error) {
    await LoggerService.logError('Get translations failed', error.stack, {
      query: req.query,
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Get a single translation by ID
 * GET /api/cms/admin/translations/:id
 */
export const getTranslation = async (req, res) => {
  try {
    const { id } = req.params;

    const translation = await prisma.translation.findUnique({
      where: { id },
      include: {
        history: {
          orderBy: { changedAt: 'desc' },
          take: 10 // Last 10 changes
        }
      }
    });

    if (!translation) {
      return createError(res, 404, 'notFound', 'TRANSLATION_NOT_FOUND', {}, req);
    }

    return createResponse(res, 200, 'dataRetrieved', { translation }, req, {}, 'api');
  } catch (error) {
    await LoggerService.logError('Get translation failed', error.stack, {
      translationId: req.params.id,
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Create a new translation
 * POST /api/cms/admin/translations
 */
export const createTranslation = async (req, res) => {
  try {
    const { key, namespace, locale, value, description } = req.body;

    // Validate required fields
    if (!key || !namespace || !locale || !value) {
      return createError(res, 400, 'badRequest', 'MISSING_REQUIRED_FIELDS', {
        message: 'key, namespace, locale, and value are required'
      }, req);
    }

    // Validate locale format
    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(locale)) {
      return createError(res, 400, 'badRequest', 'INVALID_LOCALE', {
        message: 'Invalid locale format. Use format: en, es, de-CH, etc.'
      }, req);
    }

    const userId = req.user?.id || 'system';

    const translation = await prisma.translation.create({
      data: {
        key,
        namespace,
        locale,
        value,
        description,
        createdBy: userId,
        updatedBy: userId
      }
    });

    await LoggerService.logAudit(userId, 'TRANSLATION_CREATED', null, {
      translationId: translation.id,
      key,
      namespace,
      locale
    });

    return createResponse(res, 201, 'created', { translation }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2002') {
      return createError(res, 409, 'conflict', 'TRANSLATION_ALREADY_EXISTS', {
        message: 'Translation with this key, namespace, and locale already exists'
      }, req);
    }
    await LoggerService.logError('Create translation failed', error.stack, {
      body: req.body,
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Update an existing translation
 * PUT /api/cms/admin/translations/:id
 */
export const updateTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, description, isActive } = req.body;
    const userId = req.user?.id || 'system';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Get existing translation
    const existing = await prisma.translation.findUnique({ where: { id } });
    if (!existing) {
      return createError(res, 404, 'notFound', 'TRANSLATION_NOT_FOUND', {}, req);
    }

    // Update translation and create history entry in a transaction
    const [translation] = await prisma.$transaction([
      prisma.translation.update({
        where: { id },
        data: {
          ...(value !== undefined && { value }),
          ...(description !== undefined && { description }),
          ...(isActive !== undefined && { isActive }),
          updatedBy: userId,
          updatedAt: new Date()
        }
      }),
      // Create history entry if value changed
      ...(value !== undefined && value !== existing.value ? [
        prisma.translationHistory.create({
          data: {
            translationId: id,
            oldValue: existing.value,
            newValue: value,
            changedBy: userId,
            ipAddress,
            reason: req.body.reason || 'Updated via admin UI'
          }
        })
      ] : [])
    ]);

    await LoggerService.logAudit(userId, 'TRANSLATION_UPDATED', null, {
      translationId: id,
      key: existing.key,
      namespace: existing.namespace,
      locale: existing.locale,
      valueChanged: value !== undefined && value !== existing.value
    });

    return createResponse(res, 200, 'updated', { translation }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'TRANSLATION_NOT_FOUND', {}, req);
    }
    await LoggerService.logError('Update translation failed', error.stack, {
      translationId: req.params.id,
      body: req.body,
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Delete a translation
 * DELETE /api/cms/admin/translations/:id
 */
export const deleteTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'system';

    const existing = await prisma.translation.findUnique({ where: { id } });
    if (!existing) {
      return createError(res, 404, 'notFound', 'TRANSLATION_NOT_FOUND', {}, req);
    }

    await prisma.translation.delete({ where: { id } });

    await LoggerService.logAudit(userId, 'TRANSLATION_DELETED', null, {
      translationId: id,
      key: existing.key,
      namespace: existing.namespace,
      locale: existing.locale
    });

    return createResponse(res, 200, 'deleted', { 
      message: 'Translation deleted successfully' 
    }, req, {}, 'api');
  } catch (error) {
    if (error.code === 'P2025') {
      return createError(res, 404, 'notFound', 'TRANSLATION_NOT_FOUND', {}, req);
    }
    await LoggerService.logError('Delete translation failed', error.stack, {
      translationId: req.params.id,
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Get missing translations
 * GET /api/cms/admin/translations/missing
 */
export const getMissingTranslations = async (req, res) => {
  try {
    const { locale } = req.query;

    // Get all locales if not specified
    const locales = locale 
      ? [locale] 
      : ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar'];

    // Get all unique key+namespace combinations from English (reference language)
    const referenceKeys = await prisma.translation.findMany({
      where: { locale: 'en' },
      select: { key: true, namespace: true }
    });

    const missing = [];

    for (const targetLocale of locales) {
      if (targetLocale === 'en') continue; // Skip reference language

      // Get existing translations for this locale
      const existing = await prisma.translation.findMany({
        where: { locale: targetLocale },
        select: { key: true, namespace: true }
      });

      const existingSet = new Set(
        existing.map(t => `${t.namespace}.${t.key}`)
      );

      // Find missing keys
      const missingForLocale = referenceKeys.filter(ref => 
        !existingSet.has(`${ref.namespace}.${ref.key}`)
      );

      if (missingForLocale.length > 0) {
        missing.push({
          locale: targetLocale,
          count: missingForLocale.length,
          missing: missingForLocale.map(m => ({
            key: m.key,
            namespace: m.namespace
          }))
        });
      }
    }

    return createResponse(res, 200, 'dataRetrieved', { 
      missing,
      totalMissing: missing.reduce((sum, m) => sum + m.count, 0)
    }, req, {}, 'api');
  } catch (error) {
    await LoggerService.logError('Get missing translations failed', error.stack, {
      query: req.query,
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Bulk import translations from JSON
 * POST /api/cms/admin/translations/bulk-import
 */
export const bulkImport = async (req, res) => {
  try {
    const { namespace, locale, translations, overwrite = false } = req.body;
    const userId = req.user?.id || 'system';

    if (!namespace || !locale || !translations) {
      return createError(res, 400, 'badRequest', 'MISSING_REQUIRED_FIELDS', {
        message: 'namespace, locale, and translations are required'
      }, req);
    }

    // Flatten the translations object
    const flattened = flattenObject(translations);
    const keys = Object.keys(flattened);

    let imported = 0;
    let skipped = 0;
    let updated = 0;

    for (const [key, value] of Object.entries(flattened)) {
      try {
        if (overwrite) {
          await prisma.translation.upsert({
            where: {
              key_namespace_locale: { key, namespace, locale }
            },
            update: {
              value: String(value),
              updatedBy: userId,
              updatedAt: new Date()
            },
            create: {
              key,
              namespace,
              locale,
              value: String(value),
              createdBy: userId,
              updatedBy: userId
            }
          });
          updated++;
        } else {
          await prisma.translation.create({
            data: {
              key,
              namespace,
              locale,
              value: String(value),
              createdBy: userId,
              updatedBy: userId
            }
          });
          imported++;
        }
      } catch (error) {
        if (error.code === 'P2002') {
          skipped++;
        } else {
          throw error;
        }
      }
    }

    await LoggerService.logAudit(userId, 'TRANSLATIONS_BULK_IMPORT', null, {
      namespace,
      locale,
      total: keys.length,
      imported,
      updated,
      skipped
    });

    return createResponse(res, 200, 'operationSuccess', {
      message: 'Bulk import completed',
      stats: { total: keys.length, imported, updated, skipped }
    }, req, {}, 'api');
  } catch (error) {
    await LoggerService.logError('Bulk import failed', error.stack, {
      body: req.body,
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Bulk export translations to JSON
 * GET /api/cms/admin/translations/bulk-export
 */
export const bulkExport = async (req, res) => {
  try {
    const { locale, namespace, format = 'nested' } = req.query;

    const where = {};
    if (locale) where.locale = locale;
    if (namespace) where.namespace = namespace;
    where.isActive = true;

    const translations = await prisma.translation.findMany({
      where,
      orderBy: [
        { locale: 'asc' },
        { namespace: 'asc' },
        { key: 'asc' }
      ]
    });

    // Group by locale and namespace
    const grouped = {};
    
    for (const translation of translations) {
      if (!grouped[translation.locale]) {
        grouped[translation.locale] = {};
      }
      if (!grouped[translation.locale][translation.namespace]) {
        grouped[translation.locale][translation.namespace] = {};
      }
      
      if (format === 'flat') {
        // Flat format: { "key": "value" }
        grouped[translation.locale][translation.namespace][translation.key] = translation.value;
      } else {
        // Nested format: { "hero": { "title": "value" } }
        setNestedValue(
          grouped[translation.locale][translation.namespace],
          translation.key,
          translation.value
        );
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="translations-${Date.now()}.json"`);
    
    return res.json({
      success: true,
      data: grouped,
      meta: {
        exportedAt: new Date().toISOString(),
        totalTranslations: translations.length,
        locales: Object.keys(grouped),
        format
      }
    });
  } catch (error) {
    await LoggerService.logError('Bulk export failed', error.stack, {
      query: req.query,
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Get metadata (unique locales and namespaces)
 * GET /api/translations/admin/translations/metadata
 */
export const getMetadata = async (req, res) => {
  try {
    // Get distinct locales and namespaces from database
    const [locales, namespaces] = await Promise.all([
      prisma.translation.findMany({
        select: { locale: true },
        distinct: ['locale'],
        orderBy: { locale: 'asc' }
      }),
      prisma.translation.findMany({
        select: { namespace: true },
        distinct: ['namespace'],
        orderBy: { namespace: 'asc' }
      })
    ]);

    return createResponse(res, 200, 'success', {
      locales: locales.map(l => l.locale),
      namespaces: namespaces.map(n => n.namespace)
    }, req);
  } catch (error) {
    await LoggerService.logError('Get metadata failed', error.stack, {
      error: error.message
    });
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Helper: Flatten nested object into dot-notation
 */
function flattenObject(obj, prefix = '') {
  const flattened = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  return flattened;
}

/**
 * Helper: Set nested value using dot-notation key
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

export default {
  getTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  getMissingTranslations,
  getMetadata,
  bulkImport,
  bulkExport
};
