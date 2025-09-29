// Utility to normalize API errors into user-friendly, translated messages
// Shape expected from server: { status, error: { type, typeKey, message, details, code } }

/**
 * Normalize API error for display
 * @param {unknown} apiError - Error object or string returned from API/login action
 * @param {(key: string, defaultValue?: string) => string} translate - i18n translate function (already scoped to needed ns)
 * @returns {{ title: string, description?: string, variant: 'destructive' | 'warning' | 'success' | 'default' }}
 */
export function normalizeApiError(apiError, translate) {
  const fallback = {
    title: safeTranslate(translate, 'auth:loginFailed', 'Login failed'),
    description: undefined,
    variant: 'destructive',
  };

  // Handle plain strings
  if (typeof apiError === 'string') {
    return {
      ...fallback,
      description: apiError,
    };
  }

  // Handle typical fetch/Action errors that wrap response json
  const maybe = apiError && typeof apiError === 'object' ? apiError : null;
  if (!maybe) return fallback;

  // Unwrap common shapes
  const errObj =
    // React Router actions often return { error: {...} }
    (maybe.error && typeof maybe.error === 'object' ? maybe.error : null) ||
    // Direct server payload already at top-level
    (maybe.status && maybe.error ? maybe.error : null) ||
    // Unknown shape – attempt to use as-is
    maybe;

  const typeKey = (errObj.typeKey || errObj.type || '').toString().toUpperCase();
  const code = Number(errObj.code || maybe.code || 0);
  const rawMessage = toStringSafe(errObj.message || maybe.message);
  const detailMessage = toStringSafe(errObj.details?.message);
  const suggestion = toStringSafe(errObj.details?.suggestion);

  // Map common auth conditions to translation keys
  const mapped = mapAuthKey({ typeKey, code, rawMessage, detailMessage });

  const titleKey = mapped || 'auth:loginFailed';
  const description = suggestion || detailMessage || rawMessage || undefined;

  return {
    title: safeTranslate(translate, titleKey, 'Login failed'),
    description,
    variant: deriveVariant(code, typeKey),
  };
}

function mapAuthKey({ typeKey, code, rawMessage, detailMessage }) {
  const message = `${rawMessage} ${detailMessage}`.toLowerCase();

  // Unauthorized / invalid credentials
  if (code === 401 || /unauthor/i.test(typeKey) || /invalid\s*credentials/i.test(message) || /password|user not found/i.test(message)) {
    return 'auth:invalidCredentials';
  }

  if (/account[_\s-]?locked/i.test(typeKey) || /locked/i.test(message)) {
    return 'auth:accountLocked';
  }

  if (/not[_\s-]?verified/i.test(typeKey) || /verify/i.test(message)) {
    return 'auth:accountNotVerified';
  }

  if (/token[_\s-]?expired/i.test(typeKey) || /expired/i.test(message)) {
    return 'auth:tokenExpired';
  }

  if (/token[_\s-]?invalid/i.test(typeKey) || /invalid token/i.test(message)) {
    return 'auth:tokenInvalid';
  }

  if (code === 403 || /access[_\s-]?denied/i.test(typeKey)) {
    return 'auth:accessDenied';
  }

  if (/session[_\s-]?expired/i.test(typeKey)) {
    return 'auth:sessionExpired';
  }

  return null;
}

function deriveVariant(code, typeKey) {
  if (code === 401 || code === 403 || /unauth|denied|invalid/i.test(typeKey)) return 'destructive';
  return 'warning';
}

function toStringSafe(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function safeTranslate(t, key, fallback) {
  try {
    const res = t(key);
    return typeof res === 'string' ? res : fallback;
  } catch {
    return fallback;
  }
}

