import { z } from 'zod';

export const orderTypeEnum = z.enum(['TAKEOUT', 'DELIVERY']);
export const orderStatusEnum = z.enum([
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'AWAITING_PAYMENT',
  'PAYMENT_DISPUTED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
]);

export const orderItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().int().min(1),
  notes: z.string().optional(),
});

export const createOrderSchema = z.object({
  type: orderTypeEnum,
  items: z.array(orderItemSchema).min(1),
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(7),
  notes: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryInstructions: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'DELIVERY' && !data.deliveryAddress) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'deliveryAddress required for DELIVERY orders', path: ['deliveryAddress'] });
  }
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});