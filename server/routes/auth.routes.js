import express from 'express';
import validate, { validateQuery } from '../middleware/validation.middleware.js';
import { loginSchema, registerSchema, paginationQuerySchema } from '../validations/auth.validation.js';
import {
  getToken,
  login,
  logout,
  refreshToken,
  register,
  listSessions,
  logoutAllSessions,
  logoutOtherSessions,
  revokeSessionById,
} from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Rate limits
const rlStrict = rateLimit({ windowMs: 60_000, max: 10 });
const rlModerate = rateLimit({ windowMs: 60_000, max: 30 });

// Public routes
router.post('/register', rlStrict, validate(registerSchema), register);
router.post('/login', rlStrict, validate(loginSchema), login);
router.post('/refresh-token', rlModerate, refreshToken);

// Authenticated routes
router.delete('/logout', authMiddleware, logout);
router.get('/token', authMiddleware, getToken);

// Session management (role-based)
router.get(
  '/sessions',
  authMiddleware,
  requireRole('CUSTOMER', 'DRIVER', 'COOK', 'WAITER', 'CASHIER', 'ADMIN', 'OWNER'),
  validateQuery(paginationQuerySchema),
  listSessions
);
router.post(
  '/logout-all',
  authMiddleware,
  requireRole('CUSTOMER', 'DRIVER', 'COOK', 'WAITER', 'CASHIER', 'ADMIN', 'OWNER'),
  logoutAllSessions
);
router.post(
  '/logout-others',
  authMiddleware,
  requireRole('CUSTOMER', 'DRIVER', 'COOK', 'WAITER', 'CASHIER', 'ADMIN', 'OWNER'),
  logoutOtherSessions
);
router.delete(
  '/sessions/:id',
  authMiddleware,
  requireRole('CUSTOMER', 'DRIVER', 'COOK', 'WAITER', 'CASHIER', 'ADMIN', 'OWNER'),
  revokeSessionById
);

export default router;





// import express from 'express';
// import validate, { validateQuery } from '../middleware/validation.middleware.js';
// import { loginSchema, registerSchema, paginationQuerySchema } from '../validations/auth.validation.js';
// import { getToken, login, logout, refreshToken, register ,listSessions, logoutAllSessions, logoutOtherSessions, revokeSessionById } from '../controllers/auth.controller.js';
// import authMiddleware from '../middleware/auth.middleware.js';
// import rateLimit from '../middleware/rateLimit.middleware.js';
// import { requireRole } from '../middleware/rbac.middleware.js';

// const router = express.Router();

// const rlStrict = rateLimit({ windowMs: 60_000, max: 10 });
// const rlModerate = rateLimit({ windowMs: 60_000, max: 30 });

// router.post('/register', rlStrict, validate(registerSchema), register);
// router.post('/login', rlStrict, validate(loginSchema), login);
// router.post('/refresh-token', rlModerate, refreshToken);
// router.post('/logout', authMiddleware, logout);
// router.get('/token', authMiddleware, getToken);


// router.get('/sessions', authMiddleware, requireRole('CUSTOMER','DRIVER','COOK','WAITER','CASHIER','ADMIN','OWNER'), validateQuery(paginationQuerySchema), listSessions);
// router.post('/logout-all', authMiddleware, requireRole('CUSTOMER','DRIVER','COOK','WAITER','CASHIER','ADMIN','OWNER'), logoutAllSessions);
// router.post('/logout-others', authMiddleware, requireRole('CUSTOMER','DRIVER','COOK','WAITER','CASHIER','ADMIN','OWNER'), logoutOtherSessions);
// router.delete('/sessions/:id', authMiddleware, requireRole('CUSTOMER','DRIVER','COOK','WAITER','CASHIER','ADMIN','OWNER'), revokeSessionById);

// export default router;