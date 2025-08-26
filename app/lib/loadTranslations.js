/**
 * Load translations from the backend API
 * @param {string} lng - Language code
 * @returns {Promise<Object>} Translation resources
 */
export async function loadTranslationsFromAPI(lng) {
  try {
    const response = await fetch(`/api/translations/${lng}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to load translations');
    }
    
    return data.data.translations;
  } catch (error) {
    console.error('Failed to load translations from API:', error);
    // Fallback to empty object - i18next will use fallback language
    return {};
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