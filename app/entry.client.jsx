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

    // Set document attributes IMMEDIATELY to prevent flash
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';

    // Initialize i18n with the detected language
    const i18n = await initI18n({ lng, resources: uiResources });

    // Ensure the language is actually set correctly
    if (i18n.language !== lng) {
      console.log(`🔄 Correcting i18n language from ${i18n.language} to ${lng}`);
      await i18n.changeLanguage(lng);
    }

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
