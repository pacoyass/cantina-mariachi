import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';
import { rtlLngs } from './lib/i18n.js';

/**
 * Client-side app initialization with SSR-compatible language support
 */
startTransition(async () => {
  try {
    // Get language from server context (SSR) or detect on client
    const serverLang = window.__REACT_ROUTER_DATA__?.context?.lng;
    const urlLang = new URLSearchParams(window.location.search).get('lng');
    const storedLang = localStorage.getItem('lng');
    const cookieLang = document.cookie.split('; ').find(row => row.startsWith('i18next='))?.split('=')[1];
    
    // Language priority: URL > Server > Cookie > localStorage > Default
    const lng = urlLang || serverLang || cookieLang || storedLang || 'en';
    
    console.log('🌍 Client language detection:', {
      url: urlLang,
      server: serverLang,
      cookie: cookieLang,
      stored: storedLang,
      final: lng
    });

    // Set document attributes immediately to prevent flash
    document.documentElement.lang = lng;
    document.documentElement.dir = rtlLngs.includes(lng) ? 'rtl' : 'ltr';

    // Initialize i18n with the detected language
    const i18n = await initI18n({ lng, resources: uiResources });

    // Ensure the language is actually set correctly
    if (i18n.language !== lng) {
      console.log(`🔄 Correcting i18n language from ${i18n.language} to ${lng}`);
      await i18n.changeLanguage(lng);
    }

    // Update localStorage and cookie if needed
    if (storedLang !== lng) {
      try {
        localStorage.setItem('lng', lng);
      } catch {}
    }
    
    if (cookieLang !== lng) {
      try {
        document.cookie = `i18next=${lng}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}
    }

    // Listen for language changes and update document attributes
    i18n.on('languageChanged', (newLng) => {
      document.documentElement.lang = newLng;
      document.documentElement.dir = rtlLngs.includes(newLng) ? 'rtl' : 'ltr';
      
      // Update URL if not already set
      const currentUrlLang = new URLSearchParams(window.location.search).get('lng');
      if (currentUrlLang !== newLng) {
        const url = new URL(window.location.href);
        url.searchParams.set('lng', newLng);
        window.history.replaceState({}, '', url.toString());
      }
    });

    // Hydrate the React app
    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={i18n}>
          <HydratedRouter />
        </I18nextProvider>
      </StrictMode>
    );

  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback to basic initialization
    const fallbackI18n = await initI18n({ lng: 'en', resources: uiResources });
    
    // Set fallback document attributes
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    
    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={fallbackI18n}>
          <HydratedRouter />
        </I18nextProvider>
      </StrictMode>
    );
  }
});
