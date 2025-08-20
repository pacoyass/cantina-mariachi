import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Simple hook for language management
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

  // Persist language changes to localStorage and cookies
  useEffect(() => {
    if (i18n.language && i18n.language !== 'en') {
      try {
        localStorage.setItem('lng', i18n.language);
        document.cookie = `i18next=${i18n.language}; path=/; max-age=31536000; SameSite=Lax`;
        
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
 * Hook for language switching
 */
export function useLanguageSwitcher() {
  const { i18n, languages } = useDynamicTranslation();

  const changeLanguage = async (code) => {
    try {
      // Check if language is supported
      const isSupported = languages.some(lang => lang.code === code);
      if (!isSupported) {
        console.warn(`Language ${code} is not supported`);
        return false;
      }

      // Change language
      await i18n.changeLanguage(code);
      
      // Update URL
      const url = new URL(window.location.href);
      url.searchParams.set('lng', code);
      window.history.replaceState({}, '', url.toString());
      
      // Update localStorage
      try {
        localStorage.setItem('lng', code);
      } catch {}
      
      // Update document attributes
      try {
        document.documentElement.lang = code;
        const selectedLang = languages.find(l => l.code === code);
        document.documentElement.dir = selectedLang?.rtl ? 'rtl' : 'ltr';
      } catch {}
      
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  };

  return {
    changeLanguage,
    loading: false,
    availableLanguages: languages.map(lang => lang.code),
    currentLanguage: i18n.language
  };
}