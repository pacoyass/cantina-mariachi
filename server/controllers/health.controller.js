import prisma from '../config/database.js';
import cacheService from '../services/cacheService.js';
import { createResponse } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';

export const getHealth = async (req, res) => {
  const db = { ok: false };
  const cache = { ok: false };
  try {
    await prisma.$queryRaw`SELECT 1`;
    db.ok = true;
  } catch (e) {
    db.error = e.message;
  }
  try {
    const resp = await cacheService.ping();
    cache.ok = resp.ok;
    if (!resp.ok) cache.error = resp.error;
  } catch (e) {
    cache.error = e.message;
  }
  
  const isHealthy = db.ok && cache.ok;
  const messageKey = isHealthy ? 'systemHealthy' : 'systemDegraded';
  
  return createResponse(res, isHealthy ? 200 : 503, messageKey, 
    { db, cache, time: new Date().toISOString() }, req, {}, 'business:system');
};

export const cleanupHealth = async () => {
  // No-op cleanup; record a heartbeat cron run for observability
  await LoggerService.logCronRun('health_heartbeat', 'SUCCESS', { timestamp: new Date().toISOString() });
};

export default { getHealth, cleanupHealth };