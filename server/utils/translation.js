// import i18nPromise from '../config/i18n.js';

// /**
//  * Translation utility class for backend operations
//  */
// export class TranslationService {
  
//   /**
//    * Get translation for a key with optional interpolation
//    * @param {string} key - Translation key (can include namespace like 'auth:loginSuccess')
//    * @param {Object} options - Translation options
//    * @param {string} options.lng - Language code (defaults to 'en')
//    * @param {Object} options.interpolation - Variables for interpolation
//    * @param {string} options.ns - Namespace (if not included in key)
//    * @returns {string} Translated string
//    */
//   static async t(key, options = {}) {
//     const { lng = 'en', interpolation = {}, ns } = options;
    
//     try {
//       const i18n = await i18nPromise;
//       return i18n.t(key, {
//         lng,
//         ns,
//         ...interpolation
//       });
//     } catch (error) {
//       console.warn(`Translation warning: Could not translate key "${key}" for language "${lng}"`);
//       return key; // Return the key itself as fallback
//     }
//   }

//   /**
//    * Get translation based on request language
//    * @param {Object} req - Express request object
//    * @param {string} key - Translation key
//    * @param {Object} interpolation - Variables for interpolation
//    * @param {string} namespace - Namespace (optional)
//    * @returns {string} Translated string
//    */
//   static async tReq(req, key, interpolation = {}, namespace = null) {
//     const language = req.language || req.lng || 'en';
    
//     return await this.t(key, {
//       lng: language,
//       interpolation,
//       ns: namespace
//     });
//   }

//   /**
//    * Get multiple translations at once
//    * @param {Array<string>} keys - Array of translation keys
//    * @param {Object} options - Translation options
//    * @returns {Object} Object with keys as properties and translations as values
//    */
//   static async tMultiple(keys, options = {}) {
//     const result = {};
    
//     for (const key of keys) {
//       result[key] = await this.t(key, options);
//     }
    
//     return result;
//   }

//   /**
//    * Get translation for common API responses
//    * @param {string} type - Response type ('success', 'error', 'created', etc.)
//    * @param {string} language - Language code
//    * @param {Object} interpolation - Variables for interpolation
//    * @returns {string} Translated message
//    */
//   static async tResponse(type, language = 'en', interpolation = {}) {
//     return await this.t(`common:${type}`, {
//       lng: language,
//       interpolation
//     });
//   }

//   /**
//    * Get translation for validation errors
//    * @param {string} validationType - Validation type ('required', 'email', etc.)
//    * @param {string} language - Language code
//    * @param {Object} interpolation - Variables for interpolation (field, min, max, etc.)
//    * @returns {string} Translated validation message
//    */
//   static async tValidation(validationType, language = 'en', interpolation = {}) {
//     return await this.t(`validation:${validationType}`, {
//       lng: language,
//       interpolation
//     });
//   }

//   /**
//    * Get translation for authentication messages
//    * @param {string} authType - Auth message type ('loginSuccess', 'invalidCredentials', etc.)
//    * @param {string} language - Language code
//    * @param {Object} interpolation - Variables for interpolation
//    * @returns {string} Translated auth message
//    */
//   static async tAuth(authType, language = 'en', interpolation = {}) {
//     return await this.t(`auth:${authType}`, {
//       lng: language,
//       interpolation
//     });
//   }

//   /**
//    * Get translation for email templates
//    * @param {string} emailType - Email template type
//    * @param {string} language - Language code
//    * @param {Object} interpolation - Variables for interpolation
//    * @returns {string} Translated email content
//    */
//   static async tEmail(emailType, language = 'en', interpolation = {}) {
//     return await this.t(`email:${emailType}`, {
//       lng: language,
//       interpolation
//     });
//   }

//   /**
//    * Check if a translation exists for a key
//    * @param {string} key - Translation key
//    * @param {string} language - Language code
//    * @returns {boolean} True if translation exists
//    */
//   static async exists(key, language = 'en') {
//     try {
//       const i18n = await i18nPromise;
//       return i18n.exists(key, { lng: language });
//     } catch (error) {
//       return false;
//     }
//   }

//   /**
//    * Get available languages
//    * @returns {Array<string>} Array of supported language codes
//    */
//   static async getSupportedLanguages() {
//     try {
//       const i18n = await i18nPromise;
//       return i18n.options.supportedLngs || ['en'];
//     } catch (error) {
//       return ['en'];
//     }
//   }

//   /**
//    * Get current language from request
//    * @param {Object} req - Express request object
//    * @returns {string} Current language code
//    */
//   static getCurrentLanguage(req) {
//     return req.language || req.lng || 'en';
//   }

//   /**
//    * Format error message with translation
//    * @param {Object} req - Express request object
//    * @param {string} errorKey - Error translation key
//    * @param {Object} interpolation - Variables for interpolation
//    * @param {string} namespace - Namespace (defaults to 'common')
//    * @returns {string} Formatted error message
//    */
//   static async formatError(req, errorKey, interpolation = {}, namespace = 'common') {
//     const language = this.getCurrentLanguage(req);
//     const key = namespace ? `${namespace}:${errorKey}` : errorKey;
    
//     return await this.t(key, {
//       lng: language,
//       interpolation
//     });
//   }
// }

// /**
//  * Middleware to add translation helpers to request object
//  */
// export const addTranslationHelpers = (req, res, next) => {
//   // Add translation method to request (async)
//   req.t = async (key, interpolation = {}, namespace = null) => {
//     return await TranslationService.tReq(req, key, interpolation, namespace);
//   };

//   // Add specific helper methods (async)
//   req.tAuth = async (key, interpolation = {}) => {
//     return await TranslationService.tAuth(key, TranslationService.getCurrentLanguage(req), interpolation);
//   };

//   req.tValidation = async (key, interpolation = {}) => {
//     return await TranslationService.tValidation(key, TranslationService.getCurrentLanguage(req), interpolation);
//   };

//   req.tResponse = async (key, interpolation = {}) => {
//     return await TranslationService.tResponse(key, TranslationService.getCurrentLanguage(req), interpolation);
//   };

//   next();
// };

// export default TranslationService;



import i18nPromise from '../config/i18n.js';

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
  static async t(key, options = {}) {
    const { lng = 'en', interpolation = {}, ns } = options;
    
    try {
      const i18n = await i18nPromise;
      return i18n.t(key, {
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
  static async tReq(req, key, interpolation = {}, namespace = null) {
    const language = req.language || req.lng || 'en';
    
    return await this.t(key, {
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
  static async tMultiple(keys, options = {}) {
    const result = {};
    
    for (const key of keys) {
      result[key] = await this.t(key, options);
    }
    
    return result;
  }

  /**
   * Get translation for common API responses
   * @param {string} type - Response type ('success', 'error', 'created', etc.)
   * @param {string} language - Language code
   * @param {Object} interpolation - Variables for interpolation
   * @returns {string} Translated message
   */
  static async tResponse(type, language = 'en', interpolation = {}) {
    return await this.t(`common:${type}`, {
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
  static async tValidation(validationType, language = 'en', interpolation = {}) {
    return await this.t(`validation:${validationType}`, {
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
  static async tAuth(authType, language = 'en', interpolation = {}) {
    return await this.t(`auth:${authType}`, {
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
  static async tEmail(emailType, language = 'en', interpolation = {}) {
    return await this.t(`email:${emailType}`, {
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
  static async exists(key, language = 'en') {
    try {
      const i18n = await i18nPromise;
      return i18n.exists(key, { lng: language });
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available languages
   * @returns {Array<string>} Array of supported language codes
   */
  static async getSupportedLanguages() {
    try {
      const i18n = await i18nPromise;
      return i18n.options.supportedLngs || ['en'];
    } catch (error) {
      return ['en'];
    }
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
  static async formatError(req, errorKey, interpolation = {}, namespace = 'common') {
    const language = this.getCurrentLanguage(req);
    const key = namespace ? `${namespace}:${errorKey}` : errorKey;
    
    return await this.t(key, {
      lng: language,
      interpolation
    });
  }
}

/**
 * Middleware to add translation helpers to request object
 */
export const addTranslationHelpers = (req, res, next) => {
  // If i18next middleware already attached a synchronous req.t, keep it.
  const hasI18nextT = typeof req.t === 'function';

  // Provide a safe, synchronous req.t fallback only if not present.
  if (!hasI18nextT) {
    req.t = (key, interpolation = {}, namespace = null) => {
      // Fallback: return the key (optionally prefixed with namespace) to avoid async in response builders
      const k = namespace ? `${namespace}:${key}` : key;
      return k;
    };
  }

  // Add specific helper methods; prefer existing synchronous req.t when available
  req.tAuth = (key, interpolation = {}) => {
    if (typeof req.t === 'function') return req.t(`auth:${key}`, interpolation);
    return `auth:${key}`;
  };

  req.tValidation = (key, interpolation = {}) => {
    if (typeof req.t === 'function') return req.t(`validation:${key}`, interpolation);
    return `validation:${key}`;
  };

  req.tResponse = (key, interpolation = {}) => {
    if (typeof req.t === 'function') return req.t(`common:${key}`, interpolation);
    return `common:${key}`;
  };

  next();
};

export default TranslationService;