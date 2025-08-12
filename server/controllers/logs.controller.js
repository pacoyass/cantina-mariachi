import { databaseService } from '../services/databaseService.js';
import { createResponse, createError } from '../utils/response.js';

/**
 * GET /api/logs/activity
 * Requires ADMIN/OWNER. Uses validated and normalized req.query.
 */
export const getActivityLogs = async (req, res) => {
  try {
    const { page, pageSize, start, end, type } = req.query;
    const logs = await databaseService.getActivityLogs(type, start, end, { page, pageSize });
    return createResponse(res, 200, 'Activity logs fetched', { logs, page, pageSize, hasMore: logs.length === pageSize });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch activity logs', 'SERVER_ERROR');
  }
};

/**
 * GET /api/logs/notifications
 * Requires ADMIN/OWNER. Uses validated and normalized req.query.
 */
export const getNotifications = async (req, res) => {
  try {
    const { page, pageSize, start, end, status } = req.query;
    const logs = await databaseService.getNotificationLogs(status, start, end, { page, pageSize });
    return createResponse(res, 200, 'Notification logs fetched', { logs, page, pageSize, hasMore: logs.length === pageSize });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch notification logs', 'SERVER_ERROR');
  }
};

/**
 * GET /api/logs/orders
 * Requires ADMIN/OWNER. Uses validated and normalized req.query.
 */
export const getOrders = async (req, res) => {
  try {
    const { page, pageSize, status } = req.query;
    const orders = await databaseService.getOrdersByStatus(status, { page, pageSize });
    return createResponse(res, 200, 'Orders fetched', { orders, page, pageSize, hasMore: orders.length === pageSize });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch orders', 'SERVER_ERROR');
  }
};  
