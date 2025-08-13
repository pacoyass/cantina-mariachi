import { jest } from '@jest/globals';

jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    listDrivers: jest.fn().mockResolvedValue([{ id: 'd1' }]),
    createDriver: jest.fn().mockResolvedValue({ id: 'd1', name: 'N' }),
    updateDriver: jest.fn().mockResolvedValue({ id: 'd1', name: 'U' }),
    deleteDriver: jest.fn().mockResolvedValue({}),
    linkDriverToUser: jest.fn().mockResolvedValue({ id: 'd1', userId: 'u1' }),
    assignOrderToDriver: jest.fn().mockResolvedValue({ id: 'o1', driverId: 'd1' }),
    listOrdersAssignedToDriver: jest.fn().mockResolvedValue([{ id: 'o1' }]),
  }
}));

jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logAudit: jest.fn().mockResolvedValue() } }));

const { listDrivers, createDriver, updateDriver, deleteDriver, linkDriverToUser, assignOrder, listDriverAssignments } = await import('../controllers/drivers.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('drivers.controller extra', () => {
  it('listDrivers returns 200', async () => {
    const req = { validatedQuery: { active: true, zone: 'Z1' } };
    const res = makeRes();
    await listDrivers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('create/update/delete driver paths return success', async () => {
    const res = makeRes();
    await createDriver({ body: { name: 'N' }, user: { userId: 'u' } }, res);
    expect(res.status).toHaveBeenCalledWith(201);

    const res2 = makeRes();
    await updateDriver({ params: { id: 'd1' }, body: { name: 'U' }, user: { userId: 'u' } }, res2);
    expect(res2.status).toHaveBeenCalledWith(200);

    const res3 = makeRes();
    await deleteDriver({ params: { id: 'd1' }, user: { userId: 'u' } }, res3);
    expect(res3.status).toHaveBeenCalledWith(200);
  });

  it('link and assign return 200', async () => {
    const res = makeRes();
    await linkDriverToUser({ params: { id: 'd1' }, body: { userId: 'u1' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const res2 = makeRes();
    await assignOrder({ body: { orderNumber: 10, driverId: 'd1' } }, res2);
    expect(res2.status).toHaveBeenCalledWith(200);
  });

  it('listDriverAssignments returns 200', async () => {
    const res = makeRes();
    await listDriverAssignments({ params: { id: 'd1' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});