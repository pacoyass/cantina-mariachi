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
 * Get dynamic i18n configuration from backend
 */
async function getDynamicI18nConfig() {
  try {
    const response = await fetch('/api/cms/admin/languages');
    if (response.ok) {
      const { languages } = await response.json();
      const { namespaces } = await fetch('/api/cms/admin/namespaces').then(r => r.ok ? r.json() : { namespaces: [] });
      
      return {
        supportedLngs: languages.map(l => l.code),
        rtlLngs: languages.filter(l => l.rtl).map(l => l.code),
        ns: namespaces.map(n => n.name),
        fallbackLng: 'en',
        defaultNS: 'ui'
      };
    }
  } catch (error) {
    console.warn('Failed to fetch dynamic i18n config:', error.message);
  }
  
  // Fallback to static configuration
  return {
    supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
    rtlLngs: ['ar'],
    ns: ['ui', 'home', 'menu', 'orders'],
    fallbackLng: 'en',
    defaultNS: 'ui'
  };
}

export async function initI18n({ lng = 'en', resources }) {
  const i18n = getI18nInstance();
  if (i18n.isInitialized) {
    if (i18n.language !== lng) await i18n.changeLanguage(lng);
    return i18n;
  }

  // Get dynamic configuration
  const dynamicConfig = await getDynamicI18nConfig();
  
  console.log('✅ Using dynamic i18n configuration:', {
    supportedLngs: dynamicConfig.supportedLngs,
    rtlLngs: dynamicConfig.rtlLngs,
    namespaces: dynamicConfig.ns
  });

  await i18n.init({
    lng,
    fallbackLng: dynamicConfig.fallbackLng,
    supportedLngs: dynamicConfig.supportedLngs,
    interpolation: { escapeValue: false },
    resources,
    ns: dynamicConfig.ns,
    defaultNS: dynamicConfig.defaultNS,
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
  });
  return i18n;
}

export function createServerI18n({ lng = 'en', resources }) {
  const i18n = i18next.createInstance();
  i18n.use(initReactI18next);
  
  // Use static configuration for server-side rendering
  const staticConfig = {
    supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
    rtlLngs: ['ar'],
    ns: ['ui', 'home', 'menu', 'orders'],
    fallbackLng: 'en',
    defaultNS: 'ui'
  };
  
  i18n.init({
    lng,
    fallbackLng: staticConfig.fallbackLng,
    supportedLngs: staticConfig.supportedLngs,
    interpolation: { escapeValue: false },
    resources,
    ns: staticConfig.ns,
    defaultNS: staticConfig.defaultNS,
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
    initImmediate: false,
  });
  return i18n;
}