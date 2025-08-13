import { jest } from '@jest/globals';
import { requireRole, requireSelfOrRole } from '../middleware/rbac.middleware.js';

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('rbac middleware', () => {
  it('denies when no user', async () => {
    const mw = requireRole('ADMIN');
    const req = { originalUrl: '/x', method: 'GET' };
    const res = makeRes(); const next = jest.fn();
    await mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('allows when role matches', async () => {
    const mw = requireRole('ADMIN');
    const req = { user: { userId: 'u1', role: 'ADMIN' }, originalUrl: '/x', method: 'GET' };
    const res = makeRes(); const next = jest.fn();
    await mw(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('self or role: allows if same userId', async () => {
    const mw = requireSelfOrRole('id', ['ADMIN']);
    const req = { user: { userId: 'u1', role: 'USER' }, params: { id: 'u1' }, originalUrl: '/x', method: 'GET' };
    const res = makeRes(); const next = jest.fn();
    await mw(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('self or role: denies if not same and role not allowed', async () => {
    const mw = requireSelfOrRole('id', ['ADMIN']);
    const req = { user: { userId: 'u1', role: 'USER' }, params: { id: 'u2' }, originalUrl: '/x', method: 'GET' };
    const res = makeRes(); const next = jest.fn();
    await mw(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});