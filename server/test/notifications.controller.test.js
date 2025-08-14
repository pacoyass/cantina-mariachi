import { jest } from '@jest/globals';

// Mocks
const logger = {
  logSystemEvent: jest.fn().mockResolvedValue(),
  logError: jest.fn().mockResolvedValue(),
  logAudit: jest.fn().mockResolvedValue(),
  logCronRun: jest.fn().mockResolvedValue(),
};
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));

const lock = { acquireLock: jest.fn(), releaseLock: jest.fn().mockResolvedValue() };
await jest.unstable_mockModule('../utils/lock.js', () => lock);

const dispatchNotification = jest.fn();
await jest.unstable_mockModule('../services/notificationService.js', () => ({ dispatchNotification }));

const prisma = { $transaction: jest.fn(async (fn) => fn({ notificationLog: { deleteMany: jest.fn().mockResolvedValue({ count: 2 }) }, notification: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) } })) };
await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));

const { dispatch, cleanupNotifications } = await import('../controllers/notifications.controller.js');

function makeRes() { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; }

describe('notifications.controller dispatch', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('returns 200 when provider succeeds', async () => {
    dispatchNotification.mockResolvedValue({ success: true });
    const res = makeRes();
    await dispatch({ body: { type: 'EMAIL', target: 'to@x.com', content: 'hi' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 502 when provider fails', async () => {
    dispatchNotification.mockResolvedValue({ success: false, error: 'boom' });
    const res = makeRes();
    await dispatch({ body: { type: 'SMS', target: '+1222', content: 'hi' } }, res);
    expect(res.status).toHaveBeenCalledWith(502);
  });
});

describe('notifications.controller cleanupNotifications', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('skips when lock not acquired', async () => {
    lock.acquireLock.mockResolvedValue(false);
    await cleanupNotifications(90, 180);
    expect(logger.logCronRun).toHaveBeenCalledWith('notifications_cleanup', 'SKIPPED', expect.any(Object));
  });

  it('deletes logs and notifications and logs success when lock acquired', async () => {
    lock.acquireLock.mockResolvedValue(true);
    await cleanupNotifications(90, 180);
    expect(logger.logCronRun).toHaveBeenCalledWith('notifications_cleanup', 'SUCCESS', expect.objectContaining({ deletedLogs: 2, deletedRead: 1 }));
    expect(lock.releaseLock).toHaveBeenCalled();
  });
});