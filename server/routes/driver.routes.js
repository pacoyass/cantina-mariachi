import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import {
  getDriverDeliveries,
  acceptDelivery,
  startDelivery,
  completeDelivery,
  getDriverCashSummary,
  updateDriverStatus
} from '../controllers/driver.controller.js';

const router = express.Router();

// Rate limiting
const rlModerate = rateLimit({ windowMs: 60_000, max: 200 });

// All driver routes require DRIVER role
router.use(authMiddleware);
router.use(requireRole('DRIVER'));

// Deliveries
router.get('/deliveries', rlModerate, getDriverDeliveries);
router.post('/deliveries/:orderId/accept', rlModerate, acceptDelivery);
router.post('/deliveries/:orderId/start', rlModerate, startDelivery);
router.post('/deliveries/:orderId/complete', rlModerate, completeDelivery);

// Cash and status
router.get('/cash-summary', rlModerate, getDriverCashSummary);
router.put('/status', rlModerate, updateDriverStatus);

export default router;
