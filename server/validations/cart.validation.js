import { z } from 'zod';

// Schema for adding items to cart
export const addToCartSchema = z.object({
  itemId: z.string()
    .min(1, 'Item ID is required')
    .max(100, 'Item ID too long'),
  quantity: z.number()
    .int('Quantity must be an integer')
    .min(1, 'Quantity must be at least 1')
    .max(50, 'Quantity cannot exceed 50')
    .optional()
    .default(1),
  notes: z.string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .default('')
});

// Schema for removing items from cart
export const removeFromCartSchema = z.object({
  itemId: z.string()
    .min(1, 'Item ID is required')
    .max(100, 'Item ID too long')
});

// Schema for updating cart items
export const updateCartItemSchema = z.object({
  itemId: z.string()
    .min(1, 'Item ID is required')
    .max(100, 'Item ID too long'),
  quantity: z.number()
    .int('Quantity must be an integer')
    .min(0, 'Quantity cannot be negative')
    .max(50, 'Quantity cannot exceed 50'),
  notes: z.string()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
});

export default {
  addToCartSchema,
  removeFromCartSchema,
  updateCartItemSchema
};