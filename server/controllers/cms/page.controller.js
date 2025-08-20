import prisma from '../../config/database.js';
import { createError, createResponse } from '../../utils/response.js';
import { acquireLock, releaseLock } from '../../utils/lock.js';
import { LoggerService } from '../../utils/logger.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import crypto from 'node:crypto';
import DynamicTranslationService from '../../services/dynamicTranslation.service.js';

/**
 * Get page content with dynamic field-level fallback chain
 * Implements proper locale fallback: de-CH → de → en
 */
export const getPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = 'en', status } = req.query;
    
    // Build dynamic fallback chain: de-CH → de → en
    const fallbackChain = await DynamicTranslationService.buildDynamicFallbackChain(locale);
    
    // Fetch available locales for this slug in one query
    const candidates = await prisma.pageContent.findMany({
      where: { 
        slug, 
        locale: { in: fallbackChain },
        ...(status !== 'ANY' && { status: 'PUBLISHED' })
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Pick first locale in fallback order that has content
    let page = null;
    let resolvedLocale = null;
    
    for (const lng of fallbackChain) {
      const candidate = candidates.find(c => c.locale === lng);
      if (candidate) { 
        page = candidate; 
        resolvedLocale = lng;
        break; 
      }
    }

    if (!page) {
      return createError(res, 404, 'notFound', 'PAGE_NOT_FOUND', {}, req);
    }

    // Apply dynamic field-level fallbacks for missing content
    const resolvedContent = await applyDynamicFieldLevelFallbacks(page.data, candidates, fallbackChain, slug);

    // Set proper headers for SEO and caching
    res.set({
      'Content-Language': resolvedLocale,
      'Vary': 'Accept-Language',
      'Cache-Control': 'public, max-age=300, s-maxage=3600' // 5min client, 1h CDN
    });

    return createResponse(res, 200, 'dataRetrieved', { 
      page: { ...page, data: resolvedContent }, 
      localeResolved: resolvedLocale,
      fallbackChain 
    }, req, {}, 'api');
  } catch (e) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Apply dynamic field-level fallbacks for missing content
 * If a field is missing in current locale, fall back to source locale
 */
async function applyDynamicFieldLevelFallbacks(content, candidates, fallbackChain, slug) {
  if (!content || typeof content !== 'object') {
    return content;
  }

  const resolved = { ...content };
  
  // Get dynamic schema for this page
  const schema = await DynamicTranslationService.getDynamicSchema(slug, fallbackChain[0]);
  
  // For each field defined in schema, check if it's missing and apply fallback
  for (const [section, fields] of Object.entries(schema)) {
    if (Array.isArray(fields)) {
      // Handle array-based field definitions
      for (const field of fields) {
        if (content[section]?.[field] === null || content[section]?.[field] === undefined || content[section]?.[field] === '') {
          // Find this field in fallback locales
          for (const lng of fallbackChain) {
            const candidate = candidates.find(c => c.locale === lng);
            if (candidate?.data?.[section]?.[field]) {
              if (!resolved[section]) resolved[section] = {};
              resolved[section][field] = candidate.data[section][field];
              break;
            }
          }
        }
      }
    } else if (typeof fields === 'object') {
      // Handle nested object field definitions
      for (const [subsection, subfields] of Object.entries(fields)) {
        if (Array.isArray(subfields)) {
          for (const field of subfields) {
            if (content[section]?.[subsection]?.[field] === null || content[section]?.[subsection]?.[field] === undefined || content[section]?.[subsection]?.[field] === '') {
              // Find this field in fallback locales
              for (const lng of fallbackChain) {
                const candidate = candidates.find(c => c.locale === lng);
                if (candidate?.data?.[section]?.[subsection]?.[field]) {
                  if (!resolved[section]) resolved[section] = {};
                  if (!resolved[section][subsection]) resolved[section][subsection] = {};
                  resolved[section][subsection][field] = candidate.data[section][subsection][field];
                  break;
                }
              }
            }
          }
        }
      }
    }
  }
  
  return resolved;
}

/**
 * Upsert page content with locale validation
 */
export const upsertPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = 'en', data = {}, status = 'PUBLISHED' } = req.body || {};
    
    // Validate locale format
    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(locale)) {
      return createError(res, 400, 'badRequest', 'INVALID_LOCALE', { 
        message: 'Invalid locale format. Use format: en, de-CH, etc.' 
      }, req);
    }

    // Validate that data is not empty
    if (!data || Object.keys(data).length === 0) {
      return createError(res, 400, 'badRequest', 'EMPTY_CONTENT', { 
        message: 'Page content cannot be empty' 
      }, req);
    }

    const result = await prisma.pageContent.upsert({
      where: { slug_locale: { slug, locale } },
      update: { data, status, updatedAt: new Date() },
      create: { slug, locale, data, status },
    });

    // Trigger webhook for cache invalidation
    try {
      await triggerCacheInvalidation(slug, locale);
    } catch (webhookError) {
      console.warn('Cache invalidation webhook failed:', webhookError.message);
    }

    return createResponse(res, 200, 'operationSuccess', { page: result }, req, {}, 'api');
  } catch (e) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

/**
 * Trigger cache invalidation webhook
 */
async function triggerCacheInvalidation(slug, locale) {
  const webhookUrl = process.env.CACHE_INVALIDATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'CMS_UPDATE',
        slug,
        locale,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.warn('Cache invalidation webhook failed:', error.message);
  }
}

export const cleanupCmsDrafts = async (retentionDays = Number(process.env.CMS_DRAFT_RETENTION_DAYS || '30')) => {
  const taskName = 'cms_draft_cleanup';
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();
  try {
    await prisma.$transaction(async (tx) => {
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logCronRun(taskName, 'SKIPPED', { reason: 'Lock held', timestamp });
        return;
      }
      try {
        const cutoff = subDays(new Date(), retentionDays);
        const deleted = await tx.pageContent.deleteMany({ where: { status: { not: 'PUBLISHED' }, updatedAt: { lt: cutoff } } });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { retentionDays, deleted: deleted.count, cutoff: cutoff.toISOString(), timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'CMS_DRAFT_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('CMS draft cleanup failed', error.stack, { taskName, error: error.message, retentionDays, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, retentionDays, timestamp });
    throw error;
  }
};

export default { getPage, upsertPage, cleanupCmsDrafts };