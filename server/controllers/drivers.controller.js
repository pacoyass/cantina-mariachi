import { createResponse, createError } from '../utils/response.js';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';
import prisma from '../config/database.js';
import { acquireLock, releaseLock } from '../utils/lock.js';
import { toZonedTime } from 'date-fns-tz';
import { subDays } from 'date-fns';
import crypto from 'node:crypto';

export const listDrivers = async (req, res) => {
  try {
    const { active, zone } = req.validatedQuery || {};
    const drivers = await databaseService.listDrivers({ active, deliveryZone: zone });
    return createResponse(res, 200, 'Drivers fetched', { drivers }, req, {}, 'business:drivers');
  } catch (error) {
    return createError(res, 500, 'Failed to fetch drivers', 'SERVER_ERROR', {}, req, {}, 'business:drivers');
  }
};

export const createDriver = async (req, res) => {
  try {
    const created = await databaseService.createDriver(req.body);
    await LoggerService.logAudit(req.user?.userId || null, 'DRIVER_CREATED', created.id, { name: created.name });
    return createResponse(res, 201, 'driverCreated', { driver: created }, req, {}, 'business:drivers');
  } catch (error) {
    return createError(res, 500, 'Failed to create driver', 'SERVER_ERROR', {}, req, {}, 'business:drivers');
  }
};

export const updateDriver = async (req, res) => {
  try {
    const updated = await databaseService.updateDriver(req.params.id, req.body);
    await LoggerService.logAudit(req.user?.userId || null, 'DRIVER_UPDATED', updated.id, { name: updated.name });
    return createResponse(res, 200, 'driverUpdated', { driver: updated }, req, {}, 'business:drivers');
  } catch (error) {
    return createError(res, 500, 'Failed to update driver', 'SERVER_ERROR', {}, req, {}, 'business:drivers');
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await databaseService.deleteDriver(req.params.id);
    await LoggerService.logAudit(req.user?.userId || null, 'DRIVER_DELETED', req.params.id, {});
    return createResponse(res, 200, 'driverDeleted', {}, req, {}, 'business:drivers');
  } catch (error) {
    return createError(res, 500, 'Failed to delete driver', 'SERVER_ERROR', {}, req, {}, 'business:drivers');
  }
};

export const updateDriverStatus = async (req, res) => {
  try {
    const updated = await databaseService.updateDriver(req.params.id, { currentStatus: req.body.currentStatus });
    return createResponse(res, 200, 'Driver status updated', { driver: updated }, req, {}, 'business:drivers');
  } catch (error) {
    return createError(res, 500, 'Failed to update driver status', 'SERVER_ERROR', {}, req, {}, 'business:drivers');
  }
};

export const linkDriverToUser = async (req, res) => {
  try {
    const updated = await databaseService.linkDriverToUser(req.params.id, req.body.userId);
    return createResponse(res, 200, 'Driver linked to user', { driver: updated }, req, {}, 'business:drivers');
  } catch (error) {
    return createError(res, 500, 'Failed to link driver', 'SERVER_ERROR', {}, req, {}, 'business:drivers');
  }
};

export const assignOrder = async (req, res) => {
  try {
    const updated = await databaseService.assignOrderToDriver(req.body.orderNumber, req.body.driverId);
    return createResponse(res, 200, 'Order assigned', { order: updated }, req, {}, 'business:drivers');
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to assign order', 'ASSIGNMENT_FAILED');
  }
};

export const listDriverAssignments = async (req, res) => {
  try {
    const orders = await databaseService.listOrdersAssignedToDriver(req.params.id);
    return createResponse(res, 200, 'Driver assignments fetched', { orders }, req, {}, 'business:drivers');
  } catch (error) {
    return createError(res, 500, 'Failed to fetch driver assignments', 'SERVER_ERROR', {}, req, {}, 'business:drivers');
  }
};

export const cleanupInactiveDrivers = async (retentionDays = 90) => {
  const taskName = 'drivers_cleanup';
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
        const deleted = await tx.driver.deleteMany({
          where: {
            active: false,
            updatedAt: { lt: cutoff },
            userId: null,
            orders: { none: {} },
          },
        });
        await LoggerService.logCronRun(taskName, 'SUCCESS', { deleted: deleted.count, cutoff: cutoff.toISOString(), timestamp });
      } finally {
        await releaseLock(tx, taskName);
        await LoggerService.logAudit(null, 'DRIVERS_CLEANUP_LOCK_RELEASED', null, { instanceId, timestamp });
      }
    });
  } catch (error) {
    await LoggerService.logError('Drivers cleanup failed', error.stack, { taskName, error: error.message, timestamp });
    await LoggerService.logCronRun(taskName, 'FAILED', { error: error.message, timestamp });
    throw error;
  }
};

export default { listDrivers, createDriver, updateDriver, deleteDriver, updateDriverStatus, linkDriverToUser, assignOrder, listDriverAssignments, cleanupInactiveDrivers };