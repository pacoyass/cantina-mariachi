import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { supportedLngs, rtlLngs } from '../../i18n.config.js';
import { loadTranslationsFromAPI } from './loadTranslations.js';
import { uiResources } from './resources.js';

let initialized = false;

export function getI18nInstance() {
  if (!initialized) {
    i18next.use(initReactI18next);
    initialized = true;
  }
  return i18next;
}

/**
 * Initialize i18n with the specified language
 * @param {Object} options - Configuration options
 * @param {string} options.lng - Language code (default: 'en')
 * @param {Object} options.resources - Translation resources (optional, will load from API if not provided)
 * @returns {Promise<Object>} Initialized i18n instance
 */
export async function initI18n({ lng = 'en', resources }) {
  const i18n = getI18nInstance();
  
  // If already initialized, just change language if needed
  if (i18n.isInitialized) {
    if (i18n.language !== lng) {
      await i18n.changeLanguage(lng);
    }
    return i18n;
  }

  // Load translations from API if not provided
  let translationResources = resources;
  if (!translationResources) {
    try {
      translationResources = await loadTranslationsFromAPI(lng);
      console.log('✅ Successfully loaded translations from API for language:', lng);
    } catch (error) {
      console.warn('⚠️ Failed to load translations from API, using fallback resources:', error);
      // Use hardcoded resources as fallback
      translationResources = uiResources[lng] || uiResources.en;
    }
  }

  // Initialize with namespace support for components
  await i18n.init({
    lng,
    fallbackLng: 'en',
    supportedLngs,
    interpolation: { escapeValue: false },
    resources: translationResources,
    // Configure namespaces for component access
    ns: ['ui', 'home', 'common', 'auth', 'api', 'validation', 'email', 'business', 'events', 'navbar', 'footer', 'faq', 'popular'],
    defaultNS: 'ui',
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
    // SSR optimizations
    initImmediate: false,
    compatibilityJSON: 'v4',
    // Language detection
    detection: {
      order: ['querystring', 'cookie', 'header', 'session'],
      caches: ['cookie'],
      cookieOptions: {
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
        maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
      }
    }
  });

  return i18n;
}

/**
 * Create server-side i18n instance for SSR
 * @param {Object} options - Configuration options
 * @param {string} options.lng - Language code (default: 'en')
 * @param {Object} options.resources - Translation resources
 * @returns {Object} Server i18n instance
 */
export function createServerI18n({ lng = 'en', resources }) {
  const i18n = i18next.createInstance();
  i18n.use(initReactI18next);
  
  // Use provided resources or fallback to hardcoded resources
  const serverResources = resources || uiResources[lng] || uiResources.en;
  
  i18n.init({
    lng,
    fallbackLng: 'en',
    resources: serverResources,
    // Configure namespaces for component access
    ns: ['ui', 'home', 'common', 'auth', 'api', 'validation', 'email', 'business', 'events', 'navbar', 'footer', 'faq', 'popular'],
    defaultNS: 'ui',
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
    // SSR optimizations
    initImmediate: false,
    compatibilityJSON: 'v4',
    // Server-specific options
    backend: {
      loadPath: false, // Disable backend loading on server
      addPath: false
    }
  });
  
  return i18n;
}

/**
 * Get RTL languages for SSR
 */
export { rtlLngs };