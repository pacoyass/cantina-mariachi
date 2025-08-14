import express from 'express';
import client from 'prom-client';

const router = express.Router();

client.collectDefaultMetrics();

import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';

router.get('/', authMiddleware, requireRole('ADMIN','OWNER'), async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

export default router;