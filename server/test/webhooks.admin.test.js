import { jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({ default: { post: jest.fn() } }));

jest.unstable_mockModule('../services/webhookAdminService.js', () => ({
  listWebhooks: jest.fn().mockResolvedValue([{ id: 'w1', url: 'http://bad', status: 'ACTIVE' }]),
  registerWebhook: jest.fn(),
  setWebhookStatus: jest.fn(),
  deadLetterWebhookLog: jest.fn(),
}));

const axios = (await import('axios')).default;
const { trigger } = await import('../controllers/webhookAdmin.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('webhooks admin', () => {
  it('triggers active webhooks with retry and reports failures', async () => {
    axios.post.mockRejectedValue(new Error('net'));
    const req = { body: { event: 'TEST', payload: {} } };
    const res = makeRes();
    await trigger(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data.results[0].status).toBe('FAILED');
  });

  it('triggers success when axios resolves', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const req = { body: { event: 'TEST', payload: {} } };
    const res = makeRes();
    await trigger(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json.mock.calls[0][0].data.results[0].status).toBe('SUCCESS');
  });
});