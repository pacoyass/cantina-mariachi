import { jest } from '@jest/globals';

jest.unstable_mockModule('axios', () => ({ default: { post: jest.fn() } }));

jest.unstable_mockModule('../services/webhookAdminService.js', () => ({
  registerWebhook: jest.fn(async (b)=> ({ id: 'w1', ...b })),
  listWebhooks: jest.fn(async ()=> [{ id: 'w1', url: 'http://x', status: 'ACTIVE' }]),
  setWebhookStatus: jest.fn(async (id, status)=> ({ id, status })),
  deadLetterWebhookLog: jest.fn(async ()=> ({})),
}));

const axios = (await import('axios')).default;
const { register, list, enable, disable, trigger } = await import('../controllers/webhookAdmin.controller.js');

const makeRes = () => { const res = {}; res.status = jest.fn().mockReturnValue(res); res.json = jest.fn().mockReturnValue(res); return res; };

describe('webhookAdmin.controller extra', () => {
  it('register/list/enable/disable return success', async () => {
    const res1 = makeRes();
    await register({ body: { url: 'http://x' } }, res1);
    expect(res1.status).toHaveBeenCalledWith(201);

    const res2 = makeRes();
    await list({}, res2);
    expect(res2.status).toHaveBeenCalledWith(200);

    const res3 = makeRes();
    await enable({ params: { id: 'w1' } }, res3);
    expect(res3.status).toHaveBeenCalledWith(200);

    const res4 = makeRes();
    await disable({ params: { id: 'w1' } }, res4);
    expect(res4.status).toHaveBeenCalledWith(200);
  });

  it('trigger success path', async () => {
    axios.post.mockResolvedValue({ status: 200 });
    const res = makeRes();
    await trigger({ body: { event: 'E', payload: {} } }, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});