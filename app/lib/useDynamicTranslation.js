import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for dynamic translation configuration
 * Provides access to dynamic languages, namespaces, and RTL settings
 */
export function useDynamicTranslation() {
  const { t, i18n } = useTranslation();
  const [languages, setLanguages] = useState([]);
  const [namespaces, setNamespaces] = useState([]);
  const [rtlLanguages, setRtlLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Static fallback configuration
  const staticLanguages = [
    { code: 'en', name: 'English', rtl: false, priority: 0, isActive: true },
    { code: 'es', name: 'Spanish', rtl: false, priority: 1, isActive: true },
    { code: 'fr', name: 'French', rtl: false, priority: 2, isActive: true },
    { code: 'de', name: 'German', rtl: false, priority: 3, isActive: true },
    { code: 'it', name: 'Italian', rtl: false, priority: 4, isActive: true },
    { code: 'pt', name: 'Portuguese', rtl: false, priority: 5, isActive: true },
    { code: 'ar', name: 'Arabic', rtl: true, priority: 6, isActive: true },
  ];

  const staticNamespaces = ['ui', 'home', 'menu', 'orders', 'common', 'auth', 'api', 'validation', 'email', 'business'];

  // Fetch dynamic translation configuration
  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch languages
      const languagesResponse = await fetch('/api/cms/admin/languages');
      if (languagesResponse.ok) {
        const { languages: backendLanguages } = await languagesResponse.json();
        if (Array.isArray(backendLanguages) && backendLanguages.length > 0) {
          const activeLanguages = backendLanguages
            .filter(lang => lang.isActive)
            .sort((a, b) => a.priority - b.priority);
          
          setLanguages(activeLanguages);
          setRtlLanguages(activeLanguages.filter(lang => lang.rtl).map(lang => lang.code));
          console.log('✅ Loaded dynamic languages from backend:', activeLanguages.length);
        } else {
          throw new Error('No languages returned from backend');
        }
      } else {
        throw new Error(`Backend responded with ${languagesResponse.status}`);
      }

      // Fetch namespaces for current language
      const namespacesResponse = await fetch(`/api/cms/admin/namespaces?locale=${i18n.language || 'en'}`);
      if (namespacesResponse.ok) {
        const { namespaces: backendNamespaces } = await namespacesResponse.json();
        if (Array.isArray(backendNamespaces) && backendNamespaces.length > 0) {
          const activeNamespaces = backendNamespaces
            .filter(ns => ns.isActive)
            .map(ns => ns.name);
          setNamespaces(activeNamespaces);
          console.log('✅ Loaded dynamic namespaces from backend:', activeNamespaces.length);
        } else {
          throw new Error('No namespaces returned from backend');
        }
      } else {
        throw new Error(`Backend responded with ${namespacesResponse.status}`);
      }

    } catch (err) {
      console.warn('Failed to fetch dynamic translation config, using static fallback:', err.message);
      setError(err.message);
      
      // Use static configuration as fallback
      setLanguages(staticLanguages);
      setNamespaces(staticNamespaces);
      setRtlLanguages(['ar']);
    } finally {
      setLoading(false);
    }
  }, [i18n.language]);

  // Refresh configuration when language changes
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Get current language info
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || 
    { code: 'en', name: 'English', rtl: false, priority: 0 };

  // Check if current language is RTL
  const isRTL = currentLanguage.rtl;

  // Get available language codes
  const availableLanguages = languages.map(lang => lang.code);

  // Check if a language is supported
  const isLanguageSupported = useCallback((code) => {
    return availableLanguages.includes(code);
  }, [availableLanguages]);

  // Get language display name
  const getLanguageName = useCallback((code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  }, [languages]);

  // Get language RTL setting
  const getLanguageRTL = useCallback((code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.rtl : false;
  }, [languages]);

  // Get fallback language for a given language
  const getFallbackLanguage = useCallback((code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.fallback : 'en';
  }, [languages]);

  return {
    // State
    languages,
    namespaces,
    rtlLanguages,
    loading,
    error,
    
    // Current language info
    currentLanguage,
    isRTL,
    
    // Utility functions
    availableLanguages,
    isLanguageSupported,
    getLanguageName,
    getLanguageRTL,
    getFallbackLanguage,
    
    // Actions
    refreshConfig: fetchConfig,
    
    // i18n instance
    i18n,
    t
  };
}

/**
 * Hook for language switching with dynamic configuration
 */
export function useLanguageSwitcher() {
  const { i18n, languages, loading } = useDynamicTranslation();

  const changeLanguage = useCallback(async (code) => {
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
      
      // Update cookies and localStorage
      try {
        document.cookie = `i18next=${code}; path=/; max-age=31536000; SameSite=Lax`;
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
  }, [i18n, languages]);

  return {
    changeLanguage,
    loading,
    availableLanguages: languages.map(lang => lang.code),
    currentLanguage: i18n.language
  };
}