import { createClient } from 'redis';
import { LoggerService } from '../utils/logger.js';

class CacheService {
  #client;

  constructor() {
    this.#client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    this.#client.on('error', async (err) => {
      await LoggerService.logError(err.message, err.stack, { service: 'CacheService' });
    });
    this.#client.connect();
  }

  async getCache(key) {
    try {
      const data = await this.#client.get(key);
      if (data) {
        await LoggerService.logSystemEvent('CacheService', 'CACHE_HIT', { key });
        return JSON.parse(data);
      }
      await LoggerService.logSystemEvent('CacheService', 'CACHE_MISS', { key });
      return null;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getCache', key });
      throw error;
    }
  }

  async setCache(key, value, ttl = 300) {
    try {
      await this.#client.setEx(key, ttl, JSON.stringify(value));
      await LoggerService.logSystemEvent('CacheService', 'CACHE_SET', { key, ttl });
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'setCache', key, ttl });
      throw error;
    }
  }

  async invalidateCache(key) {
    try {
      await this.#client.del(key);
      await LoggerService.logSystemEvent('CacheService', 'CACHE_INVALIDATE', { key });
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'invalidateCache', key });
      throw error;
    }
  }

  async invalidateByPrefix(prefix) {
    try {
      const keys = await this.#client.keys(`${prefix}:*`);
      if (keys.length) {
        await this.#client.del(keys);
        await LoggerService.logSystemEvent('CacheService', 'CACHE_INVALIDATE_PREFIX', { prefix, count: keys.length });
      }
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'invalidateByPrefix', prefix });
      throw error;
    }
  }

  async disconnect() {
    await this.#client.quit();
    await LoggerService.logSystemEvent('CacheService', 'DISCONNECT_REDIS', {});
  }
}

export default new CacheService();