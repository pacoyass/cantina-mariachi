import { jest } from '@jest/globals';

jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    isReservationSlotAvailable: jest.fn().mockResolvedValue(true),
    createReservation: jest.fn().mockResolvedValue({ id: 'r1', date: '2025-01-01', time: '18:00', partySize: 2 }),
    listReservations: jest.fn().mockResolvedValue([{ id: 'r1' }]),
    updateReservationStatus: jest.fn().mockResolvedValue({ id: 'r1', status: 'CONFIRMED' }),
  }
}));

const { createReservation, listReservations, checkAvailability, updateReservationStatus, cancelReservation } = await import('../controllers/reservations.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('reservations.controller extra', () => {
  it('createReservation returns 201', async () => {
    const req = { body: { customerName: 'A', customerEmail: 'a@b.com', customerPhone: '2223334444', date: '2025-01-01', time: '18:00', partySize: 2 } };
    const res = makeRes();
    await createReservation(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('listReservations returns 200', async () => {
    const res = makeRes();
    await listReservations({ validatedQuery: {} }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('checkAvailability returns 200', async () => {
    const res = makeRes();
    await checkAvailability({ validatedQuery: { date: '2025-01-01', time: '18:00' } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('update and cancel return 200', async () => {
    const res1 = makeRes();
    await updateReservationStatus({ params: { id: 'r1' }, body: { status: 'CONFIRMED' } }, res1);
    expect(res1.status).toHaveBeenCalledWith(200);

    const res2 = makeRes();
    await cancelReservation({ params: { id: 'r1' } }, res2);
    expect(res2.status).toHaveBeenCalledWith(200);
  });
});