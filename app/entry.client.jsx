import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';
import { rtlLngs } from '../i18n.config.js';

// Very simple test component without hooks
const TestApp = ({ i18n }) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Translation Test</h1>
      <p className="mb-2">Current Language: {i18n.language}</p>
      <p className="mb-4">Hero Title: {i18n.t('hero.title', { ns: 'home' })}</p>
      <p className="mb-4">CTA Title: {i18n.t('cta.title', { ns: 'home' })}</p>
      <p className="mb-4">Spanish CTA: {i18n.t('cta.title', { ns: 'home', lng: 'es' })}</p>
      <p className="mb-4">French CTA: {i18n.t('cta.title', { ns: 'home', lng: 'fr' })}</p>
      <p className="mb-4">Portuguese CTA: {i18n.t('cta.title', { ns: 'home', lng: 'pt' })}</p>
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
        onClick={() => i18n.changeLanguage('pt')}
        className="px-4 py-2 bg-purple-500 text-white rounded mr-2"
      >
        Switch to Portuguese
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

startTransition(async () => {
  try {
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
    console.log('Initializing i18n with language:', lng);
    
    const i18n = await initI18n({ lng, resources: uiResources });
    console.log('i18n initialized:', i18n);

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
    } catch (error) {
      console.error('Error setting language:', error);
    }

    console.log('Rendering app...');
    hydrateRoot(
      document,
      <StrictMode>
        <I18nextProvider i18n={i18n}>
          <TestApp i18n={i18n} />
        </I18nextProvider>
      </StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error in app initialization:', error);
    document.getElementById('root').innerHTML = `
      <div class="p-8">
        <h1 class="text-3xl font-bold mb-4 text-red-600">Error Loading App</h1>
        <p class="mb-2">There was an error loading the React app:</p>
        <pre class="bg-gray-100 p-4 rounded">${error.message}</pre>
        <p class="mt-4">Check the browser console for more details.</p>
      </div>
    `;
  }
});
