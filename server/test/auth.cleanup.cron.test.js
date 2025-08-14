import { jest } from '@jest/globals';

const logger = {
  logSystemEvent: jest.fn().mockResolvedValue(),
  logError: jest.fn().mockResolvedValue(),
  logAudit: jest.fn().mockResolvedValue(),
  logCronRun: jest.fn().mockResolvedValue(),
  logNotification: jest.fn().mockResolvedValue(),
};
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));

const lock = { acquireLock: jest.fn(), releaseLock: jest.fn().mockResolvedValue() };
await jest.unstable_mockModule('../utils/lock.js', () => lock);

const sendWebhook = jest.fn().mockResolvedValue();
await jest.unstable_mockModule('../controllers/webhook.controller.js', () => ({ sendWebhook }));

function makePrisma(counts = { rt: 0, bl: 0 }, shouldThrow = false) {
  return {
    $transaction: jest.fn(async (fn) => {
      if (shouldThrow) throw new Error('tx fail');
      const tx = {
        refreshToken: { deleteMany: jest.fn().mockResolvedValue({ count: counts.rt }) },
        blacklistedToken: { deleteMany: jest.fn().mockResolvedValue({ count: counts.bl }) },
      };
      return fn(tx);
    }),
  };
}

const prismaZero = makePrisma({ rt: 0, bl: 0 });
const prismaSome = makePrisma({ rt: 2, bl: 3 });
const prismaFail = makePrisma({ rt: 0, bl: 0 }, true);

const modZero = await jest.unstable_mockModule('../config/database.js', () => ({ default: prismaZero }));
const { cleanupExpiredAuthData: cleanupZero } = await import('../controllers/auth.controller.js');

// Swap module for non-zero case
await jest.resetModules();
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));
await jest.unstable_mockModule('../utils/lock.js', () => lock);
await jest.unstable_mockModule('../controllers/webhook.controller.js', () => ({ sendWebhook }));
await jest.unstable_mockModule('../config/database.js', () => ({ default: prismaSome }));
const { cleanupExpiredAuthData: cleanupSome } = await import('../controllers/auth.controller.js');

// Swap module for throwing case
await jest.resetModules();
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));
await jest.unstable_mockModule('../utils/lock.js', () => lock);
await jest.unstable_mockModule('../controllers/webhook.controller.js', () => ({ sendWebhook }));
await jest.unstable_mockModule('../config/database.js', () => ({ default: prismaFail }));
const { cleanupExpiredAuthData: cleanupFail } = await import('../controllers/auth.controller.js');

describe('auth.controller cleanupExpiredAuthData', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('skips when lock not acquired', async () => {
    lock.acquireLock.mockResolvedValue(false);
    await cleanupZero();
    expect(logger.logCronRun).toHaveBeenCalledWith('auth_cleanup', 'SKIPPED', expect.any(Object));
  });

  it('logs success with zero deletions', async () => {
    lock.acquireLock.mockResolvedValue(true);
    await cleanupZero();
    expect(logger.logCronRun).toHaveBeenCalledWith('auth_cleanup', 'SUCCESS', expect.objectContaining({ totalDeleted: 0 }));
    expect(sendWebhook).toHaveBeenCalledWith('AUTH_CLEANUP_SUCCESS', expect.objectContaining({ deletedCount: 0 }));
  });

  it('logs success with non-zero deletions and sends webhook', async () => {
    lock.acquireLock.mockResolvedValue(true);
    await cleanupSome();
    expect(logger.logCronRun).toHaveBeenCalledWith('auth_cleanup', 'SUCCESS', expect.objectContaining({ totalDeleted: 5 }));
    expect(sendWebhook).toHaveBeenCalledWith('AUTH_CLEANUP_SUCCESS', expect.objectContaining({ deletedCount: 5 }));
  });

  it('catches transaction error and logs FAILED without throwing', async () => {
    lock.acquireLock.mockResolvedValue(true);
    await cleanupFail();
    expect(logger.logCronRun).toHaveBeenCalledWith('auth_cleanup', 'FAILED', expect.any(Object));
    expect(sendWebhook).toHaveBeenCalledWith('AUTH_CLEANUP_FAILED', expect.any(Object));
  });
});