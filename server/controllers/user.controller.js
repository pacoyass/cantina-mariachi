// server/controllers/user.controller.js
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { createError, createResponse } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';
import { databaseService } from '../services/databaseService.js';
import { sendWebhook } from './webhook.controller.js';
import { USER_DATA_RETENTION_DAYS } from '../config/retention.js';

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined && v !== null));
}

export const getMe = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }
    const user = await databaseService.getUserById(req.user.userId, { password: false });
    return createResponse(res, 200, 'Profile fetched', { user: sanitizeUser(user) });
  } catch (error) {
    await LoggerService.logError('getMe failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to fetch profile', 'SERVER_ERROR');
  }
};

export const updateMe = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }
    const { name, phone } = req.body || {};
    const updated = await databaseService.updateUser(req.user.userId, { name, phone });

    await LoggerService.logAudit(req.user.userId, 'USER_UPDATE_PROFILE', req.user.userId, { name, phone });
    return createResponse(res, 200, 'Profile updated', { user: sanitizeUser(updated) });
  } catch (error) {
    await LoggerService.logError('updateMe failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to update profile', 'SERVER_ERROR');
  }
};

export const changePassword = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return createError(res, 401, 'Unauthorized', 'UNAUTHORIZED');
    }
    const { currentPassword, newPassword } = req.body || {};
    const user = await databaseService.getUserById(req.user.userId, { password: true });

    const matches = await bcrypt.compare(currentPassword || '', user.password);
    if (!matches) {
      await LoggerService.logAudit(req.user.userId, 'USER_CHANGE_PASSWORD_DENY', req.user.userId, { reason: 'Invalid current password' });
      return createError(res, 400, 'Invalid current password', 'INVALID_PASSWORD');
    }

    const hashed = await bcrypt.hash(newPassword, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10));
    await databaseService.updateUser(req.user.userId, { password: hashed });

    await LoggerService.logAudit(req.user.userId, 'USER_CHANGE_PASSWORD', req.user.userId, {});
    return createResponse(res, 200, 'Password updated successfully', {});
  } catch (error) {
    await LoggerService.logError('changePassword failed', error.stack, { userId: req.user?.userId });
    return createError(res, 500, 'Failed to change password', 'SERVER_ERROR');
  }
};

/**
 * Cleanup user-related data using cron-safe locking, similar to cleanupExpiredAuthData.
 * - Deletes stale logs beyond retentionDays
 * - Deletes user preferences for users soft-deleted beyond retention
 * - Optionally hard-deletes users soft-deleted beyond retention with no blocking relations
 */
export const cleanupUserData = async (retentionDays = USER_DATA_RETENTION_DAYS) => {
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const taskName = 'user_cleanup';
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();
  let totals = {
    activityLogs: 0,
    loginLogs: 0,
    notificationLogs: 0,
    errorLogs: 0,
    auditLogs: 0,
    systemLogs: 0,
    userPreferences: 0,
    usersHardDeleted: 0,
  };
  let errors = [];

  try {
    await prisma.$transaction(async (tx) => {
      await LoggerService.logSystemEvent('user_cleanup', 'ATTEMPT_CLEANUP', { instanceId, timestamp });
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logAudit(null, 'USER_CLEANUP_SKIPPED', null, { reason: 'Lock acquisition failed', instanceId });
        await LoggerService.logCronRun(taskName, 'SKIPPED', { reason: 'Lock acquisition failed', instanceId, timestamp });
        return;
      }

      try {
        const cutoff = toZonedTime(subDays(new Date(), retentionDays), 'Europe/London');

        // Delete old logs
        const a = await tx.activityLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
        const l = await tx.loginLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
        const n = await tx.notificationLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
        const e = await tx.errorLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
        const s = await tx.systemLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
        const au = await tx.auditLog.deleteMany({ where: { createdAt: { lt: cutoff } } });

        totals.activityLogs = a.count;
        totals.loginLogs = l.count;
        totals.notificationLogs = n.count;
        totals.errorLogs = e.count;
        totals.systemLogs = s.count;
        totals.auditLogs = au.count;

        // Remove user preferences for users soft-deleted before cutoff
        const deletedPrefs = await tx.userPreference.deleteMany({
          where: {
            user: {
              deletedAt: { lte: cutoff },
            },
          },
        });
        totals.userPreferences = deletedPrefs.count;

        // Optionally: hard-delete users soft-deleted beyond retention
        // Only delete users with no orders/reservations to avoid FK issues
        const oldUsers = await tx.user.findMany({
          where: { deletedAt: { lte: cutoff } },
          select: { id: true },
        });

        for (const u of oldUsers) {
          const ordersCount = await tx.order.count({ where: { userId: u.id } });
          const reservationsCount = await tx.reservation.count({ where: { userId: u.id } });
          if (ordersCount === 0 && reservationsCount === 0) {
            await tx.user.delete({ where: { id: u.id } });
            totals.usersHardDeleted += 1;
          }
        }

        const totalDeleted =
          totals.activityLogs +
          totals.loginLogs +
          totals.notificationLogs +
          totals.errorLogs +
          totals.systemLogs +
          totals.auditLogs +
          totals.userPreferences +
          totals.usersHardDeleted;

        const details = { instanceId, retentionDays, cutoff: cutoff.toISOString(), totals, timestamp };

        await LoggerService.logAudit(null, 'USER_CLEANUP_SUCCESS', null, details);
        await LoggerService.logNotification(null, 'WEBHOOK', 'user_cleanup', `User data cleanup completed (${totalDeleted} records)`, 'SENT');
        await sendWebhook('USER_CLEANUP_SUCCESS', details);
        await LoggerService.logCronRun(taskName, 'SUCCESS', details);
      } catch (error) {
        errors.push({ type: 'CLEANUP_ERROR', message: error.message, stack: error.stack });
        await LoggerService.logError('User cleanup failed', error.stack, { instanceId, error: error.message });
        await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, instanceId, errors: errors.length, timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'USER_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('User cleanup failed', error.stack, { instanceId, error: error.message });
    await LoggerService.logAudit(null, 'USER_CLEANUP_FAILED', null, { reason: error.message, instanceId });
    await LoggerService.logNotification(null, 'WEBHOOK', 'user_cleanup_failed', error.message, 'FAILED');
    await sendWebhook('USER_CLEANUP_FAILED', { reason: error.message, instanceId, timestamp: toZonedTime(new Date(), 'Europe/London').toISOString() });
    await LoggerService.logCronRun('user_cleanup', 'FAILED', { error: error.message, instanceId, errors: errors.length });
  }
};

export default { getMe, updateMe, changePassword, cleanupUserData };