/**
 * Load translations from the backend API
 * @param {string} lng - Language code
 * @returns {Promise<Object>} Translation resources
 */
export async function loadTranslationsFromAPI(lng) {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Create timeout signal (polyfill for older browsers)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`/api/translations/${lng}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to load translations');
      }
      
      console.log(`✅ Successfully loaded translations for ${lng} (attempt ${attempt})`);
      return data.data.translations;
      
    } catch (error) {
      console.warn(`⚠️ Attempt ${attempt}/${maxRetries} failed to load translations for ${lng}:`, error.message);
      
      if (attempt === maxRetries) {
        console.error(`❌ All ${maxRetries} attempts failed to load translations for ${lng}`);
        throw error; // Re-throw the last error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
    }
  }
}

/**
 * Load a specific namespace from the backend API
 * @param {string} lng - Language code
 * @param {string} ns - Namespace
 * @returns {Promise<Object>} Translation namespace
 */
export async function loadNamespaceFromAPI(lng, ns) {
  try {
    const response = await fetch(`/api/translations/${lng}/${ns}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to load namespace');
    }
    
    return data.data.translations;
  } catch (error) {
    console.error(`Failed to load namespace ${ns} from API:`, error);
    // Fallback to empty object
    return {};
  }
}