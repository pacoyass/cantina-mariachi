import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate, validateQuery } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { createOrder, getOrderByNumber, updateOrderStatus, trackOrder, listMyOrders } from '../controllers/orders.controller.js';
import { createOrderSchema, updateOrderStatusSchema, trackOrderQuery } from '../validations/orders.validation.js';

const router = express.Router();
const rlStrict = rateLimit({ windowMs: 60_000, max: 20 });

router.post('/', rlStrict, validate(createOrderSchema), createOrder);
router.get('/:orderNumber', authMiddleware, rlStrict, requireRole('CUSTOMER','DRIVER','COOK','WAITER','CASHIER','ADMIN','OWNER'), getOrderByNumber);
router.get('/track/by', rlStrict, validateQuery(trackOrderQuery), trackOrder);
router.get('/mine/list', authMiddleware, rlStrict, listMyOrders);
router.patch('/:orderNumber/status', authMiddleware, requireRole('ADMIN','OWNER','COOK','WAITER','CASHIER','DRIVER'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;