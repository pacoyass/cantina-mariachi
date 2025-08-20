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
  // Simple language detection with priority: URL > localStorage > default
  const params = new URLSearchParams(window.location.search);
  const stored = localStorage.getItem('lng');
  const lng = params.get('lng') || stored || 'en';

  // Initialize i18n with the detected language
  const i18n = await initI18n({ lng, resources: uiResources });

  // Update preferences and document attributes
  try {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    if (!stored) localStorage.setItem('lng', i18n.language);
    if (!params.get('lng')) {
      const url = new URL(window.location.href);
      url.searchParams.set('lng', i18n.language);
      window.history.replaceState({}, '', url.toString());
    }
  } catch {}

  // Hydrate the React app with i18n support
  hydrateRoot(
    document,
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <HydratedRouter />
      </HydratedRouter>
    </StrictMode>
  );
});