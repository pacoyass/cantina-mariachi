import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { getPage, upsertPage } from '../controllers/cms/page.controller.js';

const router = express.Router();
const rlLight = rateLimit({ windowMs: 60_000, max: 240 });
const rlStrict = rateLimit({ windowMs: 60_000, max: 60 });

router.get('/:slug', rlLight, getPage);
router.put('/:slug', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, upsertPage);

export default router;