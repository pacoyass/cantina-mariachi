import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { getPublicConfig, getLanguages, setLanguage, resetLanguage } from '../controllers/config.controller.js';

const router = express.Router();
const rlLight = rateLimit({ windowMs: 60_000, max: 120 });

router.get('/public', rlLight, getPublicConfig);
router.get('/languages', rlLight, getLanguages);
router.post('/language', rlLight, setLanguage);
router.post('/language/reset', rlLight, resetLanguage);

export default router;