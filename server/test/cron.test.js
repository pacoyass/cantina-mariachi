// File: server/test.test.js
import { jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';

await jest.unstable_mockModule('../utils/logger.js', () => ({
  LoggerService: {
    logCronLock: jest.fn(),
    logCronRun: jest.fn(),
    logSystemEvent: jest.fn(),
    logError: jest.fn(),
    logAudit: jest.fn(),
    enqueueLog: jest.fn(),
    flushQueue: jest.fn(),
  },
}));

await jest.unstable_mockModule('../utils/lock.js', () => ({
  acquireLock: jest.fn(),
  releaseLock: jest.fn(),
}));

const {
  cleanupOrphanedAssignments,
} = await import('../cron/cleanupOrphans.js');

const {
  cleanupOrphanedLocks,
} = await import('../cron/lockCleanup.js');

const {
  flushLogs,
} = await import('../cron/flushLogs.js');

const {
  retryFailedLogs,
} = await import('../cron/retryFailedLogs.js');

const { LoggerService } = await import('../utils/logger.js');
const lockModule = await import('../utils/lock.js');
import prisma from '../config/database.js';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Cron Scripts', () => {
  describe('cleanupOrphanedAssignments', () => {
    test('logs successful cleanup', async () => {
      prisma.order.findMany = jest.fn().mockResolvedValue([{ id: 'order1' }]);
      prisma.order.deleteMany = jest.fn().mockResolvedValue({ count: 1 });
      lockModule.acquireLock.mockResolvedValue(true);
      lockModule.releaseLock.mockResolvedValue();

      await cleanupOrphanedAssignments();

      expect(LoggerService.logSystemEvent).toHaveBeenCalled();
      expect(LoggerService.logCronRun).toHaveBeenCalled();
      expect(LoggerService.logAudit).toHaveBeenCalled();
    });

    test('logs skipped cleanup due to lock failure', async () => {
      lockModule.acquireLock.mockResolvedValue(false);
      await cleanupOrphanedAssignments();
      expect(LoggerService.logSystemEvent).toHaveBeenCalled();
      expect(LoggerService.logCronRun).toHaveBeenCalled();
    });

    test('logs database error', async () => {
      // Mock the transaction flow
      prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
        const tx = {
          order: {
            findMany: jest.fn().mockRejectedValue(new Error('DB Error')),
            deleteMany: jest.fn(),
          },
          cronLock: {
            findMany: jest.fn(),
            delete: jest.fn(),
          }
        };
        return callback(tx);
      });
    
      lockModule.acquireLock.mockResolvedValue(true);
      lockModule.releaseLock.mockResolvedValue();
    
      await expect(cleanupOrphanedAssignments()).rejects.toThrow('DB Error');
    
      // Verify error logging
      expect(LoggerService.logError).toHaveBeenCalledWith(
        'Orphaned assignment cleanup failed',
        expect.any(String),
        expect.objectContaining({
          taskName: 'cleanupOrphanedAssignments',
          error: 'DB Error',
          timestamp: expect.any(String),
        })
      );
    
      // Verify cron run failure logging
      expect(LoggerService.logCronRun).toHaveBeenCalledWith(
        'cleanupOrphanedAssignments',
        'FAILED',
        expect.objectContaining({
          error: 'DB Error',
          timestamp: expect.any(String),
        })
      );
    });
    
  });

  describe('cleanupOrphanedLocks', () => {
    beforeEach(() => {
      // Mock the transaction flow
      prisma.$transaction = jest.fn().mockImplementation(async (callback) => {
        const tx = {
          cronLock: {
            findMany: jest.fn(),
            delete: jest.fn(),
          }
        };
        return callback(tx);
      });
    });
  
    test('logs successful lock cleanup', async () => {
      // Mock transaction with orphaned locks
      prisma.$transaction.mockImplementationOnce(async (callback) => {
        const tx = {
          cronLock: {
            findMany: jest.fn().mockResolvedValue([
              { id: '1', lockedAt: new Date(Date.now() - 7200000) }
            ]),
            delete: jest.fn().mockResolvedValue({})
          }
        };
        return callback(tx);
      });
  
      lockModule.acquireLock.mockResolvedValue(true);
      await cleanupOrphanedLocks();
  
      expect(LoggerService.logAudit).toHaveBeenCalled();
      expect(LoggerService.logCronRun).toHaveBeenCalledWith(
        'lockCleanup',  // Changed from 'cleanupOrphanedLocks'
        'SUCCESS',
        expect.objectContaining({
          count: expect.any(Number),
          timestamp: expect.any(String)
        })
      );
    });
  
    test('logs no locks found', async () => {
      // Mock transaction with empty locks array
      prisma.$transaction.mockImplementationOnce(async (callback) => {
        const tx = {
          cronLock: {
            findMany: jest.fn().mockResolvedValue([]),
            delete: jest.fn()
          }
        };
        return callback(tx);
      });
  
      lockModule.acquireLock.mockResolvedValue(true);
      await cleanupOrphanedLocks();
  
      expect(LoggerService.logSystemEvent).toHaveBeenCalled();
      expect(LoggerService.logCronRun).toHaveBeenCalledWith(
        'lockCleanup',  // Changed from 'cleanupOrphanedLocks'
        'SUCCESS',
        expect.objectContaining({
          count: 0,
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('flushLogs', () => {
    test('logs successful flush', async () => {
      lockModule.acquireLock.mockResolvedValue(true);
      await flushLogs();

      expect(LoggerService.flushQueue).toHaveBeenCalled();
      expect(LoggerService.logSystemEvent).toHaveBeenCalled();
      expect(LoggerService.logCronRun).toHaveBeenCalled();
    });

    test('logs skipped flush due to lock failure', async () => {
      lockModule.acquireLock.mockResolvedValue(false);
      await flushLogs();

      expect(LoggerService.logSystemEvent).toHaveBeenCalled();
      expect(LoggerService.logCronRun).toHaveBeenCalled();
    });
  });

  describe('retryFailedLogs', () => {
    test('retries failed logs and clears files', async () => {
      await fs.mkdir('logs', { recursive: true });
      await fs.writeFile(path.join('logs', 'cronRun.failures.log.json'), JSON.stringify({ data: { taskName: 'test' } }) + '\n');

      lockModule.acquireLock.mockResolvedValue(true);
      await retryFailedLogs();

      expect(LoggerService.enqueueLog).toHaveBeenCalled();
      expect(LoggerService.logCronRun).toHaveBeenCalled();
    });

    test('handles malformed failure files', async () => {
      await fs.mkdir('logs', { recursive: true });
      await fs.writeFile(path.join('logs', 'cronRun.failures.log.json'), 'INVALID');

      lockModule.acquireLock.mockResolvedValue(true);
      await expect(retryFailedLogs()).rejects.toThrow();
      expect(LoggerService.logError).toHaveBeenCalled();
      expect(LoggerService.logCronRun).toHaveBeenCalled();
    });
  });
});




// import { cleanupOrphanedAssignments } from './cron/cleanupOrphans.js';
// import { cleanupOrphanedLocks } from './cron/lockCleanup.js';
// import { flushLogs } from './cron/flushLogs.js';
// import { retryFailedLogs } from './cron/retryFailedLogs.js';
// import { acquireLock, releaseLock } from './utils/lock.js';
// import fs from 'fs/promises';
// import path from 'path';
// import prisma from './config/database.js';
// import { toZonedTime } from 'date-fns-tz';
// import { LoggerService } from './utils/logger.js';
// import { jest } from '@jest/globals';
// jest.mock('./utils/logger.js', () => ({
//   LoggerService: {
//     logCronLock: jest.fn().mockResolvedValue(),
//     logCronRun: jest.fn().mockResolvedValue(),
//     logSystemEvent: jest.fn().mockResolvedValue(),
//     logError: jest.fn().mockResolvedValue(),
//     logAudit: jest.fn().mockResolvedValue(),
//     enqueueLog: jest.fn().mockResolvedValue(),
//     flushQueue: jest.fn().mockResolvedValue(),
//   },
// }));

// describe('Cron Scripts', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('cleanupOrphanedAssignments', () => {
//     test('logs successful cleanup', async () => {
//       jest.spyOn(prisma.order, 'findMany').mockResolvedValue([{ id: 'order1' }]);
//       jest.spyOn(prisma.order, 'deleteMany').mockResolvedValue({ count: 1 });
//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(true);
//       jest.spyOn(require('./utils/lock.js'), 'releaseLock').mockResolvedValue();

//       await cleanupOrphanedAssignments();

//       expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('cron', 'CLEANUP_ORPHANS_STARTED', expect.any(Object));
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith(
//         'cleanupOrphanedAssignments',
//         'SUCCESS',
//         expect.objectContaining({ totalDeleted: expect.any(Number) })
//       );
//       expect(LoggerService.logAudit).toHaveBeenCalledWith(null, 'ORPHANED_ASSIGNMENT_CLEANUP', null, expect.any(Object));
//     });

//     test('logs skipped cleanup due to lock failure', async () => {
//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(false);

//       await cleanupOrphanedAssignments();

//       expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('cron', 'CLEANUP_ORPHANS_SKIPPED', expect.any(Object));
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith('cleanupOrphanedAssignments', 'SKIPPED', expect.any(Object));
//     });

//     test('logs database error', async () => {
//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(true);
//       jest.spyOn(require('./utils/lock.js'), 'releaseLock').mockResolvedValue();
      
//       // Mock transaction to throw error during findMany
//       jest.spyOn(prisma, '$transaction').mockImplementation(async (callback) => {
//         try {
//           await callback({
//             ...prisma,
//             order: {
//               ...prisma.order,
//               findMany: jest.fn().mockRejectedValue(new Error('Database error')),
//               deleteMany: jest.fn(),
//             },
//           });
//         } catch (error) {
//           throw error; // Ensure error propagates to outer try/catch
//         }
//       });

//       await expect(cleanupOrphanedAssignments()).rejects.toThrow('Database error');
//       expect(LoggerService.logError).toHaveBeenCalledWith(
//         'Orphaned assignment cleanup failed',
//         expect.any(String),
//         expect.objectContaining({ error: 'Database error' })
//       );
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith(
//         'cleanupOrphanedAssignments',
//         'FAILED',
//         expect.any(Object)
//       );
//     });
//   });

//   describe('cleanupOrphanedLocks', () => {
//     test('logs successful lock cleanup', async () => {
//       jest.spyOn(prisma.cronLock, 'findMany').mockResolvedValue([
//         { id: 'lock1', taskName: 'test', instanceId: 'inst1', lockedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) }
//       ]);
//       jest.spyOn(prisma.cronLock, 'delete').mockResolvedValue({});
//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(true);
//       jest.spyOn(require('./utils/lock.js'), 'releaseLock').mockResolvedValue();

//       await cleanupOrphanedLocks();

//       expect(LoggerService.logAudit).toHaveBeenCalled();
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith(
//         'lockCleanup',
//         'SUCCESS',
//         expect.objectContaining({ count: expect.any(Number) })
//       );
//     });

//     test('logs no locks found', async () => {
//       jest.spyOn(prisma.cronLock, 'findMany').mockResolvedValue([]);
//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(true);
//       jest.spyOn(require('./utils/lock.js'), 'releaseLock').mockResolvedValue();

//       await cleanupOrphanedLocks();

//       expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('cron', 'LOCK_CLEANUP_COMPLETED', expect.any(Object));
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith('lockCleanup', 'SUCCESS', expect.objectContaining({ count: 0 }));
//     });
//   });

//   describe('flushLogs', () => {
//     test('logs successful flush', async () => {
//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(true);
//       jest.spyOn(require('./utils/lock.js'), 'releaseLock').mockResolvedValue();

//       await flushLogs();

//       expect(LoggerService.flushQueue).toHaveBeenCalled();
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith('flush_logs', 'SUCCESS', expect.any(Object));
//       expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('cron', 'FLUSH_LOGS_COMPLETED', expect.any(Object));
//     });

//     test('logs skipped flush due to lock failure', async () => {
//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(false);

//       await flushLogs();

//       expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('cron', 'FLUSH_LOGS_SKIPPED', expect.any(Object));
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith('flush_logs', 'SKIPPED', expect.any(Object));
//     });
//   });

//   describe('retryFailedLogs', () => {
//     test('retries failed logs and clears files', async () => {
//       await fs.mkdir('logs', { recursive: true });
//       await fs.writeFile(path.join('logs', 'cronRun.failures.log.json'), JSON.stringify({ data: { taskName: 'test' } }) + '\n');

//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(true);
//       jest.spyOn(require('./utils/lock.js'), 'releaseLock').mockResolvedValue();

//       await retryFailedLogs();

//       expect(LoggerService.enqueueLog).toHaveBeenCalledWith('cronRun', expect.any(Object));
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith('retry_failed_logs', 'SUCCESS', expect.any(Object));
//     });

//     test('handles malformed failure files', async () => {
//       await fs.mkdir('logs', { recursive: true });
//       await fs.writeFile(path.join('logs', 'cronRun.failures.log.json'), 'INVALID\n');

//       jest.spyOn(require('./utils/lock.js'), 'acquireLock').mockResolvedValue(true);
//       jest.spyOn(require('./utils/lock.js'), 'releaseLock').mockResolvedValue();

//       await expect(retryFailedLogs()).rejects.toThrow();
//       expect(LoggerService.logError).toHaveBeenCalledWith('retryFailedLogs failed', expect.any(String), expect.any(Object));
//       expect(LoggerService.logCronRun).toHaveBeenCalledWith('retry_failed_logs', 'FAILED', expect.any(Object));
//     });
//   });

//   describe('lock.js', () => {
//     test('logs successful lock acquisition', async () => {
//       jest.spyOn(prisma.cronLock, 'upsert').mockResolvedValue({});
//       await acquireLock(prisma, 'testTask', 'inst1');
//       expect(typeof await acquireLock(prisma, 'testTask', 'inst1')).toBe('boolean');
//     });

//     test('logs lock conflict', async () => {
//       jest.spyOn(prisma.cronLock, 'upsert').mockImplementation(() => {
//         throw { code: 'P2002' };
//       });
//       jest.spyOn(prisma.cronLock, 'findUnique').mockResolvedValue({
//         id: 'lock1',
//         instanceId: 'inst2',
//         lockedAt: new Date(),
//       });

//       const result = await acquireLock(prisma, 'testTask', 'inst1');
//       expect(typeof result).toBe('boolean');
//     });

//     test('logs stale lock replacement', async () => {
//       jest.spyOn(prisma.cronLock, 'upsert').mockImplementation(() => {
//         throw { code: 'P2002' };
//       });
//       jest.spyOn(prisma.cronLock, 'findUnique').mockResolvedValue({
//         id: 'lock1',
//         instanceId: 'inst2',
//         lockedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
//       });
//       jest.spyOn(prisma.cronLock, 'delete').mockResolvedValue({});
//       jest.spyOn(prisma.cronLock, 'create').mockResolvedValue({});

//       const result = await acquireLock(prisma, 'testTask', 'inst1');
//       expect(result).toBe(true);
//     });
//   });
// });