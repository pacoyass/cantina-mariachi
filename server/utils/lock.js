import { toZonedTime } from 'date-fns-tz';
import crypto from 'node:crypto';
import { LoggerService } from './logger.js';

export async function acquireLock(tx, taskName, instanceId, ttlMinutes = 60, maxRetries = 3) {
  const now = toZonedTime(new Date(), 'Europe/London');
  const staleThreshold = new Date(now.getTime() - ttlMinutes * 60 * 1000);
  const lockId = crypto.randomUUID();

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      await LoggerService.logSystemEvent('lock', `ATTEMPT_ACQUIRE_LOCK_${taskName}`, {
        instanceId,
        lockId,
        attempt: attempt + 1,
        timestamp: now.toISOString(),
      });

      await tx.cronLock.upsert({
        where: { taskName },
        update: { instanceId, lockedAt: now },
        create: { id: lockId, taskName, instanceId, lockedAt: now },
      });

      await LoggerService.logSystemEvent('lock', `LOCK_ACQUIRED_${taskName}`, {
        instanceId,
        lockId,
        timestamp: now.toISOString(),
      });
      return true;
    } catch (error) {
      if (error.code === 'P2002') {
        await LoggerService.logSystemEvent('lock', `LOCK_CONFLICT_${taskName}`, {
          instanceId,
          attempt: attempt + 1,
          timestamp: now.toISOString(),
        });

        const existingLock = await tx.cronLock.findUnique({
          where: { taskName },
          select: { id: true, instanceId: true, lockedAt: true },
        });

        if (existingLock && existingLock.lockedAt < staleThreshold) {
          await LoggerService.logSystemEvent('lock', `STALE_LOCK_FOUND_${taskName}`, {
            lockId: existingLock.id,
            instanceId,
            timestamp: now.toISOString(),
          });

          await tx.cronLock.delete({ where: { taskName } });
          await tx.cronLock.create({
            data: { id: crypto.randomUUID(), taskName, instanceId, lockedAt: now },
          });

          await LoggerService.logSystemEvent('lock', `NEW_LOCK_ACQUIRED_${taskName}`, {
            instanceId,
            timestamp: now.toISOString(),
          });
          return true;
        }

        await LoggerService.logSystemEvent('lock', `LOCK_HELD_${taskName}`, {
          existingInstanceId: existingLock?.instanceId,
          lockId: existingLock?.id,
          timestamp: now.toISOString(),
        });
        return false;
      } else if (error.code === 'P2034') {
        await LoggerService.logError(`Transaction conflict for lock ${taskName}`, error.stack, {
          attempt: attempt + 1,
          timestamp: now.toISOString(),
        });

        if (attempt === maxRetries) {
          await LoggerService.logError(`Max retries reached for lock ${taskName}`, null, {
            timestamp: now.toISOString(),
          });
          return false;
        }

        const backoffMs = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      } else {
        await LoggerService.logError(`Error acquiring lock for ${taskName}`, error.stack, {
          code: error.code,
          timestamp: now.toISOString(),
        });

        if (attempt === maxRetries) {
          throw error;
        }

        const backoffMs = Math.pow(2, attempt) * 500;
        await new Promise(resolve => setTimeout(resolve, backoffMs));
        continue;
      }
    }
  }

  return false;
}

export async function releaseLock(tx, taskName) {
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();
  try {
    const lock = await tx.cronLock.findUnique({
      where: { taskName },
      select: { id: true },
    });

    if (lock) {
      await tx.cronLock.delete({ where: { taskName } });
      await LoggerService.logSystemEvent('lock', `LOCK_RELEASED_${taskName}`, {
        lockId: lock.id,
        timestamp,
      });
    } else {
      await LoggerService.logSystemEvent('lock', `NO_LOCK_FOUND_${taskName}`, { timestamp });
    }
  } catch (error) {
    if (error.code !== 'P2025') {
      await LoggerService.logError(`Error releasing lock for ${taskName}`, error.stack, {
        code: error.code,
        timestamp,
      });
      throw error;
    }
    await LoggerService.logSystemEvent('lock', `NO_LOCK_FOUND_${taskName}`, { timestamp });
  }
}

export async function isLockStale(tx, taskName, ttlMinutes = 60) {
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();
  try {
    const staleThreshold = new Date(Date.now() - ttlMinutes * 60 * 1000);
    const lock = await tx.cronLock.findUnique({
      where: { taskName },
      select: { lockedAt: true },
    });

    const isStale = lock && lock.lockedAt < staleThreshold;
    await LoggerService.logSystemEvent('lock', `CHECK_LOCK_STALE_${taskName}`, {
      isStale,
      timestamp,
    });
    return isStale;
  } catch (error) {
    await LoggerService.logError(`Error checking stale lock for ${taskName}`, error.stack, {
      timestamp,
    });
    return false;
  }
}