import { LoggerService } from '../utils/logger.js';
import { TranslationService } from '../utils/translation.js';

/**
 * Translation Management System (TMS) Service
 * Handles integration with external TMS systems like Phrase, Lokalise, Transifex
 */
export class TmsService {
  
  constructor() {
    this.deepLApiKey = process.env.DEEPL_API_KEY;
    this.deepLApiUrl = process.env.DEEPL_API_URL || 'https://api-free.deepl.com/v2';
    this.tmsWebhookUrl = process.env.TMS_WEBHOOK_URL;
    this.tmsApiKey = process.env.TMS_API_KEY;

    // LibreTranslate config (free/self-hostable)
    this.libreTranslateUrl = process.env.LIBRETRANSLATE_URL; // e.g., http://localhost:5000
    this.mtProvider = (process.env.TMS_MT_PROVIDER || '').toLowerCase(); // 'libretranslate' | 'deepl'
  }

  /**
   * Pre-fill translations using configured MT provider (LibreTranslate preferred when set)
   */
  async prefill(sourceText, sourceLocale, targetLocale, options = {}) {
    const provider = this.resolveMtProvider();
    if (provider === 'libretranslate') {
      return this.prefillWithLibreTranslate(sourceText, sourceLocale, targetLocale, options);
    }
    return this.prefillWithDeepL(sourceText, sourceLocale, targetLocale, options);
  }

  resolveMtProvider() {
    if (this.mtProvider === 'libretranslate') return 'libretranslate';
    if (this.mtProvider === 'deepl') return 'deepl';
    // Auto-detect: prefer LibreTranslate if URL is configured, otherwise DeepL
    if (this.libreTranslateUrl) return 'libretranslate';
    return 'deepl';
  }

  /**
   * Pre-fill translations using LibreTranslate API (free/self-hostable)
   * @see https://github.com/LibreTranslate/LibreTranslate
   */
  async prefillWithLibreTranslate(sourceText, sourceLocale, targetLocale, options = {}) {
    if (!this.libreTranslateUrl) {
      throw new Error('LibreTranslate URL not configured (set LIBRETRANSLATE_URL)');
    }

    const sourceLang = this.mapLocaleToLibre(sourceLocale);
    const targetLang = this.mapLocaleToLibre(targetLocale);

    if (!sourceLang || !targetLang) {
      throw new Error(`Unsupported locale pair for LibreTranslate: ${sourceLocale} → ${targetLocale}`);
    }

    try {
      const response = await fetch(`${this.libreTranslateUrl.replace(/\/$/, '')}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: sourceText,
          source: sourceLang,
          target: targetLang,
          format: options.format || 'html',
          api_key: options.apiKey || process.env.LIBRETRANSLATE_API_KEY || undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LibreTranslate error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const translatedText = data?.translatedText;
      if (!translatedText) {
        throw new Error('No translation returned from LibreTranslate');
      }

      await LoggerService.logAudit(null, 'LIBRE_TRANSLATE_SUCCESS', null, {
        sourceLocale,
        targetLocale,
        sourcePreview: sourceText.slice(0, 100),
        targetPreview: translatedText.slice(0, 100),
      });

      return translatedText;
    } catch (error) {
      await LoggerService.logError('LibreTranslate translation failed', error.stack, {
        sourceLocale,
        targetLocale,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Pre-fill translations using DeepL API
   * @param {string} sourceText - Text to translate
   * @param {string} sourceLocale - Source language (e.g., 'en')
   * @param {string} targetLocale - Target language (e.g., 'de')
   * @param {Object} options - Translation options
   * @returns {Promise<string>} Translated text
   */
  async prefillWithDeepL(sourceText, sourceLocale, targetLocale, options = {}) {
    if (!this.deepLApiKey) {
      throw new Error('DeepL API key not configured');
    }

    try {
      // Map locales to DeepL format
      const sourceLang = this.mapLocaleToDeepL(sourceLocale);
      const targetLang = this.mapLocaleToDeepL(targetLocale);

      if (!sourceLang || !targetLang) {
        throw new Error(`Unsupported locale pair: ${sourceLocale} → ${targetLocale}`);
      }

      const response = await fetch(`${this.deepLApiUrl}/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.deepLApiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text: sourceText,
          source_lang: sourceLang,
          target_lang: targetLang,
          formality: options.formality || 'default',
          tag_handling: 'html', // Handle HTML tags in content
          ...options
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const translatedText = data.translations?.[0]?.text;

      if (!translatedText) {
        throw new Error('No translation returned from DeepL');
      }

      // Log successful translation
      await LoggerService.logAudit(null, 'DEEPL_TRANSLATION_SUCCESS', null, {
        sourceLocale,
        targetLocale,
        sourceText: sourceText.substring(0, 100) + (sourceText.length > 100 ? '...' : ''),
        translatedText: translatedText.substring(0, 100) + (translatedText.length > 100 ? '...' : ''),
        options
      });

      return translatedText;

    } catch (error) {
      await LoggerService.logError('DeepL translation failed', error.stack, {
        sourceText: sourceText.substring(0, 100),
        sourceLocale,
        targetLocale,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Push content to TMS for translation
   * @param {string} projectId - TMS project identifier
   * @param {string} sourceLocale - Source language
   * @param {Object} content - Content to translate
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} TMS response
   */
  async pushToTms(projectId, sourceLocale, content, metadata = {}) {
    if (!this.tmsWebhookUrl || !this.tmsApiKey) {
      throw new Error('TMS integration not configured');
    }

    try {
      const payload = {
        type: 'CONTENT_PUSH',
        projectId,
        sourceLocale,
        content,
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'CMS',
          ...metadata
        }
      };

      const response = await fetch(this.tmsWebhookUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.tmsApiKey}`,
          'Content-Type': 'application/json',
          'X-TMS-Project': projectId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TMS push failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // Log successful push
      await LoggerService.logAudit(null, 'TMS_CONTENT_PUSH_SUCCESS', null, {
        projectId,
        sourceLocale,
        contentKeys: Object.keys(content),
        metadata
      });

      return result;

    } catch (error) {
      await LoggerService.logError('TMS content push failed', error.stack, {
        projectId,
        sourceLocale,
        contentKeys: Object.keys(content),
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Pull translations from TMS
   * @param {string} projectId - TMS project identifier
   * @param {string} targetLocale - Target language
   * @param {Object} options - Pull options
   * @returns {Promise<Object>} Translations
   */
  async pullFromTms(projectId, targetLocale, options = {}) {
    if (!this.tmsWebhookUrl || !this.tmsApiKey) {
      throw new Error('TMS integration not configured');
    }

    try {
      const payload = {
        type: 'TRANSLATIONS_PULL',
        projectId,
        targetLocale,
        options: {
          includeDrafts: options.includeDrafts || false,
          includeReviewed: options.includeReviewed || true,
          includeApproved: options.includeApproved || true,
          ...options
        }
      };

      const response = await fetch(this.tmsWebhookUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.tmsApiKey}`,
          'Content-Type': 'application/json',
          'X-TMS-Project': projectId
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`TMS pull failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      // Log successful pull
      await LoggerService.logAudit(null, 'TMS_TRANSLATIONS_PULL_SUCCESS', null, {
        projectId,
        targetLocale,
        translationCount: Object.keys(result.translations || {}).length,
        options
      });

      return result;

    } catch (error) {
      await LoggerService.logError('TMS translations pull failed', error.stack, {
        projectId,
        targetLocale,
        options,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Update translation memory with new content
   */
  async updateTranslationMemory(sourceLocale, targetLocale, sourceText, targetText, metadata = {}) {
    try {
      // TODO: Implement translation memory storage
      await LoggerService.logAudit(null, 'TRANSLATION_MEMORY_UPDATED', null, {
        sourceLocale,
        targetLocale,
        sourceText: sourceText.substring(0, 100) + (sourceText.length > 100 ? '...' : ''),
        targetText: targetText.substring(0, 100) + (targetText.length > 100 ? '...' : ''),
        metadata
      });

    } catch (error) {
      await LoggerService.logError('Translation memory update failed', error.stack, {
        sourceLocale,
        targetLocale,
        error: error.message
      });
    }
  }

  /**
   * Get translation statistics for a project
   */
  async getTranslationStats(projectId) {
    try {
      // TODO: Implement translation statistics
      return {
        projectId,
        totalStrings: 0,
        translatedStrings: 0,
        reviewedStrings: 0,
        approvedStrings: 0,
        coverage: 0,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      await LoggerService.logError('Translation stats retrieval failed', error.stack, {
        projectId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Map application locales to DeepL language codes
   */
  mapLocaleToDeepL(locale) {
    const localeMap = {
      'en': 'EN',
      'de': 'DE',
      'fr': 'FR',
      'es': 'ES',
      'it': 'IT',
      'pt': 'PT',
      'ar': 'AR', // Note: DeepL may not support Arabic
      'de-CH': 'DE',
      'fr-CH': 'FR',
      'it-CH': 'IT'
    };

    return localeMap[locale] || null;
  }

  /**
   * Map application locales to LibreTranslate language codes
   */
  mapLocaleToLibre(locale) {
    const normalized = (locale || '').toLowerCase();
    const base = normalized.split('-')[0];
    const supported = ['en','de','fr','es','it','pt','ar'];
    return supported.includes(base) ? base : null;
  }

  /**
   * Validate TMS configuration
   */
  isConfigured() {
    const provider = this.resolveMtProvider();
    if (provider === 'libretranslate') {
      return !!this.libreTranslateUrl;
    }
    return !!this.deepLApiKey;
  }

  /**
   * Get TMS configuration status
   */
  getConfigStatus() {
    const provider = this.resolveMtProvider();
    return {
      provider,
      deepL: !!this.deepLApiKey,
      libreTranslate: !!this.libreTranslateUrl,
      tmsWebhook: !!this.tmsWebhookUrl,
      tmsApiKey: !!this.tmsApiKey,
      fullyConfigured: this.isConfigured()
    };
  }
}

export default new TmsService();