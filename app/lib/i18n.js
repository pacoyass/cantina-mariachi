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
 * Falls back to static configuration if backend is unavailable
 */
async function getDynamicI18nConfig() {
  try {
    // Fetch languages and namespaces in parallel
    const [languagesResponse, namespacesResponse] = await Promise.all([
      fetch('/api/cms/admin/languages'),
      fetch('/api/cms/admin/namespaces')
    ]);

    if (languagesResponse.ok && namespacesResponse.ok) {
      const { languages } = await languagesResponse.json();
      const { namespaces } = await namespacesResponse.json();
      
      // Filter active languages and namespaces
      const activeLanguages = languages.filter(lang => lang.isActive);
      const activeNamespaces = namespaces.filter(ns => ns.isActive);
      
      return {
        supportedLngs: activeLanguages.map(l => l.code),
        rtlLngs: activeLanguages.filter(l => l.rtl).map(l => l.code),
        ns: activeNamespaces.map(n => n.name),
        fallbackLng: 'en',
        defaultNS: 'ui',
        languages: activeLanguages,
        namespaces: activeNamespaces
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
    defaultNS: 'ui',
    languages: [
      { code: 'en', name: 'English', rtl: false, priority: 0 },
      { code: 'es', name: 'Spanish', rtl: false, priority: 1 },
      { code: 'fr', name: 'French', rtl: false, priority: 2 },
      { code: 'de', name: 'German', rtl: false, priority: 3 },
      { code: 'it', name: 'Italian', rtl: false, priority: 4 },
      { code: 'pt', name: 'Portuguese', rtl: false, priority: 5 },
      { code: 'ar', name: 'Arabic', rtl: true, priority: 6 },
    ],
    namespaces: [
      { name: 'ui', description: 'User Interface' },
      { name: 'home', description: 'Home Page' },
      { name: 'menu', description: 'Menu Items' },
      { name: 'orders', description: 'Order Management' }
    ]
  };
}

export async function initI18n({ lng = 'en', resources }) {
  const i18n = getI18nInstance();
  
  // If already initialized, just change language if needed
  if (i18n.isInitialized) {
    if (i18n.language !== lng) {
      console.log(`🔄 Re-initializing i18n from ${i18n.language} to ${lng}`);
      // Force re-initialization to ensure clean state
      await i18n.destroy();
      i18n.use(initReactI18next);
    } else {
      return i18n;
    }
  }

  // Get dynamic configuration
  const dynamicConfig = await getDynamicI18nConfig();
  
  console.log('✅ Using i18n configuration:', {
    type: 'dynamic',
    detectedLanguage: lng,
    supportedLngs: dynamicConfig.supportedLngs,
    rtlLngs: dynamicConfig.rtlLngs,
    namespaces: dynamicConfig.ns,
    languagesCount: dynamicConfig.languages.length,
    namespacesCount: dynamicConfig.namespaces.length
  });

  // Create a language-locked configuration
  const lockedConfig = {
    lng, // Use the detected language directly
    fallbackLng: lng, // Force fallback to detected language
    supportedLngs: [lng, ...dynamicConfig.supportedLngs.filter(l => l !== lng)], // Put detected language first
    interpolation: { escapeValue: false },
    resources,
    ns: dynamicConfig.ns,
    defaultNS: dynamicConfig.defaultNS,
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
    
    // Additional configuration for better performance
    load: 'languageOnly',
    preload: [lng], // Only preload the detected language
    updateMissing: process.env.NODE_ENV === 'development',
    saveMissing: process.env.NODE_ENV === 'development',
    
    // Debug mode in development
    debug: process.env.NODE_ENV === 'development',
    
    // Missing key handling
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${ns}:${key} for language: ${lng}`);
      }
      return fallbackValue;
    },

    // Language change prevention
    allowMultiLoading: false,
    loadMultiLanguage: false,
    
    // Strict language enforcement
    initImmediate: false,
    useCookie: false, // Disable cookie-based language detection
    useLocalStorage: false, // Disable localStorage-based language detection
  };

  await i18n.init(lockedConfig);

  // Add language change interceptor to prevent unauthorized changes
  const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
  i18n.changeLanguage = async (newLang) => {
    // Only allow language changes if explicitly requested and valid
    if (newLang === lng || dynamicConfig.supportedLngs.includes(newLang)) {
      console.log(`✅ Allowing language change to: ${newLang}`);
      return await originalChangeLanguage(newLang);
    } else {
      console.warn(`🚫 Blocked unauthorized language change attempt: ${newLang} -> ${lng}`);
      // Force back to detected language
      return await originalChangeLanguage(lng);
    }
  };

  // Double-verify the language is correct
  if (i18n.language !== lng) {
    console.error(`🚨 Critical: i18n language mismatch! Expected: ${lng}, Got: ${i18n.language}`);
    // Force the correct language
    await i18n.changeLanguage(lng);
    
    // Verify again
    if (i18n.language !== lng) {
      console.error(`🚨 Failed to set correct language! Current: ${i18n.language}`);
      throw new Error(`Failed to initialize i18n with language: ${lng}`);
    }
  }

  console.log(`✅ i18n initialized successfully with language: ${i18n.language}`);
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
    
    // Server-side specific settings
    load: 'languageOnly',
    preload: staticConfig.supportedLngs,
    updateMissing: false,
    saveMissing: false,
    debug: false
  });
  
  return i18n;
}

/**
 * Get current i18n configuration
 * Useful for debugging and monitoring
 */
export function getCurrentI18nConfig() {
  const i18n = getI18nInstance();
  if (!i18n.isInitialized) {
    return null;
  }
  
  return {
    language: i18n.language,
    languages: i18n.languages,
    supportedLngs: i18n.options.supportedLngs,
    namespaces: i18n.options.ns,
    defaultNS: i18n.options.defaultNS,
    fallbackLng: i18n.options.fallbackLng,
    isInitialized: i18n.isInitialized
  };
}