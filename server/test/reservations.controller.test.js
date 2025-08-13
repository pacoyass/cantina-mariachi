import { jest } from '@jest/globals';
import * as dbSvc from '../services/databaseService.js';
import { createReservation } from '../controllers/reservations.controller.js';

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('reservations controller', () => {
  it('returns 409 when slot is full', async () => {
    jest.spyOn(dbSvc.databaseService, 'isReservationSlotAvailable').mockResolvedValue(false);
    const req = { body: { customerName:'A', customerEmail:'a@b.com', customerPhone:'0612345678', date:new Date().toISOString(), time:'18:00', partySize:2 } };
    const res = makeRes();
    await createReservation(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it('creates reservation when slot available', async () => {
    jest.spyOn(dbSvc.databaseService, 'isReservationSlotAvailable').mockResolvedValue(true);
    jest.spyOn(dbSvc.databaseService, 'createReservation').mockResolvedValue({ id: 'r1', date: new Date(), time: '18:00', partySize: 2 });
    const req = { body: { customerName:'A', customerEmail:'a@b.com', customerPhone:'0612345678', date:new Date().toISOString(), time:'18:00', partySize:2 } };
    const res = makeRes();
    await createReservation(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});