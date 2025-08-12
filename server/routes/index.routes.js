import express from "express";
import { createResponse, createError } from '../utils/response.js';
import testRoutes from "./test.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from './user.routes.js';
import logsRoutes from './logs.routes.js';

const router = express.Router();

// Group all API routes
router.use( "/test", testRoutes );
router.use( "/auth", authRoutes );
router.use("/users", userRoutes);
router.use('/logs', logsRoutes);

router.use((req, res, next) => {
  createError(
    res,
    404,
    `The requested route ${req.originalUrl} does not exist.`,
    'ROUTE_NOT_FOUND',
    {
      route: req.originalUrl,
      action: 'Check the URL or refer to the API documentation for valid endpoints.',
      contactSupport: 'support@taskmaster.com'
    }
  );
});
export default router;
