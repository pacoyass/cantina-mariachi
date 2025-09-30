import { useState, useCallback, useRef,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { uiResources } from './resources';
import { loadTranslationsFromAPI } from './loadTranslations';

/**
 * Simple hook for language management - SSR compatible
 */
export function useDynamicTranslation() {
  const { t, i18n } = useTranslation();
  const [languages] = useState([
    { code: 'en', name: 'English', rtl: false },
    { code: 'es', name: 'Spanish', rtl: false },
    { code: 'fr', name: 'French', rtl: false },
    { code: 'de', name: 'German', rtl: false },
    { code: 'it', name: 'Italian', rtl: false },
    { code: 'pt', name: 'Portuguese', rtl: false },
    { code: 'ar', name: 'Arabic', rtl: true },
  ]);

  const [namespaces] = useState(['ui', 'home', 'common', 'events', 'navbar', 'footer', 'faq', 'popular', 'auth', 'api', 'validation', 'email', 'business']);
  const [rtlLanguages] = useState(['ar']);

  // Persist language changes to localStorage and cookies
  useEffect(() => {
    if (!i18n.language) return;
    try {
      // Persist selection for all languages (including 'en')
      localStorage.setItem('lng', i18n.language);

      // Actively set client-visible cookie to avoid stale values on next requests
      document.cookie = `i18next=${encodeURIComponent(i18n.language)}; path=/; max-age=${365 * 24 * 60 * 60}`;

      // Update URL if not already set
      const url = new URL(window.location.href);
      if (url.searchParams.get('lng') !== i18n.language) {
        url.searchParams.set('lng', i18n.language);
        window.history.replaceState({}, '', url.toString());
      }

      // Update document attributes
      document.documentElement.lang = i18n.language;
      const selectedLang = languages.find(l => l.code === i18n.language);
      if (selectedLang) {
        document.documentElement.dir = selectedLang.rtl ? 'rtl' : 'ltr';
      }
    } catch (error) {
      console.warn('Failed to persist language preference:', error);
    }
  }, [i18n.language, languages]);

  // Get current language info
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || 
    { code: 'en', name: 'English', rtl: false };

  // Check if current language is RTL
  const isRTL = currentLanguage.rtl;

  // Get available language codes
  const availableLanguages = languages.map(lang => lang.code);

  return {
    // State
    languages,
    namespaces,
    rtlLanguages: rtlLanguages,
    loading: false,
    error: null,
    
    // Current language info
    currentLanguage,
    isRTL,
    
    // Utility functions
    availableLanguages,
    isLanguageSupported: (code) => availableLanguages.includes(code),
    getLanguageName: (code) => {
      const lang = languages.find(l => l.code === code);
      return lang ? lang.name : code;
    },
    getLanguageRTL: (code) => {
      const lang = languages.find(l => l.code === code);
      return lang ? lang.rtl : false;
    },
    
    // Actions
    refreshConfig: () => {},
    
    // i18n instance
    i18n,
    t
  };
}

/**
 * SSR-compatible hook for language switching with loop prevention
 */
export function useLanguageSwitcher() {
  const { i18n, languages } = useDynamicTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const lastChangedRef = useRef(i18n.language);

  const changeLanguage = useCallback(async (code) => {
    // Prevent multiple simultaneous language changes
    if (isLoading) {
      console.log('🔄 Language change already in progress, skipping...');
      return false;
    }

    // Prevent changing to the same language
    if (code === lastChangedRef.current) {
      console.log('🔄 Language already set to', code);
      return true;
    }

    try {
      // Check if language is supported
      const isSupported = languages.some(lang => lang.code === code);
      if (!isSupported) {
        console.warn(`⚠️ Language ${code} is not supported`);
        return false;
      }

      // Set loading state
      setIsLoading(true);
      lastChangedRef.current = code;

      console.log(`🌍 Changing language from ${i18n.language} to ${code}`);

      // 1) Merge static fallback resources (if present)
      const staticResources = uiResources[code] || uiResources['en'];
      if (staticResources) {
        const addNs = (ns) => {
          if (staticResources[ns]) i18n.addResourceBundle(code, ns, staticResources[ns], true, true);
        };
        addNs('ui');
        addNs('home');
        addNs('common');
        addNs('events');
        addNs('navbar');
        addNs('footer');
        addNs('faq');
        addNs('popular');
        addNs('auth');
        addNs('api');
        addNs('validation');
        addNs('email');
        addNs('business');
        addNs('menu');
        addNs('orders');
        addNs('account');
        addNs('reservations');
      }

      // 2) Merge authoritative API resources for selected language
      try {
        const apiResources = await loadTranslationsFromAPI(code);
        if (apiResources && typeof apiResources === 'object') {
          for (const [ns, nsRes] of Object.entries(apiResources)) {
            i18n.addResourceBundle(code, ns, nsRes, true, true);
          }
        }
      } catch (e) {
        console.warn('Failed to load translations from API on language change:', e);
      }

      // Set client-visible cookie immediately so next requests use new lang without refresh
      try {
        document.cookie = `i18next=${encodeURIComponent(code)}; path=/; max-age=${365 * 24 * 60 * 60}`;
      } catch {}

      // Change i18n language
      await i18n.changeLanguage(code);
      // Hint server to persist cookie for SSR refreshes
      try {
        fetch(`/api/config/public?lng=${encodeURIComponent(code)}`, { credentials: 'include' }).catch(() => {});
      } catch {}
      
      // Update document attributes
      document.documentElement.lang = code;
      const selectedLang = languages.find(l => l.code === code);
      document.documentElement.dir = selectedLang?.rtl ? 'rtl' : 'ltr';
      
      // Update localStorage (only if different)
      const currentStored = localStorage.getItem('lng');
      if (currentStored !== code) {
        try {
          localStorage.setItem('lng', code);
        } catch {}
      }
      
      // Note: Server handles cookie updates via httpOnly cookies
      
      // Update URL last (only if different)
      const currentUrl = new URL(window.location.href);
      const currentUrlLang = currentUrl.searchParams.get('lng');
      if (currentUrlLang !== code) {
        currentUrl.searchParams.set('lng', code);
        window.history.replaceState({}, '', currentUrl.toString());
      }
      
      console.log(`✅ Language changed successfully to ${code}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to change language:', error);
      return false;
    } finally {
      // Reset loading state immediately
      setIsLoading(false);
    }
  }, [i18n, languages, isLoading]);

  return {
    changeLanguage,
    loading: isLoading,
    availableLanguages: languages.map(lang => lang.code),
    currentLanguage: i18n.language
  };
}