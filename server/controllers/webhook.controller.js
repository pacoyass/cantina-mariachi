// controllers/webhook.controller.js
import axios from 'axios';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';
import { createError, createResponse } from '../utils/response.js';

export const triggerWebhook = async (req, res) => {
  const { event, payload } = req.body;

  try {
    const activeWebhooks = await databaseService.getActiveWebhooks();

    if (!activeWebhooks.length) {
      return createError(res, 404, 'No active webhooks found', 'NO_ACTIVE_WEBHOOKS');
    }

    let results = [];

    for (const webhook of activeWebhooks) {
      try {
        const response = await axios.post(webhook.url||null, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000,
        });

        await databaseService.logWebhookDelivery({
          webhookId: webhook.id,
          event,
          payload,
          status: 'SUCCESS',
          attempts: 1,
        });

        await LoggerService.logSystemEvent('webhook', 'WEBHOOK_DELIVERED', {
          webhookId: webhook.id,
          statusCode: response.status,
          url: webhook.url,
        });

        results.push({ webhookId: webhook.id, status: 'SUCCESS' });
      } catch (err) {
        await databaseService.logWebhookDelivery({
          webhookId: webhook.id,
          event,
          payload,
          status: 'FAILED',
          error: err.message,
          attempts: 1,
        });

        await LoggerService.logError('Webhook delivery failed', err.stack, {
          webhookId: webhook.id,
          error: err.message,
          url: webhook.url,
        });

        results.push({ webhookId: webhook.id, status: 'FAILED', error: err.message });
      }
    }

    return createResponse(res, 200, 'Webhook processing completed', { results });
  } catch (error) {
    await LoggerService.logError('Error in triggerWebhook', error.stack, { error: error.message });
    return createError(res, 500, 'Internal server error', 'WEBHOOK_TRIGGER_ERROR', {
      message: error.message,
    });
  }
};

export const sendWebhook = async (event, payload) => {
  try {
    const activeWebhooks = await databaseService.getActiveWebhooks();
    if (!activeWebhooks.length) {
      return { success: false, message: 'No active webhooks' };
    }

    for (const webhook of activeWebhooks) {
      try {
        await axios.post(webhook.url||null, { event, payload }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000,
        });

        await databaseService.logWebhookDelivery({
          webhookId: webhook.id,
          event,
          payload,
          status: 'SUCCESS',
          attempts: 1,
        });
      } catch (err) {
        await databaseService.logWebhookDelivery({
          webhookId: webhook.id,
          event,
          payload,
          status: 'FAILED',
          error: err.message,
          attempts: 1,
        });
        await LoggerService.logFailedWebhook(webhook, event, payload, err.message, 1);
      }
    }

    return { success: true };
  } catch (error) {
    await LoggerService.logError('sendWebhook failed', error.stack, { error: error.message });
    return { success: false, error: error.message };
  }
};

export const cleanupExpiredWebhooks = async () => {
  try {
    const deleted = await databaseService.deleteExpiredWebhooks(30);
    await LoggerService.logSystemEvent('webhook', 'CLEANUP_EXPIRED_WEBHOOKS', { deleted });
  } catch (error) {
    await LoggerService.logError('cleanupExpiredWebhooks failed', error.stack, { error: error.message });
  }
};

export default { sendWebhook };
