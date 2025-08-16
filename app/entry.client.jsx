import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

startTransition(async () => {
  const params = new URLSearchParams(window.location.search);
  const lng = params.get('lng') || document.documentElement.lang || 'en';
  const i18n = await initI18n({ lng, resources: uiResources });

  hydrateRoot(
    document,
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <HydratedRouter />
      </I18nextProvider>
    </StrictMode>
  );
});
