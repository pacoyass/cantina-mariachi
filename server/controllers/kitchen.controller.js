import { createResponse, createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';
import { databaseService } from '../services/databaseService.js';

// Get orders for kitchen (CONFIRMED, PREPARING, READY)
export const getKitchenOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const statuses = status ? status.split(',') : ['CONFIRMED', 'PREPARING', 'READY'];
    
    const orders = await databaseService.getOrdersByStatus(statuses);
    
    // Calculate stats
    const stats = {
      pending: orders.filter(o => o.status === 'CONFIRMED').length,
      preparing: orders.filter(o => o.status === 'PREPARING').length,
      ready: orders.filter(o => o.status === 'READY').length
    };
    
    LoggerService.logActivity(req.user?.userId, 'KITCHEN_VIEW', 'Viewed kitchen orders', {
      userId: req.user?.userId,
      orderCount: orders.length
    });
    
    return createResponse(res, 200, 'Kitchen orders retrieved successfully', {
      orders,
      stats
    });
  } catch (error) {
    LoggerService.logError('Failed to get kitchen orders', error.stack, {
      userId: req.user?.userId
    });
    return createError(res, 500, 'Failed to fetch kitchen orders', 'SERVER_ERROR');
  }
};

// Start preparing an order
export const startPreparing = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await databaseService.getOrderById(orderId);
    
    if (!order) {
      return createError(res, 404, 'Order not found', 'NOT_FOUND');
    }
    
    if (order.status !== 'CONFIRMED') {
      return createError(res, 400, 'Order must be in CONFIRMED status', 'INVALID_STATUS');
    }
    
    // Update order status and assign cook
    const updatedOrder = await databaseService.updateOrderStatus(orderId, 'PREPARING', {
      cookId: req.user?.userId
    });
    
    LoggerService.logActivity(req.user?.userId, 'ORDER_START_PREPARING', `Started preparing order ${orderId}`, {
      orderId,
      cookId: req.user?.userId
    });
    
    return createResponse(res, 200, 'Order preparation started', updatedOrder);
  } catch (error) {
    LoggerService.logError('Failed to start preparing order', error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId
    });
    return createError(res, 500, 'Failed to start preparing order', 'SERVER_ERROR');
  }
};

// Mark order as ready
export const markOrderReady = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await databaseService.getOrderById(orderId);
    
    if (!order) {
      return createError(res, 404, 'Order not found', 'NOT_FOUND');
    }
    
    if (order.status !== 'PREPARING') {
      return createError(res, 400, 'Order must be in PREPARING status', 'INVALID_STATUS');
    }
    
    const updatedOrder = await databaseService.updateOrderStatus(orderId, 'READY');
    
    LoggerService.logActivity(req.user?.userId, 'ORDER_MARK_READY', `Marked order ${orderId} as ready`, {
      orderId,
      cookId: req.user?.userId
    });
    
    // TODO: Send notification to waiter/driver that order is ready
    
    return createResponse(res, 200, 'Order marked as ready', updatedOrder);
  } catch (error) {
    LoggerService.logError('Failed to mark order as ready', error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId
    });
    return createError(res, 500, 'Failed to mark order as ready', 'SERVER_ERROR');
  }
};

export default {
  getKitchenOrders,
  startPreparing,
  markOrderReady
};
