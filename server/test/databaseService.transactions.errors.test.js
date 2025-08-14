import { jest } from '@jest/globals';

function makeDb() {
  const trx = {
    driver: { findUnique: jest.fn() },
    order: { findUnique: jest.fn(), update: jest.fn() },
  };
  const db = { $transaction: jest.fn(async (fn) => fn(trx)), order: { update: jest.fn() } };
  return { db, trx };
}

const { db, trx } = makeDb();
await jest.unstable_mockModule('../config/database.js', () => ({ default: db }));
const { databaseService } = await import('../services/databaseService.js');

describe('databaseService assignOrderToDriver and tracking', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('assignOrderToDriver throws when driver not available', async () => {
    trx.driver.findUnique.mockResolvedValueOnce(null);
    await expect(databaseService.assignOrderToDriver('ORD-1','d1')).rejects.toThrow('Driver not available');
  });
  it('assignOrderToDriver throws when order not found', async () => {
    trx.driver.findUnique.mockResolvedValueOnce({ id: 'd1', active: true });
    trx.order.findUnique.mockResolvedValueOnce(null);
    await expect(databaseService.assignOrderToDriver('ORD-1','d1')).rejects.toThrow('Order not found');
  });
  it('assignOrderToDriver success returns updated order', async () => {
    trx.driver.findUnique.mockResolvedValueOnce({ id: 'd1', active: true });
    trx.order.findUnique.mockResolvedValueOnce({ id: 'o1' });
    trx.order.update.mockResolvedValueOnce({ orderNumber: 'ORD-1', driverId: 'd1', status: 'OUT_FOR_DELIVERY' });
    const res = await databaseService.assignOrderToDriver('ORD-1','d1');
    expect(res.status).toBe('OUT_FOR_DELIVERY');
  });

  it('setOrderTracking updates order', async () => {
    db.order.update.mockResolvedValueOnce({ id: 'o1', trackingCode: 'c', trackingCodeExpiresAt: new Date() });
    const res = await databaseService.setOrderTracking('o1','c', new Date());
    expect(db.order.update).toHaveBeenCalled();
    expect(res.trackingCode).toBe('c');
  });
});