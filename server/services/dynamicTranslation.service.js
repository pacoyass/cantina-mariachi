import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';

/**
 * Dynamic Translation Management Service
 * Replaces static configuration with database-driven translation management
 */
export class DynamicTranslationService {
  
  /**
   * Get dynamic fallback chain from database
   * @param {string} locale - Source locale
   * @returns {Promise<Array<string>>} Fallback chain
   */
  static async buildDynamicFallbackChain(locale) {
    try {
      // Check if database is available and tables exist
      if (!prisma || !prisma.fallbackRule) {
        console.warn('Database not available, using static fallback');
        return this.buildStaticFallbackChain(locale);
      }

      // Get fallback rules for this locale
      const fallbackRules = await prisma.fallbackRule.findMany({
        where: { 
          sourceLocale: locale,
          isActive: true 
        },
        orderBy: { priority: 'asc' }
      });

      // Build chain: [source, fallback1, fallback2, ..., en]
      const chain = [locale];
      
      // Add configured fallbacks
      fallbackRules.forEach(rule => {
        if (!chain.includes(rule.targetLocale)) {
          chain.push(rule.targetLocale);
        }
      });

      // Always add English as final fallback if not already present
      if (!chain.includes('en')) {
        chain.push('en');
      }

      return chain;
    } catch (error) {
      // Fallback to static logic if database fails
      console.warn('Dynamic fallback failed, using static fallback:', error.message);
      return this.buildStaticFallbackChain(locale);
    }
  }

  /**
   * Static fallback chain as backup
   * @param {string} locale - Source locale
   * @returns {Array<string>} Static fallback chain
   */
  static buildStaticFallbackChain(locale) {
    const chain = [locale];
    
    // Add base language if locale has region (e.g., de-CH → de)
    if (locale.includes('-')) {
      const baseLang = locale.split('-')[0];
      if (baseLang !== locale) {
        chain.push(baseLang);
      }
    }
    
    // Always add English as final fallback
    if (locale !== 'en') {
      chain.push('en');
    }
    
    return chain;
  }

  /**
   * Get dynamic schema for a page
   * @param {string} slug - Page slug
   * @param {string} locale - Locale
   * @returns {Promise<Object>} Schema definition
   */
  static async getDynamicSchema(slug, locale) {
    try {
      // Check if database is available and tables exist
      if (!prisma || !prisma.contentSchema) {
        console.warn('Database not available, using default schema');
        return this.getDefaultSchema(slug);
      }

      const schema = await prisma.contentSchema.findFirst({
        where: { 
          slug, 
          locale,
          isActive: true 
        }
      });

      if (schema) {
        return schema.fields;
      }

      // Fallback to default schema
      return this.getDefaultSchema(slug);
    } catch (error) {
      console.warn('Dynamic schema failed, using default:', error.message);
      return this.getDefaultSchema(slug);
    }
  }

  /**
   * Get default schema for a page
   * @param {string} slug - Page slug
   * @returns {Object} Default schema
   */
  static getDefaultSchema(slug) {
    const schemas = {
      home: {
        hero: ['badge', 'title', 'desc', 'image', 'imageAlt'],
        cta: ['limited', 'title', 'desc', 'endsTonight', 'socialProof', 'start', 'reserve'],
        features: ['title', 'items'],
        about: ['title', 'content', 'image'],
        contact: ['title', 'address', 'phone', 'email'],
        seo: ['title', 'description', 'keywords']
      },
      about: {
        hero: ['title', 'desc', 'image'],
        content: ['sections'],
        team: ['members'],
        seo: ['title', 'description', 'keywords']
      },
      menu: {
        categories: ['name', 'description', 'items'],
        seo: ['title', 'description', 'keywords']
      }
    };

    return schemas[slug] || { content: ['title', 'body'] };
  }

  /**
   * Get supported languages dynamically
   * @returns {Promise<Array<Object>>} Language configurations
   */
  static async getSupportedLanguages() {
    try {
      // Check if database is available and tables exist
      if (!prisma || !prisma.language) {
        console.warn('Database not available, using static languages');
        return this.getStaticLanguages();
      }

      const languages = await prisma.language.findMany({
        where: { isActive: true },
        orderBy: { priority: 'asc' }
      });

      if (languages.length > 0) {
        return languages.map(lang => ({
          code: lang.code,
          name: lang.name,
          rtl: lang.rtl,
          fallback: lang.fallback,
          priority: lang.priority
        }));
      }

      // Fallback to static configuration
      return this.getStaticLanguages();
    } catch (error) {
      console.warn('Dynamic languages failed, using static:', error.message);
      return this.getStaticLanguages();
    }
  }

  /**
   * Get static language configuration as fallback
   * @returns {Array<Object>} Static language config
   */
  static getStaticLanguages() {
    return [
      { code: 'en', name: 'English', rtl: false, fallback: null, priority: 0 },
      { code: 'es', name: 'Spanish', rtl: false, fallback: null, priority: 1 },
      { code: 'fr', name: 'French', rtl: false, fallback: null, priority: 2 },
      { code: 'de', name: 'German', rtl: false, fallback: null, priority: 3 },
      { code: 'it', name: 'Italian', rtl: false, fallback: null, priority: 4 },
      { code: 'pt', name: 'Portuguese', rtl: false, fallback: null, priority: 5 },
      { code: 'ar', name: 'Arabic', rtl: true, fallback: null, priority: 6 },
      { code: 'de-CH', name: 'Swiss German', rtl: false, fallback: 'de', priority: 7 },
      { code: 'fr-CH', name: 'Swiss French', rtl: false, fallback: 'fr', priority: 8 },
      { code: 'it-CH', name: 'Swiss Italian', rtl: false, fallback: 'it', priority: 9 }
    ];
  }

  /**
   * Get active namespaces dynamically
   * @param {string} locale - Locale
   * @returns {Promise<Array<string>>} Namespace names
   */
  static async getActiveNamespaces(locale = 'en') {
    try {
      // Check if database is available and tables exist
      if (!prisma || !prisma.namespace) {
        console.warn('Database not available, using static namespaces');
        return this.getStaticNamespaces();
      }

      const namespaces = await prisma.namespace.findMany({
        where: { 
          locale,
          isActive: true 
        },
        orderBy: { name: 'asc' }
      });

      if (namespaces.length > 0) {
        return namespaces.map(ns => ns.name);
      }

      // Fallback to static namespaces
      return this.getStaticNamespaces();
    } catch (error) {
      console.warn('Dynamic namespaces failed, using static:', error.message);
      return this.getStaticNamespaces();
    }
  }

  /**
   * Get static namespaces as fallback
   * @returns {Array<string>} Static namespaces
   */
  static getStaticNamespaces() {
    return ['common', 'auth', 'api', 'validation', 'email', 'business', 'home', 'ui', 'menu', 'orders'];
  }

  /**
   * Get RTL languages dynamically
   * @returns {Promise<Array<string>>} RTL language codes
   */
  static async getRtlLanguages() {
    try {
      // Check if database is available and tables exist
      if (!prisma || !prisma.language) {
        console.warn('Database not available, using static RTL languages');
        return ['ar', 'he', 'fa']; // Static fallback
      }

      const languages = await prisma.language.findMany({
        where: { 
          rtl: true,
          isActive: true 
        },
        select: { code: true }
      });

      return languages.map(lang => lang.code);
    } catch (error) {
      console.warn('Dynamic RTL languages failed, using static:', error.message);
      return ['ar', 'he', 'fa']; // Static fallback
    }
  }

  /**
   * Initialize default data for dynamic translation
   * @returns {Promise<void>}
   */
  static async initializeDefaultData() {
    try {
      // Check if database is available
      if (!prisma) {
        throw new Error('Database not available');
      }

      // Initialize languages
      const languages = this.getStaticLanguages();
      for (const lang of languages) {
        await prisma.language.upsert({
          where: { code: lang.code },
          update: lang,
          create: lang
        });
      }

      // Initialize fallback rules
      const fallbackRules = [
        { sourceLocale: 'de-CH', targetLocale: 'de', priority: 0 },
        { sourceLocale: 'fr-CH', targetLocale: 'fr', priority: 0 },
        { sourceLocale: 'it-CH', targetLocale: 'it', priority: 0 }
      ];

      for (const rule of fallbackRules) {
        await prisma.fallbackRule.upsert({
          where: { 
            sourceLocale_targetLocale: {
              sourceLocale: rule.sourceLocale,
              targetLocale: rule.targetLocale
            }
          },
          update: rule,
          create: rule
        });
      }

      // Initialize namespaces
      const namespaces = this.getStaticNamespaces();
      for (const ns of namespaces) {
        await prisma.namespace.upsert({
          where: { 
            name_locale: {
              name: ns,
              locale: 'en'
            }
          },
          update: { isActive: true },
          create: { 
            name: ns, 
            locale: 'en',
            description: `${ns} namespace`,
            isActive: true
          }
        });
      }

      // Initialize content schemas
      const schemas = ['home', 'about', 'menu'];
      for (const slug of schemas) {
        const fields = this.getDefaultSchema(slug);
        await prisma.contentSchema.upsert({
          where: { 
            slug_locale: {
              slug,
              locale: 'en'
            }
          },
          update: { fields, isActive: true },
          create: { 
            slug, 
            locale: 'en',
            fields,
            isActive: true
          }
        });
      }

      if (LoggerService && LoggerService.logAudit) {
        await LoggerService.logAudit(null, 'DYNAMIC_TRANSLATION_INITIALIZED', null, {
          languagesCount: languages.length,
          fallbackRulesCount: fallbackRules.length,
          namespacesCount: namespaces.length,
          schemasCount: schemas.length
        });
      }

      console.log('✅ Dynamic translation data initialized successfully');
    } catch (error) {
      console.error('Dynamic translation initialization failed:', error.message);
      if (LoggerService && LoggerService.logError) {
        await LoggerService.logError('Dynamic translation initialization failed', error.stack, {
          error: error.message
        });
      }
      throw error;
    }
  }

  /**
   * Get dynamic i18n configuration
   * @returns {Promise<Object>} i18n configuration
   */
  static async getDynamicI18nConfig() {
    try {
      const [languages, namespaces, rtlLanguages] = await Promise.all([
        this.getSupportedLanguages(),
        this.getActiveNamespaces(),
        this.getRtlLanguages()
      ]);

      return {
        supportedLngs: languages.map(l => l.code),
        rtlLngs: rtlLanguages,
        ns: namespaces,
        fallbackLng: 'en',
        defaultNS: 'common'
      };
    } catch (error) {
      console.warn('Dynamic i18n config failed, using static:', error.message);
      return {
        supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
        rtlLngs: ['ar'],
        ns: ['common', 'auth', 'api', 'validation', 'email', 'business', 'home'],
        fallbackLng: 'en',
        defaultNS: 'common'
      };
    }
  }
}

export default DynamicTranslationService;