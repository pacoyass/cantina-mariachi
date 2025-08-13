import { jest } from '@jest/globals';
import * as dbSvc from '../services/databaseService.js';
import { updateOrderStatus } from '../controllers/orders.controller.js';

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('orders controller', () => {
  it('rejects invalid state transition', async () => {
    const req = { params: { orderNumber: 'ORD-1' }, body: { status: 'READY' }, user: { userId: 'u1' } };
    const res = makeRes();
    jest.spyOn(dbSvc.databaseService, 'updateOrderStatusByNumber').mockRejectedValue(new Error('Invalid transition from PENDING to READY'));
    await updateOrderStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});