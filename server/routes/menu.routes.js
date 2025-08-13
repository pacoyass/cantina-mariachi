import express from 'express';
import { validate, validateParams, validateQuery } from '../middleware/validation.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/rbac.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { listCategories, createCategory, updateCategory, deleteCategory, listMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } from '../controllers/menu.controller.js';
import { createCategorySchema, updateCategorySchema, listMenuItemsQuery, createMenuItemSchema, updateMenuItemSchema, toggleAvailabilitySchema } from '../validations/menu.validation.js';

const router = express.Router();
const rlModerate = rateLimit({ windowMs: 60_000, max: 120 });

// Public reads
router.get('/categories', rlModerate, listCategories);
router.get('/items', rlModerate, validateQuery(listMenuItemsQuery), listMenuItems);

// Admin/Owner writes
router.post('/categories', authMiddleware, requireRole('ADMIN','OWNER'), validate(createCategorySchema), createCategory);
router.put('/categories/:id', authMiddleware, requireRole('ADMIN','OWNER'), validate(updateCategorySchema), updateCategory);
router.delete('/categories/:id', authMiddleware, requireRole('ADMIN','OWNER'), deleteCategory);

router.post('/items', authMiddleware, requireRole('ADMIN','OWNER'), validate(createMenuItemSchema), createMenuItem);
router.put('/items/:id', authMiddleware, requireRole('ADMIN','OWNER'), validate(updateMenuItemSchema), updateMenuItem);
router.delete('/items/:id', authMiddleware, requireRole('ADMIN','OWNER'), deleteMenuItem);
router.patch('/items/:id/availability', authMiddleware, requireRole('ADMIN','OWNER'), validate(toggleAvailabilitySchema), toggleMenuItemAvailability);

export default router;