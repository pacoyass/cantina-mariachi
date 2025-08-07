import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';

export const databaseService = {
  async connect() {
    try {
      if (!prisma) {
        console.debug('Prisma client initialized');
      }
      await prisma.$connect();
      console.debug('Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error.message);
      throw new Error('Database connection failed');
    }
  },

  async disconnect() {
    if (prisma) {
      await prisma.$disconnect();
      console.debug('Database disconnected');
    }
  },

  async getUserByEmail(email, conditions = {}, select = {}) {
    console.log("getemail", email);
    try {
      console.debug('Fetching user by email:', { email, conditions, select });
      if (!prisma) throw new Error('Prisma client not initialized');

      const user = await prisma.user.findFirst({
        where: {
          email,
          deletedAt: null,
          ...conditions,
        },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          name: true,
          phone: true,
          isActive: true,
          ...select,
        },
      });

      if (!user) throw new Error('User not found');
      return user;
    } catch (error) {
      const errorMessage = error.message || 'Unknown database error';
      try {
        await LoggerService.logError('Failed to fetch user by email', error.stack || 'No stack trace', { email, error: errorMessage });
      } catch (logError) {
        console.error('Failed to log database error:', logError.message);
      }
      throw error;
    }
  },

  async cleanupExpiredTokens() {
    try {
      if (!prisma) throw new Error('Prisma client not initialized');

      await prisma.refreshToken.deleteMany({
        where: { expiresAt: { lte: new Date() } },
      });

      console.debug('Expired tokens cleaned up');
    } catch (error) {
      const errorMessage = error.message || 'Unknown database error';
      try {
        await LoggerService.logError('Failed to clean up expired tokens', error.stack || 'No stack trace', { error: errorMessage });
      } catch (logError) {
        console.error('Failed to log cleanup error:', logError.message);
      }
      throw error;
    }
  },

  async clearOldRefreshTokens(userId) {
    try {
      const deleted = await prisma.refreshToken.deleteMany({ where: { userId } });
      await LoggerService.logSystemEvent('DatabaseService', 'CLEAR_OLD_REFRESH_TOKENS', { userId, count: deleted.count });
      return deleted;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'clearOldRefreshTokens', userId });
      throw error;
    }
  },

  async storeRefreshToken(userId, hashedToken, expiresAt) {
    try {
      const token = await prisma.refreshToken.create({
        data: {
          token: hashedToken,
          userId,
          expiresAt,
        },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'STORE_REFRESH_TOKEN', { userId });
      return token;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'storeRefreshToken', userId });
      throw error;
    }
  },

  async getRefreshToken(tokenHash) {
    try {
      const token = await prisma.refreshToken.findUnique({
        where: { token: tokenHash },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'FETCH_REFRESH_TOKEN', { tokenHash });
      return token;
    } catch (error) {
      await LoggerService.logError(error.message, error.stack, { method: 'getRefreshToken', tokenHash });
      throw error;
    }
  },
};


// import  prisma  from '../config/database.js';
// import { LoggerService } from '../utils/logger.js';

// class DatabaseService {
//   #prisma;

//   constructor() {
//     this.#prisma = prisma;
//   }

//   // Auth Queries
//   async getUserByEmail(email, conditions = {}, select = {}) {
//     try {
//       const user = await this.#prisma.user.findFirst({
//         where: {
//           email,
//           deletedAt: null,
//           ...conditions,
//         },
//         select: {
//           id: true,
//           email: true,
//           name: true,
//           password: true,
//           role: true,
//           phone: true,
//           isActive: true,
//           ...select,
//         },
//       });
  
//       if (!user) throw new Error('User not found');
  
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_USER_BY_EMAIL', { email });
//       return user;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getUserByEmail', email, conditions });
//       throw error;
//     }
//   }
//   async clearOldRefreshTokens(userId) {
//     try {
//       const deleted = await this.#prisma.refreshToken.deleteMany({
//         where: { userId },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'CLEAR_OLD_REFRESH_TOKENS', { userId, count: deleted.count });
//       return deleted;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'clearOldRefreshTokens', userId });
//       throw error;
//     }
//   }
//   async storeRefreshToken(userId, hashedToken, expiresAt) {
//     try {
//       const token = await this.#prisma.refreshToken.create({
//         data: { userId, token: hashedToken, expiresAt },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'STORE_REFRESH_TOKEN', { userId });
//       return token;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'storeRefreshToken', userId });
//       throw error;
//     }
//   }
//   async getRefreshToken(tokenHash) {
//     try {
//       const token = await this.#prisma.refreshToken.findUnique({
//         where: { token: tokenHash },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_REFRESH_TOKEN', { tokenHash });
//       return token;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getRefreshToken', tokenHash });
//       throw error;
//     }
//   }
  

//   // User Queries
//   async createUser(data) {
//     try {
//       const user = await this.#prisma.user.create({ data });
//       await LoggerService.logSystemEvent('DatabaseService', 'CREATE_USER', { userId: user.id });
//       return user;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'createUser', data });
//       throw error;
//     }
//   }

//   async getUserById(id) {
//     try {
//       const user = await this.#prisma.user.findUnique({
//         where: { id },
//         include: { preferences: true, orders: true, driver: true },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_USER', { userId: id });
//       return user;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getUserById', id });
//       throw error;
//     }
//   }

//   async getUsersByRole(role) {
//     try {
//       const users = await this.#prisma.user.findMany({
//         where: { role, isActive: true },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_USERS_BY_ROLE', { role, count: users.length });
//       return users;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getUsersByRole', role });
//       throw error;
//     }
//   }

//   async updateUser(id, data) {
//     try {
//       const user = await this.#prisma.user.update({
//         where: { id },
//         data,
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'UPDATE_USER', { userId: id });
//       return user;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'updateUser', id });
//       throw error;
//     }
//   }

//   async deleteUser(id) {
//     try {
//       const user = await this.#prisma.user.update({
//         where: { id },
//         data: { deletedAt: new Date() },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'DELETE_USER', { userId: id });
//       return user;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'deleteUser', id });
//       throw error;
//     }
//   }

//   // Order Queries with Transactions
//   async createOrder(orderData, orderItemsData, cashTransactionData) {
//     try {
//       const order = await this.#prisma.$transaction(async (tx) => {
//         const createdOrder = await tx.order.create({
//           data: orderData,
//           include: { orderItems: true, cashTransaction: true, driver: true },
//         });
//         if (orderItemsData?.length) {
//           await tx.orderItem.createMany({
//             data: orderItemsData.map((item) => ({
//               ...item,
//               orderId: createdOrder.id,
//             })),
//           });
//         }
//         if (cashTransactionData) {
//           await tx.cashTransaction.create({
//             data: {
//               ...cashTransactionData,
//               orderId: createdOrder.id,
//             },
//           });
//         }
//         return createdOrder;
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'CREATE_ORDER', { orderId: order.id });
//       return order;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'createOrder', orderData });
//       throw error;
//     }
//   }

//   async getOrderById(id) {
//     try {
//       const order = await this.#prisma.order.findUnique({
//         where: { id },
//         include: { orderItems: true, cashTransaction: true, driver: true, user: true },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_ORDER', { orderId: id });
//       return order;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getOrderById', id });
//       throw error;
//     }
//   }

//   async updateOrderStatus(id, status, cashTransactionUpdate) {
//     try {
//       const order = await this.#prisma.$transaction(async (tx) => {
//         const updatedOrder = await tx.order.update({
//           where: { id },
//           data: { status },
//           include: { orderItems: true },
//         });
//         if (cashTransactionUpdate && status === 'AWAITING_PAYMENT') {
//           await tx.cashTransaction.update({
//             where: { orderId: id },
//             data: cashTransactionUpdate,
//           });
//         }
//         return updatedOrder;
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'UPDATE_ORDER_STATUS', { orderId: id, status });
//       return order;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'updateOrderStatus', id, status });
//       throw error;
//     }
//   }

//   async getOrdersByStatus(status) {
//     try {
//       const orders = await this.#prisma.order.findMany({
//         where: { status },
//         include: { orderItems: true, driver: true },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_ORDERS_BY_STATUS', { status, count: orders.length });
//       return orders;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getOrdersByStatus', status });
//       throw error;
//     }
//   }

//   // Driver Queries
//   async createDriver(data) {
//     try {
//       const driver = await this.#prisma.driver.create({ data });
//       await LoggerService.logSystemEvent('DatabaseService', 'CREATE_DRIVER', { driverId: driver.id });
//       return driver;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'createDriver', data });
//       throw error;
//     }
//   }

//   async getDriverById(id) {
//     try {
//       const driver = await this.#prisma.driver.findUnique({
//         where: { id },
//         include: { orders: true, cashTransactions: true },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_DRIVER', { driverId: id });
//       return driver;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getDriverById', id });
//       throw error;
//     }
//   }

//   async updateDriverStatus(id, currentStatus) {
//     try {
//       const driver = await this.#prisma.driver.update({
//         where: { id },
//         data: { currentStatus },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'UPDATE_DRIVER_STATUS', { driverId: id, currentStatus });
//       return driver;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'updateDriverStatus', id, currentStatus });
//       throw error;
//     }
//   }

//   async getDriversByZone(deliveryZone) {
//     try {
//       const drivers = await this.#prisma.driver.findMany({
//         where: { deliveryZone, active: true },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_DRIVERS_BY_ZONE', { deliveryZone, count: drivers.length });
//       return drivers;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getDriversByZone', deliveryZone });
//       throw error;
//     }
//   }

//   // MenuItem and Category Queries
//   async createCategory(data) {
//     try {
//       const category = await this.#prisma.category.create({ data });
//       await LoggerService.logSystemEvent('DatabaseService', 'CREATE_CATEGORY', { categoryId: category.id });
//       return category;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'createCategory', data });
//       throw error;
//     }
//   }

//   async createMenuItem(data) {
//     try {
//       const menuItem = await this.#prisma.menuItem.create({
//         data,
//         include: { category: true },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'CREATE_MENU_ITEM', { menuItemId: menuItem.id });
//       return menuItem;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'createMenuItem', data });
//       throw error;
//     }
//   }

//   async getAvailableMenuItems() {
//     try {
//       const menuItems = await this.#prisma.menuItem.findMany({
//         where: { isAvailable: true },
//         include: { category: true },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_AVAILABLE_MENU_ITEMS', { count: menuItems.length });
//       return menuItems;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getAvailableMenuItems' });
//       throw error;
//     }
//   }

//   // CashTransaction and CashSummary Queries with Transactions
//   async createCashTransaction(orderId, data) {
//     try {
//       const transaction = await this.#prisma.$transaction(async (tx) => {
//         const order = await tx.order.findUnique({ where: { id: orderId } });
//         if (!order) throw new Error('Order not found');
//         if (data.amount !== order.total) {
//           data.discrepancyAmount = data.amount - order.total;
//           data.discrepancyNotes = `Paid ${data.amount}, owed ${order.total}`;
//         }
//         return tx.cashTransaction.create({
//           data: { ...data, orderId },
//           include: { order: true, driver: true },
//         });
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'CREATE_CASH_TRANSACTION', { transactionId: transaction.id });
//       return transaction;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'createCashTransaction', orderId, data });
//       throw error;
//     }
//   }

//   async getCashSummaryByDriver(driverId, date) {
//     try {
//       const summary = await this.#prisma.cashSummary.findFirst({
//         where: { driverId, date },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_CASH_SUMMARY', { driverId, date });
//       return summary;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getCashSummaryByDriver', driverId, date });
//       throw error;
//     }
//   }

//   // Log Queries
//   async getActivityLogs(type, startDate, endDate) {
//     try {
//       const logs = await this.#prisma.activityLog.findMany({
//         where: { type, createdAt: { gte: startDate, lte: endDate } },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_ACTIVITY_LOGS', { type, count: logs.length });
//       return logs;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getActivityLogs', type, startDate, endDate });
//       throw error;
//     }
//   }

//   async getSystemLogs(source, startDate, endDate) {
//     try {
//       const logs = await this.#prisma.systemLog.findMany({
//         where: { source, createdAt: { gte: startDate, lte: endDate } },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_SYSTEM_LOGS', { source, count: logs.length });
//       return logs;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getSystemLogs', source, startDate, endDate });
//       throw error;
//     }
//   }

//   async getNotificationLogs(status, startDate, endDate) {
//     try {
//       const logs = await this.#prisma.notificationLog.findMany({
//         where: { status, createdAt: { gte: startDate, lte: endDate } },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'FETCH_NOTIFICATION_LOGS', { status, count: logs.length });
//       return logs;
//     } catch (error) {
//       await LoggerService.logError(error.message, error.stack, { method: 'getNotificationLogs', status, startDate, endDate });
//       throw error;
//     }
//   }

//   async disconnect() {
//     await this.#prisma.$disconnect();
//     await LoggerService.logSystemEvent('DatabaseService', 'DISCONNECT_PRISMA', {});
//   }
// }

// export default new DatabaseService();