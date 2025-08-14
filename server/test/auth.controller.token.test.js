import { jest } from '@jest/globals';

await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logAudit: jest.fn(), logError: jest.fn(), logNotification: jest.fn() } }));

const db = { getUserById: jest.fn(), findBlacklistedToken: jest.fn() };
await jest.unstable_mockModule('../services/databaseService.js', () => ({ databaseService: db }));

const { getToken } = await import('../controllers/auth.controller.js');

function makeRes() { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; }

describe('auth.controller getToken branches', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('missing tokens returns 401', async () => {
    const res = makeRes();
    await getToken({ headers: {}, cookies: {} }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('blacklisted token returns 401', async () => {
    db.getUserById.mockResolvedValueOnce({ id: 'u1', email: 'e', role: 'USER', name: 'N', phone: null });
    db.findBlacklistedToken = jest.fn().mockResolvedValueOnce({ id: 'b1' });
    const res = makeRes();
    await getToken({ headers: { authorization: 'Bearer a' }, cookies: { refreshToken: 'r' }, user: { userId: 'u1' } }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('valid tokens return 200', async () => {
    db.getUserById.mockResolvedValueOnce({ id: 'u1', email: 'e', role: 'USER', name: 'N', phone: null });
    db.findBlacklistedToken = jest.fn().mockResolvedValueOnce(null);
    const res = makeRes();
    await getToken({ headers: { authorization: 'Bearer a' }, cookies: { refreshToken: 'r' }, user: { userId: 'u1', id: 'u1' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});