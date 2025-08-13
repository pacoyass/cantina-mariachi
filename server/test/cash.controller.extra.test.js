import { jest } from '@jest/globals';

jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    createCashTransactionForOrder: jest.fn().mockResolvedValue({ id: 'tx1' }),
    confirmCashTransaction: jest.fn().mockResolvedValue({ id: 'tx1', confirmed: true }),
    verifyCashTransaction: jest.fn().mockResolvedValue({ id: 'tx1', adminVerified: true }),
    getCashSummaryByDriverAndDate: jest.fn().mockResolvedValue({ driverId: 'd1', total: 100 }),
  }
}));

jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logAudit: jest.fn().mockResolvedValue() } }));

const { createCashTransaction, confirmCashTransaction, verifyCashTransaction, getDriverDailySummary } = await import('../controllers/cash.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('cash.controller extra', () => {
  it('createCashTransaction returns 201', async () => {
    const req = { body: { orderNumber: 10, driverId: 'd1', amount: 10 }, user: { userId: 'u' } };
    const res = makeRes();
    await createCashTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('confirmCashTransaction returns 200', async () => {
    const req = { body: { orderNumber: 10 }, user: { userId: 'u' } };
    const res = makeRes();
    await confirmCashTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('verifyCashTransaction returns 200', async () => {
    const req = { body: { orderNumber: 10, adminVerified: true }, user: { userId: 'u' } };
    const res = makeRes();
    await verifyCashTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('getDriverDailySummary returns 200', async () => {
    const req = { validatedQuery: { driverId: 'd1', date: '2025-01-01' } };
    const res = makeRes();
    await getDriverDailySummary(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});