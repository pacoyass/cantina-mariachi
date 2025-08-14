import { jest } from '@jest/globals';

const mockLogger = { logAudit: jest.fn(), logError: jest.fn(), logNotification: jest.fn(), logLogin: jest.fn() };
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: mockLogger }));

const cache = { get: jest.fn(), set: jest.fn(), increment: jest.fn() };
await jest.unstable_mockModule('../services/cacheService.js', () => ({ default: cache }));

const db = {
  getUserByEmail: jest.fn(),
  refreshUserTokens: jest.fn(),
  getRefreshToken: jest.fn(),
  getUserById: jest.fn(),
  listRefreshTokensByUser: jest.fn(),
};
await jest.unstable_mockModule('../services/databaseService.js', () => ({ databaseService: db }));

await jest.unstable_mockModule('../controllers/webhook.controller.js', () => ({ sendWebhook: jest.fn() }));

const authSvc = {
  generateToken: jest.fn(async (p, exp) => ({ token: `T.${exp||'15m'}`, exp: new Date(Date.now()+60000) })),
  verifyToken: jest.fn(async () => ({ userId: 'u1', email: 'e', role: 'USER', name: 'N', active: true, phone: null })),
  hashToken: jest.fn(async (t)=> `h:${t}`),
};
await jest.unstable_mockModule('../services/authService.js', () => authSvc);

const { login, refreshToken, listSessions } = await import('../controllers/auth.controller.js');

function makeRes() { const res = { setHeader: jest.fn(), cookie: jest.fn() }; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; }

describe('auth.controller more branches', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('login: rate limited when attempts >=5 returns 429', async () => {
    cache.get.mockResolvedValueOnce(5);
    const res = makeRes();
    await login({ body: { email: 'e', password: 'p' }, get: ()=>null, ip: '1.1.1.1' }, res);
    expect(res.status).toHaveBeenCalledWith(429);
  });

  it('login: db error fetching user returns 401 and increments attempts', async () => {
    cache.get.mockResolvedValueOnce(0);
    db.getUserByEmail.mockRejectedValueOnce(new Error('db error'));
    const res = makeRes();
    await login({ body: { email: 'e', password: 'p' }, get: ()=>null, ip: '1.1.1.1' }, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(cache.increment).toHaveBeenCalled();
  });

  it('login: token storage failure returns 500 AUTH_ERROR', async () => {
    const bcrypt = (await import('bcrypt')).default;
    const hash = await bcrypt.hash('p', 10);
    cache.get.mockResolvedValueOnce(0);
    db.getUserByEmail.mockResolvedValueOnce({ id: 'u1', email: 'e', password: hash, role: 'USER', name: 'N', phone: null, isActive: true });
    db.refreshUserTokens.mockRejectedValueOnce(new Error('store fail'));
    const res = makeRes();
    await login({ body: { email: 'e', password: 'p' }, get: ()=>null, ip: '1.1.1.1' }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('refreshToken: user not found returns 401', async () => {
    db.getRefreshToken.mockResolvedValueOnce({ id: 'rt', expiresAt: new Date(Date.now()+3600_000) });
    db.getUserById.mockResolvedValueOnce(null);
    const res = makeRes();
    await refreshToken({ body: { refreshToken: 'r' }, cookies: {}, get: ()=>null }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('listSessions: returns hasMore true when page full', async () => {
    db.listRefreshTokensByUser.mockResolvedValueOnce([{ id: 'rt1', expiresAt: new Date(), userAgent: 'UA', ip: '1.1.1.1' }]);
    const res = makeRes();
    await listSessions({ user: { userId: 'u1' }, query: { page: '1', pageSize: '1' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data.hasMore).toBe(true);
  });
});