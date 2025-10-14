import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import {
  getKitchenOrders,
  startPreparing,
  markOrderReady
} from '../controllers/kitchen.controller.js';

const router = express.Router();

// Rate limiting for kitchen operations
const rlModerate = rateLimit({ windowMs: 60_000, max: 200 }); // 200 requests per minute

// All kitchen routes require COOK role
router.use(authMiddleware);
router.use(requireRole('COOK'));

// Get kitchen orders
router.get('/orders', rlModerate, getKitchenOrders);

// Update order status
router.post('/orders/:orderId/start-preparing', rlModerate, startPreparing);
router.post('/orders/:orderId/mark-ready', rlModerate, markOrderReady);

export default router;
