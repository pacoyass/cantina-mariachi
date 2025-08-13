import { jest } from '@jest/globals';

// Mocks
const logger = {
  logSystemEvent: jest.fn().mockResolvedValue(),
  logError: jest.fn().mockResolvedValue(),
  logAudit: jest.fn().mockResolvedValue(),
  logNotification: jest.fn().mockResolvedValue(),
  logCronRun: jest.fn().mockResolvedValue(),
};
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));

const lock = { acquireLock: jest.fn(), releaseLock: jest.fn().mockResolvedValue() };
await jest.unstable_mockModule('../utils/lock.js', () => lock);

function makeTx() {
  const tx = {
    activityLog: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    loginLog: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    notificationLog: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    errorLog: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    systemLog: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    auditLog: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    userPreference: { deleteMany: jest.fn().mockResolvedValue({ count: 2 }) },
    user: { findMany: jest.fn().mockResolvedValue([{ id: 'u2' }]), delete: jest.fn().mockResolvedValue({}) },
    order: { count: jest.fn().mockResolvedValue(0) },
    reservation: { count: jest.fn().mockResolvedValue(0) },
  };
  const prisma = { $transaction: jest.fn(async (fn) => fn(tx)) };
  return { prisma, tx };
}

const { prisma, tx } = (() => {
  const ctx = makeTx();
  return ctx;
})();

await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));

const { cleanupUserData } = await import('../controllers/user.controller.js');

describe('cleanupUserData cron', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('skips when lock not acquired', async () => {
    lock.acquireLock.mockResolvedValueOnce(false);
    await cleanupUserData(7);
    expect(logger.logCronRun).toHaveBeenCalledWith('user_cleanup', 'SKIPPED', expect.any(Object));
  });

  it('success path deletes logs, prefs, and hard-deletes users', async () => {
    lock.acquireLock.mockResolvedValueOnce(true);
    await cleanupUserData(7);
    expect(tx.activityLog.deleteMany).toHaveBeenCalled();
    expect(tx.userPreference.deleteMany).toHaveBeenCalled();
    expect(logger.logCronRun).toHaveBeenCalledWith('user_cleanup', 'SUCCESS', expect.any(Object));
    expect(lock.releaseLock).toHaveBeenCalled();
  });
});