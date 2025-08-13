import { z } from 'zod';

export const createCashTxSchema = z.object({
  orderNumber: z.string().min(5),
  driverId: z.string().min(3),
  amount: z.number().nonnegative(),
  customerNotes: z.string().optional(),
});

export const confirmCashTxSchema = z.object({
  orderNumber: z.string().min(5),
  paymentTimestamp: z.string().datetime().optional(),
});

export const verifyCashTxSchema = z.object({
  orderNumber: z.string().min(5),
  adminVerified: z.boolean().default(true),
});

export const summariesQuerySchema = z.object({
  date: z.string().optional().transform((v) => (v ? new Date(v) : new Date())),
  driverId: z.string().optional(),
});