import { createResponse, createError } from '../utils/response.js';
import { registerWebhook, listWebhooks, setWebhookStatus, deadLetterWebhookLog } from '../services/webhookAdminService.js';
import axios from 'axios';

export const register = async (req, res) => {
  try {
    const created = await registerWebhook(req.body);
    return createResponse(res, 201, 'Webhook registered', { webhook: created }, req);
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to register webhook', 'WEBHOOK_REGISTER_FAILED');
  }
};

export const list = async (req, res) => {
  try {
    const webhooks = await listWebhooks();
    return createResponse(res, 200, 'Webhooks fetched', { webhooks }, req);
  } catch (error) {
    return createError(res, 500, 'Failed to list webhooks', 'SERVER_ERROR', {}, req);
  }
};

export const enable = async (req, res) => {
  try {
    const updated = await setWebhookStatus(req.params.id, 'ACTIVE');
    return createResponse(res, 200, 'Webhook enabled', { webhook: updated }, req);
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to enable webhook', 'WEBHOOK_ENABLE_FAILED');
  }
};

export const disable = async (req, res) => {
  try {
    const updated = await setWebhookStatus(req.params.id, 'DISABLED');
    return createResponse(res, 200, 'Webhook disabled', { webhook: updated }, req);
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to disable webhook', 'WEBHOOK_DISABLE_FAILED');
  }
};

export const trigger = async (req, res) => {
  try {
    const { event, payload } = req.body;
    const webhooks = await listWebhooks();
    let results = [];
    for (const wh of webhooks.filter(w => w.status === 'ACTIVE')) {
      let attempt = 0;
      let delay = 500;
      let ok = false;
      let lastError = null;
      while (attempt < 3) {
        try {
          await axios.post(wh.url, { event, payload }, { timeout: 5000 });
          ok = true;
          break;
        } catch (e) {
          attempt += 1;
          lastError = e;
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        }
      }
      if (!ok) {
        await deadLetterWebhookLog({ webhookId: wh.id, event, error: lastError?.message });
        results.push({ webhookId: wh.id, status: 'FAILED', error: lastError?.message });
      } else {
        results.push({ webhookId: wh.id, status: 'SUCCESS' });
      }
    }
    return createResponse(res, 200, 'Trigger processed', { results }, req);
  } catch (error) {
    return createError(res, 500, 'Failed to trigger webhooks', 'WEBHOOK_TRIGGER_FAILED', {}, req);
  }
};

export default { register, list, enable, disable, trigger };