import  prisma  from '../config/database.js';
import { LoggerService } from '../utils/logger.js';

class DatabaseService {
  #prisma;

  constructor() {
    this.#prisma = prisma;
  }

  // User Queries
  async createUser(data) {
    try {
      const user = await this.#prisma.user.create({ data });
      await LoggerService.logSystemEvent('DatabaseService', 'CREATE_USER', { userId: user.id });
      return user;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'createUser', data });
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await this.#prisma.user.findUnique({
        where: { id },
        include: { preferences: true, orders: true, driver: true },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_USER', { userId: id });
      return user;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getUserById', id });
      throw error;
    }
  }

  async getUsersByRole(role) {
    try {
      const users = await this.#prisma.user.findMany({
        where: { role, isActive: true },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_USERS_BY_ROLE', { role, count: users.length });
      return users;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getUsersByRole', role });
      throw error;
    }
  }

  async updateUser(id, data) {
    try {
      const user = await this.#prisma.user.update({
        where: { id },
        data,
      });
      await LoggerService.logSystemEvent('DatabaseService', 'UPDATE_USER', { userId: id });
      return user;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'updateUser', id });
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const user = await this.#prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'DELETE_USER', { userId: id });
      return user;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'deleteUser', id });
      throw error;
    }
  }

  // Order Queries with Transactions
  async createOrder(orderData, orderItemsData, cashTransactionData) {
    try {
      const order = await this.#prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: orderData,
          include: { orderItems: true, cashTransaction: true, driver: true },
        });
        if (orderItemsData?.length) {
          await tx.orderItem.createMany({
            data: orderItemsData.map((item) => ({
              ...item,
              orderId: createdOrder.id,
            })),
          });
        }
        if (cashTransactionData) {
          await tx.cashTransaction.create({
            data: {
              ...cashTransactionData,
              orderId: createdOrder.id,
            },
          });
        }
        return createdOrder;
      });
      await LoggerService.logSystemEvent('DatabaseService', 'CREATE_ORDER', { orderId: order.id });
      return order;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'createOrder', orderData });
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      const order = await this.#prisma.order.findUnique({
        where: { id },
        include: { orderItems: true, cashTransaction: true, driver: true, user: true },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_ORDER', { orderId: id });
      return order;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getOrderById', id });
      throw error;
    }
  }

  async updateOrderStatus(id, status, cashTransactionUpdate) {
    try {
      const order = await this.#prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id },
          data: { status },
          include: { orderItems: true },
        });
        if (cashTransactionUpdate && status === 'AWAITING_PAYMENT') {
          await tx.cashTransaction.update({
            where: { orderId: id },
            data: cashTransactionUpdate,
          });
        }
        return updatedOrder;
      });
      await LoggerService.logSystemEvent('DatabaseService', 'UPDATE_ORDER_STATUS', { orderId: id, status });
      return order;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'updateOrderStatus', id, status });
      throw error;
    }
  }

  async getOrdersByStatus(status) {
    try {
      const orders = await this.#prisma.order.findMany({
        where: { status },
        include: { orderItems: true, driver: true },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_ORDERS_BY_STATUS', { status, count: orders.length });
      return orders;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getOrdersByStatus', status });
      throw error;
    }
  }

  // Driver Queries
  async createDriver(data) {
    try {
      const driver = await this.#prisma.driver.create({ data });
      await LoggerService.logSystemEvent('DatabaseService', 'CREATE_DRIVER', { driverId: driver.id });
      return driver;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'createDriver', data });
      throw error;
    }
  }

  async getDriverById(id) {
    try {
      const driver = await this.#prisma.driver.findUnique({
        where: { id },
        include: { orders: true, cashTransactions: true },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_DRIVER', { driverId: id });
      return driver;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getDriverById', id });
      throw error;
    }
  }

  async updateDriverStatus(id, currentStatus) {
    try {
      const driver = await this.#prisma.driver.update({
        where: { id },
        data: { currentStatus },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'UPDATE_DRIVER_STATUS', { driverId: id, currentStatus });
      return driver;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'updateDriverStatus', id, currentStatus });
      throw error;
    }
  }

  async getDriversByZone(deliveryZone) {
    try {
      const drivers = await this.#prisma.driver.findMany({
        where: { deliveryZone, active: true },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_DRIVERS_BY_ZONE', { deliveryZone, count: drivers.length });
      return drivers;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getDriversByZone', deliveryZone });
      throw error;
    }
  }

  // MenuItem and Category Queries
  async createCategory(data) {
    try {
      const category = await this.#prisma.category.create({ data });
      await LoggerService.logSystemEvent('DatabaseService', 'CREATE_CATEGORY', { categoryId: category.id });
      return category;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'createCategory', data });
      throw error;
    }
  }

  async createMenuItem(data) {
    try {
      const menuItem = await this.#prisma.menuItem.create({
        data,
        include: { category: true },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'CREATE_MENU_ITEM', { menuItemId: menuItem.id });
      return menuItem;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'createMenuItem', data });
      throw error;
    }
  }

  async getAvailableMenuItems() {
    try {
      const menuItems = await this.#prisma.menuItem.findMany({
        where: { isAvailable: true },
        include: { category: true },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_AVAILABLE_MENU_ITEMS', { count: menuItems.length });
      return menuItems;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getAvailableMenuItems' });
      throw error;
    }
  }

  // CashTransaction and CashSummary Queries with Transactions
  async createCashTransaction(orderId, data) {
    try {
      const transaction = await this.#prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { id: orderId } });
        if (!order) throw new Error('Order not found');
        if (data.amount !== order.total) {
          data.discrepancyAmount = data.amount - order.total;
          data.discrepancyNotes = `Paid ${data.amount}, owed ${order.total}`;
        }
        return tx.cashTransaction.create({
          data: { ...data, orderId },
          include: { order: true, driver: true },
        });
      });
      await LoggerService.logSystemEvent('DatabaseService', 'CREATE_CASH_TRANSACTION', { transactionId: transaction.id });
      return transaction;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'createCashTransaction', orderId, data });
      throw error;
    }
  }

  async getCashSummaryByDriver(driverId, date) {
    try {
      const summary = await this.#prisma.cashSummary.findFirst({
        where: { driverId, date },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_CASH_SUMMARY', { driverId, date });
      return summary;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getCashSummaryByDriver', driverId, date });
      throw error;
    }
  }

  // Log Queries
  async getActivityLogs(type, startDate, endDate) {
    try {
      const logs = await this.#prisma.activityLog.findMany({
        where: { type, createdAt: { gte: startDate, lte: endDate } },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_ACTIVITY_LOGS', { type, count: logs.length });
      return logs;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getActivityLogs', type, startDate, endDate });
      throw error;
    }
  }

  async getSystemLogs(source, startDate, endDate) {
    try {
      const logs = await this.#prisma.systemLog.findMany({
        where: { source, createdAt: { gte: startDate, lte: endDate } },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_SYSTEM_LOGS', { source, count: logs.length });
      return logs;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getSystemLogs', source, startDate, endDate });
      throw error;
    }
  }

  async getNotificationLogs(status, startDate, endDate) {
    try {
      const logs = await this.#prisma.notificationLog.findMany({
        where: { status, createdAt: { gte: startDate, lte: endDate } },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_NOTIFICATION_LOGS', { status, count: logs.length });
      return logs;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getNotificationLogs', status, startDate, endDate });
      throw error;
    }
  }

  async disconnect() {
    await this.#prisma.$disconnect();
    await LoggerService.logSystemEvent('DatabaseService', 'DISCONNECT_PRISMA', {});
  }
}

export default new DatabaseService();