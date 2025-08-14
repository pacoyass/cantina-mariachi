import { jest } from '@jest/globals';

await jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    createOrderWithItems: jest.fn(),
    setOrderTracking: jest.fn(),
    getOrderByNumber: jest.fn(),
    updateOrderStatusByNumber: jest.fn(),
    getOrderForTracking: jest.fn(),
    listOrdersByUser: jest.fn(),
  }
}));
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logAudit: jest.fn(), logError: jest.fn(), logNotification: jest.fn(), logCronRun: jest.fn() } }));
await jest.unstable_mockModule('../controllers/webhook.controller.js', () => ({ sendWebhook: jest.fn() }));

function makeRes() { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; }

const prisma = { $transaction: jest.fn(async (fn)=> fn({ order: { updateMany: jest.fn().mockResolvedValue({ count: 2 }) } })) };
await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));
await jest.unstable_mockModule('../utils/lock.js', () => ({ acquireLock: jest.fn(async ()=> true), releaseLock: jest.fn(async ()=>{}) }));

const { databaseService } = await import('../services/databaseService.js');
const { updateOrderStatus, trackOrder, listMyOrders, cleanupExpiredOrderTracking } = await import('../controllers/orders.controller.js');

describe('orders.controller branches', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('updateOrderStatus invalid transition returns 400', async () => {
    databaseService.updateOrderStatusByNumber.mockRejectedValueOnce(new Error('Invalid transition'));
    const res = makeRes();
    await updateOrderStatus({ params: { orderNumber: 'X' }, body: { status: 'BAD' } }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('trackOrder returns 404 when not found/expired', async () => {
    databaseService.getOrderForTracking.mockResolvedValueOnce(null);
    const res = makeRes();
    await trackOrder({ validatedQuery: { orderNumber: '1', code: 'c' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('listMyOrders unauthorized returns 401', async () => {
    const res = makeRes();
    await listMyOrders({ }, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('cleanupExpiredOrderTracking: lock skip and success', async () => {
    // First call: lock skip
    const { acquireLock } = await import('../utils/lock.js');
    acquireLock.mockResolvedValueOnce(false);
    await cleanupExpiredOrderTracking();
    // Second call: lock success path
    acquireLock.mockResolvedValueOnce(true);
    await cleanupExpiredOrderTracking();
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});