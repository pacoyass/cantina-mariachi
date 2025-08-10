import prisma from '../config/database.js';
import { LoggerService } from '../utils/logger.js';

const withTx = (tx) => tx || prisma;

export const databaseService = {
  async connect() {
    try {
      await prisma.$connect();
      console.debug('Database connected successfully');
    } catch (error) {
      console.error('Failed to connect to database:', error.message);
      throw new Error('Database connection failed');
    }
  },

  async disconnect() {
    await prisma.$disconnect();
    console.debug('Database disconnected');
  },

  async getUserByEmail(email, conditions = {}, select = {}, tx) {
    const db = withTx(tx);
    const user = await db.user.findFirst({
      where: { email, deletedAt: null, ...conditions },
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
  },

  async getUserById(id, select = {}, tx) {
    const db = withTx(tx);
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        ...select,
      },
    });
    if (!user) throw new Error('User not found');
    return user;
  },

  async createUser(data, tx) {
    const db = withTx(tx);
    const existing = await db.user.findFirst({ where: { email: data.email, deletedAt: null } });
    if (existing) throw new Error('User with this email already exists');
    const user = await db.user.create({ data });
    await LoggerService.logSystemEvent('DatabaseService', 'CREATE_USER', { userId: user.id });
    return user;
  },

  async refreshUserTokens(userId, hashedToken, expiresAt, tx) {
    const db = withTx(tx);
    await db.refreshToken.deleteMany({ where: { userId } });
    const token = await db.refreshToken.create({
      data: { userId, token: hashedToken, expiresAt },
    });
    await LoggerService.logSystemEvent('DatabaseService', 'REFRESH_USER_TOKENS', { userId });
    return token;
  },

  async getRefreshToken(tokenHash, tx) {
    const db = withTx(tx);
    return await db.refreshToken.findUnique({ where: { token: tokenHash } });
  },

  async cleanupExpiredTokens(tx) {
    const db = withTx(tx);
    const deleted = await db.refreshToken.deleteMany({ where: { expiresAt: { lte: new Date() } } });
    await LoggerService.logSystemEvent('DatabaseService', 'CLEANUP_EXPIRED_TOKENS', { count: deleted.count });
    return deleted.count;
  },

  // Blacklisted token helpers
  async findBlacklistedToken(tokenHash, additionalWhere = {}, tx) {
    const db = withTx(tx);
    return await db.blacklistedToken.findFirst({ where: { tokenHash, ...additionalWhere } });
  },

  async createBlacklistedToken({ tokenHash, expiresAt }, tx) {
    const db = withTx(tx);
    return await db.blacklistedToken.create({ data: { tokenHash, expiresAt } });
  },

  async deleteExpiredBlacklistedToken(tokenHash, tx) {
    const db = withTx(tx);
    return await db.blacklistedToken.deleteMany({ where: { tokenHash, expiresAt: { lt: new Date() } } });
  },

  // Webhooks helpers
  async getActiveWebhooks(tx) {
    const db = withTx(tx);
    const webhooks = await db.webhook.findMany({
      where: { status: 'ACTIVE', deletedAt: null },
      include: { integration: true },
    });

    await LoggerService.logSystemEvent('DatabaseService', 'GET_ACTIVE_WEBHOOKS', {
      count: webhooks.length,
    });

    return webhooks;
  },

  async deleteExpiredWebhooks(daysOld = 30, tx) {
    const db = withTx(tx);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);
    const deleted = await db.webhook.deleteMany({
      where: { deletedAt: { lte: cutoff } },
    });
    await LoggerService.logSystemEvent('DatabaseService', 'DELETE_EXPIRED_WEBHOOKS', { count: deleted.count });
    return deleted.count;
  },

  async logWebhookDelivery({ webhookId, event, payload, status, error = null, attempts }, tx) {
    const db = withTx(tx);

    const record = await db.webhookLog.create({
      data: {
        webhookId,
        event,
        payload,
        status,
        error,
        attempts,
      },
    });

    await LoggerService.logSystemEvent('DatabaseService', 'LOG_WEBHOOK_DELIVERY', {
      webhookId,
      event,
      status,
      attempts,
    });

    return record;
  },

  // Orders and related helpers
  async createOrder(orderData, orderItems, cashTxData, tx) {
    const db = withTx(tx);
    return await db.$transaction(async (trx) => {
      const order = await trx.order.create({ data: orderData });
      if (orderItems?.length) {
        await trx.orderItem.createMany({ data: orderItems });
      }
      if (cashTxData) {
        await trx.cashTransaction.create({ data: cashTxData });
      }
      return order;
    });
  },

  async getOrderById(id, tx) {
    const db = withTx(tx);
    return await db.order.findUnique({ where: { id } });
  },

  async updateOrderStatus(id, status, extra = {}, tx) {
    const db = withTx(tx);
    return await db.$transaction(async (trx) => {
      const updated = await trx.order.update({ where: { id }, data: { status, ...extra } });
      return updated;
    });
  },

  async getAvailableMenuItems(tx) {
    const db = withTx(tx);
    return await db.menuItem.findMany();
  },

  async createCashTransaction(orderId, data, tx) {
    const db = withTx(tx);
    return await db.$transaction(async (trx) => {
      const order = await trx.order.findUnique({ where: { id: orderId } });
      if (!order) throw new Error('Order not found');
      const created = await trx.cashTransaction.create({ data: { orderId, ...data } });
      return created;
    });
  },

  // Drivers and activity
  async getDriverById(id, tx) {
    const db = withTx(tx);
    return await db.driver.findUnique({ where: { id } });
  },

  async getActivityLogs(type, startDate, endDate, tx) {
    const db = withTx(tx);
    return await db.activityLog.findMany({ where: { type, createdAt: { gte: startDate, lte: endDate } } });
  },

  async getUsersByRole(role, tx) {
    const db = withTx(tx);
    return await db.user.findMany({ where: { role, isActive: true } });
  },

  async updateUser(id, data, tx) {
    const db = withTx(tx);
    return await db.user.update({ where: { id }, data });
  },

  async getOrdersByStatus(status, tx) {
    const db = withTx(tx);
    return await db.order.findMany({ where: { status }, include: { orderItems: true, driver: true } });
  },

  async createDriver(data, tx) {
    const db = withTx(tx);
    return await db.driver.create({ data });
  },

  async updateDriverStatus(id, status, tx) {
    const db = withTx(tx);
    return await db.driver.update({ where: { id }, data: { currentStatus: status } });
  },

  async getDriversByZone(zone, tx) {
    const db = withTx(tx);
    return await db.driver.findMany({ where: { deliveryZone: zone, active: true } });
  },

  async createCategory(data, tx) {
    const db = withTx(tx);
    return await db.category.create({ data });
  },

  async createMenuItem(data, tx) {
    const db = withTx(tx);
    return await db.menuItem.create({ data, include: { category: true } });
  },

  async getCashSummaryByDriver(driverId, date, tx) {
    const db = withTx(tx);
    return await db.cashSummary.findFirst({ where: { driverId, date } });
  },

  async getNotificationLogs(status, startDate, endDate, tx) {
    const db = withTx(tx);
    return await db.notificationLog.findMany({
      where: { status, createdAt: { gte: startDate, lte: endDate } },
    });
  },
};