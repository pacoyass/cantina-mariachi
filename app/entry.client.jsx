import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n, rtlLngs } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

/**
 * Client-side app initialization with SSR-compatible language support
 */
startTransition(async () => {
  try {
    // Get language from server-rendered HTML to prevent hydration mismatch
    const serverLang = document.documentElement.lang || 'en';
    
    // Initialize i18n with the server-provided language first
    const i18n = await initI18n({ lng: serverLang });

    // Hydrate the React app with server-provided language
    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={i18n} key={serverLang}>
          <HydratedRouter />
        </I18nextProvider>
      </StrictMode>
    );

    // After hydration, sync with client preferences
    setTimeout(async () => {
      try {
        const urlLang = new URLSearchParams(window.location.search).get('lng');
        const storedLang = localStorage.getItem('lng');
        
        // Language priority: URL > localStorage > Server
        const clientLang = urlLang || storedLang || serverLang;
        
        if (clientLang !== serverLang && i18n?.changeLanguage) {
          console.log('🌍 Client language sync:', {
            server: serverLang,
            client: clientLang,
            url: urlLang,
            stored: storedLang
          });
          
          await i18n.changeLanguage(clientLang);
          
          // Update document attributes
          document.documentElement.lang = clientLang;
          document.documentElement.dir = rtlLngs.includes(clientLang) ? 'rtl' : 'ltr';
          
          // Update localStorage if needed
          if (storedLang !== clientLang) {
            try {
              localStorage.setItem('lng', clientLang);
            } catch {}
          }
        }
        
        // Listen for language changes
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
        
      } catch (error) {
        console.warn('Failed to sync client language:', error);
      }
    }, 100); // Small delay to ensure hydration is complete

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
        <I18nextProvider i18n={fallbackI18n} key="en">
          <HydratedRouter />
        </I18nextProvider>
      </StrictMode>
    );
  }
});
