import { jest } from '@jest/globals';

// Mock logger to avoid side effects
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logSystemEvent: jest.fn().mockResolvedValue(), logError: jest.fn().mockResolvedValue() } }));

// Build prisma stub
function makePrisma() {
  return {
    $connect: jest.fn().mockResolvedValue(),
    $disconnect: jest.fn().mockResolvedValue(),
    refreshToken: {
      deleteMany: jest.fn().mockResolvedValue({ count: 3 }),
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    blacklistedToken: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: 'bl1' }),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    webhook: {
      deleteMany: jest.fn().mockResolvedValue({ count: 2 }),
      findMany: jest.fn(),
    },
    webhookLog: { create: jest.fn().mockResolvedValue({ id: 'wl1' }) },
    order: {
      findMany: jest.fn().mockResolvedValue([]),
      findFirst: jest.fn(),
    },
    menuItem: { findMany: jest.fn() },
    cashSummary: { findFirst: jest.fn().mockResolvedValue({ id: 'cs1' }) },
  };
}

const prisma = makePrisma();
await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));

const { databaseService } = await import('../services/databaseService.js');

describe('databaseService branches', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('connect success and failure', async () => {
    await databaseService.connect();
    expect(prisma.$connect).toHaveBeenCalled();
    prisma.$connect.mockRejectedValueOnce(new Error('no db'));
    await expect(databaseService.connect()).rejects.toThrow('Database connection failed');
  });

  it('disconnect calls prisma.$disconnect', async () => {
    await databaseService.disconnect();
    expect(prisma.$disconnect).toHaveBeenCalled();
  });

  it('createUser throws when existing', async () => {
    prisma.user = { findFirst: jest.fn().mockResolvedValue({ id: 'u1' }), create: jest.fn() };
    await expect(databaseService.createUser({ email: 'e@x.com' })).rejects.toThrow('already exists');
  });

  it('cleanupExpiredTokens returns count and logs', async () => {
    const count = await databaseService.cleanupExpiredTokens();
    expect(count).toBe(3);
    expect(prisma.refreshToken.deleteMany).toHaveBeenCalled();
  });

  it('blacklisted token helpers: find/create/delete', async () => {
    const found = await databaseService.findBlacklistedToken('h');
    expect(found).toBeNull();
    const created = await databaseService.createBlacklistedToken({ tokenHash: 'h', expiresAt: new Date() });
    expect(created).toHaveProperty('id');
    const del = await databaseService.deleteExpiredBlacklistedToken('h');
    expect(del).toHaveProperty('count');
  });

  it('deleteExpiredWebhooks calls deleteMany and logs', async () => {
    const deleted = await databaseService.deleteExpiredWebhooks(30);
    expect(typeof deleted).toBe('number');
    expect(prisma.webhook.deleteMany).toHaveBeenCalled();
  });

  it('logWebhookDelivery writes to webhookLog', async () => {
    const rec = await databaseService.logWebhookDelivery({ webhookId: 'w1', event: 'E', payload: {}, status: 'SUCCESS', attempts: 1 });
    expect(rec).toHaveProperty('id');
  });

  it('listMenuItems applies filters when provided', async () => {
    prisma.menuItem.findMany.mockResolvedValueOnce([]);
    await databaseService.listMenuItems({ categoryId: 'c1', available: true });
    expect(prisma.menuItem.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ categoryId: 'c1', isAvailable: true }) }));
  });

  it('listOrdersAssignedToDriver returns findMany with include/orderBy', async () => {
    prisma.order.findMany.mockResolvedValueOnce([{ id: 'o1' }]);
    const res = await databaseService.listOrdersAssignedToDriver('d1');
    expect(Array.isArray(res)).toBe(true);
  });

  it('getOrderForTracking returns null when not found', async () => {
    prisma.order.findFirst.mockResolvedValueOnce(null);
    const res = await databaseService.getOrderForTracking('N','code');
    expect(res).toBeNull();
  });

  it('getCashSummaryByDriverAndDate returns record', async () => {
    const cs = await databaseService.getCashSummaryByDriver('d1', new Date());
    expect(cs).toHaveProperty('id');
  });
});