import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n, rtlLngs } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';
import { loadTranslationsFromAPI } from './lib/loadTranslations.js';

startTransition(async () => {
  try {
    // Use server-rendered language for initial hydration to prevent mismatch
    const serverLang = document.documentElement.lang || 'en';
    // Hydrate with the exact same resources used on the server to avoid mismatch
    const i18n = await initI18n({ lng: serverLang, resources: uiResources[serverLang] || uiResources.en });
    
    hydrateRoot(document, <StrictMode><I18nextProvider i18n={i18n} key={serverLang}><HydratedRouter /></I18nextProvider></StrictMode>);
    
    // Defer client-side language sync to after hydration
    setTimeout(async () => {
      try {
        const urlLang = new URLSearchParams(window.location.search).get('lng');
        const storedLang = localStorage.getItem('lng');
        const clientLang = urlLang || storedLang || serverLang;
        
        // Merge server translations after hydration to enrich resources without breaking keys used by SSR
        try {
          const apiTranslations = await loadTranslationsFromAPI(clientLang);
          if (apiTranslations && typeof apiTranslations === 'object') {
            for (const [ns, nsRes] of Object.entries(apiTranslations)) {
              i18n.addResourceBundle(clientLang, ns, nsRes, true, true);
            }
          }
        } catch (e) {
          console.warn('Failed to load/merge API translations post-hydration:', e);
        }

        if (clientLang !== serverLang && i18n?.changeLanguage) {
          console.log('🌍 Client language sync:', { server: serverLang, client: clientLang });
          await i18n.changeLanguage(clientLang);
          document.documentElement.lang = clientLang;
          document.documentElement.dir = rtlLngs.includes(clientLang) ? 'rtl' : 'ltr';
          if (storedLang !== clientLang) {
            try { localStorage.setItem('lng', clientLang); } catch {}
          }
        }
        
        i18n.on('languageChanged', (newLng) => {
          document.documentElement.lang = newLng;
          document.documentElement.dir = rtlLngs.includes(newLng) ? 'rtl' : 'ltr';
          const currentUrlLang = new URLSearchParams(window.location.search).get('lng');
          if (currentUrlLang !== newLng) {
            const url = new URL(window.location.href);
            url.searchParams.set('lng', newLng);
            window.history.replaceState({}, '', url.toString());
          }
        });
      } catch (error) {
        console.warn('Failed to sync client language:', error);
      }
    }, 100);
    
  } catch (error) {
    console.error('Failed to initialize app:', error);
    const fallbackI18n = await initI18n({ lng: 'en', resources: uiResources.en });
    hydrateRoot(document, <StrictMode><I18nextProvider i18n={fallbackI18n} key="en"><HydratedRouter /></I18nextProvider></StrictMode>);
  }
});
