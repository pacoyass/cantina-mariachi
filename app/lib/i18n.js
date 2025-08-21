import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

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
 * @param {Object} options.resources - Translation resources
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

  // Initialize with clean, simple configuration
  await i18n.init({
    lng,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
    interpolation: { escapeValue: false },
    resources,
    ns: ['ui', 'home', 'menu', 'orders', 'reservations', 'account'],
    defaultNS: 'ui',
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
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
  
  i18n.init({
    lng,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
    interpolation: { escapeValue: false },
    resources,
    ns: ['ui', 'home', 'menu', 'orders', 'reservations', 'account'],
    defaultNS: 'ui',
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
    initImmediate: false,
  });
  
  return i18n;
}