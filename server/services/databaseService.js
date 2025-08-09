// databaseService.js
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
  }
  
};



// import prisma from '../config/database.js';
// import { LoggerService } from '../utils/logger.js';

// export const databaseService = {
//   async connect() {
//     try {
//       if (!prisma) {
//         console.debug('Prisma client initialized');
//       }
//       await prisma.$connect();
//       console.debug('Database connected successfully');
//     } catch (error) {
//       console.error('Failed to connect to database:', error.message);
//       throw new Error('Database connection failed');
//     }
//   },

//   async disconnect() {
//     if (prisma) {
//       await prisma.$disconnect();
//       console.debug('Database disconnected');
//     }
//   },

//   async getUserByEmail(email, conditions = {}, select = {}) {
//     return await prisma.$transaction(async (tx) => {
//       const user = await tx.user.findFirst({
//         where: {
//           email,
//           deletedAt: null,
//           ...conditions,
//         },
//         select: {
//           id: true,
//           email: true,
//           password: true,
//           role: true,
//           name: true,
//           phone: true,
//           isActive: true,
//           ...select,
//         },
//       });
//       if (!user) throw new Error('User not found');
//       return user;
//     });
//   },

//   async getUserById(id, select = {}) {
//     return await prisma.$transaction(async (tx) => {
//       const user = await tx.user.findUnique({
//         where: { id },
//         select: {
//           id: true,
//           email: true,
//           name: true,
//           role: true,
//           phone: true,
//           isActive: true,
//           createdAt: true,
//           ...select,
//         },
//       });
//       if (!user) throw new Error('User not found');
//       return user;
//     });
//   },

//   async createUser(data) {
//     return await prisma.$transaction(async (tx) => {
//       const exists = await tx.user.findFirst({ where: { email: data.email, deletedAt: null } });
//       if (exists) throw new Error('User with this email already exists');
//       const user = await tx.user.create({ data });
//       await LoggerService.logSystemEvent('DatabaseService', 'CREATE_USER', { userId: user.id });
//       return user;
//     });
//   },

//   async refreshUserTokens(userId, hashedToken, expiresAt) {
//     return await prisma.$transaction(async (tx) => {
//       await tx.refreshToken.deleteMany({ where: { userId } });
//       const token = await tx.refreshToken.create({
//         data: { userId, token: hashedToken, expiresAt },
//       });
//       await LoggerService.logSystemEvent('DatabaseService', 'REFRESH_USER_TOKENS', { userId });
//       return token;
//     });
//   },

//   async getRefreshToken(tokenHash) {
//     return await prisma.$transaction(async (tx) => {
//       return await tx.refreshToken.findUnique({ where: { token: tokenHash } });
//     });
//   },

//   async cleanupExpiredTokens() {
//     return await prisma.$transaction(async (tx) => {
//       const deleted = await tx.refreshToken.deleteMany({ where: { expiresAt: { lte: new Date() } } });
//       await LoggerService.logSystemEvent('DatabaseService', 'CLEANUP_EXPIRED_TOKENS', { count: deleted.count });
//       return deleted.count;
//     });
//   },
// };

