// server/middleware/rbac.middleware.js
import { createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';

export const requireRole = (...allowedRoles) => async (req, res, next) => {
  try {
    if (!req.user) {
      await LoggerService.logAudit(null, 'RBAC_DENY', null, {
        reason: 'Missing authenticated user on request',
        route: req.originalUrl,
        method: req.method,
      });
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const userRole = String(req.user.role || '').toUpperCase();
    const allowed = allowedRoles.map((r) => String(r || '').toUpperCase());

    if (!allowed.length || allowed.includes(userRole)) {
      return next();
    }

    await LoggerService.logAudit(req.user.userId || null, 'RBAC_DENY', null, {
      reason: 'User role not permitted',
      requiredRoles: allowed,
      userRole,
      route: req.originalUrl,
      method: req.method,
    });
    return createError(res, 403, 'Forbidden', 'FORBIDDEN', {
      requiredRoles: allowedRoles,
      role: req.user.role,
    });
  } catch (error) {
    await LoggerService.logError('RBAC middleware error', error.stack, {
      route: req.originalUrl,
      method: req.method,
    });
    return createError(res, 500, 'Internal server error', 'RBAC_ERROR');
  }
};

export const requireSelfOrRole = (userIdParamKey = 'id', roles = []) => async (req, res, next) => {
  try {
    if (!req.user) {
      await LoggerService.logAudit(null, 'RBAC_DENY', null, {
        reason: 'Missing authenticated user on request',
        route: req.originalUrl,
        method: req.method,
      });
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }

    const targetId = req.params?.[userIdParamKey] || req.body?.[userIdParamKey] || req.query?.[userIdParamKey];
    if (targetId && String(targetId) === String(req.user.userId)) {
      return next();
    }

    return requireRole(...roles)(req, res, next);
  } catch (error) {
    await LoggerService.logError('RBAC self-or-role middleware error', error.stack, {
      route: req.originalUrl,
      method: req.method,
    });
    return createError(res, 500, 'Internal server error', 'RBAC_ERROR');
  }
};

export default requireRole;