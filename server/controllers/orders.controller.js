import { createResponse, createError } from '../utils/response.js';
import { databaseService } from '../services/databaseService.js';
import { LoggerService } from '../utils/logger.js';

export const createOrder = async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user?.userId || null };
    const order = await databaseService.createOrderWithItems(payload);
    await LoggerService.logAudit(req.user?.userId || null, 'ORDER_CREATED', order.id, { orderNumber: order.orderNumber, total: order.total });
    return createResponse(res, 201, 'Order created', { order });
  } catch (error) {
    await LoggerService.logError('createOrder failed', error.stack, { error: error.message });
    return createError(res, 400, error.message || 'Failed to create order', 'ORDER_CREATE_FAILED');
  }
};

export const getOrderByNumber = async (req, res) => {
  try {
    const order = await databaseService.getOrderByNumber(req.params.orderNumber);
    if (!order) return createError(res, 404, 'Order not found', 'NOT_FOUND');
    return createResponse(res, 200, 'Order fetched', { order });
  } catch (error) {
    return createError(res, 500, 'Failed to fetch order', 'SERVER_ERROR');
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const updated = await databaseService.updateOrderStatusByNumber(req.params.orderNumber, req.body.status);
    await LoggerService.logAudit(req.user?.userId || null, 'ORDER_STATUS_UPDATED', updated.id, { status: req.body.status, orderNumber: updated.orderNumber });
    return createResponse(res, 200, 'Order status updated', { order: updated });
  } catch (error) {
    return createError(res, 400, error.message || 'Failed to update order status', 'ORDER_STATUS_FAILED');
  }
};

export default { createOrder, getOrderByNumber, updateOrderStatus };