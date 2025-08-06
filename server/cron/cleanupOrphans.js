import { LoggerService } from '../utils/logger.js';
import { toZonedTime } from 'date-fns-tz';
import { acquireLock, releaseLock } from '../utils/lock.js';
import crypto from 'crypto';
import prisma from '../config/database.js';

export async function cleanupOrphanedAssignments() {
  const taskName = 'cleanupOrphanedAssignments';
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();

  try {
    await prisma.$transaction(async (tx) => {
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logCronRun(taskName, 'SKIPPED', {
          reason: 'Lock held',
          timestamp,
        });
        await LoggerService.logSystemEvent('cron', 'CLEANUP_ORPHANS_SKIPPED', {
          taskName,
          reason: 'Lock held',
          timestamp,
        });
        return;
      }

      try {
        await LoggerService.logSystemEvent('cron', 'CLEANUP_ORPHANS_STARTED', { taskName, timestamp });

        const staleOrders = await tx.order.findMany({
          where: {
            status: 'PENDING',
            createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        });

        const deleted = await tx.order.deleteMany({
          where: { id: { in: staleOrders.map(o => o.id) } },
        });

        const totalDeleted = deleted.count;

        await LoggerService.logCronRun(taskName, 'SUCCESS', {
          totalDeleted,
          orderIds: staleOrders.map(o => o.id),
          timestamp,
        });

        await LoggerService.logAudit(null, 'ORPHANED_ASSIGNMENT_CLEANUP', null, {
          totalDeleted,
          timestamp,
        });
      } finally {
        await releaseLock(tx, taskName);
      }
    });
  } catch (error) {
    await LoggerService.logError('Orphaned assignment cleanup failed', error.stack, {
      taskName,
      error: error.message,
      timestamp,
    });
    await LoggerService.logCronRun(taskName, 'FAILED', {
      error: error.message,
      timestamp,
    });
    throw error;
  }
}
