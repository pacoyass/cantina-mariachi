import { jest } from '@jest/globals';

await jest.unstable_mockModule('axios', () => ({ default: { post: jest.fn() } }));
const axios = (await import('axios')).default;

await jest.unstable_mockModule('../services/databaseService.js', () => ({
  databaseService: {
    getActiveWebhooks: jest.fn(),
    logWebhookDelivery: jest.fn(),
    deleteExpiredWebhooks: jest.fn(),
  }
}));
await jest.unstable_mockModule('../utils/logger.js', () => ({ LoggerService: { logSystemEvent: jest.fn(), logError: jest.fn(), logFailedWebhook: jest.fn() } }));

const { triggerWebhook, sendWebhook } = await import('../controllers/webhook.controller.js');
const { databaseService } = await import('../services/databaseService.js');

function makeRes() { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; }

describe('webhook.controller error paths', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('triggerWebhook returns 404 when no active webhooks', async () => {
    databaseService.getActiveWebhooks.mockResolvedValueOnce([]);
    const res = makeRes();
    await triggerWebhook({ body: { event: 'E', payload: {} } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('triggerWebhook logs failures when axios.post fails', async () => {
    databaseService.getActiveWebhooks.mockResolvedValueOnce([{ id: 'w1', url: 'http://x', status: 'ACTIVE' }]);
    axios.post.mockRejectedValueOnce(new Error('down'));
    const res = makeRes();
    await triggerWebhook({ body: { event: 'E', payload: {} } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(databaseService.logWebhookDelivery).toHaveBeenCalledWith(expect.objectContaining({ status: 'FAILED' }));
  });

  it('sendWebhook handles axios failures and returns success true (partial ok)', async () => {
    databaseService.getActiveWebhooks.mockResolvedValueOnce([{ id: 'w1', url: 'http://x', status: 'ACTIVE' }]);
    axios.post.mockRejectedValueOnce(new Error('bad'));
    const res = await sendWebhook('E', {});
    expect(res.success).toBe(true);
  });

  it('sendWebhook returns success false when controller throws', async () => {
    databaseService.getActiveWebhooks.mockRejectedValueOnce(new Error('db'));
    const res = await sendWebhook('E', {});
    expect(res.success).toBe(false);
  });
});