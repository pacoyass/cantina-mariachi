import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate, validateQuery } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { listDrivers, createDriver, updateDriver, deleteDriver, updateDriverStatus, linkDriverToUser, assignOrder, listDriverAssignments } from '../controllers/drivers.controller.js';
import { createDriverSchema, updateDriverSchema, updateDriverStatusSchema, linkDriverSchema, assignmentSchema } from '../validations/drivers.validation.js';

const router = express.Router();
const rlModerate = rateLimit({ windowMs: 60_000, max: 120 });

router.get('/', rlModerate, listDrivers);
router.get('/:id/assignments', authMiddleware, requireRole('ADMIN','OWNER'), rlModerate, listDriverAssignments);

router.post('/', authMiddleware, requireRole('ADMIN','OWNER'), validate(createDriverSchema), createDriver);
router.put('/:id', authMiddleware, requireRole('ADMIN','OWNER'), validate(updateDriverSchema), updateDriver);
router.delete('/:id', authMiddleware, requireRole('ADMIN','OWNER'), deleteDriver);
router.patch('/:id/status', authMiddleware, requireRole('ADMIN','OWNER'), validate(updateDriverStatusSchema), updateDriverStatus);
router.patch('/:id/link-user', authMiddleware, requireRole('ADMIN','OWNER'), validate(linkDriverSchema), linkDriverToUser);

router.post('/assign', authMiddleware, requireRole('ADMIN','OWNER'), validate(assignmentSchema), assignOrder);

export default router;