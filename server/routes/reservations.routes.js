import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { validate, validateQuery } from '../middleware/validation.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { createReservation, listReservations, checkAvailability, updateReservationStatus, cancelReservation } from '../controllers/reservations.controller.js';
import { createReservationSchema, updateReservationStatusSchema, availabilityQuerySchema } from '../validations/reservations.validation.js';

const router = express.Router();
const rlStrict = rateLimit({ windowMs: 60_000, max: 60 });

// Public create and availability, admin listing and updates
router.post('/', rlStrict, validate(createReservationSchema), createReservation);
router.get('/availability', rlStrict, validateQuery(availabilityQuerySchema), checkAvailability);
router.get('/', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, listReservations);
router.patch('/:id/status', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, validate(updateReservationStatusSchema), updateReservationStatus);
router.post('/:id/cancel', rlStrict, cancelReservation);

export default router;