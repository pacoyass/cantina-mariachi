import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import request from 'supertest';
import { jest } from '@jest/globals';

// Logger mock
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
await jest.unstable_mockModule('../services/cacheService.js', () => ({
    default: { get: jest.fn().mockResolvedValue(0), set: jest.fn(), increment: jest.fn().mockResolvedValue(1) },
  }));
// Mock auth middleware to attach a user and proceed
await jest.unstable_mockModule('../middleware/auth.middleware.js', () => ({
  default: async (req, res, next) => {
    req.user = { userId: 'u1', email: 'test@example.com', role: 'CUSTOMER' };
    return next();
  },
}));

// DB service mock
const dbMock = {
  getUserById: jest.fn(),
  updateUser: jest.fn(),
};
await jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: dbMock,
}));

// Import after mocks
const userRoutes = (await import('../routes/user.routes.js')).default;

function buildApp() {
  const app = express();
  app.use(session({ secret: 'test', resave: false, saveUninitialized: false }));
  app.use(express.json());
  app.use(cookieParser('test'));
  app.use('/api/users', userRoutes);
  return app;
}

async function hash(pw) {
  const bcrypt = (await import('bcrypt')).default;
  return await bcrypt.hash(pw, 10);
}

describe('User profile routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/users/me returns profile', async () => {
    const app = buildApp();
    dbMock.getUserById.mockResolvedValue({ id: 'u1', email: 'test@example.com', name: 'Test', phone: '123', role: 'CUSTOMER' });

    const res = await request(app).get('/api/users/me').expect(200);

    expect(dbMock.getUserById).toHaveBeenCalledWith('u1', { password: false });
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe('test@example.com');
  });

  test('PUT /api/users/me updates profile', async () => {
    const app = buildApp();
    dbMock.updateUser.mockResolvedValue({ id: 'u1', email: 'test@example.com', name: 'New Name', phone: '999', role: 'CUSTOMER' });

    const res = await request(app)
      .put('/api/users/me')
      .send({ name: 'New Name', phone: '1234567' })
      .expect(200);

    expect(dbMock.updateUser).toHaveBeenCalledWith('u1', { name: 'New Name', phone: '1234567' });
    expect(res.body.data.user.name).toBe('New Name');
  });

  test('PUT /api/users/me/password changes password with correct current', async () => {
    const app = buildApp();
    const pwHash = await hash('OldPass1!');
    dbMock.getUserById.mockResolvedValue({ id: 'u1', email: 'test@example.com', password: pwHash, role: 'CUSTOMER' });
    dbMock.updateUser.mockResolvedValue({ id: 'u1' });

    const res = await request(app)
      .put('/api/users/me/password')
      .send({ currentPassword: 'OldPass1!', newPassword: 'NewPass2!' })
      .expect(200);

    expect(dbMock.updateUser).toHaveBeenCalled();
    expect(res.body.status).toBe('success');
  });

  test('PUT /api/users/me/password fails with wrong current', async () => {
    const app = buildApp();
    const pwHash = await hash('OldPass1!');
    dbMock.getUserById.mockResolvedValue({ id: 'u1', email: 'test@example.com', password: pwHash, role: 'CUSTOMER' });

    const res = await request(app)
      .put('/api/users/me/password')
      .send({ currentPassword: 'WrongPass!', newPassword: 'NewPass2!' })
      .expect(400);

    expect(res.body.status).toBe('error');
    expect(res.body.error?.type).toBe('INVALID_PASSWORD');
  });
});