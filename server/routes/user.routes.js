import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import validate from '../middleware/validation.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { getMe, updateMe, changePassword } from '../controllers/user.controller.js';
import { updateMeSchema, changePasswordSchema } from '../validations/user.validation.js';

const router = express.Router();

// All user routes require authentication and a valid application role
router.get('/me', authMiddleware, requireRole('CUSTOMER','DRIVER','CASHIER','ADMIN','OWNER'), getMe);
router.put('/me', authMiddleware, requireRole('CUSTOMER','DRIVER','CASHIER','ADMIN','OWNER'), validate(updateMeSchema), updateMe);
router.put('/me/password', authMiddleware, requireRole('CUSTOMER','DRIVER','CASHIER','ADMIN','OWNER'), validate(changePasswordSchema), changePassword);

export default router;