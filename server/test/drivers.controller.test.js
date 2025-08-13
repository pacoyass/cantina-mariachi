import { jest } from '@jest/globals';
import * as dbSvc from '../services/databaseService.js';
import { assignOrder } from '../controllers/drivers.controller.js';

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('drivers controller', () => {
  it('assigns order to driver', async () => {
    jest.spyOn(dbSvc.databaseService, 'assignOrderToDriver').mockResolvedValue({ orderNumber: 'ORD-1' });
    const req = { body: { orderNumber: 'ORD-1', driverId: 'd1' } };
    const res = makeRes();
    await assignOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 400 on assign failure', async () => {
    jest.spyOn(dbSvc.databaseService, 'assignOrderToDriver').mockRejectedValue(new Error('Driver not available'));
    const req = { body: { orderNumber: 'ORD-1', driverId: 'd1' } };
    const res = makeRes();
    await assignOrder(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});