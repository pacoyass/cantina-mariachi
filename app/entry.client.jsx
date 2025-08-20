import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

/**
 * Client-side app initialization with language support
 * Handles language detection, i18n setup, and app hydration
 */
startTransition(async () => {
  // Block rendering until language is properly set
  const loadingDiv = document.createElement('div');
  loadingDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #ffffff;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  loadingDiv.innerHTML = '<div>Loading language preferences...</div>';
  document.body.appendChild(loadingDiv);

  try {
    // Simple language detection with priority: URL > localStorage > default
    const params = new URLSearchParams(window.location.search);
    const stored = localStorage.getItem('lng');
    const lng = params.get('lng') || stored || 'en';

    console.log('🌍 Detected language:', lng);

    // Set document attributes BEFORE i18n initialization
    document.documentElement.lang = lng;
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';

    // Initialize i18n with the detected language
    const i18n = await initI18n({ lng, resources: uiResources });

    // Verify language is correct
    if (i18n.language !== lng) {
      console.warn(`Language mismatch: expected ${lng}, got ${i18n.language}`);
      await i18n.changeLanguage(lng);
    }

    // Update preferences only if needed
    if (!stored) {
      try {
        localStorage.setItem('lng', i18n.language);
      } catch {}
    }

    if (!params.get('lng')) {
      const url = new URL(window.location.href);
      url.searchParams.set('lng', i18n.language);
      window.history.replaceState({}, '', url.toString());
    }

    // Remove loading screen
    document.body.removeChild(loadingDiv);

    // Hydrate the React app with i18n support
    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={i18n}>
          <HydratedRouter />
        </HydratedRouter>
      </StrictMode>
    );

  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Remove loading screen
    document.body.removeChild(loadingDiv);
    
    // Fallback to basic initialization
    const fallbackI18n = await initI18n({ lng: 'en', resources: uiResources });
    
    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={fallbackI18n}>
          <HydratedRouter />
        </HydratedRouter>
      </StrictMode>
    );
  }
});
