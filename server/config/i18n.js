import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    // Fallback language
    fallbackLng: 'en',
    
    // Default language
    lng: 'en',
    
    // Supported languages
    supportedLngs: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar'],
    
    // Debug mode (disable in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Backend options
    backend: {
      // Path to translation files
      loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
      addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
    },
    
    // Language detection options
    detection: {
      // Order of language detection
      order: ['querystring', 'cookie', 'header', 'session'],
      
      // Available detectors
      caches: ['cookie'],
      
      // Cookie options
      cookieOptions: {
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false // Allow client-side access for frontend
      }
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    // Namespace options
    ns: ['common', 'auth', 'api', 'validation', 'email', 'business'],
    defaultNS: 'common',
    
    // Resource loading options
    load: 'languageOnly', // Load 'en' instead of 'en-US'
    
    // Preload languages
    preload: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar'],
    
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

export default i18next;
export { middleware };