import { jest } from '@jest/globals'; // 👈 ADD THIS

const mockRedisClient = {
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(),
    get: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    keys: jest.fn(),
    quit: jest.fn().mockResolvedValue(),
  };

await jest.unstable_mockModule('redis', () => ({
    createClient: () => mockRedisClient,
  }));
  const mockLogger = {
    logSystemEvent: jest.fn(),
    logError: jest.fn(),
    enqueueLog: jest.fn(),
    flushQueue: jest.fn(),
  };

  await jest.unstable_mockModule('../utils/logger.js', () => ({
    LoggerService: mockLogger,
  }));
  
  const cacheService = (await import('../services/cacheService.js')).default;
  const { LoggerService } = await import('../utils/logger.js');


// Ensure internal client connected state is true for tests
beforeAll(() => {
  // simulate connect event
  const connectHandler = mockRedisClient.on.mock.calls.find(call => call[0] === 'connect')?.[1];
  if (connectHandler) connectHandler();
});


describe('CacheService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCache should return cached data', async () => {
    const key = 'order:1';
    const value = { id: '1', orderNumber: 'ORD001' };
    mockRedisClient.get.mockResolvedValue(JSON.stringify(value));

    const result = await cacheService.getCache(key);
    expect(mockRedisClient.get).toHaveBeenCalledWith(key);
    expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('CacheService', 'CACHE_HIT', { key });
    expect(result).toEqual(value);
  });

  test('getCache should return null on miss', async () => {
    const key = 'order:1';
    mockRedisClient.get.mockResolvedValue(null);

    const result = await cacheService.getCache(key);
    expect(mockRedisClient.get).toHaveBeenCalledWith(key);
    expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('CacheService', 'CACHE_MISS', { key });
    expect(result).toBeNull();
  });

  test('getCache should log error on failure', async () => {
    const key = 'order:1';
    const error = new Error('Redis get failed');
    mockRedisClient.get.mockRejectedValue(error);

    await expect(cacheService.getCache(key)).rejects.toThrow('Redis get failed');
    expect(LoggerService.logError).toHaveBeenCalledWith(error.message, error.stack, { method: 'getCache', key });
  });

  test('setCache should store data with TTL', async () => {
    const key = 'order:1';
    const value = { id: '1', orderNumber: 'ORD001' };
    const ttl = 300;
    mockRedisClient.setEx.mockResolvedValue('OK');

    await cacheService.setCache(key, value, ttl);
    expect(mockRedisClient.setEx).toHaveBeenCalledWith(key, ttl, JSON.stringify(value));
    expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('CacheService', 'CACHE_SET', { key, ttl });
  });

  test('invalidateCache should delete key', async () => {
    const key = 'order:1';
    mockRedisClient.del.mockResolvedValue(1);

    await cacheService.invalidateCache(key);
    expect(mockRedisClient.del).toHaveBeenCalledWith(key);
    expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('CacheService', 'CACHE_INVALIDATE', { key });
  });

  test('invalidateByPrefix should delete matching keys', async () => {
    const prefix = 'order';
    const keys = ['order:1', 'order:2'];
    mockRedisClient.keys.mockResolvedValue(keys);
    mockRedisClient.del.mockResolvedValue(keys.length);

    await cacheService.invalidateByPrefix(prefix);
    expect(mockRedisClient.keys).toHaveBeenCalledWith(`${prefix}:*`);
    expect(mockRedisClient.del).toHaveBeenCalledWith(keys);
    expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('CacheService', 'CACHE_INVALIDATE_PREFIX', {
      prefix,
      count: keys.length,
    });
  });

  test('disconnect should close Redis connection', async () => {
    await cacheService.disconnect();
    expect(mockRedisClient.quit).toHaveBeenCalled();
    expect(LoggerService.logSystemEvent).toHaveBeenCalledWith('CacheService', 'DISCONNECT_REDIS', {});
  });
});
