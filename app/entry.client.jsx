import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter, PrefetchPageLinks } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

startTransition(async () => {
  const params = new URLSearchParams(window.location.search);
  const stored = (() => { try { return localStorage.getItem('lng'); } catch { return null; } })();
  const lng = stored || params.get('lng') || document.documentElement.lang || 'en';
  const i18n = await initI18n({ lng, resources: uiResources });

  try {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    if (!stored) {
      try { localStorage.setItem('lng', i18n.language); } catch {}
      try { document.cookie = `i18next=${i18n.language}; path=/; max-age=31536000; SameSite=Lax`; } catch {}
    }
    if (!params.get('lng')) {
      const url = new URL(window.location.href);
      url.searchParams.set('lng', i18n.language);
      window.history.replaceState({}, '', url.toString());
    }
  } catch {}

  hydrateRoot(
    document,
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <PrefetchPageLinks page="/menu" />
        <HydratedRouter />
      </I18nextProvider>
    </StrictMode>
  );
});
