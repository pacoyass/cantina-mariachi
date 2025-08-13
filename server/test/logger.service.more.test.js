import { jest } from '@jest/globals';

// Mock fs to avoid real writes
const mkdir = jest.fn().mockResolvedValue();
const appendFile = jest.fn().mockResolvedValue();
await jest.unstable_mockModule('fs/promises', () => ({ default: { mkdir, appendFile }, mkdir, appendFile }));
await jest.unstable_mockModule('path', () => ({ default: { join: (...a)=> a.join('/') }, join: (...a)=> a.join('/') }));

// Mock prisma models used by logger
await jest.unstable_mockModule('../config/database.js', () => ({
  default: {
    systemLog: { create: jest.fn().mockResolvedValue({}) },
    errorLog: { create: jest.fn().mockResolvedValue({}), createMany: jest.fn().mockResolvedValue({ count: 2 }) },
    loginLog: { create: jest.fn().mockResolvedValue({}) },
    notificationLog: { create: jest.fn().mockResolvedValue({}) },
    activityLog: { create: jest.fn().mockResolvedValue({}) },
    auditLog: { create: jest.fn().mockResolvedValue({}) },
    cronLock: { create: jest.fn().mockResolvedValue({}) },
    cronRun: { create: jest.fn().mockResolvedValue({}) },
    cashTransaction: { create: jest.fn().mockResolvedValue({}) },
  }
}));

const { LoggerService } = await import('../utils/logger.js');

describe('LoggerService more coverage', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('logError valid and enqueue/flush createMany path', async () => {
    await LoggerService.logError('msg', 'stack', { a: 1 });
    await LoggerService.enqueueLog('errorLog', { x: 1 });
    await LoggerService.flushQueue();
  });

  it('logError invalid message throws and writes to file', async () => {
    await expect(LoggerService.logError(null, 's', {})).rejects.toThrow();
    expect(appendFile).toHaveBeenCalled();
  });

  it('logLogin valid and invalid', async () => {
    await LoggerService.logLogin('u1', 'SUCCESS', '1.1.1.1', 'UA');
    await expect(LoggerService.logLogin('u1', 'BAD', '1.1.1.1', 'UA')).rejects.toThrow();
  });

  it('logAudit and logCronLock and logCashTransaction valid', async () => {
    await LoggerService.logAudit('u1', 'ACT', 't1', { d: 1 });
    await LoggerService.logCronLock('task', 'inst');
    await LoggerService.logCashTransaction('o1', 'd1', 10, true, false, null, null, null);
  });

  it('logSystemEvent invalid types throws', async () => {
    await expect(LoggerService.logSystemEvent(null, 'E', {})).rejects.toThrow();
    await expect(LoggerService.logSystemEvent('S', 3, {})).rejects.toThrow();
  });
});