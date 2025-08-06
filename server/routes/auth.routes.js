import express from 'express';
import validate from '../middleware/validation.middleware.js';
import { loginSchema, refreshTokenSchema, registerSchema } from '../validations/auth.validation.js';
import { getToken, login, logout, refreshToken, register } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post('/logout', authMiddleware, logout);
router.get('/token', authMiddleware, getToken);

export default router;