import { jest } from '@jest/globals';
import { z } from 'zod';

jest.unstable_mockModule('../services/cacheService.js', () => ({
  default: {
    get: jest.fn().mockResolvedValue(0),
    increment: jest.fn().mockResolvedValue(1),
  }
}));

jest.unstable_mockModule('../utils/logger.js', () => ({
  LoggerService: {
    logError: jest.fn().mockResolvedValue(),
    logAudit: jest.fn().mockResolvedValue(),
  }
}));

const { default: validate, validateQuery } = await import('../middleware/validation.middleware.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('validation middleware', () => {
  it('passes and assigns parsed body', async () => {
    const schema = z.object({ a: z.string() });
    const mw = validate(schema);
    const req = { body: { a: 'x' }, originalUrl: '/x', ip: '1.1.1.1', method: 'GET' };
    const res = makeRes(); const next = jest.fn();
    await mw(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.body.a).toBe('x');
  });

  it('returns ZOD_VALIDATION_ERROR for invalid query', async () => {
    const schema = z.object({ q: z.string() });
    const mw = validateQuery(schema);
    const req = { query: {}, originalUrl: '/q', ip: '1.1.1.1', method: 'GET' };
    const res = makeRes(); const next = jest.fn();
    await mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].error.type).toBe('ZOD_VALIDATION_ERROR');
  });
});