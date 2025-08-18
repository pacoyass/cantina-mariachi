import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { getPage, upsertPage } from '../controllers/cms/page.controller.js';
import { getHomePage } from '../controllers/cms/home.controller.js';
import { handleCacheInvalidation, handleTmsWebhook } from '../controllers/cms/webhook.controller.js';

const router = express.Router();
const rlLight = rateLimit({ windowMs: 60_000, max: 240 });
const rlStrict = rateLimit({ windowMs: 60_000, max: 60 });

// Public routes
router.get('/:slug', rlLight, getPage);
router.get('/home', rlLight, getHomePage); // Special route for home page

// Protected routes
router.put('/:slug', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, upsertPage);

// Webhook endpoints
router.post('/webhooks/cache-invalidation', rlStrict, handleCacheInvalidation);
router.post('/webhooks/tms', rlStrict, handleTmsWebhook);

export default router;