import { jest } from '@jest/globals';

await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logSystemEvent: jest.fn().mockResolvedValue(), logError: jest.fn().mockResolvedValue() } }));
const { acquireLock, releaseLock, isLockStale } = await import('../utils/lock.js');

function makeTx() {
  const tx = {
    cronLock: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    },
  };
  return tx;
}

describe('lock util more branches', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('acquireLock retries on P2034 then fails after maxRetries', async () => {
    const tx = makeTx();
    tx.cronLock.upsert.mockRejectedValueOnce({ code: 'P2034' })
      .mockRejectedValueOnce({ code: 'P2034' });
    const ok = await acquireLock(tx, 'TASK', 'inst', 60, 1);
    expect(ok).toBe(false);
  });

  it('acquireLock throws on generic error after retries', async () => {
    const tx = makeTx();
    tx.cronLock.upsert.mockRejectedValueOnce({ code: 'X' })
      .mockRejectedValueOnce({ code: 'X' })
      .mockRejectedValueOnce({ code: 'X' })
      .mockRejectedValueOnce({ code: 'X' });
    await expect(acquireLock(tx, 'TASK', 'inst', 60, 3)).rejects.toBeDefined();
  });

  it('isLockStale true/false and error path', async () => {
    const tx = makeTx();
    const old = new Date(Date.now() - 2 * 60 * 60 * 1000);
    tx.cronLock.findUnique.mockResolvedValueOnce({ lockedAt: old });
    const stale = await isLockStale(tx, 'TASK', 30);
    expect(stale).toBe(true);
    tx.cronLock.findUnique.mockResolvedValueOnce({ lockedAt: new Date() });
    const fresh = await isLockStale(tx, 'TASK', 60);
    expect(fresh).toBe(false);
    tx.cronLock.findUnique.mockRejectedValueOnce(new Error('db'));
    const err = await isLockStale(tx, 'TASK', 60);
    expect(err).toBe(false);
  });
});