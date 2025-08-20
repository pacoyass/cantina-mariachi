import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

/**
 * Client-side app initialization with language support
 */
startTransition(async () => {
  try {
    // Simple language detection: URL > localStorage > default
    const params = new URLSearchParams(window.location.search);
    const stored = localStorage.getItem('lng');
    const lng = params.get('lng') || stored || 'en';

    console.log('🌍 Detected language:', lng);

    // Initialize i18n
    const i18n = await initI18n({ lng, resources: uiResources });

    // Set document attributes
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';

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
