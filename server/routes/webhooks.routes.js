import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate, validateParams } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { register, list, enable, disable, trigger } from '../controllers/webhookAdmin.controller.js';
import { registerWebhookSchema, webhookIdParam, triggerSchema } from '../validations/webhooks.validation.js';

const router = express.Router();
const rlModerate = rateLimit({ windowMs: 60_000, max: 60 });

router.post('/', authMiddleware, requireRole('ADMIN','OWNER'), rlModerate, validate(registerWebhookSchema), register);
router.get('/', authMiddleware, requireRole('ADMIN','OWNER'), rlModerate, list);
router.post('/:id/enable', authMiddleware, requireRole('ADMIN','OWNER'), rlModerate, validateParams(webhookIdParam), enable);
router.post('/:id/disable', authMiddleware, requireRole('ADMIN','OWNER'), rlModerate, validateParams(webhookIdParam), disable);
router.post('/trigger', authMiddleware, requireRole('ADMIN','OWNER'), rlModerate, validate(triggerSchema), trigger);

export default router;