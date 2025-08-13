import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate, validateQuery } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { createCashTransaction, confirmCashTransaction, verifyCashTransaction, getDriverDailySummary } from '../controllers/cash.controller.js';
import { createCashTxSchema, confirmCashTxSchema, verifyCashTxSchema, summariesQuerySchema } from '../validations/cash.validation.js';

const router = express.Router();
const rlStrict = rateLimit({ windowMs: 60_000, max: 30 });

router.post('/', authMiddleware, requireRole('ADMIN','OWNER','CASHIER'), rlStrict, validate(createCashTxSchema), createCashTransaction);
router.post('/confirm', authMiddleware, requireRole('ADMIN','OWNER','CASHIER','DRIVER'), rlStrict, validate(confirmCashTxSchema), confirmCashTransaction);
router.post('/verify', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, validate(verifyCashTxSchema), verifyCashTransaction);
router.get('/summary/driver/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, validateQuery(summariesQuerySchema), getDriverDailySummary);

export default router;