import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().optional(),
  order: z.number().int().min(0).optional().default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().optional(),
  order: z.number().int().min(0).optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export const listMenuItemsQuery = z.object({
  categoryId: z.string().optional(),
  available: z.string().optional().transform((v) => (v === undefined || v === '' ? undefined : v === 'true')),
});

export const createMenuItemSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(1),
  price: z.number().nonnegative(),
  image: z.string().url().optional(),
  isVegetarian: z.boolean().optional().default(false),
  isVegan: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
  isSpecial: z.boolean().optional().default(false),
  categoryId: z.string(),
});

export const updateMenuItemSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().optional(),
  price: z.number().nonnegative().optional(),
  image: z.string().url().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isSpecial: z.boolean().optional(),
  categoryId: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export const toggleAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});