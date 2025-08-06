import { LoggerService } from '../utils/logger.js';
import { toZonedTime } from 'date-fns-tz';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';

export const retryFailedLogs = async () => {
  const taskName = 'retry_failed_logs';
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();

  try {
    await prisma.$transaction(async (tx) => {
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logSystemEvent('cron', 'RETRY_FAILED_LOGS_SKIPPED', {
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

      const logDir = 'logs';
      const files = await fs.readdir(logDir);
      let totalRetried = 0;

      for (const file of files) {
        if (file.endsWith('.failures.log.json')) {
          const model = file.split('.')[0];
          const content = await fs.readFile(path.join(logDir, file), 'utf-8');
          const lines = content.split('\n').filter(Boolean);
          for (const line of lines) {
            const { data } = JSON.parse(line);
            await LoggerService.enqueueLog(model, data);
            totalRetried++;
          }
          await fs.unlink(path.join(logDir, file));
        }
      }

      await LoggerService.logCronRun(taskName, 'SUCCESS', { retriedCount: totalRetried, timestamp });
      await LoggerService.logSystemEvent('cron', 'RETRY_FAILED_LOGS_COMPLETED', { taskName, retriedCount: totalRetried, timestamp });

      await releaseLock(tx, taskName);
    });
  } catch (error) {
    await LoggerService.logError('retryFailedLogs failed', error.stack, { error: error.message, taskName, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};