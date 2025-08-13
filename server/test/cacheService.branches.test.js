import { jest } from '@jest/globals';

let listeners = {};
const mockClient = {
  on: jest.fn((ev, cb) => { listeners[ev] = cb; }),
  connect: jest.fn(() => Promise.resolve()),
  get: jest.fn(),
  set: jest.fn(),
  setEx: jest.fn(),
  incr: jest.fn(),
  expire: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  quit: jest.fn(),
  ping: jest.fn(),
};

jest.unstable_mockModule('redis', () => ({ createClient: () => mockClient }));

jest.unstable_mockModule('../utils/logger.js', () => ({
  LoggerService: {
    logSystemEvent: jest.fn().mockResolvedValue(),
    logError: jest.fn().mockResolvedValue(),
  },
}));

function connectRedis() { listeners['connect'] && listeners['connect'](); }
function errorRedis(err) { listeners['error'] && listeners['error'](err); }

// Import cacheService after mocks
const cacheService = (await import('../services/cacheService.js')).default;
const { LoggerService } = await import('../utils/logger.js');

describe('cacheService disconnected branches', () => {
  beforeEach(() => { jest.clearAllMocks(); });
  it('getCache returns null when disconnected and logs', async () => {
    const v = await cacheService.getCache('k');
    expect(v).toBeNull();
    expect(LoggerService.logSystemEvent).toHaveBeenCalled();
  });
  it('handles error events and logs', async () => {
    errorRedis(new Error('boom'));
    const v = await cacheService.get('x');
    expect(v).toBeNull();
  });
});

describe('cacheService connected branches', () => {
  beforeAll(() => { connectRedis(); });
  beforeEach(() => { jest.clearAllMocks(); });

  it('connected: getCache hit and miss', async () => {
    mockClient.get.mockResolvedValueOnce(JSON.stringify({ a: 1 }));
    let res = await cacheService.getCache('k1');
    expect(res).toEqual({ a: 1 });
    mockClient.get.mockResolvedValueOnce(null);
    res = await cacheService.getCache('k2');
    expect(res).toBeNull();
  });

  it('setCache sets with TTL and invalidate deletes', async () => {
    await cacheService.setCache('k', { x: 1 }, 10);
    expect(mockClient.setEx).toHaveBeenCalledWith('k', 10, JSON.stringify({ x: 1 }));
    await cacheService.invalidateCache('k');
    expect(mockClient.del).toHaveBeenCalledWith('k');
  });

  it('increment sets expiry and returns value', async () => {
    mockClient.incr.mockResolvedValueOnce(2);
    await cacheService.increment('rk', { EX: 5 });
    expect(mockClient.expire).toHaveBeenCalledWith('rk', 5);
  });

  it('invalidateByPrefix deletes matched keys', async () => {
    mockClient.keys.mockResolvedValueOnce(['p:a', 'p:b']);
    await cacheService.invalidateByPrefix('p');
    expect(mockClient.del).toHaveBeenCalledWith(['p:a', 'p:b']);
  });

  it('ping returns ok when connected', async () => {
    mockClient.ping.mockResolvedValueOnce('PONG');
    const res = await cacheService.ping();
    expect(res.ok).toBe(true);
  });
});