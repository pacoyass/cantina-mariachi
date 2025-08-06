import { authService } from '../services/authService.js';
import { LoggerService } from '../utils/logger.js';
import { createResponse, createError } from '../utils/response.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../config/database.js';
import  sendWebhook  from './webhook.controller.js';

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
        const cutoffDate = toZonedTime(subDays(new Date(), 30), 'Europe/London');
        const deletedRefreshTokens = await tx.refresh_tokens.deleteMany({ where: { expiresAt: { lt: cutoffDate } } });
        const deletedBlacklistedTokens = await tx.blacklisted_tokens.deleteMany({ where: { expiresAt: { lt: cutoffDate } } });
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
    const { email, password, role, name, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10));
    const user = await authService.createUser({ email, password: hashedPassword, role, name, phone });
    await LoggerService.logAudit(user.id, 'USER_REGISTERED', user.id, { email, role, name, phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'user_registered', `User ${email} registered`, 'SENT');
    await sendWebhook('USER_REGISTERED', { userId: user.id, email, role, name, phone });
    return createResponse(res, 201, 'User registered successfully', { userId: user.id, email, role, name, phone });
  } catch (error) {
    await LoggerService.logError('Registration failed', error.stack, { email: req.body.email });
    await LoggerService.logAudit(null, 'USER_REGISTER_FAILED', null, { reason: error.message, email: req.body.email });
    return createError(res, error.message.includes('exists') ? 409 : 500, error.message, 'REGISTRATION_ERROR');
  }
};

// POST /api/auth/login - User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({
      where: { email, isActive: true },
      select: { id: true, email: true, password: true, role: true, name: true, phone: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await LoggerService.logLogin(null, 'FAILURE', req.ip, req.get('User-Agent'));
      return createError(res, 401, 'Invalid email or password', 'UNAUTHORIZED', { suggestion: 'Check your credentials or register' });
    }

    const { accessToken, refreshToken } = await authService.login(email, password);
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    const sanitizedName = user.name ? user.name.replace(/[<>]/g, '') : null;
    const getGreetingMessage = (name) => {
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
      const firstName = name ? name.split(' ')[0].charAt(0).toUpperCase() + name.split(' ')[0].slice(1).toLowerCase() : 'User';
      const funMessages = [
        'Great to see you again! 💫',
        'Access granted! 🎉',
        "You're in! Let's go! 🚀",
        'Authentication successful! 🥳',
        'Ready to roll! 🌟',
        `Welcome back, ${firstName}! 🌟`,
        `Hello, ${firstName}! Let's go! 🚀`,
        `${timeGreeting}, ${firstName}! 🌟`,
      ];
      let lastMessageIndex = -1;
      return () => {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * funMessages.length);
        } while (randomIndex === lastMessageIndex);
        lastMessageIndex = randomIndex;
        return funMessages[randomIndex];
      };
    };

    const generateLoginMessage = getGreetingMessage(sanitizedName);
    await LoggerService.logLogin(user.id, 'SUCCESS', req.ip, req.get('User-Agent'));
    await LoggerService.logAudit(user.id, 'USER_LOGIN', user.id, { email, role: user.role, phone: user.phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'user_login', `User ${email} logged in`, 'SENT');
    await sendWebhook('USER_LOGIN', { userId: user.id, email, role: user.role, phone: user.phone, loginTime: new Date().toISOString() });
    return createResponse(res, 200, generateLoginMessage(), { user: { id: user.id, email, role: user.role, name: sanitizedName, phone: user.phone }, accessToken });
  } catch (error) {
    await LoggerService.logError('Login failed', error.stack, { email: req.body.email });
    await LoggerService.logAudit(null, 'USER_LOGIN_FAILED', null, { reason: error.message, email: req.body.email });
    return createError(res, 500, 'Failed to log in', 'SERVER_ERROR', { errorId: Date.now().toString() });
  }
};

// POST /api/auth/refresh - Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (!refreshToken) {
      await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', null, { reason: 'No refresh token provided' });
      return createError(res, 401, 'Session expired. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    const { accessToken, newRefreshToken, userId } = await authService.refreshToken(refreshToken);
    const user = await prisma.users.findUnique({
      where: { id: userId, isActive: true },
      select: { id: true, email: true, role: true, name: true, phone: true },
    });

    if (!user) {
      await LoggerService.logAudit(null, 'TOKEN_REFRESH_FAILED', userId, { reason: 'User not found' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    await LoggerService.logAudit(user.id, 'TOKEN_REFRESH_SUCCESS', user.id, { email: user.email, phone: user.phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'token_refreshed', `Token refreshed for ${user.email}`, 'SENT');
    await sendWebhook('TOKEN_REFRESHED', { userId: user.id, email: user.email, phone: user.phone });
    return createResponse(res, 200, 'Token refreshed successfully', { accessToken, refreshToken: newRefreshToken });
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

    await authService.logout(accessToken);
    res.clearCookie('accessToken', { path: '/', httpOnly: true });
    res.clearCookie('refreshToken', { path: '/', httpOnly: true });

    await LoggerService.logAudit(req.user.id, 'USER_LOGOUT_SUCCESS', req.user.id, { email: req.user.email, phone: req.user.phone });
    await LoggerService.logNotification(req.user.id, 'WEBHOOK', 'user_logout', `User ${req.user.email} logged out`, 'SENT');
    await sendWebhook('USER_LOGOUT', { userId: req.user.id, email: req.user.email, phone: req.user.phone });
    return createResponse(res, 200, 'Signed out successfully', { nextSteps: 'Log in again to access your account' });
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

    const user = await authService.getUserById(req.user.id);
    if (!user) {
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', req.user.id, { reason: 'User not found' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    const tokenHash = crypto.createHash('sha256').update(accessToken).digest('hex');
    const blacklisted = await prisma.blacklisted_tokens.findFirst({
      where: { tokenHash, expiresAt: { gte: new Date() } },
    });

    if (blacklisted) {
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', user.id, { reason: 'Token is revoked' });
      return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
    }

    await LoggerService.logAudit(user.id, 'TOKEN_VALIDATE_SUCCESS', user.id, { email: user.email, phone: user.phone });
    await LoggerService.logNotification(user.id, 'WEBHOOK', 'token_validated', `Token validated for ${user.email}`, 'SENT');
    await sendWebhook('TOKEN_VALIDATED', { userId: user.id, email: user.email, phone: user.phone });
    return createResponse(res, 200, 'Session is active', { user: { id: user.id, email: user.email, role: user.role, name: user.name, phone: user.phone } });
  } catch (error) {
    await LoggerService.logError('Token validation failed', error.stack, { userId: req.user?.id });
    await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', null, { reason: error.message });
    return createError(res, 401, 'Session invalid. Please log in again', 'UNAUTHORIZED', { suggestion: 'Navigate to the login page' });
  }
};