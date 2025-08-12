import { LoggerService } from '../utils/logger.js';
import { toZonedTime } from 'date-fns-tz';
import crypto from 'node:crypto';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';

export const flushLogs = async () => {
  const taskName = 'flush_logs';
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();

  try {
    await prisma.$transaction(async (tx) => {
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logSystemEvent('cron', 'FLUSH_LOGS_SKIPPED', {
          reason: 'Lock held',
          instanceId,
          timestamp,
        });
        await LoggerService.logCronRun(taskName, 'SKIPPED', {
          reason: 'Lock held',
          timestamp,
        });
        return;
      }

      await LoggerService.flushQueue();

      await LoggerService.logCronRun(taskName, 'SUCCESS', { timestamp });
      await LoggerService.logSystemEvent('cron', 'FLUSH_LOGS_COMPLETED', { taskName, timestamp });

      await releaseLock(tx, taskName);
    });
  } catch (error) {
    await LoggerService.logError('flushLogs failed', error.stack, { error: error.message, taskName, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};