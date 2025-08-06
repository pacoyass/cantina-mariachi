import fetch from 'node-fetch';
import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';

const sendWebhook = async (event, payload) => {
  try {
    const webhooks = await prisma.webhook.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      select: { id: true, url: true, integrationId: true },
    });

    if (!webhooks.length) {
      await LoggerService.logSystemEvent('webhookController', 'NO_ACTIVE_WEBHOOKS', {
        event,
        message: 'No active webhooks found for event',
      });
      return;
    }

    const results = await Promise.all(
      webhooks.map(async (webhook) => {
        try {
          const response = await fetch(webhook.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event,
              payload,
              webhookId: webhook.id,
              integrationId: webhook.integrationId,
              timestamp: new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            throw new Error(`Webhook request failed with status ${response.status}`);
          }

          await LoggerService.logSystemEvent('webhookController', 'WEBHOOK_SENT', {
            event,
            webhookId: webhook.id,
            url: webhook.url,
            status: response.status,
          });

          return { webhookId: webhook.id, status: 'success' };
        } catch (error) {
          await LoggerService.logError('Webhook delivery failed', error.stack, {
            method: 'sendWebhook',
            event,
            webhookId: webhook.id,
            url: webhook.url,
            error: error.message,
          });
          return { webhookId: webhook.id, status: 'failed', error: error.message };
        }
      })
    );

    return results;
  } catch (error) {
    await LoggerService.logError('Failed to process webhooks', error.stack, {
      method: 'sendWebhook',
      event,
      error: error.message,
    });
    throw error;
  }
};

export default { sendWebhook };