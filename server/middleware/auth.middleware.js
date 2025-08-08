import { verifyToken, isTokenBlacklisted, blacklistToken } from '../services/authService.js';
import { LoggerService } from '../utils/logger.js';
import { createError } from '../utils/response.js';
import webhookController from '../controllers/webhook.controller.js';
import { databaseService } from '../services/databaseService.js';

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken || (
      req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null
    );

    if (!token) {
      await LoggerService.logError('No token provided', null, {
        method: 'authMiddleware',
        userId: req.user?.userId || 'unknown',
      });
      await LoggerService.logAudit(null, 'AUTH_TOKEN_MISSING', null, {
        reason: 'No token provided',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      await webhookController.sendWebhook('AUTH_TOKEN_MISSING', {
        reason: 'No token provided',
        userId: req.user?.userId || 'unknown',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      return createError(res, 401, 'Unauthorized: No token provided', 'AUTH_TOKEN_MISSING');
    }

    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      await LoggerService.logError('Token is revoked', null, {
        method: 'authMiddleware',
        userId: req.user?.userId || 'unknown',
      });
      await LoggerService.logAudit(null, 'TOKEN_VALIDATE_FAILED', null, {
        reason: 'Token is revoked',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      await webhookController.sendWebhook('TOKEN_VALIDATE_FAILED', {
        reason: 'Token is revoked',
        userId: req.user?.userId || 'unknown',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      return createError(res, 401, 'Token is revoked. Please log in again.', 'TOKEN_REVOKED', { blacklisted });
    }

    const payload = await verifyToken(token);
    const user = await databaseService.getUserById(payload.userId, { id: true,
      email: true,
      role: true,});

   

    if (!user) {
      await LoggerService.logError('User not found', null, {
        method: 'authMiddleware',
        userId: payload.userId,
      });
      await LoggerService.logAudit(payload.userId, 'USER_NOT_FOUND', null, {
        reason: 'User not found for token',
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      await webhookController.sendWebhook('USER_NOT_FOUND', {
        reason: 'User not found for token',
        userId: payload.userId,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      return createError(res, 401, 'Unauthorized: User not found', 'USER_NOT_FOUND');
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: user.role,
      exp: payload.exp,
      iat: new Date(payload.iat),
    };

    await LoggerService.logSystemEvent('authMiddleware', 'TOKEN_VERIFIED_SUCCESS', {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    await LoggerService.logAudit(req.user.userId, 'TOKEN_VERIFIED_SUCCESS', null, {
      email: req.user.email,
      role: req.user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    await webhookController.sendWebhook('TOKEN_VERIFIED', {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    next();
  } catch (error) {
    let token = req.cookies?.accessToken || (
      req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split(' ')[1]
        : null
    );

    if (error.message.includes('Token has expired')) {
      try {
        if (!token) {
          await LoggerService.logError('No token provided', null, {
            method: 'authMiddleware',
            userId: req.user?.userId || 'unknown',
          });
          await LoggerService.logAudit(null, 'AUTH_TOKEN_MISSING', null, {
            reason: 'No token provided for expired token check',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
          await webhookController.sendWebhook('AUTH_TOKEN_MISSING', {
            reason: 'No token provided for expired token check',
            userId: req.user?.userId || 'unknown',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
          return createError(res, 401, 'Unauthorized: No token provided', 'AUTH_TOKEN_MISSING');
        }

        let isAlreadyBlacklisted = await isTokenBlacklisted(token);
        if (!isAlreadyBlacklisted) {
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Blacklist for 24 hours
          const result = await blacklistToken(token, expiresAt);

          await LoggerService.logSystemEvent('authMiddleware', 'TOKEN_BLACKLISTED_AND_REVOKED_SUCCESS', {
            userId: req.user?.userId || 'unknown',
            tokenHash: result.tokenHash,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
          await LoggerService.logAudit(null, 'TOKEN_BLACKLISTED_AND_REVOKED_SUCCESS', null, {
            reason: 'Token has expired and was blacklisted',
            tokenHash: result.tokenHash,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
          await webhookController.sendWebhook('TOKEN_BLACKLISTED_AND_REVOKED_SUCCESS', {
            reason: 'Token has expired and was blacklisted',
            userId: req.user?.userId || 'unknown',
            tokenHash: result.tokenHash,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
        } else {
          await LoggerService.logSystemEvent('authMiddleware', 'TOKEN_ALREADY_BLACKLISTED', {
            userId: req.user?.userId || 'unknown',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
          await LoggerService.logAudit(null, 'TOKEN_ALREADY_BLACKLISTED', null, {
            reason: 'Token already blacklisted',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
          await webhookController.sendWebhook('TOKEN_ALREADY_BLACKLISTED', {
            reason: 'Token already blacklisted',
            userId: req.user?.userId || 'unknown',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
          });
        }

        return createError(res, 401, 'Token expired. Please log in again.', 'TOKEN_EXPIRED');
      } catch (blacklistError) {
        await LoggerService.logError('Failed to blacklist expired token', blacklistError.stack, {
          method: 'authMiddleware',
          userId: req.user?.userId || 'unknown',
          error: blacklistError.message,
        });
        await LoggerService.logAudit(null, 'TOKEN_BLACKLIST_FAILED', null, {
          reason: 'Failed to blacklist expired token',
          error: blacklistError.message,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
        await webhookController.sendWebhook('TOKEN_BLACKLIST_FAILED', {
          reason: 'Failed to blacklist expired token',
          userId: req.user?.userId || 'unknown',
          error: blacklistError.message,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
        return createError(res, 401, 'Token expired and could not be blacklisted. Please log in again.', 'TOKEN_BLACKLIST_FAILED', { error: blacklistError.message });
      }
    }

    await LoggerService.logError(error.message, error.stack, {
      method: 'authMiddleware',
      userId: req.user?.userId || 'unknown',
      token,
    });
    await LoggerService.logAudit(null, 'TOKEN_VERIFY_FAILED', null, {
      reason: error.message || 'Invalid token',
      token,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    await webhookController.sendWebhook('TOKEN_VERIFY_FAILED', {
      reason: error.message || 'Invalid token',
      userId: req.user?.userId || 'unknown',
      token,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });

    return createError(res, 401, 'Unauthorized: Invalid token', 'TOKEN_INVALID', { error: error.message });
  }
};

export default authMiddleware;