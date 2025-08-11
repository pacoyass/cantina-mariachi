// server/test/auth.test.js
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import request from 'supertest';
import { jest } from '@jest/globals'; // 👈 ADD THIS

// Mocks
const mockLogger = {
  logSystemEvent: jest.fn(),
  logError: jest.fn(),
  logAudit: jest.fn(),
  logNotification: jest.fn(),
  logLogin: jest.fn(),
  flushQueue: jest.fn(),

};

await jest.unstable_mockModule('../utils/logger.js', () => ({
  LoggerService: mockLogger,
}));

const cacheMock = {
  get: jest.fn().mockResolvedValue(0),
  set: jest.fn().mockResolvedValue(),
  increment: jest.fn().mockResolvedValue(1),
};
await jest.unstable_mockModule('../services/cacheService.js', () => ({
  default: cacheMock,
}));

const dbMock = {
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  refreshUserTokens: jest.fn(),
  getUserById: jest.fn(),
  getRefreshToken: jest.fn(),
listRefreshTokensByUser: jest.fn(),
deleteAllRefreshTokensForUser: jest.fn(),
deleteOtherRefreshTokensForUser: jest.fn(),
};
await jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: dbMock,
}));

// Auth service stubs
await jest.unstable_mockModule('../services/authService.js', () => ({
    generateToken: async (payload, exp) => ({ token: `token-${(payload && payload.email) || 'user'}-${exp || 'exp'}`, exp: new Date(Date.now() + 900000) }),
    verifyToken: async () => ({ userId: 'u1', email: 'test@example.com', role: 'CUSTOMER', exp: new Date(Date.now() + 3600000) }),
    hashToken: async (t) => 'hash_' + t,
    // required by auth.middleware.js at import time
    isTokenBlacklisted: async () => false,
    blacklistToken: async () => ({ tokenHash: 'hash', expiresAt: new Date(Date.now() + 86400000) }),
    // controller imports an authService object (logout used)
    authService: { logout: async () => {} },
  }));

// Webhook noop
await jest.unstable_mockModule('../controllers/webhook.controller.js', () => ({
    sendWebhook: async () => ({}),
    default: { sendWebhook: async () => ({}) },
  }));

// Import after mocks
const authRoutes = (await import('../routes/auth.routes.js')).default;

// Build minimal express app for testing auth routes
function buildApp() {
  const app = express();
  app.use(session({ secret: 'test', resave: false, saveUninitialized: false }));
  app.use(express.json());
  app.use(cookieParser('test'));
  app.use('/api/auth', authRoutes);
  return app;
}

// Helper to hash password using bcrypt
async function hash(pw) {
  const bcrypt = (await import('bcrypt')).default;
  return await bcrypt.hash(pw, 10);
}

describe('Auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('register creates user and returns 201', async () => {
    const app = buildApp();
    dbMock.createUser.mockResolvedValue({ id: 'u1', email: 'new@ex.com', name: 'John', role: 'CUSTOMER' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@ex.com', password: 'Password1!', name: 'John' })
      .expect(201);

    expect(dbMock.createUser).toHaveBeenCalled();
    expect(res.body.status).toBe('success');
  });

  test('login sets cookies and returns 200', async () => {
    const app = buildApp();
    const pwHash = await hash('Secret123!');
    dbMock.getUserByEmail.mockResolvedValue({
      id: 'u1', email: 'test@example.com', password: pwHash, role: 'CUSTOMER', name: 'Test', phone: null, isActive: true,
    });
    dbMock.refreshUserTokens.mockResolvedValue({});

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Secret123!' })
      .expect(200);

    expect(dbMock.getUserByEmail).toHaveBeenCalled();
    const setCookies = res.headers['set-cookie'] || [];
    expect(setCookies.some(c => c.startsWith('accessToken='))).toBeTruthy();
    expect(setCookies.some(c => c.startsWith('refreshToken='))).toBeTruthy();
  });

  test('refresh-token issues new access token cookie (no rotation)', async () => {
    const app = buildApp();
    dbMock.getUserById.mockResolvedValue({ id: 'u1', email: 'test@example.com', role: 'CUSTOMER', name: 'T', phone: null, isActive: true });

    const res = await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', ['refreshToken=dummy'])
      .send({})
      .expect(200);

    const setCookies = res.headers['set-cookie'] || [];
    expect(setCookies.some(c => c.startsWith('accessToken='))).toBeTruthy();
    // ensure no refreshToken rotation present
    expect(setCookies.some(c => c.startsWith('refreshToken='))).toBeFalsy();
  });

  test('logout without auth returns 401', async () => {
    const app = buildApp();
    await request(app)
      .post('/api/auth/logout')
      .expect(401);
  });
  test('refresh-token rotates refresh cookie and returns new access token', async () => {
    const app = buildApp();
    // mock DB accept of provided refresh hash
    dbMock.getUserById.mockResolvedValue({ id: 'u1', email: 'test@example.com', role: 'CUSTOMER', name: 'T', phone: null, isActive: true });
    // provide a fake DB getRefreshToken for rotation path
    (dbMock.getRefreshToken || (dbMock.getRefreshToken = jest.fn())).mockResolvedValue({ id: 'rt1', expiresAt: new Date(Date.now() + 3600_000) });
    (dbMock.refreshUserTokens || (dbMock.refreshUserTokens = jest.fn())).mockResolvedValue({});
  
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .set('Cookie', ['refreshToken=prevRefresh'])
      .send({})
      .expect(200);
  
    const setCookies = res.headers['set-cookie'] || [];
    expect(setCookies.some(c => c.startsWith('accessToken='))).toBeTruthy();
    expect(setCookies.some(c => c.startsWith('refreshToken='))).toBeTruthy();
  });
  
  test('list sessions returns array', async () => {
    const app = buildApp();
    (dbMock.listRefreshTokensByUser || (dbMock.listRefreshTokensByUser = jest.fn())).mockResolvedValue([
      { id: 'rt1', expiresAt: new Date(Date.now() + 3600_000) }
    ]);
    const res = await request(app).get('/api/auth/sessions').expect(200);
    expect(Array.isArray(res.body.data.sessions)).toBe(true);
  });
  
  test('logout-all sessions returns 200 and clears cookies', async () => {
    const app = buildApp();
    (dbMock.deleteAllRefreshTokensForUser || (dbMock.deleteAllRefreshTokensForUser = jest.fn())).mockResolvedValue(2);
    const res = await request(app).post('/api/auth/logout-all').set('Cookie', ['accessToken=a']).send({}).expect(200);
    expect(res.body.status).toBe('success');
  });
  
  test('logout-others sessions returns 200', async () => {
    const app = buildApp();
    (dbMock.deleteOtherRefreshTokensForUser || (dbMock.deleteOtherRefreshTokensForUser = jest.fn())).mockResolvedValue(1);
    const res = await request(app).post('/api/auth/logout-others').set('Cookie', ['refreshToken=keep']).send({}).expect(200);
    expect(res.body.status).toBe('success');
  });
});