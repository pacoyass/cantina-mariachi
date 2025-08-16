import { createResponse, createError } from '../utils/response.js';
import { dispatchNotification } from '../services/notificationService.js';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { LoggerService } from '../utils/logger.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import crypto from 'node:crypto';

export const dispatch = async (req, res) => {
  try {
    const { type, target, content, provider } = req.body;
    const result = await dispatchNotification({ type, target, content, provider });
    if (!result.success) return createError(res, 502, 'notifications.notificationFailed', 'NOTIFICATION_FAILED', { error: result.error }, req, {}, 'business');
    return createResponse(res, 200, 'notifications.notificationSent', {}, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'SERVER_ERROR', {}, req);
  }
};

export const cleanupNotifications = async (retentionDays = 90, readRetentionDays = 180) => {
  const taskName = 'notifications_cleanup';
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();
  try {
    await prisma.$transaction(async (tx) => {
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logCronRun(taskName, 'SKIPPED', { reason: 'Lock held', timestamp });
        return;
      }
      try {
        const logCutoff = subDays(new Date(), retentionDays);
        const readCutoff = subDays(new Date(), readRetentionDays);
        const deletedLogs = await tx.notificationLog.deleteMany({ where: { createdAt: { lt: logCutoff } } });
        const deletedRead = await tx.notification.deleteMany({ where: { read: true, createdAt: { lt: readCutoff } } });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { deletedLogs: deletedLogs.count, deletedRead: deletedRead.count, logCutoff: logCutoff.toISOString(), readCutoff: readCutoff.toISOString(), timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'NOTIFICATIONS_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('Notifications cleanup failed', error.stack, { taskName, error: error.message, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};

export default { dispatch, cleanupNotifications };