import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import { getPage, upsertPage } from '../controllers/cms/page.controller.js';
import { getHomePage } from '../controllers/cms/home.controller.js';
import { handleCacheInvalidation, handleTmsWebhook } from '../controllers/cms/webhook.controller.js';
import { 
  getLanguages, 
  createLanguage, 
  updateLanguage, 
  deleteLanguage,
  getNamespaces,
  createNamespace,
  updateNamespace,
  deleteNamespace,
  getContentSchemas,
  createContentSchema,
  updateContentSchema,
  deleteContentSchema,
  getFallbackRules,
  createFallbackRule,
  updateFallbackRule,
  deleteFallbackRule,
  initializeDynamicTranslation
} from '../controllers/cms/admin.controller.js';

const router = express.Router();
const rlLight = rateLimit({ windowMs: 60_000, max: 240 });
const rlStrict = rateLimit({ windowMs: 60_000, max: 60 });

// Public routes
router.get('/home', rlLight, getHomePage); // Special route for home page
router.get('/:slug', rlLight, getPage);

// Protected routes
router.put('/:slug', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, upsertPage);

// Webhook endpoints
router.post('/webhooks/cache-invalidation', rlStrict, handleCacheInvalidation);
router.post('/webhooks/tms', rlStrict, handleTmsWebhook);

// Admin routes for dynamic translation management
router.get('/admin/languages', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, getLanguages);
router.post('/admin/languages', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, createLanguage);
router.put('/admin/languages/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, updateLanguage);
router.delete('/admin/languages/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, deleteLanguage);

router.get('/admin/namespaces', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, getNamespaces);
router.post('/admin/namespaces', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, createNamespace);
router.put('/admin/namespaces/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, updateNamespace);
router.delete('/admin/namespaces/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, deleteNamespace);

router.get('/admin/schemas', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, getContentSchemas);
router.post('/admin/schemas', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, createContentSchema);
router.put('/admin/schemas/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, updateContentSchema);
router.delete('/admin/schemas/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, deleteContentSchema);

router.get('/admin/fallback-rules', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, getFallbackRules);
router.post('/admin/fallback-rules', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, createFallbackRule);
router.put('/admin/fallback-rules/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, updateFallbackRule);
router.delete('/admin/fallback-rules/:id', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, deleteFallbackRule);

// Initialize dynamic translation data
router.post('/admin/initialize', authMiddleware, requireRole('ADMIN','OWNER'), rlStrict, initializeDynamicTranslation);

export default router;