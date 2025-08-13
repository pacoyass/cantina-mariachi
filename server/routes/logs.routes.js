import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validateQuery } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';

import { getActivityLogs, getNotifications, getOrders } from '../controllers/logs.controller.js';
import { activityQuery, notificationsQuery, ordersQuery } from '../validations/logs.validation.js';

const router = express.Router();
const rlModerate = rateLimit({ windowMs: 60_000, max: 60 });

router.get(
  '/activity',
  authMiddleware,
  requireRole('ADMIN','OWNER'),
  rlModerate,
  validateQuery(activityQuery),
  getActivityLogs
);

router.get(
  '/notifications',
  authMiddleware,
  requireRole('ADMIN','OWNER'),
  rlModerate,
  validateQuery(notificationsQuery),
  getNotifications
);

router.get(
  '/orders',
  authMiddleware,
  requireRole('ADMIN','OWNER'),
  rlModerate,
  validateQuery(ordersQuery),
  getOrders
);

export default router;