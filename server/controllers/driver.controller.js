import { createResponse, createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';
import { databaseService } from '../services/databaseService.js';

// Get driver's deliveries
export const getDriverDeliveries = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Get driver info from user
    const driver = await databaseService.getDriverByUserId(req.user?.userId);
    
    if (!driver) {
      return createError(res, 404, 'Driver profile not found', 'NOT_FOUND');
    }
    
    const statuses = status ? status.split(',') : ['READY', 'OUT_FOR_DELIVERY'];
    
    // Get assigned deliveries
    const assignedDeliveries = await databaseService.getOrdersByDriverAndStatus(driver.id, statuses);
    
    // Get available deliveries (unassigned, READY)
    const availableDeliveries = await databaseService.getAvailableDeliveries();
    
    const stats = {
      assigned: assignedDeliveries.filter(o => o.status !== 'DELIVERED').length,
      inTransit: assignedDeliveries.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
      completed: assignedDeliveries.filter(o => o.status === 'DELIVERED').length,
      available: availableDeliveries.length
    };
    
    return createResponse(res, 200, 'Deliveries retrieved successfully', {
      assigned: assignedDeliveries,
      available: availableDeliveries,
      stats
    });
  } catch (error) {
    LoggerService.logError('Failed to get driver deliveries', error.stack, {
      userId: req.user?.userId
    });
    return createError(res, 500, 'Failed to fetch deliveries', 'SERVER_ERROR');
  }
};

// Accept delivery
export const acceptDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const driver = await databaseService.getDriverByUserId(req.user?.userId);
    
    if (!driver) {
      return createError(res, 404, 'Driver profile not found', 'NOT_FOUND');
    }
    
    const order = await databaseService.getOrderById(orderId);
    
    if (!order) {
      return createError(res, 404, 'Order not found', 'NOT_FOUND');
    }
    
    if (order.type !== 'DELIVERY') {
      return createError(res, 400, 'Only delivery orders can be accepted', 'INVALID_ORDER_TYPE');
    }
    
    if (order.status !== 'READY') {
      return createError(res, 400, 'Order must be READY status', 'INVALID_STATUS');
    }
    
    if (order.driverId && order.driverId !== driver.id) {
      return createError(res, 400, 'Order already assigned to another driver', 'ALREADY_ASSIGNED');
    }
    
    // Assign driver to order
    const updatedOrder = await databaseService.updateOrder(orderId, {
      driverId: driver.id
    });
    
    LoggerService.logActivity(req.user?.userId, 'DELIVERY_ACCEPTED', `Accepted delivery ${orderId}`, {
      orderId,
      driverId: driver.id
    });
    
    return createResponse(res, 200, 'Delivery accepted', updatedOrder);
  } catch (error) {
    LoggerService.logError('Failed to accept delivery', error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId
    });
    return createError(res, 500, 'Failed to accept delivery', 'SERVER_ERROR');
  }
};

// Start delivery
export const startDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await databaseService.getOrderById(orderId);
    
    if (!order) {
      return createError(res, 404, 'Order not found', 'NOT_FOUND');
    }
    
    if (order.status !== 'READY') {
      return createError(res, 400, 'Order must be READY status', 'INVALID_STATUS');
    }
    
    const updatedOrder = await databaseService.updateOrderStatus(orderId, 'OUT_FOR_DELIVERY');
    
    // Update driver status
    const driver = await databaseService.getDriverByUserId(req.user?.userId);
    if (driver) {
      await databaseService.updateDriver(driver.id, {
        currentStatus: 'On Delivery'
      });
    }
    
    LoggerService.logActivity(req.user?.userId, 'DELIVERY_STARTED', `Started delivery ${orderId}`, {
      orderId,
      driverId: driver?.id
    });
    
    return createResponse(res, 200, 'Delivery started', updatedOrder);
  } catch (error) {
    LoggerService.logError('Failed to start delivery', error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId
    });
    return createError(res, 500, 'Failed to start delivery', 'SERVER_ERROR');
  }
};

// Complete delivery
export const completeDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cashCollected, discrepancy, notes } = req.body;
    
    const order = await databaseService.getOrderById(orderId);
    
    if (!order) {
      return createError(res, 404, 'Order not found', 'NOT_FOUND');
    }
    
    if (order.status !== 'OUT_FOR_DELIVERY') {
      return createError(res, 400, 'Order must be OUT_FOR_DELIVERY status', 'INVALID_STATUS');
    }
    
    // If COD, create cash transaction
    if (cashCollected !== undefined) {
      const driver = await databaseService.getDriverByUserId(req.user?.userId);
      
      await databaseService.createCashTransaction({
        orderId,
        driverId: driver.id,
        amount: order.total,
        confirmed: false, // Pending cashier verification
        adminVerified: false,
        discrepancyAmount: discrepancy || null,
        customerNotes: notes,
        paymentTimestamp: new Date()
      });
    }
    
    // Update order status
    const updatedOrder = await databaseService.updateOrderStatus(orderId, 'DELIVERED');
    
    // Update driver status back to available
    const driver = await databaseService.getDriverByUserId(req.user?.userId);
    if (driver) {
      await databaseService.updateDriver(driver.id, {
        currentStatus: 'Available'
      });
    }
    
    LoggerService.logActivity(req.user?.userId, 'DELIVERY_COMPLETED', `Completed delivery ${orderId}`, {
      orderId,
      driverId: driver?.id,
      cashCollected
    });
    
    return createResponse(res, 200, 'Delivery completed successfully', updatedOrder);
  } catch (error) {
    LoggerService.logError('Failed to complete delivery', error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId
    });
    return createError(res, 500, 'Failed to complete delivery', 'SERVER_ERROR');
  }
};

// Get driver's cash summary
export const getDriverCashSummary = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    const driver = await databaseService.getDriverByUserId(req.user?.userId);
    
    if (!driver) {
      return createError(res, 404, 'Driver profile not found', 'NOT_FOUND');
    }
    
    const summary = await databaseService.getCashSummaryByDriverAndDate(driver.id, targetDate);
    
    return createResponse(res, 200, 'Cash summary retrieved', summary);
  } catch (error) {
    LoggerService.logError('Failed to get cash summary', error.stack, {
      userId: req.user?.userId
    });
    return createError(res, 500, 'Failed to fetch summary', 'SERVER_ERROR');
  }
};

// Update driver status
export const updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Available', 'On Delivery', 'Offline'].includes(status)) {
      return createError(res, 400, 'Invalid driver status', 'VALIDATION_ERROR');
    }
    
    const driver = await databaseService.getDriverByUserId(req.user?.userId);
    
    if (!driver) {
      return createError(res, 404, 'Driver profile not found', 'NOT_FOUND');
    }
    
    const updatedDriver = await databaseService.updateDriver(driver.id, {
      currentStatus: status
    });
    
    LoggerService.logActivity(req.user?.userId, 'DRIVER_STATUS_UPDATE', `Updated status to ${status}`, {
      driverId: driver.id,
      status
    });
    
    return createResponse(res, 200, 'Driver status updated', updatedDriver);
  } catch (error) {
    LoggerService.logError('Failed to update driver status', error.stack, {
      userId: req.user?.userId
    });
    return createError(res, 500, 'Failed to update status', 'SERVER_ERROR');
  }
};

export default {
  getDriverDeliveries,
  acceptDelivery,
  startDelivery,
  completeDelivery,
  getDriverCashSummary,
  updateDriverStatus
};
