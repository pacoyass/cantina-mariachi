import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import DynamicTranslationService from '../services/dynamicTranslation.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize i18next with dynamic configuration
function initializeI18n() {
  try {
    // For now, use static configuration to avoid async issues during startup
    // Dynamic configuration will be loaded when the service is first accessed
    const staticConfig = {
      supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
      rtlLngs: ['ar'],
      namespaces: ['common', 'auth', 'api', 'validation', 'email', 'business', 'home', 'ui', 'menu', 'orders'],
      fallbackLng: 'en',
      defaultNS: 'common'
    };

    console.log('✅ Using static i18n configuration during startup:', {
      supportedLngs: staticConfig.supportedLngs,
      rtlLngs: staticConfig.rtlLngs,
      namespaces: staticConfig.namespaces
    });

    return i18next
      .use(Backend)
      .use(middleware.LanguageDetector)
      .init({
        // Static configuration for startup
        fallbackLng: staticConfig.fallbackLng,
        lng: 'en',
        supportedLngs: staticConfig.supportedLngs,
        
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
        
        // Static namespaces for startup
        ns: staticConfig.namespaces,
        defaultNS: staticConfig.defaultNS,
        
        // Resource loading options
        load: 'languageOnly',
        
        // Preload languages
        preload: staticConfig.supportedLngs,
        
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
    console.warn('⚠️ i18n initialization failed, using minimal config:', error.message);
    
    // Minimal fallback configuration
    return i18next
      .use(Backend)
      .use(middleware.LanguageDetector)
      .init({
        fallbackLng: 'en',
        lng: 'en',
        supportedLngs: ['en'],
        debug: false,
        backend: {
          loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
          addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
        },
        detection: {
          order: ['querystring', 'cookie', 'header', 'session'],
          caches: ['cookie']
        },
        interpolation: { escapeValue: false },
        ns: ['common'],
        defaultNS: 'common',
        load: 'languageOnly',
        preload: ['en'],
        cleanCode: true,
        updateMissing: false,
        saveMissing: false,
        returnDetails: false,
        joinArrays: false,
        returnEmptyString: false,
        returnNull: false,
        returnObjects: false
      });
  }
}

// Initialize i18next synchronously
const i18nInstance = initializeI18n();

// Log initialization status
console.log('✅ i18next initialized with languages:', i18nInstance.languages || ['en']);

export default i18nInstance;
export { middleware };