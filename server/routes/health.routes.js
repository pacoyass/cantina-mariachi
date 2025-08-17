import express from 'express';
import { getHealth, getDiagnostics } from '../controllers/health.controller.js';

const router = express.Router();

router.get('/', getHealth);
router.get('/diagnostics', getDiagnostics);

export default router;