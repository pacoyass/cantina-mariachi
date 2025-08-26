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
import metricsRoutes from './metrics.routes.js';
import homeRoutes from './home.routes.js';
import configRoutes from './config.routes.js';
import analyticsRoutes from './analytics.routes.js';
import cmsRoutes from './cms.routes.js';
import translationsRoutes from './translations.routes.js';

const router = express.Router();

// Group all API routes
router.use('/healthz', healthRoutes);
router.use('/metrics', metricsRoutes);
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
router.use('/home', homeRoutes);
router.use('/config', configRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/cms', cmsRoutes);
router.use('/translations', translationsRoutes);

router.use((req, res, next) => {
  createError(
    res,
    404,
    'notFound',
    'ROUTE_NOT_FOUND',
    {
      route: req.originalUrl,
      action: req.t ? req.t('checkApiDocsAction', {}, 'api') : 'Check the URL or refer to the API documentation for valid endpoints.',
      contactSupport: 'support@cantina.app'
    },
    req,
    {},
    'common'
  );
});
export default router;
