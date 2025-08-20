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
    console.log('🚀 Starting i18n initialization...');
    
    // For now, use static configuration to avoid async issues during startup
    // Dynamic configuration will be loaded when the service is first accessed
    const staticConfig = {
      supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
      rtlLngs: ['ar'],
      namespaces: ['common', 'auth', 'api', 'validation', 'email', 'business', 'home'],
      fallbackLng: 'en',
      defaultNS: 'common'
    };

    console.log('✅ Using static i18n configuration during startup:', {
      supportedLngs: staticConfig.supportedLngs,
      rtlLngs: staticConfig.rtlLngs,
      namespaces: staticConfig.namespaces
    });

    console.log('🔄 Calling i18next.init...');
    console.log('📁 Backend loadPath:', join(__dirname, '../locales/{{lng}}/{{ns}}.json'));
    console.log('🌍 Will attempt to load languages:', staticConfig.supportedLngs);
    console.log('📚 Will attempt to load namespaces:', staticConfig.namespaces);
    
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
          addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
          // Debug backend loading
          debug: true,
          // Add more verbose logging
          parse: (data, url, callback) => {
            console.log('🔍 Backend loading:', url);
            try {
              const result = JSON.parse(data);
              console.log('✅ Backend loaded successfully:', url);
              callback(null, result);
            } catch (error) {
              console.error('❌ Backend parse error:', url, error.message);
              callback(error, null);
            }
          }
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
        load: 'all',
        
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
        returnObjects: false,
        
        // Force synchronous initialization
        initImmediate: false,
        
        // Wait for backend to load resources
        wait: true,
        
        // Ensure proper initialization
        initImmediate: false,
        compatibilityJSON: 'v4'
      });
      
      console.log('✅ i18next.init completed successfully');

  } catch (error) {
    console.error('❌ i18n initialization failed:', error);
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
console.log('🚀 About to call initializeI18n()...');
let i18nInstance;
try {
  i18nInstance = initializeI18n();
  console.log('✅ initializeI18n() completed, instance:', typeof i18nInstance);
} catch (error) {
  console.error('❌ CRITICAL ERROR during i18n initialization:', error);
  throw error;
}

// Log initialization status and test loading
console.log('✅ i18next initialized with languages:', i18nInstance.languages || ['en']);
console.log('📚 Available namespaces:', i18nInstance.options?.ns || ['common']);
console.log('🌍 Supported languages:', i18nInstance.options?.supportedLngs || ['en']);

// Test if translations are loading properly
try {
  if (i18nInstance && typeof i18nInstance.t === 'function') {
    const testEn = i18nInstance.t('dataRetrieved', { lng: 'en', ns: 'api' });
    const testFr = i18nInstance.t('hero.badge', { lng: 'fr', ns: 'home' });
    console.log('✅ Translation test - EN:', testEn, 'FR:', testFr);
  } else {
    console.warn('⚠️ i18nInstance not properly initialized for testing');
  }
} catch (error) {
  console.warn('⚠️ Translation test failed:', error.message);
}

export default i18nInstance;
export { middleware };