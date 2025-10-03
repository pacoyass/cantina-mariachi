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

  async refreshUserTokens(userId, hashedToken, expiresAt, tx, meta = {}) {
    const db = withTx(tx);
    const token = await db.refreshToken.create({
      data: { userId, token: hashedToken, expiresAt, userAgent: meta.userAgent || null, ip: meta.ip || null },
    });
    await LoggerService.logSystemEvent('DatabaseService', 'REFRESH_USER_TOKENS', { userId, hasMeta: !!(meta.userAgent || meta.ip) });
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

  // Logout current access token by blacklisting it
  async logout(accessToken, tx) {
    const db = withTx(tx);
    let expiresAt;
    const { verifyToken, hashToken } = await import('./authService.js');
    try {
      const payload = await verifyToken(accessToken);
      expiresAt = new Date(payload.exp);
    } catch (error) {
      // If verification fails, fallback to a short-lived blacklist window
      expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    }
    const tokenHash = await hashToken(accessToken);
    await db.blacklistedToken.deleteMany({ where: { tokenHash, expiresAt: { lt: new Date() } } });
    return await db.blacklistedToken.create({ data: { tokenHash, expiresAt } });
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
  async findLatestRefreshForUser(userId, tx) {
    const db = withTx(tx);
    const token = await db.refreshToken.findFirst({
      where: { userId },
      orderBy: { expiresAt: 'desc' },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        userAgent: true,
        ip: true,
      },
    });
    if (!token) return null;
    return token;
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

  async getOrderByNumber(orderNumber, tx) {
    const db = withTx(tx);
    return await db.order.findUnique({ where: { orderNumber }, include: { orderItems: true } });
  },

  async createOrderWithItems(payload, tx) {
    const db = withTx(tx);
    const { type, items, customerName, customerEmail, customerPhone, notes, deliveryAddress, deliveryInstructions, userId } = payload;

    // compute subtotal/tax/total (taxRate from AppConfig if present)
    const menuItems = await db.menuItem.findMany({ where: { id: { in: items.map(i => i.menuItemId) } } });
    const priceMap = Object.fromEntries(menuItems.map(m => [m.id, m.price]));
    const missing = items.find(i => !priceMap[i.menuItemId]);
    if (missing) throw new Error('Invalid menu item');

    const subtotal = items.reduce((acc, i) => acc + Number(priceMap[i.menuItemId]) * i.quantity, 0);
    const cfg = await db.appConfig.findFirst();
    const taxRate = cfg?.taxRate ? Number(cfg.taxRate) : 0;
    const tax = Number((subtotal * taxRate).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random()*1000)}`;

    return await db.$transaction(async (trx) => {
      const order = await trx.order.create({
        data: {
          orderNumber,
          type,
          status: 'PENDING',
          customerName,
          customerEmail,
          customerPhone,
          notes: notes || null,
          deliveryAddress: deliveryAddress || null,
          deliveryInstructions: deliveryInstructions || null,
          userId: userId || null,
          subtotal,
          tax,
          total,
        },
      });
      await trx.orderItem.createMany({ data: items.map(i => ({ orderId: order.id, menuItemId: i.menuItemId, quantity: i.quantity, price: priceMap[i.menuItemId] })) });
      return await trx.order.findUnique({ where: { id: order.id }, include: { orderItems: true } });
    });
  },

  async updateOrderStatusByNumber(orderNumber, status, extra = {}, tx) {
    const db = withTx(tx);
    return await db.$transaction(async (trx) => {
      const existing = await trx.order.findUnique({ where: { orderNumber } });
      if (!existing) throw new Error('Order not found');
      const transitions = {
        PENDING: ['CONFIRMED','CANCELLED'],
        CONFIRMED: ['PREPARING','CANCELLED'],
        PREPARING: ['READY','CANCELLED'],
        READY: ['OUT_FOR_DELIVERY','CANCELLED'],
        OUT_FOR_DELIVERY: ['DELIVERED','CANCELLED'],
        DELIVERED: ['COMPLETED'],
        AWAITING_PAYMENT: ['PAYMENT_DISPUTED','COMPLETED'],
        PAYMENT_DISPUTED: ['COMPLETED'],
        COMPLETED: [],
        CANCELLED: [],
      };
      const allowedNext = transitions[existing.status] || [];
      if (!allowedNext.includes(status)) throw new Error(`Invalid transition from ${existing.status} to ${status}`);
      const updated = await trx.order.update({ where: { orderNumber }, data: { status, ...extra } });
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

  async createCashTransactionForOrder(orderNumber, driverId, amount, notes = {}, tx) {
    const db = withTx(tx);
    return await db.$transaction(async (trx) => {
      const order = await trx.order.findUnique({ where: { orderNumber } });
      if (!order) throw new Error('Order not found');
      const driver = await trx.driver.findUnique({ where: { id: driverId } });
      if (!driver || !driver.active) throw new Error('Driver not available');
      const created = await trx.cashTransaction.create({ data: { orderId: order.id, driverId, amount, confirmed: false, adminVerified: false, customerNotes: notes.customerNotes || null } });
      return created;
    });
  },

  async confirmCashTransaction(orderNumber, paymentTimestamp, tx) {
    const db = withTx(tx);
    return await db.$transaction(async (trx) => {
      const order = await trx.order.findUnique({ where: { orderNumber } });
      if (!order) throw new Error('Order not found');
      const updated = await trx.cashTransaction.update({ where: { orderId: order.id }, data: { confirmed: true, paymentTimestamp: paymentTimestamp || new Date() } });
      return updated;
    });
  },

  async verifyCashTransaction(orderNumber, adminVerified, discrepancy = {}, tx) {
    const db = withTx(tx);
    return await db.$transaction(async (trx) => {
      const order = await trx.order.findUnique({ where: { orderNumber } });
      if (!order) throw new Error('Order not found');
      const updated = await trx.cashTransaction.update({ where: { orderId: order.id }, data: { adminVerified, discrepancyAmount: discrepancy.amount || null, discrepancyNotes: discrepancy.notes || null } });
      return updated;
    });
  },

  async getCashSummaryByDriverAndDate(driverId, date, tx) {
    const db = withTx(tx);
    const start = new Date(date); start.setHours(0,0,0,0);
    const end = new Date(date); end.setHours(23,59,59,999);
    const transactions = await db.cashTransaction.findMany({ where: { driverId, createdAt: { gte: start, lte: end } } });
    const totalAmount = transactions.reduce((acc, t) => acc + Number(t.amount), 0);
    const unconfirmedCount = transactions.filter(t => !t.confirmed).length;
    const discrepancyTotal = transactions.reduce((acc, t) => acc + Number(t.discrepancyAmount || 0), 0);
    return { date: start, totalAmount, unconfirmedCount, discrepancyTotal };
  },

  // Drivers and activity
  async getDriverById(id, tx) {
    const db = withTx(tx);
    return await db.driver.findUnique({ where: { id } });
  },

  async getUsersByRole(role, tx) {
    const db = withTx(tx);
    return await db.user.findMany({ where: { role, isActive: true } });
  },

  async updateUser(id, data, tx) {
    const db = withTx(tx);
    return await db.user.update({ where: { id }, data });
  },

  async getOrdersByStatus(status, optionsOrTx, maybeTx) {
    const options = optionsOrTx && !optionsOrTx.$transaction ? optionsOrTx : {};
    const tx = maybeTx || (optionsOrTx && optionsOrTx.$transaction ? optionsOrTx : undefined);
    const db = withTx(tx);
    const hasOptions = options.page || options.pageSize;
  
    if (!hasOptions) {
      return await db.order.findMany({
        where: { status },
        include: { orderItems: true, driver: true },
      });
    }
  
    const page = Math.max(parseInt(options.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(options.pageSize || '50', 10), 1), 200);
    const skip = (page - 1) * pageSize;
  
    return await db.order.findMany({
      where: { status },
      include: { orderItems: true, driver: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });
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

  async getNotificationLogs(status, startDate, endDate, optionsOrTx, maybeTx) {
    const options = optionsOrTx && !optionsOrTx.$transaction ? optionsOrTx : {};
    const tx = maybeTx || (optionsOrTx && optionsOrTx.$transaction ? optionsOrTx : undefined);
    const db = withTx(tx);
    const hasOptions = options.page || options.pageSize;
  
    if (!hasOptions) {
      return await db.notificationLog.findMany({
        where: { status, createdAt: { gte: startDate, lte: endDate } },
      });
    }
  
    const page = Math.max(parseInt(options.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(options.pageSize || '50', 10), 1), 200);
    const skip = (page - 1) * pageSize;
  
    return await db.notificationLog.findMany({
      where: { status, createdAt: { gte: startDate, lte: endDate } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    });
  },

  // List refresh tokens for a user (id + expiresAt only)
  async listRefreshTokensByUser(userId, optionsOrTx, maybeTx) {
    const options = optionsOrTx && !optionsOrTx.$transaction ? optionsOrTx : {};
    const tx = maybeTx || (optionsOrTx && optionsOrTx.$transaction ? optionsOrTx : undefined);
    const db = withTx(tx);
    const page = Math.max(parseInt(options.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(options.pageSize || '20', 10), 1), 100);
    const skip = (page - 1) * pageSize;
    return await db.refreshToken.findMany({
      where: { userId },
      select: { id: true, expiresAt: true, userAgent: true, ip: true },
      orderBy: { expiresAt: 'desc' },
      skip,
      take: pageSize,
    });
  },

  // Delete all refresh tokens for user (logout all sessions)
  async deleteAllRefreshTokensForUser(userId, tx) {
    const db = withTx(tx);
    const result = await db.refreshToken.deleteMany({ where: { userId } });
    await LoggerService.logSystemEvent('DatabaseService', 'DELETE_ALL_REFRESH_TOKENS', { userId, count: result.count });
    return result.count;
  },

  // Delete other refresh tokens for user, keep the current one by hash
  async deleteOtherRefreshTokensForUser(userId, keepTokenHash, tx) {
    const db = withTx(tx);
    const result = await db.refreshToken.deleteMany({
      where: { userId, NOT: { token: keepTokenHash } },
    });
    await LoggerService.logSystemEvent('DatabaseService', 'DELETE_OTHER_REFRESH_TOKENS', {
      userId,
      keptHash: keepTokenHash,
      count: result.count,
    });
    return result.count;
  },
  // Drivers and activity
async getActivityLogs(type, startDate, endDate, optionsOrTx, maybeTx) {
  const options = optionsOrTx && !optionsOrTx.$transaction ? optionsOrTx : {};
  const tx = maybeTx || (optionsOrTx && optionsOrTx.$transaction ? optionsOrTx : undefined);
  const db = withTx(tx);
  const hasOptions = options.page || options.pageSize;

  if (!hasOptions) {
    return await db.activityLog.findMany({
      where: { type, createdAt: { gte: startDate, lte: endDate } },
    });
  }

  const page = Math.max(parseInt(options.page || '1', 10), 1);
  const pageSize = Math.min(Math.max(parseInt(options.pageSize || '50', 10), 1), 200);
  const skip = (page - 1) * pageSize;

  return await db.activityLog.findMany({
    where: { type, createdAt: { gte: startDate, lte: endDate } },
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize,
  });
},

  async listDrivers(filters = {}, tx) {
    const db = withTx(tx);
    return await db.driver.findMany({ where: { ...(filters.active !== undefined ? { active: filters.active } : {}), ...(filters.deliveryZone ? { deliveryZone: filters.deliveryZone } : {}) } });
  },

  async getDriver(id, tx) {
    const db = withTx(tx);
    return await db.driver.findUnique({ where: { id } });
  },

  async updateDriver(id, data, tx) {
    const db = withTx(tx);
    return await db.driver.update({ where: { id }, data });
  },

  async deleteDriver(id, tx) {
    const db = withTx(tx);
    return await db.driver.delete({ where: { id } });
  },

  async linkDriverToUser(id, userId, tx) {
    const db = withTx(tx);
    return await db.driver.update({ where: { id }, data: { userId } });
  },

  async assignOrderToDriver(orderNumber, driverId, tx) {
    const db = withTx(tx);
    return await db.$transaction(async (trx) => {
      const driver = await trx.driver.findUnique({ where: { id: driverId } });
      if (!driver || !driver.active) throw new Error('Driver not available');
      const order = await trx.order.findUnique({ where: { orderNumber } });
      if (!order) throw new Error('Order not found');
      const updated = await trx.order.update({ where: { orderNumber }, data: { driverId, status: 'OUT_FOR_DELIVERY' } });
      return updated;
    });
  },

  async listOrdersAssignedToDriver(driverId, tx) {
    const db = withTx(tx);
    return await db.order.findMany({ where: { driverId }, include: { orderItems: true }, orderBy: { createdAt: 'desc' } });
  },

  async listCategories(tx) {
    const db = withTx(tx);
    return await db.category.findMany({ orderBy: { order: 'asc' } });
  },

  async getCategoryById(id, tx) {
    const db = withTx(tx);
    return await db.category.findUnique({ where: { id } });
  },

  async updateCategory(id, data, tx) {
    const db = withTx(tx);
    return await db.category.update({ where: { id }, data });
  },

  async deleteCategory(id, tx) {
    const db = withTx(tx);
    return await db.category.delete({ where: { id } });
  },

  async listMenuItems(filters = {}, tx) {
    const db = withTx(tx);
    const where = {
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.available !== undefined ? { isAvailable: filters.available } : {}),
    };
    return await db.menuItem.findMany({ where, include: { category: true }, orderBy: { name: 'asc' } });
  },

  async getMenuItemById(id, tx) {
    const db = withTx(tx);
    return await db.menuItem.findUnique({ where: { id }, include: { category: true } });
  },

  async updateMenuItem(id, data, tx) {
    const db = withTx(tx);
    return await db.menuItem.update({ where: { id }, data, include: { category: true } });
  },

  async deleteMenuItem(id, tx) {
    const db = withTx(tx);
    return await db.menuItem.delete({ where: { id } });
  },

  async setOrderTracking(orderId, code, expiresAt, tx) {
    const db = withTx(tx);
    return await db.order.update({ where: { id: orderId }, data: { trackingCode: code, trackingCodeExpiresAt: expiresAt } });
  },

  async getOrderForTracking(orderNumber, code, tx) {
    const db = withTx(tx);
    return await db.order.findFirst({ where: { orderNumber, trackingCode: code, trackingCodeExpiresAt: { gt: new Date() } }, include: { orderItems: true } });
  },

  async listOrdersByUser(userId, tx) {
    const db = withTx(tx);
    return await db.order.findMany({ where: { userId }, include: { orderItems: true }, orderBy: { createdAt: 'desc' } });
  },

  async createReservation(data, tx) {
    const db = withTx(tx);
    return await db.reservation.create({ data });
  },

  async listReservations(filters = {}, tx) {
    const db = withTx(tx);
    return await db.reservation.findMany({ where: { ...(filters.status ? { status: filters.status } : {}), ...(filters.date ? { date: filters.date } : {}) }, orderBy: { createdAt: 'desc' } });
  },

  async isReservationSlotAvailable(date, time, partySize, tx) {
    const db = withTx(tx);
    // naive capacity: max 50 seats per slot
    const existing = await db.reservation.findMany({ where: { date, time, status: { in: ['PENDING','CONFIRMED','SEATED'] } } });
    const used = existing.reduce((acc, r) => acc + r.partySize, 0);
    return used + partySize <= 50;
  },

  async updateReservationStatus(id, status, tx) {
    const db = withTx(tx);
    return await db.reservation.update({ where: { id }, data: { status } });
  },

};