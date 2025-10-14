import { createResponse, createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';
import { databaseService } from '../services/databaseService.js';

// Get waiter's orders (dine-in orders)
export const getWaiterOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const statuses = status ? status.split(',') : ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'];
    
    // Get DINE_IN orders only
    const orders = await databaseService.getOrdersByTypeAndStatus('DINE_IN', statuses);
    
    // Group by table
    const tableOrders = orders.reduce((acc, order) => {
      const table = order.tableNumber || 'No Table';
      if (!acc[table]) {
        acc[table] = {
          tableNumber: order.tableNumber,
          guestCount: order.guestCount,
          orders: []
        };
      }
      acc[table].orders.push(order);
      return acc;
    }, {});
    
    return createResponse(res, 200, 'Waiter orders retrieved successfully', {
      orders,
      tableOrders: Object.values(tableOrders)
    });
  } catch (error) {
    LoggerService.logError('Failed to get waiter orders', error.stack, {
      userId: req.user?.userId
    });
    return createError(res, 500, 'Failed to fetch waiter orders', 'SERVER_ERROR');
  }
};

// Create dine-in order
export const createDineInOrder = async (req, res) => {
  try {
    const {
      tableNumber,
      guestCount,
      customerName,
      customerEmail,
      customerPhone,
      items, // Array of { menuItemId, quantity, notes }
      notes
    } = req.body;
    
    if (!tableNumber || !items || items.length === 0) {
      return createError(res, 400, 'Table number and items are required', 'VALIDATION_ERROR');
    }
    
    // Calculate order totals
    const menuItems = await Promise.all(
      items.map(item => databaseService.getMenuItemById(item.menuItemId))
    );
    
    const subtotal = items.reduce((sum, item, index) => {
      return sum + (menuItems[index].price * item.quantity);
    }, 0);
    
    const tax = subtotal * 0.085; // 8.5% tax (should come from AppConfig)
    const total = subtotal + tax;
    
    // Create order
    const orderData = {
      type: 'DINE_IN',
      tableNumber,
      guestCount,
      customerName: customerName || 'Walk-in Guest',
      customerEmail: customerEmail || 'none@restaurant.local',
      customerPhone: customerPhone || 'N/A',
      subtotal,
      tax,
      total,
      notes,
      waiterId: req.user?.userId,
      status: 'PENDING'
    };
    
    const order = await databaseService.createOrderWithItems(orderData, items);
    
    LoggerService.logActivity(req.user?.userId, 'ORDER_CREATE_DINEIN', 'Created dine-in order', {
      orderId: order.id,
      tableNumber,
      waiterId: req.user?.userId
    });
    
    return createResponse(res, 201, 'Dine-in order created successfully', order);
  } catch (error) {
    LoggerService.logError('Failed to create dine-in order', error.stack, {
      userId: req.user?.userId
    });
    return createError(res, 500, 'Failed to create dine-in order', 'SERVER_ERROR');
  }
};

// Get today's reservations
export const getTodayReservations = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const reservations = await databaseService.getReservationsByDateRange(today, tomorrow);
    
    return createResponse(res, 200, 'Today\'s reservations retrieved', reservations);
  } catch (error) {
    LoggerService.logError('Failed to get today\'s reservations', error.stack, {
      userId: req.user?.userId
    });
    return createError(res, 500, 'Failed to fetch reservations', 'SERVER_ERROR');
  }
};

// Mark reservation as seated
export const seatReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { tableNumber } = req.body;
    
    const reservation = await databaseService.updateReservationStatus(reservationId, 'SEATED');
    
    LoggerService.logActivity(req.user?.userId, 'RESERVATION_SEATED', `Seated reservation ${reservationId}`, {
      reservationId,
      tableNumber,
      waiterId: req.user?.userId
    });
    
    return createResponse(res, 200, 'Reservation marked as seated', reservation);
  } catch (error) {
    LoggerService.logError('Failed to seat reservation', error.stack, {
      userId: req.user?.userId,
      reservationId: req.params.reservationId
    });
    return createError(res, 500, 'Failed to seat reservation', 'SERVER_ERROR');
  }
};

export default {
  getWaiterOrders,
  createDineInOrder,
  getTodayReservations,
  seatReservation
};
