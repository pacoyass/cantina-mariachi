import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate, validateQuery } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { createOrder, getOrderByNumber, updateOrderStatus, trackOrder, listMyOrders } from '../controllers/orders.controller.js';
import { createOrderSchema, updateOrderStatusSchema, trackOrderQuery } from '../validations/orders.validation.js';

const router = express.Router();
const rlStrict = rateLimit({ windowMs: 60_000, max: 20 });

router.post('/',authMiddleware, rlStrict,requireRole('CUSTOMER','CASHIER'), validate(createOrderSchema), createOrder);
router.get('/mine/list', authMiddleware, rlStrict, listMyOrders);
router.get('/track/by', rlStrict, validateQuery(trackOrderQuery), trackOrder);
router.get('/:orderNumber', authMiddleware, rlStrict, requireRole('CUSTOMER','DRIVER','CASHIER','ADMIN','OWNER'), getOrderByNumber);
router.patch('/:orderNumber/status', authMiddleware, requireRole('ADMIN','OWNER','CASHIER','DRIVER'), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;