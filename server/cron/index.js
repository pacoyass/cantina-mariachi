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
import { cleanupHealth } from '../controllers/health.controller.js';
import { cleanupLogsRetention } from '../controllers/logs.controller.js';
import { cleanupMenuCache } from '../controllers/menu.controller.js';
import { cleanupExpiredOrderTracking } from '../controllers/orders.controller.js';
import { cleanupInactiveDrivers } from '../controllers/drivers.controller.js';
import { cleanupCashData } from '../controllers/cash.controller.js';
import { cleanupOldReservations } from '../controllers/reservations.controller.js';
import { cleanupNotifications } from '../controllers/notifications.controller.js';
import { cleanupCmsDrafts } from '../controllers/cms/page.controller.js';
import { cleanupAnalyticsLogs } from '../controllers/analytics.controller.js';

// Cron job configuration
const CRON_CONFIG = {
  MAX_JOB_DURATION: 5 * 60 * 1000, // 5 minutes max per job
  LOG_FLUSH_INTERVAL: '*/15 * * * *', // Every 15 minutes
  LOG_RETRY_INTERVAL: '*/30 * * * *', // Every 30 minutes  
  HEALTH_CHECK_INTERVAL: '*/10 * * * *', // Every 10 minutes
  TIMEZONE: 'Europe/London',
  ENABLE_VERBOSE_LOGGING: process.env.CRON_VERBOSE_LOGGING === 'true',
};

const runningJobs = new Map(); // Track job start times

async function runJobSafely(jobName, jobFunction) {
  const now = Date.now();
  
  // Check if job is already running
  if (runningJobs.has(jobName)) {
    const startTime = runningJobs.get(jobName);
    const duration = now - startTime;
    
    // If job has been running too long, force cleanup and log warning
    if (duration > CRON_CONFIG.MAX_JOB_DURATION) {
      await LoggerService.logError(`Long-running job detected: ${jobName}`, null, {
        duration: duration,
        maxDuration: CRON_CONFIG.MAX_JOB_DURATION,
        action: 'Force cleanup',
        timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
      });
      runningJobs.delete(jobName); // Force cleanup
    } else {
      await LoggerService.logSystemEvent('cron', `JOB_SKIPPED_${jobName}`, {
        reason: 'Already running',
        duration: duration,
        timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
      });
      return;
    }
  }

  runningJobs.set(jobName, now);
  const startTime = Date.now();

  try {
    await LoggerService.logSystemEvent('cron', `JOB_STARTED_${jobName}`, {
      timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
    });
    
    // Add timeout wrapper to prevent jobs from hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Job ${jobName} timed out after ${CRON_CONFIG.MAX_JOB_DURATION}ms`)), CRON_CONFIG.MAX_JOB_DURATION)
    );
    
    await Promise.race([jobFunction(), timeoutPromise]);
    
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

  // Flush logs (configurable frequency)
  cron.schedule(CRON_CONFIG.LOG_FLUSH_INTERVAL, async () => {
    await runJobSafely('flushLogs', async () => {
      await flushLogs();
    });
  }, {
    scheduled: true,
    timezone: CRON_CONFIG.TIMEZONE,
  });

  // Retry failed logs (configurable frequency)
  cron.schedule(CRON_CONFIG.LOG_RETRY_INTERVAL, async () => {
    await runJobSafely('retryFailedLogs', async () => {
      await retryFailedLogs();
    });
  }, {
    scheduled: true,
    timezone: CRON_CONFIG.TIMEZONE,
  });
  // Cleanup expired auth data at 3:15 AM
  cron.schedule('15 3 * * *', async () => {
    await runJobSafely('cleanupExpiredAuthData', async () => {
      await cleanupExpiredAuthData();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });
 
  // Cleanup expired user data at 3:25 AM (staggered timing)
  cron.schedule('25 3 * * *', async () => {
    await runJobSafely('cleanupUserData', async () => {
      await cleanupUserData();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Cleanup expired webhook data at 3:35 AM (staggered timing)
  cron.schedule('35 3 * * *', async () => {
    await runJobSafely('cleanupExpiredWebhook', async () => {
      await cleanupExpiredWebhooks();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Health heartbeat (configurable frequency)
  cron.schedule(CRON_CONFIG.HEALTH_CHECK_INTERVAL, async () => {
    await runJobSafely('health_heartbeat', async () => {
      await cleanupHealth();
    });
  }, {
    scheduled: true,
    timezone: CRON_CONFIG.TIMEZONE,
  });

  // Logs retention cleanup daily at 03:30
  cron.schedule('30 3 * * *', async () => {
    await runJobSafely('logs_retention_cleanup', async () => {
      await cleanupLogsRetention();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Menu cache cleanup daily at 03:40
  cron.schedule('40 3 * * *', async () => {
    await runJobSafely('menu_cache_cleanup', async () => {
      await cleanupMenuCache();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Orders tracking cleanup daily at 03:50
  cron.schedule('50 3 * * *', async () => {
    await runJobSafely('orders_tracking_cleanup', async () => {
      await cleanupExpiredOrderTracking();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Drivers cleanup daily at 04:00
  cron.schedule('0 4 * * *', async () => {
    await runJobSafely('drivers_cleanup', async () => {
      await cleanupInactiveDrivers();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Cash cleanup daily at 04:10
  cron.schedule('10 4 * * *', async () => {
    await runJobSafely('cash_cleanup', async () => {
      await cleanupCashData();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Reservations cleanup daily at 04:20
  cron.schedule('20 4 * * *', async () => {
    await runJobSafely('reservations_cleanup', async () => {
      await cleanupOldReservations();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Notifications cleanup daily at 04:30
  cron.schedule('30 4 * * *', async () => {
    await runJobSafely('notifications_cleanup', async () => {
      await cleanupNotifications();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // CMS draft cleanup daily at 04:40
  cron.schedule('40 4 * * *', async () => {
    await runJobSafely('cms_draft_cleanup', async () => {
      await cleanupCmsDrafts();
    });
  }, {
    scheduled: true,
    timezone: 'Europe/London',
  });

  // Analytics logs cleanup daily at 04:50
  cron.schedule('50 4 * * *', async () => {
    await runJobSafely('analytics_cleanup', async () => {
      await cleanupAnalyticsLogs();
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
  // Only run initial cleanup if explicitly requested
  if (process.env.RUN_INITIAL_CLEANUP !== 'true') {
    await LoggerService.logSystemEvent('cron', 'INITIAL_CLEANUP_SKIPPED', {
      reason: 'RUN_INITIAL_CLEANUP not set to true',
      timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
    });
    return;
  }

  await LoggerService.logSystemEvent('cron', 'INITIAL_CLEANUP_STARTED', {
    timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
  });

  // Run critical cleanup tasks sequentially with proper delays to avoid overwhelming the system
  const criticalTasks = [
    { name: 'initial_flushLogs', fn: flushLogs },
    { name: 'initial_cleanupOrphanedLocks', fn: cleanupOrphanedLocks },
    { name: 'initial_cleanupExpiredAuthData', fn: cleanupExpiredAuthData },
  ];

  // Run critical tasks sequentially with 10-second delays
  for (let i = 0; i < criticalTasks.length; i++) {
    const task = criticalTasks[i];
    setTimeout(async () => {
      await runJobSafely(task.name, task.fn);
    }, (i + 1) * 10000); // 10s, 20s, 30s delays
  }

  await LoggerService.logSystemEvent('cron', 'INITIAL_CLEANUP_SCHEDULED', {
    tasksScheduled: criticalTasks.length,
    timestamp: toZonedTime(new Date(), 'Europe/London').toISOString(),
  });
}

// Development cron jobs (only when explicitly enabled)
if (process.env.NODE_ENV !== 'test' && process.env.ENABLE_DEV_CRONS === 'true') {
  // Run cleanup every 2 hours in development (much less frequent)
  cron.schedule('0 */2 * * *', () => runJobSafely('dev_cleanupOrphanedLocks', cleanupOrphanedLocks), {
    scheduled: true,
    timezone: 'Europe/London',
  });
  
  // Only run initial cleanup, not continuous
  if (process.env.RUN_INITIAL_CLEANUP === 'true') {
    setTimeout(() => runJobSafely('dev_initial_cleanupOrphanedLocks', cleanupOrphanedLocks), 5000);
  }
}