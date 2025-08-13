import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { createOrder, getOrderByNumber, updateOrderStatus } from '../controllers/orders.controller.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/orders.validation.js';

const router = express.Router();
const rlStrict = rateLimit({ windowMs: 60_000, max: 20 });

router.post('/', rlStrict, validate(createOrderSchema), createOrder);
router.get('/:orderNumber', rlStrict, getOrderByNumber);
router.patch('/:orderNumber/status', authMiddleware, requireRole('ADMIN','OWNER','COOK','WAITER','CASHIER','DRIVER'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;