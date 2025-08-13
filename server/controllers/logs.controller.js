import { databaseService } from '../services/databaseService.js';
import { createResponse, createError } from '../utils/response.js';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { LoggerService } from '../utils/logger.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import crypto from 'node:crypto';

/**
 * GET /api/logs/activity
 * Requires ADMIN/OWNER. Uses validated and normalized req.validatedQuery.
 */
export const getActivityLogs = async (req, res) => {
  try {
    const { page, pageSize, start, end, type } = req.validatedQuery || {};
    const logs = await databaseService.getActivityLogs(type, start, end, { page, pageSize });
    return createResponse(res, 200, 'Activity logs fetched', { logs, page, pageSize, hasMore: logs.length === pageSize });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch activity logs', 'SERVER_ERROR');
  }
};

/**
 * GET /api/logs/notifications
 * Requires ADMIN/OWNER. Uses validated and normalized req.validatedQuery.
 */
export const getNotifications = async (req, res) => {
  try {
    const { page, pageSize, start, end, status } = req.validatedQuery || {};
    const logs = await databaseService.getNotificationLogs(status, start, end, { page, pageSize });
    return createResponse(res, 200, 'Notification logs fetched', { logs, page, pageSize, hasMore: logs.length === pageSize });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch notification logs', 'SERVER_ERROR');
  }
};

/**
 * GET /api/logs/orders
 * Requires ADMIN/OWNER. Uses validated and normalized req.validatedQuery.
 */
export const getOrders = async (req, res) => {
  try {
    const { page, pageSize, status } = req.validatedQuery || {};
    const orders = await databaseService.getOrdersByStatus(status, { page, pageSize });
    return createResponse(res, 200, 'Orders fetched', { orders, page, pageSize, hasMore: orders.length === pageSize });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch orders', 'SERVER_ERROR');
  }
};

/**
 * Cleanup old logs beyond retention (default 90 days).
 */
export const cleanupLogsRetention = async (retentionDays = 90) => {
  const taskName = 'logs_retention_cleanup';
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
        const a = await tx.activityLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
        const n = await tx.notificationLog.deleteMany({ where: { createdAt: { lt: cutoff } } });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { deletedActivity: a.count, deletedNotifications: n.count, cutoff: cutoff.toISOString(), timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'LOGS_RETENTION_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('Logs cleanup failed', error.stack, { taskName, error: error.message, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};

export default { getActivityLogs, getNotifications, getOrders, cleanupLogsRetention };  
