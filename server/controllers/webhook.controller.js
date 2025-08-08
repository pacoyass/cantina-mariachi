import fetch from 'node-fetch';
import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';
import { subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
const webhookQueue = [];
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;


// Add to the bottom of webhook.controller.js



/**
 * Cleanup expired or deleted webhooks
 */
export const cleanupExpiredWebhooks = async () => {
  const instanceId = process.env.INSTANCE_ID || 'default-instance';
  const cutoffDate = toZonedTime(subDays(new Date(), 30), 'Europe/London');
  let deletedCount = 0;

  try {
    const result = await prisma.webhook.deleteMany({
      where: {
        OR: [
          { status: { not: 'ACTIVE' } },
          { deletedAt: { lt: cutoffDate } },
        ],
      },
    });

    deletedCount = result.count;

    await LoggerService.logSystemEvent('webhookController', 'WEBHOOK_CLEANUP_SUCCESS', {
      instanceId,
      deletedCount,
      cutoffDate: cutoffDate.toISOString(),
    });

    if (deletedCount > 0) {
      await sendWebhook('WEBHOOK_CLEANUP_SUCCESS', {
        instanceId,
        deletedCount,
        cutoffDate: cutoffDate.toISOString(),
      });
    }
  } catch (error) {
    await LoggerService.logError('Webhook cleanup failed', error.stack, {
      instanceId,
      message: error.message,
    });
  }
};


/**
 * Send a webhook with retry mechanism and queue handling
 */
export const sendWebhook = async (event, payload) => {
  try {
    // Fetch active webhooks from database
    const webhooks = await prisma.webhook.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      select: { id: true, url: true, integrationId: true },
    });

    if (!webhooks.length) {
      await LoggerService.logSystemEvent('webhookController', 'NO_ACTIVE_WEBHOOKS', {
        event,
        message: 'No active webhooks found for event',
      });
      return [];
    }

    // Add webhook data to queue
    const webhookData = {
      event,
      payload,
      timestamp: new Date().toISOString(),
    };
    webhookQueue.push(webhookData);

    // Process each webhook with retry logic
    const results = await Promise.all(
      webhooks.map(async (webhook) => {
        let attempts = 0;
        while (attempts < MAX_RETRIES) {
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
              timeout: 5000, // 5-second timeout
            });

            if (!response.ok) {
              throw new Error(`Webhook request failed with status ${response.status}`);
            }

            await LoggerService.logSystemEvent('webhookController', 'WEBHOOK_SENT', {
              event,
              webhookId: webhook.id,
              url: webhook.url,
              status: response.status,
              attempts: attempts + 1,
            });

            return { webhookId: webhook.id, status: 'success' };
          } catch (error) {
            attempts++;
            if (attempts >= MAX_RETRIES) {
              await LoggerService.logError('Webhook delivery failed after max retries', error.stack, {
                method: 'sendWebhook',
                event,
                webhookId: webhook.id,
                url: webhook.url,
                error: error.message,
                attempts,
              });

              // Log failed webhook to database
              await logFailedWebhookToDatabase(webhook, event, payload, error, attempts);

              return { webhookId: webhook.id, status: 'failed', error: error.message };
            }

            // Exponential backoff
            const delay = RETRY_DELAY * Math.pow(2, attempts - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      })
    );

    // Remove from queue after processing
    const index = webhookQueue.indexOf(webhookData);
    if (index > -1) webhookQueue.splice(index, 1);

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

/**
 * Log failed webhook to database
 */
const logFailedWebhookToDatabase = async (webhook, event, payload, error, attempts) => {
  try {
    await prisma.webhook.create({
      data: {
        url: webhook.url,
        status: 'FAILED',
        lastSync: new Date(),
        integrationId: webhook.integrationId || null,
        details: {
          event,
          payload,
          error: error.message,
          attempts,
        },
      },
    });

    await LoggerService.logSystemEvent('webhookController', 'WEBHOOK_FAILED_LOGGED', {
      event,
      webhookId: webhook.id,
      url: webhook.url,
      error: error.message,
      attempts,
    });
  } catch (dbError) {
    await LoggerService.logError('Failed to save webhook to database', dbError.stack, {
      method: 'logFailedWebhookToDatabase',
      event,
      webhookId: webhook.id,
      url: webhook.url,
      error: dbError.message,
    });
  }
};
