import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { rtlLngs } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

/**
 * Client-side app initialization with SSR-compatible language support
 */
startTransition(async () => {
  try {
    // Get language from various sources (React Router loader data is handled in root.jsx)
    const urlLang = new URLSearchParams(window.location.search).get('lng');
    const storedLang = localStorage.getItem('lng');
    // Note: Server sets httpOnly cookies, so we can't read them from client
    // We'll rely on URL, localStorage, and server context instead
    
    // Language priority: URL > localStorage > Default
    // Note: Server language is accessed through React Router loader in root.jsx
    const lng = urlLang || storedLang || 'en';
    
    console.log('🌍 Client language detection:', {
      url: urlLang,
      stored: storedLang,
      final: lng,
      note: 'Server cookies are httpOnly and not accessible from client'
    });

    // Set document attributes immediately to prevent flash
    document.documentElement.lang = lng;
    document.documentElement.dir = rtlLngs.includes(lng) ? 'rtl' : 'ltr';

    // Initialize i18n with the detected language
    // Let it try to load from API first, then fallback to hardcoded resources
    const i18n = await initI18n({ lng });

    // Ensure the language is actually set correctly
    if (i18n.language !== lng) {
      console.log(`🔄 Correcting i18n language from ${i18n.language} to ${lng}`);
      await i18n.changeLanguage(lng);
    }

    // Update localStorage if needed
    if (storedLang !== lng) {
      try {
        localStorage.setItem('lng', lng);
      } catch {}
    }
    
    // Note: Server handles cookie updates automatically via httpOnly cookies
    // No need to manually set cookies on the client side

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
    const fallbackI18n = await initI18n({ lng: 'en', resources: uiResources.en });
    
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
