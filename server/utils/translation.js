import i18next from '../config/i18n.js';

/**
 * Translation utility class for backend operations
 */
export class TranslationService {
  
  /**
   * Get translation for a key with optional interpolation
   * @param {string} key - Translation key (can include namespace like 'auth:loginSuccess')
   * @param {Object} options - Translation options
   * @param {string} options.lng - Language code (defaults to 'en')
   * @param {Object} options.interpolation - Variables for interpolation
   * @param {string} options.ns - Namespace (if not included in key)
   * @returns {string} Translated string
   */
  static t(key, options = {}) {
    const { lng = 'en', interpolation = {}, ns } = options;
    
    try {
      return i18next.t(key, {
        lng,
        ns,
        ...interpolation
      });
    } catch (error) {
      console.warn(`Translation warning: Could not translate key "${key}" for language "${lng}"`);
      return key; // Return the key itself as fallback
    }
  }

  /**
   * Get translation based on request language
   * @param {Object} req - Express request object
   * @param {string} key - Translation key
   * @param {Object} interpolation - Variables for interpolation
   * @param {string} namespace - Namespace (optional)
   * @returns {string} Translated string
   */
  static tReq(req, key, interpolation = {}, namespace = null) {
    const language = req.language || req.lng || 'en';
    
    return this.t(key, {
      lng: language,
      interpolation,
      ns: namespace
    });
  }

  /**
   * Get multiple translations at once
   * @param {Array<string>} keys - Array of translation keys
   * @param {Object} options - Translation options
   * @returns {Object} Object with keys as properties and translations as values
   */
  static tMultiple(keys, options = {}) {
    const result = {};
    
    keys.forEach(key => {
      result[key] = this.t(key, options);
    });
    
    return result;
  }

  /**
   * Get translation for common API responses
   * @param {string} type - Response type ('success', 'error', 'created', etc.)
   * @param {string} language - Language code
   * @param {Object} interpolation - Variables for interpolation
   * @returns {string} Translated message
   */
  static tResponse(type, language = 'en', interpolation = {}) {
    return this.t(`common:${type}`, {
      lng: language,
      interpolation
    });
  }

  /**
   * Get translation for validation errors
   * @param {string} validationType - Validation type ('required', 'email', etc.)
   * @param {string} language - Language code
   * @param {Object} interpolation - Variables for interpolation (field, min, max, etc.)
   * @returns {string} Translated validation message
   */
  static tValidation(validationType, language = 'en', interpolation = {}) {
    return this.t(`validation:${validationType}`, {
      lng: language,
      interpolation
    });
  }

  /**
   * Get translation for authentication messages
   * @param {string} authType - Auth message type ('loginSuccess', 'invalidCredentials', etc.)
   * @param {string} language - Language code
   * @param {Object} interpolation - Variables for interpolation
   * @returns {string} Translated auth message
   */
  static tAuth(authType, language = 'en', interpolation = {}) {
    return this.t(`auth:${authType}`, {
      lng: language,
      interpolation
    });
  }

  /**
   * Get translation for email templates
   * @param {string} emailType - Email template type
   * @param {string} language - Language code
   * @param {Object} interpolation - Variables for interpolation
   * @returns {string} Translated email content
   */
  static tEmail(emailType, language = 'en', interpolation = {}) {
    return this.t(`email:${emailType}`, {
      lng: language,
      interpolation
    });
  }

  /**
   * Check if a translation exists for a key
   * @param {string} key - Translation key
   * @param {string} language - Language code
   * @returns {boolean} True if translation exists
   */
  static exists(key, language = 'en') {
    return i18next.exists(key, { lng: language });
  }

  /**
   * Get available languages
   * @returns {Array<string>} Array of supported language codes
   */
  static getSupportedLanguages() {
    return i18next.options.supportedLngs || ['en'];
  }

  /**
   * Get current language from request
   * @param {Object} req - Express request object
   * @returns {string} Current language code
   */
  static getCurrentLanguage(req) {
    return req.language || req.lng || 'en';
  }

  /**
   * Format error message with translation
   * @param {Object} req - Express request object
   * @param {string} errorKey - Error translation key
   * @param {Object} interpolation - Variables for interpolation
   * @param {string} namespace - Namespace (defaults to 'common')
   * @returns {string} Formatted error message
   */
  static formatError(req, errorKey, interpolation = {}, namespace = 'common') {
    const language = this.getCurrentLanguage(req);
    const key = namespace ? `${namespace}:${errorKey}` : errorKey;
    
    return this.t(key, {
      lng: language,
      interpolation
    });
  }
}

/**
 * Middleware to add translation helpers to request object
 */
export const addTranslationHelpers = (req, res, next) => {
  // Add translation method to request
  req.t = (key, interpolation = {}, namespace = null) => {
    return TranslationService.tReq(req, key, interpolation, namespace);
  };

  // Add specific helper methods
  req.tAuth = (key, interpolation = {}) => {
    return TranslationService.tAuth(key, TranslationService.getCurrentLanguage(req), interpolation);
  };

  req.tValidation = (key, interpolation = {}) => {
    return TranslationService.tValidation(key, TranslationService.getCurrentLanguage(req), interpolation);
  };

  req.tResponse = (key, interpolation = {}) => {
    return TranslationService.tResponse(key, TranslationService.getCurrentLanguage(req), interpolation);
  };

  next();
};

export default TranslationService;