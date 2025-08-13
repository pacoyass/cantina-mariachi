import { createResponse, createError } from '../utils/response.js';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';

export const listDrivers = async (req, res) => {
  try {
    const { active, zone } = req.validatedQuery || {};
    const drivers = await databaseService.listDrivers({ active, deliveryZone: zone });
    return createResponse(res, 200, 'Drivers fetched', { drivers });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch drivers', 'SERVER_ERROR');
  }
};

export const createDriver = async (req, res) => {
  try {
    const created = await databaseService.createDriver(req.body);
    await LoggerService.logAudit(req.user?.userId || null, 'DRIVER_CREATED', created.id, { name: created.name });
    return createResponse(res, 201, 'Driver created', { driver: created });
  } catch (error) {
    return createError(res, 500, 'Failed to create driver', 'SERVER_ERROR');
  }
};

export const updateDriver = async (req, res) => {
  try {
    const updated = await databaseService.updateDriver(req.params.id, req.body);
    await LoggerService.logAudit(req.user?.userId || null, 'DRIVER_UPDATED', updated.id, { name: updated.name });
    return createResponse(res, 200, 'Driver updated', { driver: updated });
  } catch (error) {
    return createError(res, 500, 'Failed to update driver', 'SERVER_ERROR');
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await databaseService.deleteDriver(req.params.id);
    await LoggerService.logAudit(req.user?.userId || null, 'DRIVER_DELETED', req.params.id, {});
    return createResponse(res, 200, 'Driver deleted', {});
  } catch (error) {
    return createError(res, 500, 'Failed to delete driver', 'SERVER_ERROR');
  }
};

export const updateDriverStatus = async (req, res) => {
  try {
    const updated = await databaseService.updateDriver(req.params.id, { currentStatus: req.body.currentStatus });
    return createResponse(res, 200, 'Driver status updated', { driver: updated });
  } catch (error) {
    return createError(res, 500, 'Failed to update driver status', 'SERVER_ERROR');
  }
};

export const linkDriverToUser = async (req, res) => {
  try {
    const updated = await databaseService.linkDriverToUser(req.params.id, req.body.userId);
    return createResponse(res, 200, 'Driver linked to user', { driver: updated });
  } catch (error) {
    return createError(res, 500, 'Failed to link driver', 'SERVER_ERROR');
  }
};

export const assignOrder = async (req, res) => {
  try {
    const updated = await databaseService.assignOrderToDriver(req.body.orderNumber, req.body.driverId);
    return createResponse(res, 200, 'Order assigned', { order: updated });
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to assign order', 'ASSIGNMENT_FAILED');
  }
};

export const listDriverAssignments = async (req, res) => {
  try {
    const orders = await databaseService.listOrdersAssignedToDriver(req.params.id);
    return createResponse(res, 200, 'Driver assignments fetched', { orders });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch driver assignments', 'SERVER_ERROR');
  }
};

export default { listDrivers, createDriver, updateDriver, deleteDriver, updateDriverStatus, linkDriverToUser, assignOrder, listDriverAssignments };