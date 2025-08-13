import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';

export async function registerWebhook({ url, status = 'ACTIVE', integrationId = null, details = {} }) {
  const created = await prisma.webhook.create({ data: { url, status, integrationId, details } });
  await LoggerService.logSystemEvent('WebhookAdmin', 'REGISTER', { id: created.id, url });
  return created;
}

export async function listWebhooks() {
  return await prisma.webhook.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function setWebhookStatus(id, status) {
  const updated = await prisma.webhook.update({ where: { id }, data: { status } });
  await LoggerService.logSystemEvent('WebhookAdmin', 'STATUS', { id, status });
  return updated;
}

export async function deadLetterWebhookLog(log) {
  // Store failed webhook logs to a DLQ table (using webhook_logs with status FAILED as DLQ)
  await LoggerService.logSystemEvent('WebhookAdmin', 'DLQ', log);
}

export default { registerWebhook, listWebhooks, setWebhookStatus, deadLetterWebhookLog };