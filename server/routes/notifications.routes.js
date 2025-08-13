import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { dispatch } from '../controllers/notifications.controller.js';
import { dispatchNotificationSchema } from '../validations/notifications.validation.js';

const router = express.Router();
const rlStrict = rateLimit({ windowMs: 60_000, max: 30 });

router.post('/dispatch', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, validate(dispatchNotificationSchema), dispatch);

export default router;