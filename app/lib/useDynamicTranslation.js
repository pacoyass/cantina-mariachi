import { useState, useCallback } from 'react';
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
 * SSR-compatible hook for language switching
 */
export function useLanguageSwitcher() {
  const { i18n, languages } = useDynamicTranslation();

  const changeLanguage = useCallback(async (code) => {
    try {
      // Check if language is supported
      const isSupported = languages.some(lang => lang.code === code);
      if (!isSupported) {
        console.warn(`Language ${code} is not supported`);
        return false;
      }

      console.log(`🌍 Changing language from ${i18n.language} to ${code}`);

      // Change i18n language
      await i18n.changeLanguage(code);
      
      // Update URL
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('lng', code);
      window.history.replaceState({}, '', currentUrl.toString());
      
      // Update localStorage
      try {
        localStorage.setItem('lng', code);
      } catch {}
      
      // Update cookie for SSR compatibility
      try {
        document.cookie = `i18next=${code}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}
      
      // Update document attributes
      document.documentElement.lang = code;
      const selectedLang = languages.find(l => l.code === code);
      document.documentElement.dir = selectedLang?.rtl ? 'rtl' : 'ltr';
      
      console.log(`✅ Language changed successfully to ${code}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to change language:', error);
      return false;
    }
  }, [i18n, languages]);

  return {
    changeLanguage,
    loading: false,
    availableLanguages: languages.map(lang => lang.code),
    currentLanguage: i18n.language
  };
}