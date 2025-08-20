import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import DynamicTranslationService from '../services/dynamicTranslation.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize i18next with dynamic configuration
async function initializeI18n() {
  try {
    // Try to get dynamic configuration
    const dynamicConfig = await DynamicTranslationService.getDynamicI18nConfig();
    
    console.log('✅ Using dynamic i18n configuration:', {
      supportedLngs: dynamicConfig.supportedLngs,
      rtlLngs: dynamicConfig.rtlLngs,
      namespaces: dynamicConfig.ns
    });

    return i18next
      .use(Backend)
      .use(middleware.LanguageDetector)
      .init({
        // Dynamic configuration from database
        fallbackLng: dynamicConfig.fallbackLng,
        lng: 'en',
        supportedLngs: dynamicConfig.supportedLngs,
        
        // Debug mode (disable in production)
        debug: process.env.NODE_ENV === 'development',
        
        // Backend options
        backend: {
          loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
          addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
        },
        
        // Language detection options
        detection: {
          order: ['querystring', 'cookie', 'header', 'session'],
          caches: ['cookie'],
          cookieOptions: {
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false
          }
        },
        
        // Interpolation options
        interpolation: {
          escapeValue: false
        },
        
        // Dynamic namespaces from database
        ns: dynamicConfig.ns,
        defaultNS: dynamicConfig.defaultNS,
        
        // Resource loading options
        load: 'languageOnly',
        
        // Preload languages
        preload: dynamicConfig.supportedLngs,
        
        // Clean code options
        cleanCode: true,
        
        // Performance options
        updateMissing: process.env.NODE_ENV === 'development',
        saveMissing: process.env.NODE_ENV === 'development',
        
        // Return details about translation
        returnDetails: false,
        
        // Join arrays
        joinArrays: false,
        
        // Return empty string for missing keys
        returnEmptyString: false,
        
        // Return null for missing keys
        returnNull: false,
        
        // Return objects for missing keys
        returnObjects: false
      });

  } catch (error) {
    console.warn('⚠️ Dynamic i18n configuration failed, using static fallback:', error.message);
    
    // Fallback to static configuration
    const staticSupportedLngs = ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'];
    const staticRtlLngs = ['ar'];
    const staticNamespaces = ['common', 'auth', 'api', 'validation', 'email', 'business', 'home'];
    
    return i18next
      .use(Backend)
      .use(middleware.LanguageDetector)
      .init({
        fallbackLng: 'en',
        lng: 'en',
        supportedLngs: staticSupportedLngs,
        
        debug: process.env.NODE_ENV === 'development',
        
        backend: {
          loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
          addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
        },
        
        detection: {
          order: ['querystring', 'cookie', 'header', 'session'],
          caches: ['cookie'],
          cookieOptions: {
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: false
          }
        },
        
        interpolation: {
          escapeValue: false
        },
        
        ns: staticNamespaces,
        defaultNS: 'common',
        
        load: 'languageOnly',
        preload: staticSupportedLngs,
        cleanCode: true,
        updateMissing: process.env.NODE_ENV === 'development',
        saveMissing: process.env.NODE_ENV === 'development',
        returnDetails: false,
        joinArrays: false,
        returnEmptyString: false,
        returnNull: false,
        returnObjects: false
      });
  }
}

// Initialize i18next
const i18nInstance = await initializeI18n();

export default i18nInstance;
export { middleware };