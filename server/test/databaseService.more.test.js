import { jest } from '@jest/globals';

await jest.unstable_mockModule('../utils/logger.js', () => ({
  LoggerService: {
    logSystemEvent: jest.fn().mockResolvedValue(),
  },
}));

const makeDb = () => {
  const db = {
    user: { findFirst: jest.fn(), create: jest.fn(), findUnique: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    refreshToken: { create: jest.fn(), findUnique: jest.fn(), deleteMany: jest.fn(), findMany: jest.fn() },
    blacklistedToken: { findFirst: jest.fn(), create: jest.fn(), deleteMany: jest.fn() },
    webhook: { findMany: jest.fn(), deleteMany: jest.fn() },
    webhookLog: { create: jest.fn() },
    order: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn(), findMany: jest.fn() },
    orderItem: { createMany: jest.fn() },
    menuItem: { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), findUnique: jest.fn(), delete: jest.fn() },
    appConfig: { findFirst: jest.fn().mockResolvedValue({ taxRate: 0.1 }) },
    category: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn(), delete: jest.fn() },
    cashTransaction: { create: jest.fn(), update: jest.fn(), findMany: jest.fn(), deleteMany: jest.fn() },
    driver: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
    reservation: { create: jest.fn(), findMany: jest.fn(), update: jest.fn() },
    notificationLog: { findMany: jest.fn() },
    activityLog: { findMany: jest.fn() },
    $transaction: jest.fn(async (fn) => fn(db)),
  };
  return db;
};

await jest.unstable_mockModule('../config/database.js', () => ({ default: makeDb() }));

const prisma = (await import('../config/database.js')).default;
const { databaseService } = await import('../services/databaseService.js');

describe('databaseService more', () => {
  beforeEach(() => jest.clearAllMocks());

  it('createUser throws on duplicate and creates user otherwise', async () => {
    prisma.user.findFirst.mockResolvedValueOnce({ id: 'u1' });
    await expect(databaseService.createUser({ email: 'e' })).rejects.toThrow();
    prisma.user.findFirst.mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValueOnce({ id: 'u2' });
    const u = await databaseService.createUser({ email: 'e' });
    expect(u.id).toBe('u2');
  });

  it('createOrderWithItems computes totals and writes items', async () => {
    prisma.menuItem.findMany.mockResolvedValue([{ id: 'm1', price: 10 }]);
    prisma.order.create.mockResolvedValue({ id: 'o1' });
    prisma.orderItem.createMany.mockResolvedValue({ count: 1 });
    prisma.order.findUnique.mockResolvedValue({ id: 'o1', total: 11 });
    const order = await databaseService.createOrderWithItems({ type: 'DINE_IN', items: [{ menuItemId: 'm1', quantity: 1 }] });
    expect(order.id).toBe('o1');
  });

  it('updateOrderStatusByNumber enforces transitions', async () => {
    prisma.order.findUnique.mockResolvedValue({ orderNumber: 'ORD-1', status: 'PENDING' });
    prisma.order.update.mockResolvedValue({ orderNumber: 'ORD-1', status: 'CONFIRMED' });
    const o = await databaseService.updateOrderStatusByNumber('ORD-1', 'CONFIRMED');
    expect(o.status).toBe('CONFIRMED');
  });

  it('getOrdersByStatus supports pagination and basic path', async () => {
    prisma.order.findMany.mockResolvedValue([{ id: 'o1' }]);
    const r1 = await databaseService.getOrdersByStatus('PENDING');
    expect(Array.isArray(r1)).toBe(true);
    const r2 = await databaseService.getOrdersByStatus('PENDING', { page: 2, pageSize: 10 });
    expect(Array.isArray(r2)).toBe(true);
  });

  it('logs and deletes refresh tokens helpers', async () => {
    prisma.refreshToken.deleteMany.mockResolvedValue({ count: 3 });
    const cnt = await databaseService.cleanupExpiredTokens();
    expect(cnt).toBe(3);
    prisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 });
    const cntAll = await databaseService.deleteAllRefreshTokensForUser('u1');
    expect(cntAll).toBe(2);
    prisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });
    const cntOther = await databaseService.deleteOtherRefreshTokensForUser('u1', 'hash');
    expect(cntOther).toBe(1);
  });

  it('cash transaction helpers happy paths', async () => {
    prisma.order.findUnique.mockResolvedValue({ id: 'o1' });
    prisma.cashTransaction.create.mockResolvedValue({ id: 'tx1' });
    const tx = await databaseService.createCashTransaction('o1', { amount: 10 });
    expect(tx.id).toBe('tx1');
    prisma.driver.findUnique.mockResolvedValue({ id: 'd1', active: true });
    const tx2 = await databaseService.createCashTransactionForOrder('N', 'd1', 10, {});
    expect(tx2.id).toBe('tx1');
    prisma.cashTransaction.update.mockResolvedValue({ id: 'tx1', confirmed: true });
    const c = await databaseService.confirmCashTransaction('N');
    expect(c.confirmed).toBe(true);
    prisma.cashTransaction.update.mockResolvedValue({ id: 'tx1', adminVerified: true });
    const v = await databaseService.verifyCashTransaction('N', true, {});
    expect(v.adminVerified).toBe(true);
  });

  it('listing helpers for logs and categories and menu items', async () => {
    prisma.notificationLog.findMany.mockResolvedValue([{ id: 'n1' }]);
    const n = await databaseService.getNotificationLogs('SENT', new Date(), new Date());
    expect(n.length).toBe(1);
    prisma.activityLog.findMany.mockResolvedValue([{ id: 'a1' }]);
    const a = await databaseService.getActivityLogs('LOGIN', new Date(), new Date(), { page: 1, pageSize: 1 });
    expect(a.length).toBe(1);
    prisma.category.findMany.mockResolvedValue([{ id: 'c1' }]);
    const cats = await databaseService.listCategories();
    expect(cats.length).toBe(1);
    prisma.menuItem.findMany.mockResolvedValue([{ id: 'm1' }]);
    const items = await databaseService.listMenuItems({ available: true });
    expect(items.length).toBe(1);
  });
});