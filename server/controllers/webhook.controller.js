// controllers/webhook.controller.js
import axios from 'axios';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';
<<<<<<< HEAD
import { createError, createSuccess } from '../utils/response.js';
=======
import { createError, createResponse } from '../utils/response.js';
>>>>>>> 81e1cddda51e5d59f35929558a81dae12197f13a

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

<<<<<<< HEAD
    return createSuccess(res, 200, 'Webhook processing completed', { results });
=======
    return createResponse(res, 200, 'Webhook processing completed', { results });
>>>>>>> 81e1cddda51e5d59f35929558a81dae12197f13a
  } catch (error) {
    LoggerService.error('Error in triggerWebhook', { error: error.message, stack: error.stack });
    return createError(res, 500, 'Internal server error', 'WEBHOOK_TRIGGER_ERROR', {
      message: error.message,
    });
  }
};
<<<<<<< HEAD
=======

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
>>>>>>> 81e1cddda51e5d59f35929558a81dae12197f13a
