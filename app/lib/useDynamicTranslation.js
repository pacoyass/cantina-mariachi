import { useState, useCallback, useRef, useEffect } from 'react';
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
  const isChangingLanguage = useRef(false);
  const lastChangedLanguage = useRef(i18n.language);
  const changeTimeoutRef = useRef(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
    };
  }, []);

  const changeLanguage = useCallback(async (code) => {
    try {
      // Prevent multiple simultaneous language changes
      if (isChangingLanguage.current) {
        console.log('Language change already in progress, skipping...');
        return false;
      }

      // Prevent changing to the same language
      if (code === lastChangedLanguage.current) {
        console.log('Language already set to', code);
        return true;
      }

      // Check if language is supported
      const isSupported = languages.some(lang => lang.code === code);
      if (!isSupported) {
        console.warn(`Language ${code} is not supported`);
        return false;
      }

      // Set flag to prevent multiple changes
      isChangingLanguage.current = true;
      lastChangedLanguage.current = code;

      console.log(`Changing language from ${i18n.language} to ${code}`);

      // Change language
      await i18n.changeLanguage(code);
      
      // Update URL only if it's different
      const currentUrl = new URL(window.location.href);
      const currentLng = currentUrl.searchParams.get('lng');
      if (currentLng !== code) {
        currentUrl.searchParams.set('lng', code);
        window.history.replaceState({}, '', currentUrl.toString());
      }
      
      // Update localStorage only if it's different
      const storedLng = localStorage.getItem('lng');
      if (storedLng !== code) {
        try {
          localStorage.setItem('lng', code);
        } catch {}
      }
      
      // Update document attributes only if they're different
      const currentLang = document.documentElement.lang;
      const currentDir = document.documentElement.dir;
      const selectedLang = languages.find(l => l.code === code);
      const newDir = selectedLang?.rtl ? 'rtl' : 'ltr';
      
      if (currentLang !== code) {
        document.documentElement.lang = code;
      }
      if (currentDir !== newDir) {
        document.documentElement.dir = newDir;
      }
      
      console.log(`Language changed successfully to ${code}`);
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    } finally {
      // Reset flag after a delay to prevent rapid changes
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
      changeTimeoutRef.current = setTimeout(() => {
        isChangingLanguage.current = false;
      }, 300);
    }
  }, [i18n, languages]);

  return {
    changeLanguage,
    loading: isChangingLanguage.current,
    availableLanguages: languages.map(lang => lang.code),
    currentLanguage: i18n.language
  };
}