// import i18next from 'i18next';
// import Backend from 'i18next-fs-backend';
// import middleware from 'i18next-http-middleware';
// import { fileURLToPath } from 'node:url';
// import { dirname, join } from 'node:path';
// import { supportedLngs } from '../../i18n.config.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Initialize i18next with dynamic configuration
// async function initializeI18n() {
//   try {
//     console.log('🚀 Starting i18n initialization...');
    
//     console.log('🔄 Calling i18next.init...');
//     console.log('📁 Backend loadPath:', join(__dirname, '../locales/{{lng}}/{{ns}}.json'));
//     console.log('🌍 Will attempt to load languages:', supportedLngs);
    
//     const instance = i18next
//       .use(Backend)
//       .use(middleware.LanguageDetector);
    
//     // Wait for initialization to complete
//     await instance.init({
//       // Basic configuration
//       fallbackLng: 'en',
//       lng: 'en',
//       supportedLngs,
      
//       // Debug mode (disable in production)
//       debug: process.env.NODE_ENV === 'development',
      
//       // Backend options - simplified
//       backend: {
//         loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
//         addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
//         debug: process.env.NODE_ENV === 'development'
//       },
      
//       // Language detection options
//       detection: {
//         order: ['querystring', 'cookie', 'header', 'session'],
//         caches: ['cookie'],
//         cookieOptions: {
//           path: '/',
//           sameSite: 'strict',
//           secure: process.env.NODE_ENV === 'production',
//           httpOnly: false
//         }
//       },
      
//       // Interpolation options
//       interpolation: {
//         escapeValue: false
//       },
      
//       // Namespaces
//       ns: ['common', 'auth', 'api', 'validation', 'email', 'business', 'home', 'ui', 'menu', 'popular', 'orders', 'account', 'reservations'],
//       defaultNS: 'common',
      
//       // Resource loading options
//       load: 'all',
      
//       // Preload languages
//       preload: supportedLngs,
      
//       // Clean code options
//       cleanCode: true,
      
//       // Performance options
//       updateMissing: process.env.NODE_ENV === 'development',
//       saveMissing: process.env.NODE_ENV === 'development',
      
//       // Return details about translation
//       returnDetails: false,
      
//       // Join arrays
//       joinArrays: false,
      
//       // Return empty string for missing keys
//       returnEmptyString: false,
      
//       // Return null for missing keys
//       returnNull: false,
      
//       // Return objects for missing keys
//       returnObjects: false,
      
//       // Force synchronous initialization
//       initImmediate: false,
      
//       // Wait for backend to load resources
//       wait: true,
      
//       // Ensure proper initialization
//       compatibilityJSON: 'v4'
//     });
      
//     console.log('✅ i18next.init completed successfully');
//     return instance;

//   } catch (error) {
//     console.error('❌ i18n initialization failed:', error);
//     console.warn('⚠️ i18n initialization failed, using minimal config:', error.message);
    
//     // Minimal fallback configuration
//     const fallbackInstance = i18next
//       .use(Backend)
//       .use(middleware.LanguageDetector);
    
//     await fallbackInstance.init({
//       fallbackLng: 'en',
//       lng: 'en',
//       supportedLngs: ['en'],
//       debug: false,
//       backend: {
//         loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
//         addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json')
//       },
//       detection: {
//         order: ['querystring', 'cookie', 'header', 'session'],
//         caches: ['cookie']
//       },
//       interpolation: { escapeValue: false },
//       ns: ['common', 'ui', 'menu', 'home', 'orders', 'account', 'reservations'],
//       defaultNS: 'common',
//       load: 'languageOnly',
//       preload: ['en'],
//       cleanCode: true,
//       updateMissing: false,
//       saveMissing: false,
//       returnDetails: false,
//       joinArrays: false,
//       returnEmptyString: false,
//       returnNull: false,
//       returnObjects: false
//     });
    
//     return fallbackInstance;
//   }
// }

// // Initialize i18next asynchronously and export the Promise
// console.log('🚀 About to call initializeI18n()...');
// const i18nPromise = initializeI18n();

// // Export the Promise - consumers must await it
// export default i18nPromise;
// export { middleware };

// // For backward compatibility, also export a function to get the instance
// export async function getI18nInstance() {
//   return await i18nPromise;
// }



import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { supportedLngs } from '../../i18n.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize i18next with dynamic configuration
async function initializeI18n() {
  try {
    console.log('🚀 Starting i18n initialization...');
    
    console.log('🔄 Calling i18next.init...');
    console.log('📁 Backend loadPath:', join(__dirname, '../locales/{{lng}}/{{ns}}.json'));
    console.log('🌍 Will attempt to load languages:', supportedLngs);
    
    const instance = i18next
      .use(Backend)
      .use(middleware.LanguageDetector);
    
    // Wait for initialization to complete
    await instance.init({
      // Basic configuration
      fallbackLng: 'en',
      lng: 'en',
      supportedLngs,
      
      // Debug mode (disable in production)
      debug: process.env.NODE_ENV === 'development',
      
      // Backend options - simplified
      backend: {
        loadPath: join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
        addPath: join(__dirname, '../locales/{{lng}}/{{ns}}.missing.json'),
        debug: process.env.NODE_ENV === 'development'
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
      
      // Namespaces
      ns: ['common', 'auth', 'api', 'validation', 'email', 'business', 'home', 'ui', 'menu', 'popular', 'orders', 'account', 'reservations'],
      defaultNS: 'common',
      
      // Resource loading options
      load: 'all',
      
      // Preload languages
      preload: supportedLngs,
      
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
      compatibilityJSON: 'v4'
    });
      
    console.log('✅ i18next.init completed successfully');
    return instance;

  } catch (error) {
    console.error('❌ i18n initialization failed:', error);
    console.warn('⚠️ i18n initialization failed, using minimal config:', error.message);
    
    // Minimal fallback configuration
    const fallbackInstance = i18next
      .use(Backend)
      .use(middleware.LanguageDetector);
    
    await fallbackInstance.init({
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
      ns: ['common', 'ui', 'menu', 'home', 'orders', 'account', 'reservations'],
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
    
    return fallbackInstance;
  }
}

// Initialize i18next asynchronously and export the Promise
console.log('🚀 About to call initializeI18n()...');
const i18nPromise = initializeI18n();

// Export the Promise - consumers must await it
export default i18nPromise;
export { middleware };

// For backward compatibility, also export a function to get the instance
export async function getI18nInstance() {
  return await i18nPromise;
}