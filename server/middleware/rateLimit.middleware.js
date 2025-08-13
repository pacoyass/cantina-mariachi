import { createError } from '../utils/response.js';
import cacheService from '../services/cacheService.js';

const memoryBuckets = new Map();

export default function rateLimit({ windowMs = 60_000, max = 60, key = (req) => req.ip + ':' + (req.baseUrl + req.path) } = {}) {
  return async (req, res, next) => {
    const now = Date.now();
    const k = key(req);

    try {
      // Try Redis counter
      const count = await cacheService.increment(`ratelimit:${k}`, { EX: Math.ceil(windowMs / 1000) });
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - count)));
      if (count > max) {
        return createError(res, 429, 'Too many requests', 'RATE_LIMITED', { retryAfter: Math.ceil(windowMs / 1000) });
      }
      return next();
    } catch (e) {
      // Fallback in-memory
      const entry = memoryBuckets.get(k) || { count: 0, reset: now + windowMs };
      if (now > entry.reset) {
        entry.count = 0;
        entry.reset = now + windowMs;
      }
      entry.count += 1;
      memoryBuckets.set(k, entry);

      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
      res.setHeader('X-RateLimit-Reset', String(Math.floor(entry.reset / 1000)));

      if (entry.count > max) {
        return createError(res, 429, 'Too many requests', 'RATE_LIMITED', { retryAfter: Math.ceil((entry.reset - now) / 1000) });
      }
      return next();
    }
  };
}