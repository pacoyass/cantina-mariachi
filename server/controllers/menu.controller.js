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
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.setHeader('ETag', `W/"${Buffer.from(JSON.stringify(cached)).length}"`);
      return createResponse(res, 200, 'Categories fetched (cache)', { categories: cached, cached: true });
    }
    const categories = await databaseService.listCategories();
    await cacheService.setCache(categoriesKey, categories, 300);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return createResponse(res, 200, 'Categories fetched', { categories, cached: false });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch categories', 'SERVER_ERROR');
  }
};

export const createCategory = async (req, res) => {
  try {
    const created = await databaseService.createCategory(req.body);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 201, 'Category created', { category: created });
  } catch (error) {
    return createError(res, 500, 'Failed to create category', 'SERVER_ERROR');
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await databaseService.updateCategory(req.params.id, req.body);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'Category updated', { category: updated });
  } catch (error) {
    return createError(res, 500, 'Failed to update category', 'SERVER_ERROR');
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await databaseService.deleteCategory(req.params.id);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'Category deleted', {});
  } catch (error) {
    return createError(res, 500, 'Failed to delete category', 'SERVER_ERROR');
  }
};

// Menu Items
export const listMenuItems = async (req, res) => {
  try {
    const filters = req.validatedQuery || {};
    const key = itemsKey(filters);
    const cached = await cacheService.getCache(key);
    if (cached) {
      res.setHeader('Cache-Control', 'public, max-age=300');
      res.setHeader('ETag', `W/"${Buffer.from(JSON.stringify(cached)).length}"`);
      return createResponse(res, 200, 'Menu items fetched (cache)', { items: cached, cached: true });
    }
    const items = await databaseService.listMenuItems(filters);
    await cacheService.setCache(key, items, 300);
    res.setHeader('Cache-Control', 'public, max-age=60');
    return createResponse(res, 200, 'Menu items fetched', { items, cached: false });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch menu items', 'SERVER_ERROR');
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const created = await databaseService.createMenuItem(req.body);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 201, 'Menu item created', { item: created });
  } catch (error) {
    return createError(res, 500, 'Failed to create menu item', 'SERVER_ERROR');
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const updated = await databaseService.updateMenuItem(req.params.id, req.body);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'Menu item updated', { item: updated });
  } catch (error) {
    return createError(res, 500, 'Failed to update menu item', 'SERVER_ERROR');
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    await databaseService.deleteMenuItem(req.params.id);
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'Menu item deleted', {});
  } catch (error) {
    return createError(res, 500, 'Failed to delete menu item', 'SERVER_ERROR');
  }
};

export const toggleMenuItemAvailability = async (req, res) => {
  try {
    const updated = await databaseService.updateMenuItem(req.params.id, { isAvailable: req.body.isAvailable });
    await cacheService.invalidateByPrefix('menu');
    return createResponse(res, 200, 'Menu item availability updated', { item: updated });
  } catch (error) {
    return createError(res, 500, 'Failed to update availability', 'SERVER_ERROR');
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