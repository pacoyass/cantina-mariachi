import { LoggerService } from '../utils/logger.js';
import prisma from '../config/database.js';
import { toZonedTime } from 'date-fns-tz';
import { acquireLock, releaseLock } from '../utils/lock.js';
import crypto from 'crypto';

export async function cleanupOrphanedLocks() {
  const taskName = 'lockCleanup';
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();

  try {
    await prisma.$transaction(async (tx) => {
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logSystemEvent('cron', 'LOCK_CLEANUP_SKIPPED', {
          reason: 'Lock acquisition failed',
          instanceId,
          timestamp,
        });
        await LoggerService.logCronRun(taskName, 'SKIPPED', {
          reason: 'Lock acquisition failed',
          timestamp,
        });
        return;
      }

      try {
        const now = toZonedTime(new Date(), 'Europe/London');
        const staleThreshold = new Date(now.getTime() - 60 * 60 * 1000); // 60 minutes

        const orphanedLocks = await tx.cronLock.findMany({
          where: { lockedAt: { lt: staleThreshold } },
        });

        if (orphanedLocks.length === 0) {
          await LoggerService.logCronRun(taskName, 'SUCCESS', { count: 0, timestamp });
          await LoggerService.logSystemEvent('cron', 'LOCK_CLEANUP_COMPLETED', {
            taskName,
            count: 0,
            timestamp,
          });
          return;
        }

        for (const lock of orphanedLocks) {
          await tx.cronLock.delete({ where: { taskName: lock.taskName } });
          await LoggerService.logAudit(null, 'LOCK_CLEANUP', null, {
            taskName: lock.taskName,
            instanceId: lock.instanceId,
            lockedAt: lock.lockedAt.toISOString(),
            timestamp,
          });
        }

        await LoggerService.logCronRun(taskName, 'SUCCESS', {
          count: orphanedLocks.length,
          lockIds: orphanedLocks.map(l => l.id),
          timestamp,
        });
        await LoggerService.logSystemEvent('cron', 'LOCK_CLEANUP_COMPLETED', {
          taskName,
          count: orphanedLocks.length,
          timestamp,
        });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'LOCK_CLEANUP_LOCK_RELEASED', null, {
          instanceId,
          timestamp,
        });
      }
    });
  } catch (error) {
    await LoggerService.logError('Lock cleanup failed', error.stack, {
      taskName,
      reason: error.message,
      timestamp,
    });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
}