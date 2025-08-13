import { jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({ default: { post: jest.fn() } }));

jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    getActiveWebhooks: jest.fn().mockResolvedValue([{ id: 'w1', url: 'http://x' }]),
    logWebhookDelivery: jest.fn().mockResolvedValue({}),
    deleteExpiredWebhooks: jest.fn().mockResolvedValue(1),
  }
}));

jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logSystemEvent: jest.fn().mockResolvedValue(), logError: jest.fn().mockResolvedValue(), logFailedWebhook: jest.fn().mockResolvedValue() } }));

const axios = (await import('axios')).default;
const { triggerWebhook, sendWebhook, cleanupExpiredWebhooks } = await import('../controllers/webhook.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('webhook.controller', () => {
  it('triggerWebhook returns 200 with success', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const res = makeRes();
    await triggerWebhook({ body: { event: 'E', payload: { x: 1 } } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('sendWebhook returns success', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const r = await sendWebhook('E', {});
    expect(r.success).toBe(true);
  });

  it('cleanupExpiredWebhooks logs without throw', async () => {
    await cleanupExpiredWebhooks();
  });
});