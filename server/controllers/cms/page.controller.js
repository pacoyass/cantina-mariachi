import prisma from '../../config/database.js';
import { createError, createResponse } from '../../utils/response.js';
import { acquireLock, releaseLock } from '../../utils/lock.js';
import { LoggerService } from '../../utils/logger.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import crypto from 'node:crypto';

export const getPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = 'en', status } = req.query;
    const page = await prisma.pageContent.findUnique({ where: { slug_locale: { slug, locale } } });
    if (!page || (status !== 'ANY' && page.status !== 'PUBLISHED')) {
      return createError(res, 404, 'notFound', 'PAGE_NOT_FOUND', {}, req);
    }
    return createResponse(res, 200, 'dataRetrieved', { page }, req, {}, 'api');
  } catch (e) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const upsertPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = 'en', data = {}, status = 'PUBLISHED' } = req.body || {};
    const result = await prisma.pageContent.upsert({
      where: { slug_locale: { slug, locale } },
      update: { data, status },
      create: { slug, locale, data, status },
    });
    return createResponse(res, 200, 'operationSuccess', { page: result }, req, {}, 'api');
  } catch (e) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const cleanupCmsDrafts = async (retentionDays = Number(process.env.CMS_DRAFT_RETENTION_DAYS || '30')) => {
  const taskName = 'cms_draft_cleanup';
  const instanceId = process.env.INSTANCE_ID || crypto.randomUUID();
  const timestamp = toZonedTime(new Date(), 'Europe/London').toISOString();
  try {
    await prisma.$transaction(async (tx) => {
      const locked = await acquireLock(tx, taskName, instanceId);
      if (!locked) {
        await LoggerService.logCronRun(taskName, 'SKIPPED', { reason: 'Lock held', timestamp });
        return;
      }
      try {
        const cutoff = subDays(new Date(), retentionDays);
        const deleted = await tx.pageContent.deleteMany({ where: { status: { not: 'PUBLISHED' }, updatedAt: { lt: cutoff } } });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { retentionDays, deleted: deleted.count, cutoff: cutoff.toISOString(), timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'CMS_DRAFT_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('CMS draft cleanup failed', error.stack, { taskName, error: error.message, retentionDays, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, retentionDays, timestamp });
    throw error;
  }
};

export default { getPage, upsertPage, cleanupCmsDrafts };