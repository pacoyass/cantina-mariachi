import prisma from '../config/database.js';
import cacheService from '../services/cacheService.js';
import { createResponse } from '../utils/response.js';

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
  return createResponse(res, db.ok && cache.ok ? 200 : 503, 'health', { db, cache, time: new Date().toISOString() });
};

export default { getHealth };