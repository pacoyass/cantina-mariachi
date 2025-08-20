import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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

  const [namespaces] = useState(['ui', 'home', 'menu', 'orders']);
  const [rtlLanguages] = useState(['ar']);

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
    rtlLanguages,
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

      // Change i18n language first
      await i18n.changeLanguage(code);
      
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
      
      // Update cookie (only if different)
      const currentCookie = document.cookie.split('; ').find(row => row.startsWith('i18next='))?.split('=')[1];
      if (currentCookie !== code) {
        try {
          document.cookie = `i18next=${code}; path=/; max-age=31536000; SameSite=Lax`;
        } catch {}
      }
      
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