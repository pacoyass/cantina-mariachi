import { jest } from '@jest/globals';

const logger = {
  logSystemEvent: jest.fn().mockResolvedValue(),
  logError: jest.fn().mockResolvedValue(),
  logAudit: jest.fn().mockResolvedValue(),
  logCronRun: jest.fn().mockResolvedValue(),
};
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));

const db = {
  getActivityLogs: jest.fn(),
  getNotificationLogs: jest.fn(),
  getOrdersByStatus: jest.fn(),
};
await jest.unstable_mockModule('../services/databaseService.js', () => ({ databaseService: db }));

const lock = { acquireLock: jest.fn(), releaseLock: jest.fn().mockResolvedValue() };
await jest.unstable_mockModule('../utils/lock.js', () => lock);

const prisma = { $transaction: jest.fn(async (fn) => fn({ activityLog: { deleteMany: jest.fn().mockResolvedValue({ count: 2 }) }, notificationLog: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) } })) };
await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));

const { getActivityLogs, getNotifications, getOrders, cleanupLogsRetention } = await import('../controllers/logs.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('logs.controller error paths', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('getActivityLogs returns 500 on error', async () => {
    db.getActivityLogs.mockRejectedValue(new Error('fail'));
    const res = makeRes();
    await getActivityLogs({ validatedQuery: {} }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('getNotifications returns 500 on error', async () => {
    db.getNotificationLogs.mockRejectedValue(new Error('fail'));
    const res = makeRes();
    await getNotifications({ validatedQuery: {} }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('getOrders returns 500 on error', async () => {
    db.getOrdersByStatus.mockRejectedValue(new Error('fail'));
    const res = makeRes();
    await getOrders({ validatedQuery: {} }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('logs.controller cleanupLogsRetention', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('skips when lock not acquired', async () => {
    lock.acquireLock.mockResolvedValue(false);
    await cleanupLogsRetention(90);
    expect(logger.logCronRun).toHaveBeenCalledWith('logs_retention_cleanup', 'SKIPPED', expect.any(Object));
  });

  it('deletes and logs success when lock acquired', async () => {
    lock.acquireLock.mockResolvedValue(true);
    await cleanupLogsRetention(90);
    expect(logger.logCronRun).toHaveBeenCalledWith('logs_retention_cleanup', 'SUCCESS', expect.any(Object));
    expect(lock.releaseLock).toHaveBeenCalled();
  });
});