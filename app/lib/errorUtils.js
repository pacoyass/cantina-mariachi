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
  const retryAfterSec = toNumberSafe(errObj.details?.retryAfter);

  // Map common auth conditions to translation keys
  const mapped = mapAuthKey({ typeKey, code, rawMessage, detailMessage });

  const titleKey = mapped || 'auth:loginFailed';
  // Prefer showing both detail (e.g., "User not found") and suggestion if available
  const descriptionParts = [];
  if (detailMessage) {
    const translatedDetail = translateDetail(detailMessage, translate);
    descriptionParts.push(translatedDetail);
  }
  if (suggestion) {
    const translatedSuggestion = translateSuggestion(suggestion, translate);
    descriptionParts.push(translatedSuggestion);
  }
  if (Number.isFinite(retryAfterSec) && retryAfterSec > 0) {
    descriptionParts.push(formatRetryAfter(translate, retryAfterSec));
  }
  // Also include raw message (translated) when available and not redundant
  if (rawMessage) {
    const translatedRaw = translateRaw(rawMessage, translate);
    if (!descriptionParts.some(p => equalsIgnoreCase(p, translatedRaw))) {
      descriptionParts.unshift(translatedRaw);
    }
  }
  if (descriptionParts.length === 0 && rawMessage) descriptionParts.push(rawMessage);
  const description = descriptionParts.length ? descriptionParts.join(' — ') : undefined;

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

  // Rate limit
  if (
    code === 429 ||
    /rate[_\s-]?limit/i.test(typeKey) ||
    /rate[_\s-]?limited/i.test(typeKey) ||
    /too many (requests|attempts)/i.test(message)
  ) {
    return 'auth:tooManyAttempts';
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
  if (code === 429 || /rate[_\s-]?limit/i.test(typeKey)) return 'warning';
  return 'warning';
}

function translateDetail(detail, t) {
  const d = (detail || '').toLowerCase();
  if (/user\s+not\s+found/.test(d)) {
    return safeTranslate(t, 'auth:userNotFound', 'User not found');
  }
  if (/account\s+locked/.test(d)) {
    return safeTranslate(t, 'auth:accountLocked', 'Account is locked');
  }
  if (/not\s+verified/.test(d)) {
    return safeTranslate(t, 'auth:accountNotVerified', 'Account is not verified');
  }
  if (/too\s+many\s+login\s+attempts/.test(d)) {
    return safeTranslate(t, 'auth:tooManyAttempts', 'Too many login attempts');
  }
  return detail;
}

function translateSuggestion(suggestion, t) {
  const s = (suggestion || '').toLowerCase();
  if (/check\s+your\s+credentials/.test(s) && /register/.test(s)) {
    // Compose using existing keys when available
    const partA = safeTranslate(t, 'auth:invalidCredentials', 'Invalid credentials');
    const partB = safeTranslate(t, 'auth:registerSuccess', 'Register');
    // Fallback to the original suggestion if composition isn't ideal
    return suggestion || `${partA}. ${partB}`;
  }
  if (/try\s+again\s+in\s+a?\s*minute/.test(s) || /try\s+again\s+later/.test(s)) {
    return safeTranslate(t, 'auth:tryAgainLater', 'Try again later');
  }
  return suggestion;
}

function translateRaw(message, t) {
  const m = (message || '').toLowerCase();
  if (/invalid\s+password/.test(m)) {
    return safeTranslate(t, 'auth:invalidPassword', 'Invalid password');
  }
  if (/invalid\s+email\s+or\s+password/.test(m)) {
    return safeTranslate(t, 'auth:invalidCredentials', 'Invalid credentials');
  }
  if (/invalid\s+email/.test(m)) {
    return safeTranslate(t, 'auth:invalidCredentials', 'Invalid credentials');
  }
  if (/too\s+many\s+login\s+attempts|too\s+many\s+requests/.test(m)) {
    return safeTranslate(t, 'auth:tooManyAttempts', 'Too many attempts');
  }
  return message;
}

function equalsIgnoreCase(a, b) {
  if (!a || !b) return false;
  return String(a).toLowerCase() === String(b).toLowerCase();
}

function formatRetryAfter(t, seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 1 && secs === 0) {
    return safeTranslate(t, 'auth:retryAfterMinutes', `Try again in ${mins} minute${mins === 1 ? '' : 's'}`);
  }
  if (mins >= 1 && secs > 0) {
    return safeTranslate(
      t,
      'auth:retryAfterMinutesSeconds',
      `Try again in ${mins}m ${secs}s`
    );
  }
  return safeTranslate(t, 'auth:retryAfterSeconds', `Try again in ${secs}s`);
}

function toNumberSafe(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
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

