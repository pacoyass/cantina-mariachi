import { jest } from '@jest/globals';

const logger = {
  logSystemEvent: jest.fn().mockResolvedValue(),
  logError: jest.fn().mockResolvedValue(),
  logAudit: jest.fn().mockResolvedValue(),
  logCronRun: jest.fn().mockResolvedValue(),
};
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: logger }));

const lock = { acquireLock: jest.fn(), releaseLock: jest.fn().mockResolvedValue() };
await jest.unstable_mockModule('../utils/lock.js', () => lock);

const tx = { reservation: { deleteMany: jest.fn().mockResolvedValue({ count: 3 }) } };
const prisma = { $transaction: jest.fn(async (fn) => fn(tx)) };
await jest.unstable_mockModule('../config/database.js', () => ({ default: prisma }));

const { cleanupOldReservations } = await import('../controllers/reservations.controller.js');

describe('reservations cleanupOldReservations', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('skips when lock not acquired', async () => {
    lock.acquireLock.mockResolvedValue(false);
    await cleanupOldReservations(180);
    expect(logger.logCronRun).toHaveBeenCalledWith('reservations_cleanup', 'SKIPPED', expect.any(Object));
  });

  it('deletes and logs success when lock acquired', async () => {
    lock.acquireLock.mockResolvedValue(true);
    await cleanupOldReservations(180);
    expect(tx.reservation.deleteMany).toHaveBeenCalled();
    expect(logger.logCronRun).toHaveBeenCalledWith('reservations_cleanup', 'SUCCESS', expect.any(Object));
    expect(lock.releaseLock).toHaveBeenCalled();
  });
});