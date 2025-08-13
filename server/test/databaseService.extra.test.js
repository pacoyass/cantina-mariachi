import { jest } from '@jest/globals';

await jest.unstable_mockModule('../utils/logger.js', () => ({
  LoggerService: {
    logSystemEvent: jest.fn().mockResolvedValue(),
  }
}));

await jest.unstable_mockModule('../config/database.js', () => ({
  default: {
    user: { findFirst: jest.fn(), create: jest.fn() },
    refreshToken: { create: jest.fn(), deleteMany: jest.fn(), findUnique: jest.fn() },
    blacklistedToken: { deleteMany: jest.fn(), create: jest.fn(), findFirst: jest.fn() },
  }
}));

const prisma = (await import('../config/database.js')).default;
const { databaseService } = await import('../services/databaseService.js');

// Mock authService.verifyToken and hashToken used by logout
jest.unstable_mockModule('../services/authService.js', () => ({
  verifyToken: jest.fn(async () => ({ exp: Date.now() + 60000 })),
  hashToken: jest.fn(async (t) => `hash:${t}`),
}));

describe('databaseService extras', () => {
  beforeEach(() => jest.clearAllMocks());

  it('createUser throws on duplicate email', async () => {
    prisma.user.findFirst.mockResolvedValue({ id: 'u1' });
    await expect(databaseService.createUser({ email: 'e@x.com' })).rejects.toThrow('User with this email already exists');
  });

  it('refreshUserTokens creates refresh token and logs', async () => {
    prisma.refreshToken.create.mockResolvedValue({ id: 'rt1' });
    const result = await databaseService.refreshUserTokens('u1', 'h', new Date(), null, { userAgent: 'UA', ip: '1.1.1.1' });
    expect(result).toHaveProperty('id');
    expect(prisma.refreshToken.create).toHaveBeenCalled();
  });

  it('logout blacklists token even if verify fails gracefully', async () => {
    const { verifyToken } = await import('../services/authService.js');
    verifyToken.mockRejectedValueOnce(new Error('bad'));
    prisma.blacklistedToken.deleteMany.mockResolvedValue({ count: 0 });
    prisma.blacklistedToken.create.mockResolvedValue({ id: 'bl1' });
    const res = await databaseService.logout('token');
    expect(res).toHaveProperty('id', 'bl1');
    expect(prisma.blacklistedToken.create).toHaveBeenCalled();
  });
});