import TranslationService from './translation.js';

/**
 * Create an error response with translation support
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} message - Error message (translation key or plain text)
 * @param {string} type - Error type
 * @param {Object} details - Additional error details
 * @param {Object} req - Express request object (for language detection)
 * @param {Object} interpolation - Variables for translation interpolation
 * @param {string} namespace - Translation namespace (defaults to 'common')
 * @returns {Object} Express response
 */
export const createError = (res, status, message, type, details = {}, req = null, interpolation = {}, namespace = 'common') => {
  let translatedMessage = message;
  
  // If request object is available, try to translate the message
  if (req && req.t) {
    translatedMessage = req.t(message, interpolation, namespace);
  } else if (req) {
    // Fallback to TranslationService if req.t is not available
    const language = TranslationService.getCurrentLanguage(req);
    const key = namespace ? `${namespace}:${message}` : message;
    translatedMessage = TranslationService.t(key, {
      lng: language,
      interpolation
    });
  }
  
  const response = {
    status: 'error',
    error: {
      type: type || 'UNKNOWN_ERROR',
      message: translatedMessage || 'Internal server error',
      details: { ...details }, // Spread to ensure details is included
      code: status,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(status).json(response);
};

/**
 * Create a success response with translation support
 * @param {Object} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} message - Success message (translation key or plain text)
 * @param {Object} data - Response data
 * @param {Object} req - Express request object (for language detection)
 * @param {Object} interpolation - Variables for translation interpolation
 * @param {string} namespace - Translation namespace (defaults to 'common')
 * @returns {Object} Express response
 */
export const createResponse = (res, status, message, data = {}, req = null, interpolation = {}, namespace = 'common') => {
  let translatedMessage = message;
  
  // If request object is available, try to translate the message
  if (req && req.t) {
    translatedMessage = req.t(message, interpolation, namespace);
  } else if (req) {
    // Fallback to TranslationService if req.t is not available
    const language = TranslationService.getCurrentLanguage(req);
    const key = namespace ? `${namespace}:${message}` : message;
    translatedMessage = TranslationService.t(key, {
      lng: language,
      interpolation
    });
  }
  
  return res.status(status).json({
    status: 'success',
    message: translatedMessage,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Create a validation error response with translated messages
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 * @param {Object} req - Express request object
 * @returns {Object} Express response
 */
export const createValidationError = (res, errors, req = null) => {
  const translatedErrors = errors.map(error => {
    if (req && req.tValidation) {
      return {
        ...error,
        message: req.tValidation(error.type || 'invalidFormat', error.interpolation || {})
      };
    }
    return error;
  });

  return createError(res, 400, 'badRequest', 'VALIDATION_ERROR', 
    { errors: translatedErrors }, req, {}, 'common');
};

/**
 * Create an authentication error response
 * @param {Object} res - Express response object
 * @param {string} authErrorType - Authentication error type
 * @param {Object} req - Express request object
 * @param {Object} interpolation - Variables for interpolation
 * @returns {Object} Express response
 */
export const createAuthError = (res, authErrorType, req = null, interpolation = {}) => {
  let message = authErrorType;
  let statusCode = 401;

  // Map auth error types to status codes
  const statusMap = {
    'invalidCredentials': 401,
    'accountLocked': 423,
    'accountNotVerified': 403,
    'tokenExpired': 401,
    'tokenInvalid': 401,
    'accessDenied': 403,
    'sessionExpired': 401
  };

  statusCode = statusMap[authErrorType] || 401;

  if (req && req.tAuth) {
    message = req.tAuth(authErrorType, interpolation);
  }

  return createError(res, statusCode, message, 'AUTH_ERROR', {}, req);
};