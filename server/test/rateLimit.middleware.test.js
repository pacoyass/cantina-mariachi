import { jest } from '@jest/globals';
import rateLimit from '../middleware/rateLimit.middleware.js';
import * as cacheSvc from '../services/cacheService.js';

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); res.setHeader = jest.fn(); return res; };
const makeReq = (path='/test') => ({ ip: '1.2.3.4', baseUrl: '', path });

describe('rateLimit middleware', () => {
  it('uses Redis when available', async () => {
    jest.spyOn(cacheSvc.default, 'increment').mockResolvedValue(1);
    const mw = rateLimit({ windowMs: 1000, max: 2 });
    const req = makeReq('/ok'); const res = makeRes();
    const next = jest.fn();
    await mw(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('falls back to memory on Redis error', async () => {
    jest.spyOn(cacheSvc.default, 'increment').mockRejectedValue(new Error('redis down'));
    const mw = rateLimit({ windowMs: 1000, max: 1, key: (r)=> 'k' });
    const req = makeReq('/fallback'); const res = makeRes();
    const next = jest.fn();
    await mw(req, res, next);
    // second call should exceed
    await mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(429);
  });
});