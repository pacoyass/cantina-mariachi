import { createResponse, createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import crypto from 'node:crypto';

export const postEvent = async (req, res) => {
  try {
    const { event, props = {}, variant } = req.body || {};
    if (!event || typeof event !== 'string' || event.length > 64) {
      return createError(res, 400, 'validationError', 'INVALID_EVENT', {}, req);
    }
    const meta = { ip: req.ip, ua: req.headers['user-agent'] || null };
    await LoggerService.logSystemEvent('Analytics', 'EVENT', { event, props, variant, meta });
    return createResponse(res, 204, 'ok', {}, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const cleanupAnalyticsLogs = async (retentionDays = Number(process.env.ANALYTICS_RETENTION_DAYS || '90')) => {
  const taskName = 'analytics_cleanup';
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
        const cutoff = subDays(new Date(), retentionDays);
        const deleted = await tx.systemLog.deleteMany({ where: { source: 'Analytics', createdAt: { lt: cutoff } } });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { retentionDays, deleted: deleted.count, cutoff: cutoff.toISOString(), timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'ANALYTICS_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('Analytics cleanup failed', error.stack, { taskName, error: error.message, retentionDays, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, retentionDays, timestamp });
    throw error;
  }
};

export default { postEvent, cleanupAnalyticsLogs };