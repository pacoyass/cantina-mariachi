import { createResponse, createError } from "../utils/response.js";
import { LoggerService } from "../utils/logger.js";
import { databaseService } from "../services/databaseService.js";

// Get orders awaiting payment
export const getOrdersAwaitingPayment = async (req, res) => {
  try {
    const orders = await databaseService.getOrdersByStatus([
      "AWAITING_PAYMENT",
      "READY",
    ]);

    const stats = {
      awaitingPayment: orders.filter((o) => o.status === "AWAITING_PAYMENT")
        .length,
      ready: orders.filter((o) => o.status === "READY").length,
    };

    return createResponse(res, 200, "Orders retrieved successfully", {
      orders,
      stats,
    });
  } catch (error) {
    LoggerService.logError(
      "Failed to get orders awaiting payment",
      error.stack,
      {
        userId: req.user?.userId,
      }
    );
    return createError(res, 500, "Failed to fetch orders", "SERVER_ERROR");
  }
};

// Process payment
export const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod, amount, notes } = req.body;

    if (!orderId || !paymentMethod || !amount) {
      return createError(
        res,
        400,
        "Order ID, payment method, and amount are required",
        "VALIDATION_ERROR"
      );
    }

    const order = await databaseService.getOrderById(orderId);

    if (!order) {
      return createError(res, 404, "Order not found", "NOT_FOUND");
    }

    // Record cash transaction if payment method is CASH
    if (paymentMethod === "CASH" && order.type === "DELIVERY") {
      const discrepancy = amount !== order.total ? amount - order.total : null;

      await databaseService.createCashTransaction({
        orderId,
        driverId: order.driverId,
        amount: order.total,
        confirmed: true,
        adminVerified: false,
        discrepancyAmount: discrepancy,
        customerNotes: notes,
        paymentTimestamp: new Date(),
      });
    }

    // Update order status to COMPLETED and assign cashier
    const updatedOrder = await databaseService.updateOrderStatus(
      orderId,
      "COMPLETED",
      {
        cashierId: req.user?.userId,
      }
    );

    LoggerService.logActivity(
      req.user?.userId,
      "PAYMENT_PROCESSED",
      `Processed payment for order ${orderId}`,
      {
        orderId,
        paymentMethod,
        amount,
        cashierId: req.user?.userId,
      }
    );

    return createResponse(
      res,
      200,
      "Payment processed successfully",
      updatedOrder
    );
  } catch (error) {
    LoggerService.logError("Failed to process payment", error.stack, {
      userId: req.user?.userId,
      orderId: req.body.orderId,
    });
    return createError(res, 500, "Failed to process payment", "SERVER_ERROR");
  }
};

// Get today's transactions
export const getTodayTransactions = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transactions = await databaseService.getCashTransactionsByDateRange(
      today,
      tomorrow
    );
    const orders = await databaseService.getOrdersByDateRange(today, tomorrow, [
      "PENDING",
      "CONFIRMED",
      "PREPARING",
      "READY",
      "OUT_FOR_DELIVERY",
      "AWAITING_PAYMENT",
      "PAYMENT_DISPUTED",
      "DELIVERED",
      "COMPLETED",
      "CANCELLED",
    ]);
    console.log("from cashier controller order....", orders);

    // Calculate stats
    const cashTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
    const cardOrders = orders.filter(
      (o) => !transactions.find((t) => t.orderId === o.id)
    );
    const cardTotal = cardOrders.reduce((sum, o) => sum + o.total, 0);
    const todayTotal = cashTotal + cardTotal;

    const stats = {
      todayTotal,
      cashTotal,
      cardTotal,
      transactionCount: orders.length,
      avgTransaction: orders.length > 0 ? todayTotal / orders.length : 0,
    };

    return createResponse(res, 200, "Today's transactions retrieved", {
      transactions,
      orders,
      stats,
    });
  } catch (error) {
    LoggerService.logError("Failed to get today's transactions", error.stack, {
      userId: req.user?.userId,
    });
    return createError(
      res,
      500,
      "Failed to fetch transactions",
      "SERVER_ERROR"
    );
  }
};

// Get daily summary
export const getDailySummary = async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const summary = await databaseService.getCashSummaryByDate(targetDate);

    return createResponse(res, 200, "Daily summary retrieved", summary);
  } catch (error) {
    LoggerService.logError("Failed to get daily summary", error.stack, {
      userId: req.user?.userId,
    });
    return createError(res, 500, "Failed to fetch summary", "SERVER_ERROR");
  }
};

// End shift report
export const endShiftReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transactions = await databaseService.getCashTransactionsByDateRange(
      today,
      tomorrow
    );
    const orders = await databaseService.getOrdersByDateRange(today, tomorrow, [
      "COMPLETED",
    ]);

    const report = {
      date: today,
      cashier: req.user?.name,
      totalTransactions: orders.length,
      cashTransactions: transactions.length,
      cardTransactions: orders.length - transactions.length,
      totalCash: transactions.reduce((sum, t) => sum + t.amount, 0),
      unconfirmedCash: transactions.filter((t) => !t.confirmed).length,
      discrepancies: transactions.filter((t) => t.discrepancyAmount).length,
    };

    LoggerService.logActivity(
      req.user?.userId,
      "SHIFT_END",
      "Generated end shift report",
      {
        userId: req.user?.userId,
        report,
      }
    );

    return createResponse(res, 200, "End shift report generated", report);
  } catch (error) {
    LoggerService.logError("Failed to generate end shift report", error.stack, {
      userId: req.user?.userId,
    });
    return createError(res, 500, "Failed to generate report", "SERVER_ERROR");
  }
};

// ===== NEW CASHIER COORDINATOR FUNCTIONS =====

// Confirm order (PENDING → CONFIRMED)
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return createError(res, 400, "Order ID is required", "VALIDATION_ERROR");
    }

    const order = await databaseService.getOrderById(orderId);

    if (!order) {
      return createError(res, 404, "Order not found", "NOT_FOUND");
    }

    if (order.status !== "PENDING") {
      return createError(
        res,
        400,
        `Order cannot be confirmed from ${order.status} status`,
        "INVALID_STATUS"
      );
    }

    // Update order status to CONFIRMED
    // Cashier has reviewed and confirmed the order
    const updatedOrder = await databaseService.updateOrderStatus(
      orderId,
      "CONFIRMED",
      {
        cashierId: req.user?.userId,
      }
    );

    LoggerService.logActivity(
      req.user?.userId,
      "ORDER_CONFIRMED",
      `Confirmed order ${orderId}`,
      {
        orderId,
        cashierId: req.user?.userId,
      }
    );

    return createResponse(
      res,
      200,
      "Order confirmed successfully",
      updatedOrder
    );
  } catch (error) {
    LoggerService.logError("Failed to confirm order", error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId,
    });
    return createError(res, 500, "Failed to confirm order", "SERVER_ERROR");
  }
};

// Send to kitchen (CONFIRMED → PREPARING)
export const sendToKitchen = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return createError(res, 400, "Order ID is required", "VALIDATION_ERROR");
    }

    const order = await databaseService.getOrderById(orderId);

    if (!order) {
      return createError(res, 404, "Order not found", "NOT_FOUND");
    }

    if (order.status !== "CONFIRMED") {
      return createError(
        res,
        400,
        `Order cannot be sent to kitchen from ${order.status} status`,
        "INVALID_STATUS"
      );
    }

    // Update order status to PREPARING
    // Cashier physically handed the order to kitchen
    const updatedOrder = await databaseService.updateOrderStatus(
      orderId,
      "PREPARING"
    );

    LoggerService.logActivity(
      req.user?.userId,
      "ORDER_SENT_TO_KITCHEN",
      `Sent order ${orderId} to kitchen`,
      {
        orderId,
        cashierId: req.user?.userId,
      }
    );

    return createResponse(
      res,
      200,
      "Order sent to kitchen successfully",
      updatedOrder
    );
  } catch (error) {
    LoggerService.logError("Failed to send order to kitchen", error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId,
    });
    return createError(res, 500, "Failed to send to kitchen", "SERVER_ERROR");
  }
};

// Mark order ready (PREPARING → READY)
export const markOrderReady = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return createError(res, 400, "Order ID is required", "VALIDATION_ERROR");
    }

    const order = await databaseService.getOrderById(orderId);

    if (!order) {
      return createError(res, 404, "Order not found", "NOT_FOUND");
    }

    if (order.status !== "PREPARING") {
      return createError(
        res,
        400,
        `Order cannot be marked ready from ${order.status} status`,
        "INVALID_STATUS"
      );
    }

    // Update order status to READY
    // Kitchen has finished preparing
    const updatedOrder = await databaseService.updateOrderStatus(
      orderId,
      "READY"
    );

    LoggerService.logActivity(
      req.user?.userId,
      "ORDER_READY",
      `Marked order ${orderId} as ready`,
      {
        orderId,
        cashierId: req.user?.userId,
      }
    );

    return createResponse(
      res,
      200,
      "Order marked as ready successfully",
      updatedOrder
    );
  } catch (error) {
    LoggerService.logError("Failed to mark order ready", error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId,
    });
    return createError(res, 500, "Failed to mark order ready", "SERVER_ERROR");
  }
};

// Assign driver to order (READY → OUT_FOR_DELIVERY)
export const assignDriver = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { driverId } = req.body;

    if (!orderId || !driverId) {
      return createError(
        res,
        400,
        "Order ID and Driver ID are required",
        "VALIDATION_ERROR"
      );
    }

    const order = await databaseService.getOrderById(orderId);

    if (!order) {
      return createError(res, 404, "Order not found", "NOT_FOUND");
    }

    if (order.status !== "READY") {
      return createError(
        res,
        400,
        `Order must be READY to assign driver. Current status: ${order.status}`,
        "INVALID_STATUS"
      );
    }

    // Check if driver exists
    const driver = await databaseService.getDriverById(driverId);
    if (!driver) {
      return createError(res, 404, "Driver not found", "NOT_FOUND");
    }

    // Update order with driver and change status to OUT_FOR_DELIVERY
    const updatedOrder = await databaseService.updateOrder(orderId, {
      driverId,
      status: "OUT_FOR_DELIVERY",
    });

    LoggerService.logActivity(
      req.user?.userId,
      "DRIVER_ASSIGNED",
      `Assigned driver ${driver.name} to order ${orderId}`,
      {
        orderId,
        driverId,
        driverName: driver.name,
        cashierId: req.user?.userId,
      }
    );

    return createResponse(
      res,
      200,
      "Driver assigned successfully",
      updatedOrder
    );
  } catch (error) {
    LoggerService.logError("Failed to assign driver", error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId,
      driverId: req.body.driverId,
    });
    return createError(res, 500, "Failed to assign driver", "SERVER_ERROR");
  }
};

// Get all drivers (for assignment dropdown)
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await databaseService.getAllDrivers();

    const driversWithStats = await Promise.all(
      drivers.map(async (driver) => {
        const activeDeliveries = await databaseService.getOrdersByDriverAndStatus(
          driver.id,
          ["OUT_FOR_DELIVERY"]
        );
        
        return {
          ...driver,
          activeDeliveries: activeDeliveries.length,
        };
      })
    );

    return createResponse(
      res,
      200,
      "Drivers retrieved successfully",
      driversWithStats
    );
  } catch (error) {
    LoggerService.logError("Failed to get drivers", error.stack, {
      userId: req.user?.userId,
    });
    return createError(res, 500, "Failed to fetch drivers", "SERVER_ERROR");
  }
};

// Reject order (PENDING → CANCELLED)
export const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!orderId) {
      return createError(res, 400, "Order ID is required", "VALIDATION_ERROR");
    }

    const order = await databaseService.getOrderById(orderId);

    if (!order) {
      return createError(res, 404, "Order not found", "NOT_FOUND");
    }

    if (order.status !== "PENDING") {
      return createError(
        res,
        400,
        `Only PENDING orders can be rejected. Current status: ${order.status}`,
        "INVALID_STATUS"
      );
    }

    // Update order status to CANCELLED with notes
    const updatedOrder = await databaseService.updateOrder(orderId, {
      status: "CANCELLED",
      notes: order.notes
        ? `${order.notes}\n[REJECTED by cashier: ${reason || "No reason provided"}]`
        : `[REJECTED by cashier: ${reason || "No reason provided"}]`,
    });

    LoggerService.logActivity(
      req.user?.userId,
      "ORDER_REJECTED",
      `Rejected order ${orderId}`,
      {
        orderId,
        reason,
        cashierId: req.user?.userId,
      }
    );

    return createResponse(
      res,
      200,
      "Order rejected successfully",
      updatedOrder
    );
  } catch (error) {
    LoggerService.logError("Failed to reject order", error.stack, {
      userId: req.user?.userId,
      orderId: req.params.orderId,
    });
    return createError(res, 500, "Failed to reject order", "SERVER_ERROR");
  }
};
