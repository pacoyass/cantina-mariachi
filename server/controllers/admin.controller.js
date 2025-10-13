import { createResponse, createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';

// Mock data for development - replace with actual database queries
const mockStats = {
  orders: {
    total: 156,
    pending: 8,
    completed: 142,
    cancelled: 6,
    today: 12,
    growth: 15.3
  },
  revenue: {
    today: 1240.50,
    month: 24580.75,
    growth: 8.2,
    avgOrder: 35.25
  },
  menu: {
    total: 48,
    available: 44,
    outOfStock: 4,
    categories: 8
  },
  users: {
    total: 328,
    active: 89,
    new: 24,
    growth: 12.1
  }
};

// Dashboard Stats
export const getOrderStats = async (req, res) => {
  try {
    // In a real app, query the database for order statistics
    // const stats = await prisma.order.aggregate(...);
    
    LoggerService.logActivity(req.user?.id, 'ADMIN_VIEW', 'Viewed order stats', {
      userId: req.user?.id,
      path: req.path
    });
    
    return createResponse(res, 200, 'Order stats retrieved successfully', mockStats.orders);
  } catch (error) {
    LoggerService.logError('Failed to get order stats', error.stack, {
      path: req.path,
      userId: req.user?.id
    });
    return createError(res, 500, 'internalError', 'STATS_ERROR');
  }
};

export const getRevenueStats = async (req, res) => {
  try {
    // In a real app, calculate revenue from orders
    LoggerService.logActivity(req.user?.id, 'ADMIN_VIEW', 'Viewed revenue stats', {
      userId: req.user?.id,
      path: req.path
    });
    
    return createResponse(res, 200, 'Revenue stats retrieved successfully', mockStats.revenue);
  } catch (error) {
    LoggerService.logError('Failed to get revenue stats', error.stack, {
      path: req.path,
      userId: req.user?.id
    });
    return createError(res, 500, 'internalError', 'STATS_ERROR');
  }
};

export const getMenuStats = async (req, res) => {
  try {
    // In a real app, query menu items
    LoggerService.logActivity(req.user?.id, 'ADMIN_VIEW', 'Viewed menu stats', {
      userId: req.user?.id,
      path: req.path
    });
    
    return createResponse(res, 200, 'Menu stats retrieved successfully', mockStats.menu);
  } catch (error) {
    LoggerService.logError('Failed to get menu stats', error.stack, {
      path: req.path,
      userId: req.user?.id
    });
    return createError(res, 500, 'internalError', 'STATS_ERROR');
  }
};

export const getUserStats = async (req, res) => {
  try {
    // In a real app, query users
    LoggerService.logActivity(req.user?.id, 'ADMIN_VIEW', 'Viewed user stats', {
      userId: req.user?.id,
      path: req.path
    });
    
    return createResponse(res, 200, 'User stats retrieved successfully', mockStats.users);
  } catch (error) {
    LoggerService.logError('Failed to get user stats', error.stack, {
      path: req.path,
      userId: req.user?.id
    });
    return createError(res, 500, 'internalError', 'STATS_ERROR');
  }
};

// Orders Management
export const getOrders = async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 20 } = req.query;
    
    // Mock orders data
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+1234567890',
        total: 45.99,
        status: 'PENDING',
        type: 'DELIVERY',
        deliveryAddress: '123 Main St, City, State',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+1234567891',
        total: 28.50,
        status: 'PREPARING',
        type: 'PICKUP',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
    
    LoggerService.logActivity(req.user?.id, 'ADMIN_VIEW', 'Viewed orders list', {
      userId: req.user?.id,
      filters: { status, type, search }
    });
    
    return createResponse(res, 200, 'Orders retrieved successfully', {
      orders: mockOrders,
      pagination: {
        page: parseInt(page),
        totalPages: 1,
        total: mockOrders.length
      }
    });
  } catch (error) {
    LoggerService.logError('Failed to get orders', error.stack, {
      path: req.path,
      userId: req.user?.id
    });
    return createError(res, 500, 'internalError', 'ORDERS_ERROR');
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Mock recent orders
    const recentOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        total: 45.99,
        status: 'PENDING',
        type: 'DELIVERY',
        createdAt: new Date().toISOString()
      }
    ];
    
    return createResponse(res, 200, 'Recent orders retrieved successfully', recentOrders.slice(0, limit));
  } catch (error) {
    LoggerService.logError('Failed to get recent orders', error.stack, {
      path: req.path,
      userId: req.user?.id
    });
    return createError(res, 500, 'internalError', 'ORDERS_ERROR');
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!orderId || !status) {
      return createError(res, 400, 'validationError', 'MISSING_PARAMETERS');
    }
    
    // In a real app, update the order in the database
    // await prisma.order.update({ where: { id: orderId }, data: { status } });
    
    LoggerService.logActivity(req.user?.id, 'ORDER_UPDATE', `Updated order ${orderId} status to ${status}`, {
      userId: req.user?.id,
      orderId,
      newStatus: status
    });
    
    return createResponse(res, 200, 'Order status updated successfully', { orderId, status });
  } catch (error) {
    LoggerService.logError('Failed to update order status', error.stack, {
      path: req.path,
      userId: req.user?.id,
      orderId: req.params.orderId
    });
    return createError(res, 500, 'internalError', 'ORDER_UPDATE_ERROR');
  }
};

// Users Management
export const getUsers = async (req, res) => {
  try {
    const { role, search, status } = req.query;
    
    // Mock users data
    const mockUsers = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@cantina.com',
        phone: '+1234567890',
        role: 'ADMIN',
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Maria Garcia',
        email: 'maria@cantina.com',
        phone: '+1234567891',
        role: 'COOK',
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    LoggerService.logActivity(req.user?.id, 'ADMIN_VIEW', 'Viewed users list', {
      userId: req.user?.id,
      filters: { role, search, status }
    });
    
    return createResponse(res, 200, 'Users retrieved successfully', { users: mockUsers });
  } catch (error) {
    LoggerService.logError('Failed to get users', error.stack, {
      path: req.path,
      userId: req.user?.id
    });
    return createError(res, 500, 'internalError', 'USERS_ERROR');
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    if (!userId || isActive === undefined) {
      return createError(res, 400, 'validationError', 'MISSING_PARAMETERS');
    }
    
    // In a real app, update the user in the database
    // await prisma.user.update({ where: { id: userId }, data: { isActive } });
    
    LoggerService.logActivity(req.user?.id, 'USER_UPDATE', `Updated user ${userId} status`, {
      userId: req.user?.id,
      targetUserId: userId,
      isActive
    });
    
    return createResponse(res, 200, 'User status updated successfully', { userId, isActive });
  } catch (error) {
    LoggerService.logError('Failed to update user status', error.stack, {
      path: req.path,
      userId: req.user?.id,
      targetUserId: req.params.userId
    });
    return createError(res, 500, 'internalError', 'USER_UPDATE_ERROR');
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!userId || !role) {
      return createError(res, 400, 'validationError', 'MISSING_PARAMETERS');
    }
    
    // In a real app, update the user role in the database
    // await prisma.user.update({ where: { id: userId }, data: { role } });
    
    LoggerService.logActivity(req.user?.id, 'USER_ROLE_UPDATE', `Updated user ${userId} role to ${role}`, {
      userId: req.user?.id,
      targetUserId: userId,
      newRole: role
    });
    
    return createResponse(res, 200, 'User role updated successfully', { userId, role });
  } catch (error) {
    LoggerService.logError('Failed to update user role', error.stack, {
      path: req.path,
      userId: req.user?.id,
      targetUserId: req.params.userId
    });
    return createError(res, 500, 'internalError', 'USER_ROLE_UPDATE_ERROR');
  }
};

// Session Management
export const getAllUsersWithSessions = async (req, res) => {
  try {
    const { databaseService } = await import('../services/databaseService.js');
    
    // Get all users
    const users = await databaseService.getAllUsers();
    
    // Get sessions for each user
    const usersWithSessions = await Promise.all(
      users.map(async (user) => {
        const sessions = await databaseService.listRefreshTokensByUser(user.id, { page: 1, pageSize: 100 });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          sessions: sessions.map(s => ({
            id: s.id,
            expiresAt: s.expiresAt,
            lastUsedAt: s.lastUsedAt,
            userAgent: s.userAgent,
            ip: s.ip,
            createdAt: s.createdAt
          }))
        };
      })
    );
    
    LoggerService.logActivity(req.user?.id, 'ADMIN_VIEW', 'Viewed all users with sessions', {
      userId: req.user?.id,
      totalUsers: usersWithSessions.length
    });
    
    return createResponse(res, 200, 'Users with sessions retrieved successfully', usersWithSessions);
  } catch (error) {
    LoggerService.logError('Failed to get users with sessions', error.stack, {
      path: req.path,
      userId: req.user?.id
    });
    return createError(res, 500, 'internalError', 'USERS_SESSIONS_ERROR');
  }
};

export const revokeUserSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.params;
    
    if (!userId || !sessionId) {
      return createError(res, 400, 'validationError', 'MISSING_PARAMETERS');
    }
    
    const { databaseService } = await import('../services/databaseService.js');
    
    // Verify the session belongs to the user
    const session = await databaseService.getRefreshTokenById(sessionId);
    if (!session || session.userId !== userId) {
      return createError(res, 404, 'Session not found or does not belong to user', 'SESSION_NOT_FOUND');
    }
    
    // Delete the session
    await databaseService.deleteRefreshToken(sessionId);
    
    LoggerService.logActivity(req.user?.id, 'ADMIN_ACTION', `Revoked session ${sessionId} for user ${userId}`, {
      adminId: req.user?.id,
      targetUserId: userId,
      sessionId
    });
    
    return createResponse(res, 200, 'Session revoked successfully', { userId, sessionId });
  } catch (error) {
    LoggerService.logError('Failed to revoke user session', error.stack, {
      path: req.path,
      userId: req.user?.id,
      targetUserId: req.params.userId,
      sessionId: req.params.sessionId
    });
    return createError(res, 500, 'internalError', 'SESSION_REVOKE_ERROR');
  }
};

export default {
  // Stats
  getOrderStats,
  getRevenueStats,
  getMenuStats,
  getUserStats,
  
  // Orders
  getOrders,
  getRecentOrders,
  updateOrderStatus,
  
  // Users
  getUsers,
  updateUserStatus,
  updateUserRole,
  
  // Sessions
  getAllUsersWithSessions,
  revokeUserSession
};