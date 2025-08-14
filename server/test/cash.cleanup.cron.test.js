import { jest } from '@jest/globals';

const logger = {
  logSystemEvent: jest.fn().mockResolvedValue(),
  logError: jest.fn().mockResolvedValue(),
  logAudit: jest.fn().mockResolvedValue(),
  logCronRun: jest.fn().mockResolvedValue(),
};
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));

const lock = { acquireLock: jest.fn(), releaseLock: jest.fn().mockResolvedValue() };
await jest.unstable_mockModule('../utils/lock.js', () => lock);

function makePrisma(throwTx = false) {
  return {
    $transaction: jest.fn(async (fn) => {
      if (throwTx) throw new Error('tx error');
      const tx = {
        cashSummary: { deleteMany: jest.fn().mockResolvedValue({ count: 4 }) },
        cashTransaction: { deleteMany: jest.fn().mockResolvedValue({ count: 7 }) },
      };
      return fn(tx);
    })
  };
}

const prisma = makePrisma(false);
await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));
const { cleanupCashData } = await import('../controllers/cash.controller.js');

// For failure case reload with throwing prisma
await jest.resetModules();
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));
await jest.unstable_mockModule('../utils/lock.js', () => lock);
const prismaThrow = makePrisma(true);
await jest.unstable_mockModule('../config/database.js', () => ({ default: prismaThrow }));
const { cleanupCashData: cleanupCashDataThrow } = await import('../controllers/cash.controller.js');

describe('cash.controller cleanupCashData', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('skips when lock not acquired', async () => {
    lock.acquireLock.mockResolvedValue(false);
    await cleanupCashData(365);
    expect(logger.logCronRun).toHaveBeenCalledWith('cash_cleanup', 'SKIPPED', expect.any(Object));
  });

  it('logs success with deletions when lock acquired', async () => {
    lock.acquireLock.mockResolvedValue(true);
    await cleanupCashData(365);
    expect(logger.logCronRun).toHaveBeenCalledWith('cash_cleanup', 'SUCCESS', expect.objectContaining({ deletedSummaries: 4, deletedTransactions: 7 }));
    expect(lock.releaseLock).toHaveBeenCalled();
  });

  it('rethrows on transaction failure and logs FAILED', async () => {
    lock.acquireLock.mockResolvedValue(true);
    await expect(cleanupCashDataThrow(365)).rejects.toThrow('tx error');
    expect(logger.logCronRun).toHaveBeenCalledWith('cash_cleanup', 'FAILED', expect.any(Object));
  });
});