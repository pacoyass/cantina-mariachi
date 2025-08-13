import { jest } from '@jest/globals';

jest.unstable_mockModule('../utils/logger.js', () => ({
  LoggerService: {
    logSystemEvent: jest.fn().mockResolvedValue(),
    logError: jest.fn().mockResolvedValue(),
  }
}));

const { acquireLock, releaseLock } = await import('../utils/lock.js');

function makeTx() {
  const store = { taskName: null, lock: null };
  return {
    cronLock: {
      upsert: jest.fn(async ({ where, update, create }) => {
        if (store.lock && where.taskName === store.lock.taskName) {
          const err = new Error('conflict'); err.code = 'P2002'; throw err;
        }
        store.lock = { id: create?.id || 'x', taskName: where.taskName, instanceId: update?.instanceId || create.instanceId, lockedAt: new Date(Date.now()-1000) };
      }),
      findUnique: jest.fn(async ({ where }) => store.lock && store.lock.taskName === where.taskName ? store.lock : null),
      delete: jest.fn(async ({ where }) => { if (store.lock?.taskName === where.taskName) store.lock = null; else { const e=new Error('no'); e.code='P2025'; throw e; } }),
      create: jest.fn(async ({ data }) => { store.lock = { ...data }; }),
    }
  };
}

describe('lock util', () => {
  it('acquireLock returns true when free', async () => {
    const tx = makeTx();
    const ok = await acquireLock(tx, 'TASK', 'inst');
    expect(ok).toBe(true);
  });

  it('acquireLock returns true when stale lock is replaced', async () => {
    const tx = makeTx();
    // first acquire to create lock in past
    await acquireLock(tx, 'TASK', 'a');
    // simulate conflict and stale
    const ok = await acquireLock(tx, 'TASK', 'b');
    expect(ok).toBe(true);
  });

  it('releaseLock returns without throw if no lock exists', async () => {
    const tx = makeTx();
    await releaseLock(tx, 'NONE');
  });
});