import { jest } from '@jest/globals';

// Mock prisma models with basic findMany counting
const mk = () => ({ findMany: jest.fn().mockResolvedValue([]) });
const order = mk(); const notificationLog = mk(); const activityLog = mk(); const refreshToken = { findMany: jest.fn().mockResolvedValue([]) };
await jest.unstable_mockModule('../config/database.js', () => ({ default: { order, notificationLog, activityLog, refreshToken } }));

const { databaseService } = await import('../services/databaseService.js');

describe('databaseService pagination branches', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('getOrdersByStatus: no options -> simple findMany', async () => {
    await databaseService.getOrdersByStatus('PENDING');
    expect(order.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { status: 'PENDING' } }));
  });

  it('getOrdersByStatus: with pagination computes skip/take', async () => {
    await databaseService.getOrdersByStatus('PENDING', { page: 2, pageSize: 10 });
    expect(order.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 10, take: 10 }));
  });

  it('getNotificationLogs: paginated branch', async () => {
    await databaseService.getNotificationLogs('SENT', new Date('2025-01-01'), new Date('2025-01-31'), { page: 3, pageSize: 25 });
    expect(notificationLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 50, take: 25 }));
  });

  it('getActivityLogs: non-paginated branch', async () => {
    await databaseService.getActivityLogs('TYPE', new Date('2025-01-01'), new Date('2025-01-31'));
    expect(activityLog.findMany).toHaveBeenCalled();
  });

  it('listRefreshTokensByUser: uses defaults and orders by expiresAt', async () => {
    await databaseService.listRefreshTokensByUser('u1', {});
    expect(refreshToken.findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { expiresAt: 'desc' } }));
  });
});