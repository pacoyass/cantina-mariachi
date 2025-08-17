import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { postEvent } from '../controllers/analytics.controller.js';

const router = express.Router();
const rlStrict = rateLimit({ windowMs: 60_000, max: 60 });

router.post('/event', rlStrict, postEvent);

export default router;