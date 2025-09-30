import { generateToken, hashToken, verifyToken } from '../services/authService.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import {createError,createResponse}  from '../utils/response.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';
import cacheService from '../services/cacheService.js';
import { databaseService } from '../services/databaseService.js';
import { sendWebhook } from './webhook.controller.js';
import { AUTH_DATA_RETENTION_DAYS } from '../config/retention.js';
 
// Cleanup expired authentication data (refresh tokens, blacklisted tokens)
export const cleanupExpiredAuthData = async () => {
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  let totalDeleted = 0;
  let errors = [];

  try {
    await prisma.$transaction(async (tx) => {
      await LoggerService.logSystemEvent('auth_cleanup', 'ATTEMPT_CLEANUP', { instanceId, timestamp: toZonedTime(new Date(), 'Europe/London').toISOString() });
      const locked = await acquireLock(tx, 'auth_cleanup', instanceId);
      if (!locked) {
        await LoggerService.logAudit(null, 'AUTH_CLEANUP_SKIPPED', null, { reason: 'Lock acquisition failed', instanceId });
        await LoggerService.logCronRun('auth_cleanup', 'SKIPPED', { reason: 'Lock acquisition failed', instanceId });
        return;
      }

      try {
        const cutoffDate = toZonedTime(subDays(new Date(), AUTH_DATA_RETENTION_DAYS), 'Europe/London');
        const deletedRefreshTokens = await tx.refreshToken.deleteMany({ where: { expiresAt: { lt: cutoffDate } } });
        const deletedBlacklistedTokens = await tx.blacklistedToken.deleteMany({ where: { expiresAt: { lt: cutoffDate } } });
        totalDeleted = deletedRefreshTokens.count + deletedBlacklistedTokens.count;

        if (totalDeleted === 0) {
          await LoggerService.logAudit(null, 'AUTH_CLEANUP_SUCCESS', null, {
            deletedCount: 0,
            reason: 'No authentication data to delete',
            instanceId,
            timestamp: cutoffDate.toISOString(),
          });
          await LoggerService.logNotification(null, 'WEBHOOK', 'auth_cleanup', 'No authentication data deleted', 'SENT');
          await sendWebhook('AUTH_CLEANUP_SUCCESS', {
            deletedCount: 0,
            reason: 'No authentication data to delete',
            instanceId,
            timestamp: cutoffDate.toISOString(),
          });
          await LoggerService.logCronRun('auth_cleanup', 'SUCCESS', {
            totalDeleted: 0,
            errorCount: 0,
            instanceId,
            cutoffDate: cutoffDate.toISOString(),
            deletedRefreshTokens: 0,
            deletedBlacklistedTokens: 0,
          });
          return;
        }

        await LoggerService.logAudit(null, 'AUTH_CLEANUP_SUCCESS', null, {
          deletedCount: totalDeleted,
          deletedRefreshTokens: deletedRefreshTokens.count,
          deletedBlacklistedTokens: deletedBlacklistedTokens.count,
          instanceId,
          timestamp: cutoffDate.toISOString(),
        });
        await LoggerService.logNotification(null, 'WEBHOOK', 'auth_cleanup', `Deleted ${totalDeleted} auth records`, 'SENT');
        await sendWebhook('AUTH_CLEANUP_SUCCESS', {
          deletedCount: totalDeleted,
          deletedRefreshTokens: deletedRefreshTokens.count,
          deletedBlacklistedTokens: deletedBlacklistedTokens.count,
          instanceId,
          timestamp: cutoffDate.toISOString(),
        });
        await LoggerService.logCronRun('auth_cleanup', 'SUCCESS', {
          totalDeleted,
          errorCount: 0,
          instanceId,
          cutoffDate: cutoffDate.toISOString(),
          deletedRefreshTokens: deletedRefreshTokens.count,
          deletedBlacklistedTokens: deletedBlacklistedTokens.count,
        });
      } catch (error) {
        errors.push({ error: { type: 'CLEANUP_ERROR', message: error.message, stack: error.stack } });
        await LoggerService.logError('Auth cleanup failed', error.stack, { instanceId, error: error.message });
        await LoggerService.logCronRun('auth_cleanup', 'FAILED', { error: error.message, instanceId, errors: errors.length });
      } finally {
        await releaseLock(tx, 'auth_cleanup');
        await LoggerService.logAudit(null, 'AUTH_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp: toZonedTime(new Date(), 'Europe/London').toISOString() });
      }
    });
  } catch (error) {
    await LoggerService.logError('Auth cleanup failed', error.stack, { instanceId, error: error.message });
    await LoggerService.logAudit(null, 'AUTH_CLEANUP_FAILED', null, { reason: error.message, instanceId });
    await LoggerService.logNotification(null, 'WEBHOOK', 'auth_cleanup_failed', error.message, 'FAILED');
    await sendWebhook('AUTH_CLEANUP_FAILED', { reason: error.message, instanceId, timestamp: toZonedTime(new Date(), 'Europe/London').toISOString() });
    await LoggerService.logCronRun('auth_cleanup', 'FAILED', { error: error.message, instanceId, errors: errors.length });
  }
};

// POST /api/auth/register - User registration
export const register = async (req, res) => {
  try {
    if (!req.body || !req.body.email || !req.body.password || !req.body.name) {
      return createError(res, 400, 'badRequest', 'INVALID_INPUT', {
        fields: ['email', 'password', 'name'],
      });
    }
    const { email, password, role, name, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10));
    const user = await databaseService.createUser({email, password: hashedPassword, role, name, phone });
    
    await LoggerService.logAudit(user.id, 'USER_REGISTERED', user.id, { email, role, name, phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'user_registered', `User ${email} registered`, 'SENT');
    await sendWebhook('USER_REGISTERED', { userId: user.id, email, role, name, phone });
    return createResponse(res, 201, 'registerSuccess', { data:user }, req, {}, 'auth');
  } catch (error) {
    await LoggerService.logError('Authentication error in refreshToken', error.stack, {
      method: 'refreshToken',
      error: error.message,
      context: req.body
    });
    
    await LoggerService.logError('Registration failed', error.stack, { email: req.body.email });
    await LoggerService.logAudit(null, 'USER_REGISTER_FAILED', null, { reason: error.message, email: req.body.email });
    return createError(
      res,
      error.code === 'P2002' || error.message.includes('already exists') ? 409 : 500,
      error.message,
      error.code === 'P2002' || error.message.includes('already exists') ? 'CONFLICT' : 'REGISTRATION_ERROR',
      error.code === 'P2002' || error.message.includes('already exists')
        ? { field: 'email', suggestion: 'Try logging in or use a different email' }
        : {}
    );
  }
};

// POST /api/auth/login - User login
export const login = async (req, res) => {
  
  const { email, password } = req.body || {};
  const userAgent = req.get('User-Agent') || null;
const ip = req.ip || null;


  if (!email || !password) {
    await LoggerService.logLogin(null, 'FAILURE', ip, userAgent);
    return createError(res, 400, 'badRequest', 'BAD_REQUEST', {}, req, {}, 'auth');
  }

  // Check rate-limiting
  let attempts = 0;
  try {
    attempts = (await cacheService.get(`login-attempts:${email}`)) || 0;
    if (attempts >= 5) {
      await LoggerService.logLogin(null, 'FAILURE', ip, userAgent);
      return createError(res, 429, 'Too many login attempts', 'RATE_LIMIT_EXCEEDED', {
        suggestion: 'Try again in a minute',
      });
    }
  } catch (cacheErr) {
    await LoggerService.logError('Cache error during login attempt tracking', cacheErr.stack, { email, error: cacheErr.message });
    await LoggerService.logSystemEvent('auth.controller', 'CACHE_SERVICE_UNAVAILABLE', {
      method: 'refreshToken',
      message: 'Cache service unavailable, skipping rate-limiting'
    });
  }

  // Fetch user
  let user;
  try {
    user = await databaseService.getUserByEmail(email, { isActive: true });
  } catch (err) {
    await cacheService.increment(`login-attempts:${email}`, { EX: 60 });
    await LoggerService.logLogin(null, 'FAILURE', ip, userAgent);
    return createError(res, 401, 'Invalid email or password', 'UNAUTHORIZED', {
      message: err.message === 'User not found' ? 'User not found' : 'Database error',
      suggestion: 'Check your credentials or register',
    });
  }

  // Verify password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    await cacheService.increment(`login-attempts:${email}`, { EX: 60 });
    await LoggerService.logLogin(null, 'FAILURE', ip, userAgent);
    return createError(res, 401, 'Invalid email or password', 'UNAUTHORIZED', {
      suggestion: 'Check your credentials or register',
    });
  }

  // Generate tokens
  let accessToken, refreshToken, refreshExp;
  try {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      active: user.isActive,
      phone: user.phone,
    };
    ({ token: accessToken } = await generateToken(payload, process.env.TOKEN_EXPIRATION || '15m'));
    ({ token: refreshToken, exp: refreshExp } = await generateToken(payload, process.env.REFRESH_TOKEN_EXPIRATION || '7d'));
    const hashedRefreshToken = await hashToken(refreshToken);
    await databaseService.refreshUserTokens(user.id, hashedRefreshToken, new Date(refreshExp), undefined, { userAgent, ip });
  } catch (authErr) {
    await LoggerService.logError('Token generation/storage failed', authErr.stack, { email, error: authErr.message });
    return createError(res, 500, 'Failed to generate tokens', 'AUTH_ERROR', {}, req, {}, 'auth');
  }

  // Set cookies
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000,
    path: '/',
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });

  // Sanitize name for response
  const sanitizedName = user.name ? user.name.replace(/[<>]/g, '') : null;

  // Generate dynamic welcome message (translated)
  const getGreetingMessage = (name) => {
    const hour = new Date().getHours();
    const firstName = name ? name.split(' ')[0].charAt(0).toUpperCase() + name.split(' ')[0].slice(1).toLowerCase() : 'User';
    const timeOfDayKey = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const candidates = [
      `greeting:${timeOfDayKey}`,
      'greeting:welcomeBackName',
      'greeting:helloName',
      'greeting:accessGranted',
      'greeting:authSuccess',
      'greeting:ready'
    ];
    let lastIndex = -1;
    return () => {
      let idx;
      do {
        idx = Math.floor(Math.random() * candidates.length);
      } while (idx === lastIndex);
      lastIndex = idx;
      const key = candidates[idx];
      try {
        if (req && typeof req.t === 'function') {
          const translated = req.t(key, { ns: 'auth', name: firstName });
          if (translated && typeof translated === 'string') return translated;
        }
      } catch {}
      // Fallback to English format if translation not available
      if (key.includes('morning')) return `Good morning, ${firstName}! 🌟`;
      if (key.includes('afternoon')) return `Good afternoon, ${firstName}! 🌟`;
      if (key.includes('evening')) return `Good evening, ${firstName}! 🌟`;
      if (key.includes('welcomeBackName')) return `Welcome back, ${firstName}! 🌟`;
      if (key.includes('helloName')) return `Hello, ${firstName}! Let's go! 🚀`;
      if (key.includes('accessGranted')) return 'Access granted! 🎉';
      if (key.includes('authSuccess')) return 'Authentication successful! 🥳';
      return 'Ready to roll! 🌟';
    };
  };

  const generateLoginMessage = getGreetingMessage(sanitizedName);

  // Log success and reset attempts
  await cacheService.set(`login-attempts:${email}`, 0);
  await LoggerService.logLogin(user.id, 'SUCCESS', ip, userAgent);
  await LoggerService.logAudit(user.id, 'USER_LOGIN', user.id, { email, role: user.role, phone: user.phone });
  await LoggerService.logNotification(user.id, 'WEBHOOK', 'user_login', `User ${email} logged in`, 'SENT');
  await sendWebhook('USER_LOGIN', { userId: user.id, email, role: user.role, phone: user.phone, loginTime: new Date().toISOString() });

  return createResponse(res, 200, 'loginSuccess', {
    greeting: generateLoginMessage(),
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: sanitizedName,
      phone: user.phone,
    },
  }, req, {}, 'auth');
};

// POST /api/auth/refresh - Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const userAgent = req.get('User-Agent') || null;
const ip = req.ip || null;
    const rotate = (process.env.REFRESH_ROTATION || 'true').toLowerCase() === 'true';
    const providedRefreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!providedRefreshToken) {
      await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', null, { reason: 'No refresh token provided' });
      return createError(res, 401, 'Session expired. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    // Verify provided refresh token
    const payload = await verifyToken(providedRefreshToken);

    if (!rotate) {
      const accessPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        name: payload.name,
        active: payload.active,
        phone: payload.phone,
      };
      const { token: accessToken } = await generateToken(accessPayload, process.env.TOKEN_EXPIRATION || '15m');
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 15 * 60 * 1000,
        path: '/',
      });
      return createResponse(res, 200, 'loginSuccess', { accessToken }, req, {}, 'auth');
    }
    // Ensure stored hash exists (rotate only if valid current token)
    const providedTokenHash = await hashToken(providedRefreshToken);
    const stored = await databaseService.getRefreshToken(providedTokenHash);
    if (!stored || stored.expiresAt < new Date()) {
      await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', payload.userId, { reason: 'Refresh token not recognized or expired' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', {}, req, {}, 'auth');
    }

    // Fetch user
    const user = await databaseService.getUserById(payload.userId, { id: true, email: true, role: true, name: true, phone: true, isActive: true });
    if (!user) {
      await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', payload.userId, { reason: 'User not found' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', {}, req, {}, 'auth');
    }

    // Issue new tokens (rotate refresh)
    const accessPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      active: user.isActive,
      phone: user.phone,
    };
    const { token: accessToken } = await generateToken(accessPayload, process.env.TOKEN_EXPIRATION || '15m');
    const { token: newRefreshToken, exp: newRefreshExp } = await generateToken(accessPayload, process.env.REFRESH_TOKEN_EXPIRATION || '7d');

    // Store new refresh token hash (replaces previous)
    const newHashedRefresh = await hashToken(newRefreshToken);
    await databaseService.refreshUserTokens(user.id, newHashedRefresh, newRefreshExp, undefined, { userAgent, ip });

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    await LoggerService.logAudit(user.id, 'TOKEN_REFRESH_SUCCESS', user.id, { email: user.email, phone: user.phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'token_refreshed', `Token refreshed for ${user.email}`, 'SENT');
    await sendWebhook('TOKEN_REFRESHED', { userId: user.id, email: user.email, phone: user.phone });
    return createResponse(res, 200, 'loginSuccess', { accessToken }, req, {}, 'auth');
  } catch (error) {
    await LoggerService.logError('Token refresh failed', error.stack, { userId: req.user?.id });
    await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', null, { reason: error.message });
    return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
  }
};

// POST /api/auth/logout - User logout
export const logout = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
    if (!accessToken) {
      await LoggerService.logAudit(null, 'USER_LOGOUT_FAILED', null, { reason: 'Missing access token' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    await databaseService.logout(accessToken);
    res.clearCookie('accessToken', { path: '/', httpOnly: true });
    res.clearCookie('refreshToken', { path: '/', httpOnly: true });

    await LoggerService.logAudit(req.user.userId, 'USER_LOGOUT_SUCCESS', req.user.userId, { email: req.user.email });
    await LoggerService.logNotification(req.user.userId, 'WEBHOOK', 'user_logout', `User ${req.user.email} logged out`, 'SENT');
    await sendWebhook('USER_LOGOUT', { userId: req.user.userId, email: req.user.email });
    return createResponse(res, 200, 'logoutSuccess', { nextSteps: 'Log in again to access your account' }, req, {}, 'auth');
  } catch (error) {
    await LoggerService.logError('Logout failed', error.stack, { userId: req.user?.id });
    await LoggerService.logAudit(null, 'USER_LOGOUT_FAILED', null, { reason: error.message });
    return createError(res, 500, 'Failed to log out', 'SERVER_ERROR', { errorId: Date.now().toString() });
  }
};

// GET /api/auth/token - Validate token
export const getToken = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken || !refreshToken) {
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', null, { reason: 'Missing session tokens' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    const user = await databaseService.getUserById(req.user.userId);
    if (!user) {
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', req.user.id, { reason: 'User not found' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    const tokenHash = await hashToken(accessToken);
    const blacklisted = await databaseService.findBlacklistedToken(tokenHash, { expiresAt: { gte: new Date() } });

    if (blacklisted) {
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', user.id, { reason: 'Token is revoked' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    await LoggerService.logAudit(user.id, 'TOKEN_VALIDATE_SUCCESS', user.id, { email: user.email, phone: user.phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'token_validated', `Token validated for ${user.email}`, 'SENT');
    await sendWebhook('TOKEN_VALIDATED', { userId: user.id, email: user.email, phone: user.phone });
    return createResponse(res, 200, 'loginSuccess', { user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone } }, req, {}, 'auth');
  } catch (error) {
    await LoggerService.logError('Token validation failed', error.stack, { userId: req.user?.id });
    await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', null, { reason: error.message });
    return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
  }
};


// List current user's refresh tokens (sessions)
export const listSessions = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED', {}, req, {}, 'auth');
    }
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '20', 10), 1), 100);
    const tokens = await databaseService.listRefreshTokensByUser(req.user.userId, { page, pageSize });
    const hasMore = tokens.length === pageSize;
    return createResponse(res, 200, 'dataRetrieved', { sessions: tokens.map(t => ({ id: t.id, expiresAt: t.expiresAt, userAgent: t.userAgent, ip: t.ip })), page, pageSize, hasMore }, req, {}, 'api');
  } catch (error) {
    await LoggerService.logError('listSessions failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to fetch sessions', 'SERVER_ERROR', {}, req, {}, 'auth');
  }
};

// Logout all sessions: delete all refresh tokens for user and blacklist current access token
export const logoutAllSessions = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED', {}, req, {}, 'auth');
    }
    // Blacklist current access token if present
    const accessToken = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;
    if (accessToken) {
      await databaseService.logout(accessToken);
    }

    const count = await databaseService.deleteAllRefreshTokensForUser(req.user.userId);
    res.clearCookie('accessToken', { path: '/', httpOnly: true });
    res.clearCookie('refreshToken', { path: '/', httpOnly: true });

    await LoggerService.logAudit(req.user.userId, 'USER_LOGOUT_ALL_SESSIONS', req.user.userId, { deletedTokens: count });
    return createResponse(res, 200, 'logoutSuccess', { deletedTokens: count }, req, {}, 'auth');
  } catch (error) {
    await LoggerService.logError('logoutAllSessions failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to logout from all sessions', 'SERVER_ERROR', {}, req, {}, 'auth');
  }
};

// Logout other sessions: delete all refresh tokens except the current one (from provided cookie)
export const logoutOtherSessions = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED', {}, req, {}, 'auth');
    }
    const currentRefresh = req.cookies.refreshToken || req.body.refreshToken;
    if (!currentRefresh) {
      return createError(res, 400, 'Current refresh token required', 'BAD_REQUEST', {}, req, {}, 'auth');
    }
    const keepHash = await hashToken(currentRefresh);
    const count = await databaseService.deleteOtherRefreshTokensForUser(req.user.userId, keepHash);

    await LoggerService.logAudit(req.user.userId, 'USER_LOGOUT_OTHER_SESSIONS', req.user.userId, { deletedTokens: count });
    return createResponse(res, 200, 'logoutSuccess', { deletedTokens: count }, req, {}, 'auth');
  } catch (error) {
    await LoggerService.logError('logoutOtherSessions failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to logout other sessions', 'SERVER_ERROR', {}, req, {}, 'auth');
  }
};

// Revoke a specific session (refresh token) by id
export const revokeSessionById = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED', {}, req, {}, 'auth');
    }
    const sessionId = req.params.id;
    const result = await prisma.refreshToken.deleteMany({ where: { id: sessionId, userId: req.user.userId } });
    return createResponse(res, 200, 'logoutSuccess', { deleted: result.count }, req, {}, 'auth');
  } catch (error) {
    await LoggerService.logError('revokeSessionById failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to revoke session', 'SERVER_ERROR', {}, req, {}, 'auth');
  }
};