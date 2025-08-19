import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';
import { rtlLngs } from '../i18n.config.js';
import { useTranslation } from 'react-i18next';

startTransition(async () => {
  const params = new URLSearchParams(window.location.search);
  const stored = (() => { try { return localStorage.getItem('lng'); } catch { return null; } })();
  
  // Check if server has restarted by looking for server timestamp
  const serverTimestamp = document.querySelector('meta[name="server-start-time"]')?.content;
  const lastServerRestart = localStorage.getItem('lastServerRestart');
  
  // If server has restarted, reset language to default
  if (serverTimestamp && serverTimestamp !== lastServerRestart) {
    localStorage.removeItem('lng');
    localStorage.setItem('lastServerRestart', serverTimestamp);
    // Clear i18next cookie
    try { document.cookie = 'i18next=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'; } catch {}
  }
  
  const lng = params.get('lng') || stored || document.documentElement.lang || 'en';
  const i18n = await initI18n({ lng, resources: uiResources });

  try {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = rtlLngs.includes(i18n.language) ? 'rtl' : 'ltr';
    try { localStorage.setItem('lng', i18n.language); } catch {}
    try { document.cookie = `i18next=${i18n.language}; path=/; max-age=31536000; SameSite=Lax`; } catch {}
    if (!params.get('lng')) {
      const url = new URL(window.location.href);
      url.searchParams.set('lng', i18n.language);
      window.history.replaceState({}, '', url.toString());
    }
  } catch {}

  // Simple test component to verify translations work
  const TestApp = () => {
    const { t } = useTranslation('home');
    
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Translation Test</h1>
        <p className="mb-2">Current Language: {i18n.language}</p>
        <p className="mb-4">Hero Title: {t('hero.title')}</p>
        <p className="mb-4">CTA Title: {t('cta.title')}</p>
        <button 
          onClick={() => i18n.changeLanguage('es')}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          Switch to Spanish
        </button>
        <button 
          onClick={() => i18n.changeLanguage('fr')}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          Switch to French
        </button>
        <button 
          onClick={() => i18n.changeLanguage('en')}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Switch to English
        </button>
      </div>
    );
  };

  hydrateRoot(
    document,
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <TestApp />
      </I18nextProvider>
    </StrictMode>
  );
});
