import { jest } from '@jest/globals';

await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logSystemEvent: jest.fn().mockResolvedValue() } }));

function makePrisma() {
  const data = {
    reservations: [],
  };
  const reservation = {
    create: jest.fn(async ({ data: r }) => { const rec = { id: 'r1', ...r }; data.reservations.push(rec); return rec; }),
    findMany: jest.fn(async ({ where }) => {
      let list = data.reservations.slice();
      if (where?.status?.in) list = list.filter(r => where.status.in.includes(r.status));
      else if (where?.status && typeof where.status === 'string') list = list.filter(r => r.status === where.status);
      if (where?.date) list = list.filter(r => r.date === where.date);
      if (where?.time) list = list.filter(r => r.time === where.time);
      return list;
    }),
    update: jest.fn(async ({ where, data: r }) => {
      const idx = data.reservations.findIndex(x => x.id === where.id);
      if (idx === -1) throw new Error('not found');
      data.reservations[idx] = { ...data.reservations[idx], ...r };
      return data.reservations[idx];
    }),
  };
  return { reservation };
}

const prisma = makePrisma();
await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));
const { databaseService } = await import('../services/databaseService.js');

describe('databaseService reservations', () => {
  beforeEach(() => {
    prisma.reservation.create.mockClear();
    prisma.reservation.findMany.mockClear();
    prisma.reservation.update.mockClear();
  });

  it('createReservation creates record', async () => {
    const rec = await databaseService.createReservation({ customerName: 'A', date: '2025-01-01', time: '18:00', partySize: 4, status: 'PENDING' });
    expect(rec).toHaveProperty('id', 'r1');
  });

  it('listReservations filters by status/date', async () => {
    await databaseService.createReservation({ id: 'r2', customerName: 'B', date: '2025-01-02', time: '19:00', partySize: 2, status: 'CONFIRMED' });
    const list = await databaseService.listReservations({ status: 'CONFIRMED', date: '2025-01-02' });
    expect(list.every(r => r.status === 'CONFIRMED')).toBe(true);
  });

  it('isReservationSlotAvailable caps at 50 seats', async () => {
    // Seed 48 seats used
    for (let i = 0; i < 12; i++) {
      await databaseService.createReservation({ customerName: `C${i}`, date: '2025-01-03', time: '18:00', partySize: 4, status: 'CONFIRMED' });
    }
    const ok = await databaseService.isReservationSlotAvailable('2025-01-03', '18:00', 2);
    expect(ok).toBe(true);
    const notOk = await databaseService.isReservationSlotAvailable('2025-01-03', '18:00', 3);
    expect(notOk).toBe(false);
  });

  it('updateReservationStatus updates record', async () => {
    const created = await databaseService.createReservation({ id: 'r3', customerName: 'D', date: '2025-01-04', time: '20:00', partySize: 2, status: 'PENDING' });
    const updated = await databaseService.updateReservationStatus(created.id, 'CANCELLED');
    expect(updated.status).toBe('CANCELLED');
  });
});