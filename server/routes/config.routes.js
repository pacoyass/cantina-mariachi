import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { getPublicConfig } from '../controllers/config.controller.js';

const router = express.Router();
const rlLight = rateLimit({ windowMs: 60_000, max: 120 });

router.get('/public', rlLight, getPublicConfig);

export default router;