import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import {
  getOrdersAwaitingPayment,
  processPayment,
  getTodayTransactions,
  getDailySummary,
  endShiftReport
} from '../controllers/cashier.controller.js';

const router = express.Router();

// Rate limiting
const rlModerate = rateLimit({ windowMs: 60_000, max: 200 });

// All cashier routes require CASHIER role
router.use(authMiddleware);
router.use(requireRole('CASHIER'));

// Orders and payments
router.get('/orders', rlModerate, getOrdersAwaitingPayment);
router.post('/payments', rlModerate, processPayment);

// Transactions and reports
router.get('/transactions', rlModerate, getTodayTransactions);
router.get('/summary', rlModerate, getDailySummary);
router.post('/shift/end', rlModerate, endShiftReport);

export default router;
