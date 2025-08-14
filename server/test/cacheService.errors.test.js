import { jest } from '@jest/globals';

let listeners = {};
const mockClient = {
  on: jest.fn((ev, fn) => { listeners[ev] = fn; return mockClient; }),
  connect: jest.fn(async () => {}),
  get: jest.fn(async () => { throw new Error('get fail'); }),
  set: jest.fn(async () => { throw Object.assign(new Error('set fail'), { code: 'ESET' }); }),
  setEx: jest.fn(async () => { throw new Error('setEx fail'); }),
  incr: jest.fn(async () => { throw Object.assign(new Error('incr fail'), { code: 'EINCR' }); }),
  expire: jest.fn(async () => {}),
  del: jest.fn(async () => { throw new Error('del fail'); }),
  keys: jest.fn(async () => ['k1','k2']),
  quit: jest.fn(async () => {}),
  ping: jest.fn(async () => { throw new Error('ping fail'); }),
};

await jest.unstable_mockModule('redis', () => ({ createClient: () => mockClient }));
const logger = { logSystemEvent: jest.fn().mockResolvedValue(), logError: jest.fn().mockResolvedValue() };
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));

const cacheService = (await import('../services/cacheService.js')).default;

function connectRedis() { listeners['connect'] && listeners['connect'](); }

describe('cacheService error branches when connected', () => {
  beforeAll(() => { connectRedis(); });
  beforeEach(() => { jest.clearAllMocks(); });

  it('get throws and logs when client.get fails', async () => {
    await expect(cacheService.get('a')).rejects.toThrow('get fail');
    expect(logger.logError).toHaveBeenCalled();
  });
  it('set throws and logs when client.set fails', async () => {
    await expect(cacheService.set('a','1',{ EX: 1 })).rejects.toThrow('set fail');
    expect(logger.logError).toHaveBeenCalled();
  });
  it('setCache throws and logs when client.setEx fails', async () => {
    await expect(cacheService.setCache('a', { x: 1 }, 10)).rejects.toThrow('setEx fail');
    expect(logger.logError).toHaveBeenCalled();
  });
  it('increment throws and logs when client.incr fails', async () => {
    await expect(cacheService.increment('a', { EX: 1 })).rejects.toThrow('incr fail');
    expect(logger.logError).toHaveBeenCalled();
  });
  it('invalidateCache throws and logs when client.del fails', async () => {
    await expect(cacheService.invalidateCache('a')).rejects.toThrow('del fail');
    expect(logger.logError).toHaveBeenCalled();
  });
  it('invalidateByPrefix propagates error when del fails', async () => {
    mockClient.del.mockRejectedValueOnce(new Error('bulk del fail'));
    await expect(cacheService.invalidateByPrefix('p')).rejects.toThrow('bulk del fail');
    expect(logger.logError).toHaveBeenCalled();
  });
  it('ping returns ok=false when client.ping fails', async () => {
    const res = await cacheService.ping();
    expect(res.ok).toBe(false);
  });
});