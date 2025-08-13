import express from "express";
import { createResponse, createError } from '../utils/response.js';
import authRoutes from "./auth.routes.js";
import userRoutes from './user.routes.js';
import logsRoutes from './logs.routes.js';
import healthRoutes from './health.routes.js';
import menuRoutes from './menu.routes.js';
import ordersRoutes from './orders.routes.js';
import driversRoutes from './drivers.routes.js';
import cashRoutes from './cash.routes.js';
import reservationsRoutes from './reservations.routes.js';
import notificationsRoutes from './notifications.routes.js';
import webhooksAdminRoutes from './webhooks.routes.js';

const router = express.Router();

// Group all API routes
router.use('/healthz', healthRoutes);
router.use( "/auth", authRoutes );
router.use("/users", userRoutes);
router.use('/logs', logsRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', ordersRoutes);
router.use('/drivers', driversRoutes);
router.use('/cash', cashRoutes);
router.use('/reservations', reservationsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/webhooks', webhooksAdminRoutes);

router.use((req, res, next) => {
  createError(
    res,
    404,
    `The requested route ${req.originalUrl} does not exist.`,
    'ROUTE_NOT_FOUND',
    {
      route: req.originalUrl,
      action: 'Check the URL or refer to the API documentation for valid endpoints.',
      contactSupport: 'support@cantina.app'
    }
  );
});
export default router;
