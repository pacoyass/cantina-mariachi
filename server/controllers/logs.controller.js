import { databaseService } from '../services/databaseService.js';
import { createResponse, createError } from '../utils/response.js';


export const getActivityLogs=async (req, res) => {
    try {
      const page = Math.max(parseInt(req.query.page || '1', 10), 1);
      const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '50', 10), 1), 200);
      const start = req.query.start ? new Date(req.query.start) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = req.query.end ? new Date(req.query.end) : new Date();
      const type = req.query.type || undefined;
      const logs = await databaseService.getActivityLogs(type, start, end, { page, pageSize });
      return createResponse(res, 200, 'Activity logs fetched', { logs, page, pageSize, hasMore: logs.length === pageSize });
    } catch (error) {
      return createError(res, 500, 'Failed to fetch activity logs', 'SERVER_ERROR');
    }
  }


export const getNotifications= async (req, res) => {
    try {
      const page = Math.max(parseInt(req.query.page || '1', 10), 1);
      const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '50', 10), 1), 200);
      const start = req.query.start ? new Date(req.query.start) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const end = req.query.end ? new Date(req.query.end) : new Date();
      const status = req.query.status || 'SENT';
      const logs = await databaseService.getNotificationLogs(status, start, end, { page, pageSize });
      return createResponse(res, 200, 'Notification logs fetched', { logs, page, pageSize, hasMore: logs.length === pageSize });
    } catch (error) {
      return createError(res, 500, 'Failed to fetch notification logs', 'SERVER_ERROR');
    }
  }


export const getOrders=  async (req, res) => {
    try {
      const page = Math.max(parseInt(req.query.page || '1', 10), 1);
      const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '50', 10), 1), 200);
      const status = req.query.status || 'PENDING';
      const orders = await databaseService.getOrdersByStatus(status, { page, pageSize });
      return createResponse(res, 200, 'Orders fetched', { orders, page, pageSize, hasMore: orders.length === pageSize });
    } catch (error) {
      return createError(res, 500, 'Failed to fetch orders', 'SERVER_ERROR');
    }
  }  
