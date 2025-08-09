// controllers/webhook.controller.js
import axios from 'axios';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';
import { createError, createSuccess } from '../utils/response.js';

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

        LoggerService.info(`Webhook sent successfully to ${webhook.url}`, {
          webhookId: webhook.id,
          statusCode: response.status,
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

        LoggerService.error(`Webhook delivery failed to ${webhook.url}`, {
          webhookId: webhook.id,
          error: err.message,
        });

        results.push({ webhookId: webhook.id, status: 'FAILED', error: err.message });
      }
    }

    return createSuccess(res, 200, 'Webhook processing completed', { results });
  } catch (error) {
    LoggerService.error('Error in triggerWebhook', { error: error.message, stack: error.stack });
    return createError(res, 500, 'Internal server error', 'WEBHOOK_TRIGGER_ERROR', {
      message: error.message,
    });
  }
};
