import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { getOffers, getTestimonials } from '../controllers/home.controller.js';

const router = express.Router();
const rlLight = rateLimit({ windowMs: 60_000, max: 60 });

router.get('/offers', rlLight, getOffers);
router.get('/testimonials', rlLight, getTestimonials);

export default router;