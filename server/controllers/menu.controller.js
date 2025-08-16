import { createResponse, createError } from '../utils/response.js';
import { databaseService } from '../services/databaseService.js';
import cacheService from '../services/cacheService.js';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { LoggerService } from '../utils/logger.js';
import { toZonedTime } from 'date-fns-tz';
import crypto from 'node:crypto';

// Caching keys
const categoriesKey = 'menu:categories';
const itemsKey = (filters) => `menu:items:${filters.categoryId || 'all'}:${String(filters.available ?? 'any')}`;

// Categories
export const listCategories = async (req, res) => {
  try {
    const cached = await cacheService.getCache(categoriesKey);
    if (cached) {
      const etag = `W/"${Buffer.from(JSON.stringify(cached)).length}"`;
      if (req.headers['if-none-match'] === etag) {
        res.statusCode = 304; return res.end();
      }
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.setHeader('ETag', etag);
      return createResponse(res, 200, 'dataRetrieved', { categories: cached, cached: true }, req, {}, 'api');
    }
    const categories = await databaseService.listCategories();
    await cacheService.setCache(categoriesKey, categories, 300);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return createResponse(res, 200, 'dataRetrieved', { categories, cached: false }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const createCategory = async (req, res) => {
  try {
    const created = await databaseService.createCategory(req.body);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 201, 'menu.categoryCreated', { category: created }, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'SERVER_ERROR', {}, req);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await databaseService.updateCategory(req.params.id, req.body);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'menu.categoryUpdated', { category: updated }, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'SERVER_ERROR', {}, req);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await databaseService.deleteCategory(req.params.id);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'menu.categoryDeleted', {}, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'SERVER_ERROR', {}, req);
  }
};

// Menu Items
export const listMenuItems = async (req, res) => {
  try {
    const filters = req.validatedQuery || {};
    const key = itemsKey(filters);
    const cached = await cacheService.getCache(key);
    if (cached) {
      const etag = `W/"${Buffer.from(JSON.stringify(cached)).length}"`;
      if (req.headers['if-none-match'] === etag) { res.statusCode = 304; return res.end(); }
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.setHeader('ETag', etag);
      return createResponse(res, 200, 'dataRetrieved', { items: cached, cached: true }, req, {}, 'api');
    }
    const items = await databaseService.listMenuItems(filters);
    await cacheService.setCache(key, items, 300);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return createResponse(res, 200, 'dataRetrieved', { items, cached: false }, req, {}, 'api');
  } catch (error) {
    return createError(res, 500, 'internalError', 'SERVER_ERROR', {}, req);
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const created = await databaseService.createMenuItem(req.body);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 201, 'menu.itemCreated', { item: created }, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'SERVER_ERROR', {}, req);
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const updated = await databaseService.updateMenuItem(req.params.id, req.body);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'menu.itemUpdated', { item: updated }, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'SERVER_ERROR', {}, req);
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    await databaseService.deleteMenuItem(req.params.id);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'menu.itemDeleted', {}, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'SERVER_ERROR', {}, req);
  }
};

export const toggleMenuItemAvailability = async (req, res) => {
  try {
    const updated = await databaseService.updateMenuItem(req.params.id, { isAvailable: req.body.isAvailable });
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'menu.itemUpdated', { item: updated }, req, {}, 'business');
  } catch (error) {
    return createError(res, 500, 'operationFailed', 'SERVER_ERROR', {}, req);
  }
};

export const cleanupMenuCache = async () => {
  const taskName = 'menu_cache_cleanup';
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
        await cacheService.invalidateByPrefix('menu');
        await LoggerService.logCronRun(taskName, 'SUCCESS', { timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'MENU_CACHE_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('Menu cache cleanup failed', error.stack, { taskName, error: error.message, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};

export default { listCategories, createCategory, updateCategory, deleteCategory, listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability, cleanupMenuCache };