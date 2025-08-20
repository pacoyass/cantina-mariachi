import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { I18nextProvider } from 'react-i18next';
import { initI18n } from './lib/i18n.js';
import { uiResources } from './lib/resources.js';

startTransition(async () => {
  // Improved language detection with better priority order
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lng');
  
  // Get stored language preference
  let storedLang = null;
  try {
    storedLang = localStorage.getItem('lng');
  } catch {}
  
  // Get language from cookie
  let cookieLang = null;
  try {
    const cookieMatch = document.cookie.match(/(?:^|; )i18next=([^;]+)/);
    if (cookieMatch) {
      cookieLang = decodeURIComponent(cookieMatch[1]);
    }
  } catch {}
  
  // Get language from document
  const docLang = document.documentElement.lang;
  
  // Priority order: URL > Stored > Cookie > Document > Default
  const lng = urlLang || storedLang || cookieLang || docLang || 'en';
  
  console.log('🌍 Language detection:', {
    url: urlLang,
    stored: storedLang,
    cookie: cookieLang,
    document: docLang,
    selected: lng
  });

  // Set document attributes BEFORE i18n initialization to prevent flash
  try {
    document.documentElement.lang = lng;
    
    // Set RTL direction based on language
    const isRTL = ['ar', 'he', 'fa'].includes(lng);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  } catch (error) {
    console.warn('Failed to set initial document attributes:', error);
  }

  // Initialize i18n with the detected language
  const i18n = await initI18n({ lng, resources: uiResources });

  try {
    // Update stored preferences if not already set
    if (!storedLang) {
      try { 
        localStorage.setItem('lng', i18n.language); 
      } catch {}
    }
    
    // Set cookie if not already set
    if (!cookieLang) {
      try { 
        document.cookie = `i18next=${i18n.language}; path=/; max-age=31536000; SameSite=Lax`; 
      } catch {}
    }
    
    // Update URL if no language parameter
    if (!urlLang) {
      const url = new URL(window.location.href);
      url.searchParams.set('lng', i18n.language);
      window.history.replaceState({}, '', url.toString());
    }
  } catch (error) {
    console.warn('Failed to update language preferences:', error);
  }

  hydrateRoot(
    document,
    <StrictMode>
      <I18nextProvider i18n={i18n}>
        <HydratedRouter />
      </I18nextProvider>
    </StrictMode>
  );
});
