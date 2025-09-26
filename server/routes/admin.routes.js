import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { 
  getOrderStats,
  getRevenueStats,
  getMenuStats,
  getUserStats,
  getOrders,
  getRecentOrders,
  updateOrderStatus,
  getUsers,
  updateUserStatus,
  updateUserRole
} from '../controllers/admin.controller.js';

const router = express.Router();

// Rate limiting for admin operations
const rlModerate = rateLimit({ windowMs: 60_000, max: 100 }); // 100 requests per minute
const rlStrict = rateLimit({ windowMs: 60_000, max: 30 });   // 30 requests per minute

// Middleware to check admin privileges
const requireAdmin = (req, res, next) => {
  if (!req.user || !['ADMIN', 'OWNER'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Insufficient privileges. Admin access required.'
    });
  }
  next();
};

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(requireAdmin);

// Dashboard Stats Routes
router.get('/stats/orders', rlModerate, getOrderStats);
router.get('/stats/revenue', rlModerate, getRevenueStats);
router.get('/stats/menu', rlModerate, getMenuStats);
router.get('/stats/users', rlModerate, getUserStats);

// Orders Management Routes
router.get('/orders', rlModerate, getOrders);
router.get('/orders/recent', rlModerate, getRecentOrders);
router.put('/orders/:orderId/status', rlStrict, updateOrderStatus);

// Users Management Routes
router.get('/users', rlModerate, getUsers);
router.put('/users/:userId', rlStrict, updateUserStatus);
router.put('/users/:userId/role', rlStrict, updateUserRole);

// Menu Management Routes (extend existing menu routes for admin)
// These could be added here or extend the existing menu.routes.js

export default router;