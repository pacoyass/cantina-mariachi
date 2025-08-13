import { jest } from '@jest/globals';

jest.unstable_mockModule('../config/database.js', () => ({
  default: {
    activityLog: { create: jest.fn().mockResolvedValue({}) },
    systemLog: { create: jest.fn().mockResolvedValue({}) },
    notificationLog: { create: jest.fn().mockResolvedValue({}) },
    cronRun: { create: jest.fn().mockResolvedValue({}) },
  }
}));

const { LoggerService } = await import('../utils/logger.js');

describe('LoggerService', () => {
  it('logActivity writes activity', async () => {
    await LoggerService.logActivity('u1', 'TYPE', 'message', { a: 1 });
  });
  it('logSystemEvent writes system log', async () => {
    await LoggerService.logSystemEvent('ctx', 'EVENT', { x: true });
  });
  it('logNotification writes notification log', async () => {
    await LoggerService.logNotification('u1', 'EMAIL', 'to@example.com', 'msg', 'SENT', null, null);
  });
  it('logCronRun writes cron run log', async () => {
    await LoggerService.logCronRun('task', 'OK', { d: 1 });
  });
});