import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import {
  getWaiterOrders,
  createDineInOrder,
  getTodayReservations,
  seatReservation
} from '../controllers/waiter.controller.js';

const router = express.Router();

// Rate limiting
const rlModerate = rateLimit({ windowMs: 60_000, max: 200 });

// All waiter routes require WAITER role
router.use(authMiddleware);
router.use(requireRole('WAITER'));

// Orders
router.get('/orders', rlModerate, getWaiterOrders);
router.post('/orders', rlModerate, createDineInOrder);

// Reservations
router.get('/reservations/today', rlModerate, getTodayReservations);
router.put('/reservations/:reservationId/seat', rlModerate, seatReservation);

export default router;
