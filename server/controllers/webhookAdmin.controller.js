import { createResponse, createError } from '../utils/response.js';
import { registerWebhook, listWebhooks, setWebhookStatus, deadLetterWebhookLog } from '../services/webhookAdminService.js';
import axios from 'axios';

export const register = async (req, res) => {
  try {
    const created = await registerWebhook(req.body);
    return createResponse(res, 201, 'webhooks.registered', { webhook: created }, req, {}, 'business');
  } catch (error) {
    return createError(res, 400, 'operationFailed', 'WEBHOOK_REGISTER_FAILED', {}, req);
  }
};

export const list = async (req, res) => {
  try {
    const webhooks = await listWebhooks();
    return createResponse(res, 200, 'dataRetrieved', { webhooks }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const enable = async (req, res) => {
  try {
    const updated = await setWebhookStatus(req.params.id, 'ACTIVE');
    return createResponse(res, 200, 'webhooks.enabled', { webhook: updated }, req, {}, 'business');
  } catch (error) {
    return createError(res, 400, 'operationFailed', 'WEBHOOK_ENABLE_FAILED', {}, req);
  }
};

export const disable = async (req, res) => {
  try {
    const updated = await setWebhookStatus(req.params.id, 'DISABLED');
    return createResponse(res, 200, 'webhooks.disabled', { webhook: updated }, req, {}, 'business');
  } catch (error) {
    return createError(res, 400, 'operationFailed', 'WEBHOOK_DISABLE_FAILED', {}, req);
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
    return createResponse(res, 200, 'webhooks.triggerProcessed', { results }, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'WEBHOOK_TRIGGER_FAILED', {}, req);
  }
};

export default { register, list, enable, disable, trigger };