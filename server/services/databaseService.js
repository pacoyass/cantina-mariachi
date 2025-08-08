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
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
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
    });
  },

  async getUserById(id, select = {}) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
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
    });
  },

  async createUser(data) {
    return await prisma.$transaction(async (tx) => {
      const exists = await tx.user.findFirst({ where: { email: data.email, deletedAt: null } });
      if (exists) throw new Error('User with this email already exists');
      const user = await tx.user.create({ data });
      await LoggerService.logSystemEvent('DatabaseService', 'CREATE_USER', { userId: user.id });
      return user;
    });
  },

  async refreshUserTokens(userId, hashedToken, expiresAt) {
    return await prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({ where: { userId } });
      const token = await tx.refreshToken.create({
        data: { userId, token: hashedToken, expiresAt },
      });
      await LoggerService.logSystemEvent('DatabaseService', 'REFRESH_USER_TOKENS', { userId });
      return token;
    });
  },

  async getRefreshToken(tokenHash) {
    return await prisma.$transaction(async (tx) => {
      return await tx.refreshToken.findUnique({ where: { token: tokenHash } });
    });
  },

  async cleanupExpiredTokens() {
    return await prisma.$transaction(async (tx) => {
      const deleted = await tx.refreshToken.deleteMany({ where: { expiresAt: { lte: new Date() } } });
      await LoggerService.logSystemEvent('DatabaseService', 'CLEANUP_EXPIRED_TOKENS', { count: deleted.count });
      return deleted.count;
    });
  },
};

