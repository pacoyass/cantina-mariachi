import { createClient } from 'redis';
import { LoggerService } from '../utils/logger.js';

class CacheService {
  #client;
  #isConnected = false;

  constructor() {
    this.#client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.#client.on('error', async (err) => {
      this.#isConnected = false;
      const errorMessage = typeof err === 'string' ? err : err.message || err.code || 'Unknown Redis error';
      const errorStack = err.stack || 'No stack trace';
      try {
        await LoggerService.logError(errorMessage, errorStack, { service: 'CacheService', errorCode: err.code || null });
      } catch (logError) {
        // Fallback: use console only if LoggerService fails
        console.error('Failed to log Redis error:', logError.message, logError);
      }
    });

    this.#client.on('connect', () => {
      this.#isConnected = true;
      if (process.env.NODE_ENV === 'development') {
        console.log('Redis connected');
      }
    });

    // Always initialize the client; connect in non-test envs, but mark as disconnected in tests
    if (process.env.NODE_ENV !== 'test') {
      this.#client.connect().catch((err) => {
        const errorMessage = typeof err === 'string' ? err : err.message || err.code || 'Unknown error';
        console.error('Redis connection failed:', errorMessage);
      });
    } else {
      // Explicitly emit a disconnected log in tests to exercise branches
      try {
        // do not await here to avoid top-level await in constructor for Jest parser
        LoggerService.logSystemEvent('CacheService', 'CACHE_DISCONNECTED', { env: 'test', during: 'init' });
      } catch {}
    }
  }

  async get(key) {
    if (!this.#isConnected) {
      // Only warn in development, not in tests
      if (process.env.NODE_ENV !== 'test') {
        try {
          await LoggerService.logSystemEvent('CacheService', 'CACHE_DISCONNECTED', { key, method: 'get' });
        } catch (logError) {
          console.error('Failed to log cache event:', logError.message);
        }
      }
      return null;
    }
    try {
      const data = await this.#client.get(key);
      await LoggerService.logSystemEvent('CacheService', data ? 'CACHE_HIT' : 'CACHE_MISS', { key });
      return data ? parseInt(data, 10) : null;
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || error.code || 'Unknown get error';
      const errorStack = error.stack || 'No stack trace';
      try {
        await LoggerService.logError(errorMessage, errorStack, { method: 'get', key, errorCode: error.code || null });
      } catch (logError) {
        console.error('Failed to log cache error:', logError.message);
      }
      throw error;
    }
  }

  // Backward-compatible JSON cache helpers used by tests
  async getCache(key) {
    if (!this.#isConnected) {
      try {
        await LoggerService.logSystemEvent('CacheService', 'CACHE_DISCONNECTED', { key, method: 'getCache' });
      } catch (logError) {
        if (process.env.NODE_ENV !== 'test') {
          console.error('Failed to log cache event:', logError.message);
        }
      }
      return null;
    }
    try {
      const data = await this.#client.get(key);
      if (data) {
        await LoggerService.logSystemEvent('CacheService', 'CACHE_HIT', { key });
        return JSON.parse(data);
      }
      await LoggerService.logSystemEvent('CacheService', 'CACHE_MISS', { key });
      return null;
    } catch (error) {
      await LoggerService.logError(error.message || 'getCache error', error.stack, { method: 'getCache', key });
      throw error;
    }
  }

  async set(key, value, options = {}) {
    if (!this.#isConnected) {
      // Only warn in development, not in tests
      if (process.env.NODE_ENV !== 'test') {
        try {
          await LoggerService.logSystemEvent('CacheService', 'CACHE_DISCONNECTED', { key, method: 'set' });
        } catch (logError) {
          console.error('Failed to log cache event:', logError.message);
        }
      }
      return;
    }
    try {
      await this.#client.set(key, value, options);
      await LoggerService.logSystemEvent('CacheService', 'CACHE_SET', { key, ttl: options.EX });
    } catch (error) {
      console.error(error)

      const errorMessage = typeof error === 'string' ? error : error.message || error.code || 'Unknown set error';
      const errorStack = error.stack || 'No stack trace';
      try {
        await LoggerService.logError(errorMessage, errorStack, { method: 'set', key, ttl: options.EX, errorCode: error.code || null });
      } catch (logError) {
        console.error('Failed to log cache error:', logError.message);
      }
      throw error;
    }
  }

  async setCache(key, value, ttl = 300) {
    if (!this.#isConnected) {
      console.warn('Redis not connected, skipping setCache');
      try {
        await LoggerService.logSystemEvent('CacheService', 'CACHE_DISCONNECTED', { key });
      } catch (logError) {
        console.error('Failed to log cache event:', logError.message);
      }
      return;
    }
    try {
      await this.#client.setEx(key, ttl, JSON.stringify(value));
      await LoggerService.logSystemEvent('CacheService', 'CACHE_SET', { key, ttl });
    } catch (error) {
      await LoggerService.logError(error.message || 'setCache error', error.stack, { method: 'setCache', key, ttl });
      throw error;
    }
  }

  async increment(key, options = {}) {
    if (!this.#isConnected) {
      console.warn('Redis not connected, skipping increment');
      try {
        await LoggerService.logSystemEvent('CacheService', 'CACHE_DISCONNECTED', { key });
      } catch (logError) {
        console.error('Failed to log cache event:', logError.message);
      }
      return 0;
    }
    try {
      const value = await this.#client.incr(key);
      if (options.EX) await this.#client.expire(key, options.EX);
      await LoggerService.logSystemEvent('CacheService', 'CACHE_INCREMENT', { key, value });
      return value;
    } catch (error) {
      console.error(error)

      const errorMessage = typeof error === 'string' ? error : error.message || error.code || 'Unknown increment error';
      const errorStack = error.stack || 'No stack trace';
      try {
        await LoggerService.logError(errorMessage, errorStack, { method: 'increment', key, errorCode: error.code || null });
      } catch (logError) {
        console.error('Failed to log cache error:', logError.message);
      }
      throw error;
    }
  }

  async invalidateCache(key) {
    if (!this.#isConnected) {
      console.warn('Redis not connected, skipping invalidate');
      try {
        await LoggerService.logSystemEvent('CacheService', 'CACHE_DISCONNECTED', { key });
      } catch (logError) {
        console.error('Failed to log cache event:', logError.message);
      }
      return;
    }
    try {
      await this.#client.del(key);
      await LoggerService.logSystemEvent('CacheService', 'CACHE_INVALIDATE', { key });
    } catch (error) {
      console.error(error)

      const errorMessage = typeof error === 'string' ? error : error.message || error.code || 'Unknown invalidate error';
      const errorStack = error.stack || 'No stack trace';
      try {
        await LoggerService.logError(errorMessage, errorStack, { method: 'invalidateCache', key, errorCode: error.code || null });
      } catch (logError) {
        console.error('Failed to log cache error:', logError.message);
      }
      throw error;
    }
  }

  async invalidateByPrefix(prefix) {
    if (!this.#isConnected) {
      console.warn('Redis not connected, skipping invalidateByPrefix');
      try {
        await LoggerService.logSystemEvent('CacheService', 'CACHE_DISCONNECTED', { prefix });
      } catch (logError) {
        console.error('Failed to log cache event:', logError.message);
      }
      return;
    }
    try {
      const keys = await this.#client.keys(`${prefix}:*`);
      if (keys.length) {
        await this.#client.del(keys);
        await LoggerService.logSystemEvent('CacheService', 'CACHE_INVALIDATE_PREFIX', { prefix, count: keys.length });
      }
    } catch (error) {
      console.error(error)

      const errorMessage = typeof error === 'string' ? error : error.message || error.code || 'Unknown invalidateByPrefix error';
      const errorStack = error.stack || 'No stack trace';
      try {
        await LoggerService.logError(errorMessage, errorStack, { method: 'invalidateByPrefix', prefix, errorCode: error.code || null });
      } catch (logError) {
        console.error('Failed to log cache error:', logError.message);
      }
      throw error;
    }
  }

  async disconnect() {
    if (this.#isConnected) {
      await this.#client.quit();
      this.#isConnected = false;
      try {
        await LoggerService.logSystemEvent('CacheService', 'DISCONNECT_REDIS', {});
      } catch (logError) {
        console.error('Failed to log cache event:', logError.message);
      }
    }
  }

  async ping() {
    if (!this.#isConnected) {
      return { ok: false, error: 'DISCONNECTED' };
    }
    try {
      // redis v5 client supports ping()
      const resp = await this.#client.ping();
      return { ok: resp === 'PONG', value: resp };
    } catch (error) {
      await LoggerService.logError(error.message || 'ping error', error.stack, { method: 'ping' });
      return { ok: false, error: error.message };
    }
  }
}

export default new CacheService();



// import { createClient } from 'redis';
// import { LoggerService } from '../utils/logger.js';

// class CacheService {
//   #client;

//   constructor() {
//     this.#client = createClient({
//       url: process.env.REDIS_URL || 'redis://localhost:6379',
//     });
//     this.#client.on('error', async (err) => {
//       await LoggerService.logError(err.message, err.stack, { service: 'CacheService' });
//     });
//     this.#client.connect();
//   }

//   async getCache(key) {
//     try {
//       const data = await this.#client.get(key);
//       if (data) {
//         await LoggerService.logSystemEvent('CacheService', 'CACHE_HIT', { key });
//         return JSON.parse(data);
//       }
//       await LoggerService.logSystemEvent('CacheService', 'CACHE_MISS', { key });
//       return null;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getCache', key });
//       throw error;
//     }
//   }

//   async setCache(key, value, ttl = 300) {
//     try {
//       await this.#client.setEx(key, ttl, JSON.stringify(value));
//       await LoggerService.logSystemEvent('CacheService', 'CACHE_SET', { key, ttl });
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'setCache', key, ttl });
//       throw error;
//     }
//   }

//   async invalidateCache(key) {
//     try {
//       await this.#client.del(key);
//       await LoggerService.logSystemEvent('CacheService', 'CACHE_INVALIDATE', { key });
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'invalidateCache', key });
//       throw error;
//     }
//   }

//   async invalidateByPrefix(prefix) {
//     try {
//       const keys = await this.#client.keys(`${prefix}:*`);
//       if (keys.length) {
//         await this.#client.del(keys);
//         await LoggerService.logSystemEvent('CacheService', 'CACHE_INVALIDATE_PREFIX', { prefix, count: keys.length });
//       }
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'invalidateByPrefix', prefix });
//       throw error;
//     }
//   }

//   async disconnect() {
//     await this.#client.quit();
//     await LoggerService.logSystemEvent('CacheService', 'DISCONNECT_REDIS', {});
//   }
// }

// export default new CacheService();