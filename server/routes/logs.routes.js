import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validateQuery } from '../middleware/validation.middleware.js';

import { getActivityLogs, getNotifications, getOrders } from '../controllers/logs.controller.js';
import { activityQuery, notificationsQuery, ordersQuery } from '../validations/logs.validation.js';

const router = express.Router();

router.get(
  '/activity',
  authMiddleware,
  requireRole('ADMIN','OWNER'),
  validateQuery(activityQuery),
  getActivityLogs
);

router.get(
  '/notifications',
  authMiddleware,
  requireRole('ADMIN','OWNER'),
  validateQuery(notificationsQuery),
  getNotifications
);

router.get(
  '/orders',
  authMiddleware,
  requireRole('ADMIN','OWNER'),
  validateQuery(ordersQuery),
  getOrders
);

export default router;