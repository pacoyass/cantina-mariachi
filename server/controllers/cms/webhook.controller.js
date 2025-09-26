import { createError, createResponse } from '../../utils/response.js';
import { LoggerService } from '../../utils/logger.js';
import cacheService from '../../services/cacheService.js';

/**
 * Handle cache invalidation webhooks
 * Called when CMS content is updated to clear relevant caches
 */
export const handleCacheInvalidation = async (req, res) => {
  try {
    const { type, slug, locale, timestamp } = req.body;
    
    // Validate webhook payload
    if (!type || !slug || !locale) {
      return createError(res, 400, 'badRequest', 'INVALID_WEBHOOK_PAYLOAD', {
        message: 'Missing required fields: type, slug, locale'
      }, req);
    }

    // Log webhook receipt
    await LoggerService.logAudit(null, 'CACHE_INVALIDATION_WEBHOOK_RECEIVED', null, {
      type,
      slug,
      locale,
      timestamp,
      source: req.ip
    });

    // Invalidate relevant caches
    const cacheKeys = [
      `cms:${slug}:${locale}`,
      `cms:${slug}:*`, // Invalidate all locales for this slug
      'cms:home:*', // Invalidate home page caches
      'cms:menu:*', // Invalidate menu caches if applicable
    ];

    for (const key of cacheKeys) {
      try {
        if (key.includes('*')) {
          // Pattern-based invalidation
          await cacheService.invalidatePattern(key);
        } else {
          // Direct key invalidation
          await cacheService.del(key);
        }
      } catch (cacheError) {
        await LoggerService.logError(`Cache invalidation failed for key ${key}`, cacheError.stack, {
          method: 'handleCacheInvalidation',
          key: key,
          error: cacheError.message
        });
      }
    }

    // Set cache headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return createResponse(res, 200, 'webhookProcessed', {
      message: 'Cache invalidation processed successfully',
      invalidatedKeys: cacheKeys.length,
      timestamp: new Date().toISOString()
    }, req, {}, 'api');

  } catch (error) {
    await LoggerService.logError('Cache invalidation webhook failed', error.stack, {
      error: error.message,
      body: req.body
    });

    return createError(res, 500, 'internalError', 'WEBHOOK_PROCESSING_FAILED', {}, req);
  }
};

/**
 * Handle TMS (Translation Management System) webhooks
 * Processes translation updates from external TMS systems
 */
export const handleTmsWebhook = async (req, res) => {
  try {
    const { 
      type, 
      projectId, 
      locale, 
      translations, 
      status, 
      timestamp,
      sourceLocale = 'en'
    } = req.body;

    // Validate webhook payload
    if (!type || !projectId || !locale || !translations) {
      return createError(res, 400, 'badRequest', 'INVALID_TMS_WEBHOOK_PAYLOAD', {
        message: 'Missing required fields: type, projectId, locale, translations'
      }, req);
    }

    // Log TMS webhook receipt
    await LoggerService.logAudit(null, 'TMS_WEBHOOK_RECEIVED', null, {
      type,
      projectId,
      locale,
      sourceLocale,
      status,
      timestamp,
      translationCount: Object.keys(translations).length,
      source: req.ip
    });

    // Process different TMS webhook types
    let result;
    switch (type) {
      case 'TRANSLATION_COMPLETED':
        result = await processTranslationCompleted(projectId, locale, translations, sourceLocale);
        break;
      
      case 'TRANSLATION_REVIEWED':
        result = await processTranslationReviewed(projectId, locale, translations, status);
        break;
      
      case 'GLOSSARY_UPDATED':
        result = await processGlossaryUpdate(projectId, locale, translations);
        break;
      
      case 'STYLE_GUIDE_UPDATED':
        result = await processStyleGuideUpdate(projectId, locale, translations);
        break;
      
      default:
        return createError(res, 400, 'badRequest', 'UNSUPPORTED_TMS_WEBHOOK_TYPE', {
          message: `Unsupported webhook type: ${type}`
        }, req);
    }

    // Set cache headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    return createResponse(res, 200, 'webhookProcessed', {
      message: 'TMS webhook processed successfully',
      type,
      locale,
      result,
      timestamp: new Date().toISOString()
    }, req, {}, 'api');

  } catch (error) {
    await LoggerService.logError('TMS webhook processing failed', error.stack, {
      error: error.message,
      body: req.body
    });

    return createError(res, 500, 'internalError', 'TMS_WEBHOOK_PROCESSING_FAILED', {}, req);
  }
};

/**
 * Process completed translations from TMS
 */
async function processTranslationCompleted(projectId, locale, translations, sourceLocale) {
  // TODO: Implement translation processing logic
  // This would typically:
  // 1. Update CMS content with new translations
  // 2. Update translation memory
  // 3. Trigger cache invalidation
  // 4. Send notifications to content managers
  
  console.log(`Processing completed translations for ${locale} from ${sourceLocale}`);
  
  return {
    processed: true,
    locale,
    translationCount: Object.keys(translations).length
  };
}

/**
 * Process reviewed translations from TMS
 */
async function processTranslationReviewed(projectId, locale, translations, status) {
  // TODO: Implement review processing logic
  // This would typically:
  // 1. Update translation status in CMS
  // 2. Trigger publishing workflow if approved
  // 3. Send notifications to translators/reviewers
  
  console.log(`Processing reviewed translations for ${locale} with status: ${status}`);
  
  return {
    processed: true,
    locale,
    status,
    translationCount: Object.keys(translations).length
  };
}

/**
 * Process glossary updates from TMS
 */
async function processGlossaryUpdate(projectId, locale, glossary) {
  // TODO: Implement glossary update logic
  // This would typically:
  // 1. Update shared terminology database
  // 2. Notify translators of new terms
  // 3. Update translation memory with new terms
  
  console.log(`Processing glossary update for ${locale}`);
  
  return {
    processed: true,
    locale,
    termCount: Object.keys(glossary).length
  };
}

/**
 * Process style guide updates from TMS
 */
async function processStyleGuideUpdate(projectId, locale, styleGuide) {
  // TODO: Implement style guide update logic
  // This would typically:
  // 1. Update style guide database
  // 2. Notify translators of style changes
  // 3. Update translation validation rules
  
  console.log(`Processing style guide update for ${locale}`);
  
  return {
    processed: true,
    locale,
    rulesCount: Object.keys(styleGuide).length
  };
}