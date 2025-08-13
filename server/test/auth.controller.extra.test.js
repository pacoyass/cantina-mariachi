import { jest } from '@jest/globals';

const mockLogger = { logAudit: jest.fn(), logError: jest.fn(), logNotification: jest.fn(), logLogin: jest.fn() };
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: mockLogger }));

const cache = { get: jest.fn().mockResolvedValue(0), set: jest.fn().mockResolvedValue(), increment: jest.fn().mockResolvedValue(1) };
await jest.unstable_mockModule('../services/cacheService.js', () => ({ default: cache }));

const db = {
  getUserByEmail: jest.fn(),
  refreshUserTokens: jest.fn(),
  getRefreshToken: jest.fn(),
  getUserById: jest.fn(),
  logout: jest.fn(),
  listRefreshTokensByUser: jest.fn(),
  deleteAllRefreshTokensForUser: jest.fn(),
  deleteOtherRefreshTokensForUser: jest.fn(),
};
await jest.unstable_mockModule('../services/databaseService.js', () => ({ databaseService: db }));

await jest.unstable_mockModule('../controllers/webhook.controller.js', () => ({ sendWebhook: jest.fn() }));

const authSvc = {
  generateToken: jest.fn(async (p, exp) => ({ token: `A.${exp || '15m'}`, exp: new Date(Date.now() + 60000) })),
  verifyToken: jest.fn(async () => ({ userId: 'u1', email: 'e', role: 'USER', name: 'N', active: true, phone: null })),
  hashToken: jest.fn(async (t)=> `h:${t}`),
};
await jest.unstable_mockModule('../services/authService.js', () => authSvc);

await jest.unstable_mockModule('../config/database.js', () => ({ default: { refreshToken: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) } } }));

const { register, login, refreshToken, logout, getToken, listSessions, logoutAllSessions, logoutOtherSessions, revokeSessionById } = await import('../controllers/auth.controller.js');

function makeRes() {
  const res = { headers: {}, cookiesCleared: [], setHeader: jest.fn(), cookie: jest.fn(), clearCookie: jest.fn(function(n){ this.cookiesCleared.push(n); }), status: jest.fn(function(c){ this.statusCode=c; return this; }), json: jest.fn(function(b){ this.body=b; return this; }) };
  return res;
}

describe('auth.controller negative and branches', () => {
  beforeEach(() => { jest.clearAllMocks(); delete process.env.REFRESH_ROTATION; });

  it('register: missing fields returns 400', async () => {
    const res = makeRes();
    await register({ body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('login: missing email/password returns 400', async () => {
    const res = makeRes();
    await login({ body: {} , get: ()=>null, ip: '1.1.1.1' }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('login: wrong password returns 401', async () => {
    const bcrypt = (await import('bcrypt')).default;
    const hash = await bcrypt.hash('Other123!', 10);
    db.getUserByEmail.mockResolvedValue({ id: 'u1', email: 'e', password: hash, role: 'USER', name: 'N', phone: null, isActive: true });
    const res = makeRes();
    await login({ body: { email: 'e', password: 'Secret123!' }, get: ()=>null, ip: '1.1.1.1' }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('refreshToken: no cookie returns 401', async () => {
    const res = makeRes();
    await refreshToken({ body: {}, cookies: {}, get: ()=>null }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('refreshToken: rotation disabled issues only access token', async () => {
    process.env.REFRESH_ROTATION = 'false';
    const res = makeRes();
    await refreshToken({ body: { refreshToken: 'r' }, cookies: {}, get: ()=>null }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(db.refreshUserTokens).not.toHaveBeenCalled();
  });

  it('refreshToken: missing stored token or expired returns 401', async () => {
    process.env.REFRESH_ROTATION = 'true';
    db.getRefreshToken.mockResolvedValueOnce(null);
    const res = makeRes();
    await refreshToken({ body: { refreshToken: 'r' }, cookies: {}, get: ()=>null }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('logout: missing access token returns 401', async () => {
    const res = makeRes();
    await logout({ headers: {}, cookies: {} }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('getToken: missing tokens returns 401', async () => {
    const res = makeRes();
    await getToken({ headers: {}, cookies: {} }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('listSessions: unauthorized without req.user', async () => {
    const res = makeRes();
    await listSessions({ query: {} }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('logoutAllSessions: unauthorized without req.user', async () => {
    const res = makeRes();
    await logoutAllSessions({}, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('logoutOtherSessions: unauthorized without req.user', async () => {
    const res = makeRes();
    await logoutOtherSessions({ cookies: {} }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('logoutOtherSessions: missing current token returns 400', async () => {
    const res = makeRes();
    await logoutOtherSessions({ user: { userId: 'u1' }, cookies: {}, body: {} }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('revokeSessionById: deletes and returns 200', async () => {
    const res = makeRes();
    await revokeSessionById({ user: { userId: 'u1' }, params: { id: 'rt1' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});