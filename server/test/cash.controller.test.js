import { jest } from '@jest/globals';
import * as dbSvc from '../services/databaseService.js';
import { confirmCashTransaction, verifyCashTransaction } from '../controllers/cash.controller.js';

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('cash controller', () => {
  it('confirms cash transaction', async () => {
    jest.spyOn(dbSvc.databaseService, 'confirmCashTransaction').mockResolvedValue({ id: 'tx1' });
    const req = { body: { orderNumber: 'ORD-1' }, user: { userId: 'u1' } };
    const res = makeRes();
    await confirmCashTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('verifies cash transaction', async () => {
    jest.spyOn(dbSvc.databaseService, 'verifyCashTransaction').mockResolvedValue({ id: 'tx1' });
    const req = { body: { orderNumber: 'ORD-1', adminVerified: true }, user: { userId: 'u1' } };
    const res = makeRes();
    await verifyCashTransaction(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});