import { createError } from '../utils/response.js';

const buckets = new Map();

export default function rateLimit({ windowMs = 60_000, max = 60, key = (req) => req.ip + ':' + (req.baseUrl + req.path) } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const k = key(req);
    const entry = buckets.get(k) || { count: 0, reset: now + windowMs };
    if (now > entry.reset) {
      entry.count = 0;
      entry.reset = now + windowMs;
    }
    entry.count += 1;
    buckets.set(k, entry);

    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    res.setHeader('X-RateLimit-Reset', String(Math.floor(entry.reset / 1000)));

    if (entry.count > max) {
      return createError(res, 429, 'Too many requests', 'RATE_LIMITED', { retryAfter: Math.ceil((entry.reset - now) / 1000) });
    }
    next();
  };
}