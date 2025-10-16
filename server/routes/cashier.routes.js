import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import {
  getOrdersAwaitingPayment,
  processPayment,
  getTodayTransactions,
  getDailySummary,
  endShiftReport,
  confirmOrder,
  markOrderReady,
  assignDriver,
  getAllDrivers,
  rejectOrder
} from '../controllers/cashier.controller.js';

const router = express.Router();

// Rate limiting
const rlModerate = rateLimit({ windowMs: 60_000, max: 200 });

// All cashier routes require CASHIER role
router.use(authMiddleware);
router.use(requireRole('CASHIER'));

// Order management (coordinator functions)
router.post('/orders/:orderId/confirm', rlModerate, confirmOrder);
router.post('/orders/:orderId/reject', rlModerate, rejectOrder);
router.post('/orders/:orderId/ready', rlModerate, markOrderReady);
router.post('/orders/:orderId/assign-driver', rlModerate, assignDriver);

// Orders and payments
router.get('/orders', rlModerate, getOrdersAwaitingPayment);
router.post('/payments', rlModerate, processPayment);

// Drivers
router.get('/drivers', rlModerate, getAllDrivers);

// Transactions and reports
router.get('/transactions', rlModerate, getTodayTransactions);
router.get('/summary', rlModerate, getDailySummary);
router.post('/shift/end', rlModerate, endShiftReport);

export default router;
