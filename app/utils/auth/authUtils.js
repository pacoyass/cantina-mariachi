// Utilities for SSR auth checking and token refresh

function base64UrlDecode(input) {
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    return Buffer.from(padded, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

export function parseJwt(token) {
  if (!token || typeof token !== 'string' || token.split('.').length < 2) return null;
  try {
    const [, payload] = token.split('.');
    const json = base64UrlDecode(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getCookieValue(cookieString, key) {
  if (!cookieString) return '';
  const parts = cookieString.split('; ').filter(Boolean);
  for (const part of parts) {
    const [name, ...rest] = part.split('=');
    if (name === key) return rest.join('=');
  }
  return '';
}

function extractCookieFromSetCookie(setCookieHeader, name) {
  if (!setCookieHeader) return '';
  // If multiple Set-Cookie headers are concatenated, split on comma followed by space and token name
  const entries = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : String(setCookieHeader).split(/,(?=[^;]+?=)/g);
  for (const entry of entries) {
    const match = String(entry).match(new RegExp(`(?:^|; )${name}=([^;]+)`));
    if (match && match[1]) return match[1];
  }
  return '';
}

export function getTokenDuration(expIso) {
  if (!expIso) return -1;
  const expirationTime = new Date(expIso).getTime();
  if (Number.isNaN(expirationTime)) return -1;
  const delta = expirationTime - Date.now();
  return delta > 0 ? delta : -1;
}

export async function refreshAccessTokenSSR(request, csrfToken) {
  const url = new URL(request.url);
  const cookies = request.headers.get('cookie') || '';
  const res = await fetch(`${url.origin}/api/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'x-csrf-token': csrfToken || '',
      cookie: cookies,
    },
    credentials: 'include',
    signal: request.signal,
  });
  return res;
}

export async function checkAuthToken(request, csrfToken) {
  const cookies = request.headers.get('cookie') || '';
  const accessToken = getCookieValue(cookies, 'accessToken');
  const refreshToken = getCookieValue(cookies, 'refreshToken');

  if (!refreshToken) {
    return { user: null, refreshExpired: true };
  }

  const accessPayload = parseJwt(accessToken);
  const refreshPayload = parseJwt(refreshToken);
  const accessExpIso = accessPayload?.exp ? new Date(accessPayload.exp * 1000).toISOString() : null;
  const refreshExpIso = refreshPayload?.exp ? new Date(refreshPayload.exp * 1000).toISOString() : null;

  const thresholdMs = 5000;
  const accessValid = accessExpIso && new Date(accessExpIso).getTime() - Date.now() > thresholdMs;
  const refreshValid = refreshExpIso && new Date(refreshExpIso).getTime() - Date.now() > 0;

  if (accessValid) {
    const user = accessPayload
      ? { id: accessPayload.userId, email: accessPayload.email, role: accessPayload.role, name: accessPayload.name, exp: accessExpIso }
      : null;
    return { user, refreshExpire: refreshExpIso };
  }

  // Try refresh if access expired/about to expire and refresh is valid
  if (!refreshValid) {
    return { user: null, refreshExpired: true };
  }

  const res = await refreshAccessTokenSSR(request, csrfToken);
  if (!res.ok) {
    return { user: null, refreshExpired: true };
  }

  // Forward Set-Cookie headers to client
  const headers = new Headers();
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) {
    // May contain multiple cookies; append as-is
    for (const entry of String(setCookie).split(/,(?=[^;]+?=)/g)) {
      headers.append('Set-Cookie', entry.trim());
    }
  }

  // Decode the newly set access token from Set-Cookie
  const newAccessToken = extractCookieFromSetCookie(setCookie, 'accessToken') || accessToken;
  const newAccessPayload = parseJwt(newAccessToken);
  const newAccessExpIso = newAccessPayload?.exp ? new Date(newAccessPayload.exp * 1000).toISOString() : accessExpIso;

  const user = newAccessPayload
    ? { id: newAccessPayload.userId, email: newAccessPayload.email, role: newAccessPayload.role, name: newAccessPayload.name, exp: newAccessExpIso }
    : null;

  return {
    user,
    refreshExpire: refreshExpIso,
    headers,
    accessToken: newAccessToken,
  };
}

