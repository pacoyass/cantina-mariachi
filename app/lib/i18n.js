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

export async function initI18n({ lng = 'en', resources }) {
  const i18n = getI18nInstance();
  
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

  await i18n.init({
    lng,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
    interpolation: { escapeValue: false },
    resources,
    ns: ['ui', 'home', 'menu', 'orders'],
    defaultNS: 'ui',
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
  });

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
  
  i18n.init({
    lng,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar', 'es', 'fr', 'de', 'it', 'pt'],
    interpolation: { escapeValue: false },
    resources,
    ns: ['ui', 'home', 'menu', 'orders'],
    defaultNS: 'ui',
    react: { useSuspense: false },
    returnEmptyString: false,
    cleanCode: true,
    initImmediate: false,
  });
  
  return i18n;
}