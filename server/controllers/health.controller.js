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
  const messageKey = isHealthy ? 'system.systemHealthy' : 'system.systemDegraded';
  
  return createResponse(res, isHealthy ? 200 : 503, messageKey, 
    { db, cache, time: new Date().toISOString() }, req, {}, 'business');
};

export const getDiagnostics = async (req, res) => {
  const startDb = Date.now();
  let dbMs = null; let dbOk = false; let dbError;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbMs = Date.now() - startDb; dbOk = true;
  } catch (e) {
    dbMs = Date.now() - startDb; dbError = e.message;
  }

  const startCache = Date.now();
  let cacheMs = null; let cacheOk = false; let cacheError;
  try {
    const resp = await cacheService.ping();
    cacheMs = Date.now() - startCache; cacheOk = resp.ok; if (!resp.ok) cacheError = resp.error;
  } catch (e) {
    cacheMs = Date.now() - startCache; cacheError = e.message;
  }

  const version = process.env.APP_VERSION || 'dev';
  const commit = process.env.GIT_COMMIT || 'unknown';
  const time = new Date().toISOString();
  const overall = dbOk && cacheOk;
  return createResponse(res, overall ? 200 : 503, overall ? 'system.systemHealthy' : 'system.systemDegraded', {
    db: { ok: dbOk, ms: dbMs, error: dbError },
    cache: { ok: cacheOk, ms: cacheMs, error: cacheError },
    version, commit, time
  }, req, {}, 'business');
};

export const cleanupHealth = async () => {
  // No-op cleanup; record a heartbeat cron run for observability
  await LoggerService.logCronRun('health_heartbeat', 'SUCCESS', { timestamp: new Date().toISOString() });
};

export default { getHealth, getDiagnostics, cleanupHealth };