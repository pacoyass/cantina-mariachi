import express from 'express';
import validate, { validateQuery } from '../middleware/validation.middleware.js';
import { loginSchema, registerSchema, paginationQuerySchema } from '../validations/auth.validation.js';
import { getToken, login, logout, refreshToken, register ,listSessions, logoutAllSessions, logoutOtherSessions } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

import { requireRole } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);
router.get('/token', authMiddleware, getToken);


router.get('/sessions', authMiddleware, requireRole('CUSTOMER','DRIVER','COOK','WAITER','CASHIER','ADMIN','OWNER'), validateQuery(paginationQuerySchema), listSessions);
router.post('/logout-all', authMiddleware, requireRole('CUSTOMER','DRIVER','COOK','WAITER','CASHIER','ADMIN','OWNER'), logoutAllSessions);
router.post('/logout-others', authMiddleware, requireRole('CUSTOMER','DRIVER','COOK','WAITER','CASHIER','ADMIN','OWNER'), logoutOtherSessions);

export default router;