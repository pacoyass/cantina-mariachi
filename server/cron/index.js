import cron from 'node-cron';
import { LoggerService } from '../utils/logger.js';
import { cleanupOrphanedLocks } from './lockCleanup.js';
import { cleanupOrphanedAssignments } from './cleanupOrphans.js';
import { flushLogs } from './flushLogs.js';
import { retryFailedLogs } from './retryFailedLogs.js';
import { toZonedTime } from 'date-fns-tz';
import { cleanupExpiredAuthData } from '../controllers/auth.controller.js';
import { cleanupExpiredWebhooks } from '../controllers/webhook.controller.js';
import { cleanupUserData } from '../controllers/user.controller.js';

const runningJobs = new Set();

async function runJobSafely(jobName, jobFunction) {
  if (runningJobs.has(jobName)) {
    await LoggerService.logSystemEvent('cron', `JOB_SKIPPED_${jobName}`, {
      reason: 'Already running',
      timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
    });
    return;
  }

  runningJobs.add(jobName);
  const startTime = Date.now();

  try {
    await LoggerService.logSystemEvent('cron', `JOB_STARTED_${jobName}`, {
      timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
    });
    await jobFunction();
    await LoggerService.logSystemEvent('cron', `JOB_COMPLETED_${jobName}`, {
      duration: Date.now() - startTime,
      timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
    });
  } catch (error) {
    await LoggerService.logError(`Failed to run ${jobName}`, error.stack, {
      message: error.message,
      duration: Date.now() - startTime,
      timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
    });
  } finally {
    runningJobs.delete(jobName);
  }
}

export const registerCronJobs = () => {
  LoggerService.logSystemEvent('cron', 'REGISTERING_CRON_JOBS', {
    timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
  });

  // Cleanup orphaned assignments at 3:00 AM Europe/London
  cron.schedule('0 3 * * *', async () => {
    await runJobSafely('cleanupOrphanedAssignments', async () => {
      await cleanupOrphanedAssignments();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Cleanup orphaned locks at 4:00 AM Europe/London
  cron.schedule('0 4 * * *', async () => {
    await runJobSafely('cleanupOrphanedLocks', async () => {
      await cleanupOrphanedLocks();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Flush logs every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    await runJobSafely('flushLogs', async () => {
      await flushLogs();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Retry failed logs every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    await runJobSafely('retryFailedLogs', async () => {
      await retryFailedLogs();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });
    // Cleanup expired auth data at 3:20 AM
    cron.schedule('20 3 * * *', async () => {
      await runJobSafely('cleanupExpiredAuthData', async () => {
        await cleanupExpiredAuthData();
      });
    }, {
      scheduled: true,
      timezone: 'Europe/London',
    });
 
    // Cleanup expired user data at 3:20 AM
    cron.schedule('20 3 * * *', async () => {
      await runJobSafely('cleanupUserData', async () => {
        await cleanupUserData();
      });
    }, {
      scheduled: true,
      timezone: 'Europe/London',
    });

// Cleanup expired webhook data at 3:20 AM
    cron.schedule('20 3 * * *', async () => {
      await runJobSafely('cleanupExpiredWebhook', async () => {
        await cleanupExpiredWebhooks();
      });
    }, {
      scheduled: true,
      timezone: 'Europe/London',
    });
  LoggerService.logSystemEvent('cron', 'CRON_JOBS_REGISTERED', {
    timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
  });
}

export const runInitialCleanup = async () => {
  await LoggerService.logSystemEvent('cron', 'INITIAL_CLEANUP_STARTED', {
    timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
  });

  const cleanupTasks = [
    { name: 'cleanupOrphanedAssignments', fn: cleanupOrphanedAssignments, delay: 20000 },
    { name: 'cleanupOrphanedLocks', fn: cleanupOrphanedLocks, delay: 25000 },
    { name: 'flushLogs', fn: flushLogs, delay: 30000 },
    { name: 'retryFailedLogs', fn: retryFailedLogs, delay: 35000 },
    { name: 'cleanupExpiredAuthData', fn: cleanupExpiredAuthData, delay: 20000 },
    { name: 'cleanupExpiredWebhook', fn: cleanupExpiredWebhooks, delay: 45000 },
    { name: 'cleanupUserData', fn: cleanupUserData, delay: 50000 },
  ];

  for (const task of cleanupTasks) {
    setTimeout(async () => {
      await runJobSafely(task.name, task.fn);
    }, task.delay);
  }

  await LoggerService.logSystemEvent('cron', 'INITIAL_CLEANUP_SCHEDULED', {
    timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
  });
}

if (process.env.NODE_ENV !== 'test' && process.env.ENABLE_DEV_CRONS === 'true') {
  cron.schedule('*/30 * * * *', () => runJobSafely('cleanupOrphanedLocks', cleanupOrphanedLocks));
  runJobSafely('cleanupOrphanedLocks', cleanupOrphanedLocks);
}