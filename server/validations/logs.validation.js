
import { z } from 'zod';

const parseIntOrDefault = (value, defaultValue) => {
  if (typeof value !== 'string' || value.trim() === '') return defaultValue;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? defaultValue : n;
};

const sevenDaysAgo = () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

export const activityQuery = z.object({
  page: z.string().optional().transform((v) => parseIntOrDefault(v, 1)).pipe(z.number().int().min(1)).default(1),
  pageSize: z.string().optional().transform((v) => parseIntOrDefault(v, 50)).pipe(z.number().int().min(1).max(200)).default(50),
  start: z.string().optional().transform((v) => (v ? new Date(v) : sevenDaysAgo())),
  end: z.string().optional().transform((v) => (v ? new Date(v) : new Date())),
  type: z.string().optional(),
});

export const notificationsQuery = z.object({
  page: z.string().optional().transform((v) => parseIntOrDefault(v, 1)).pipe(z.number().int().min(1)).default(1),
  pageSize: z.string().optional().transform((v) => parseIntOrDefault(v, 50)).pipe(z.number().int().min(1).max(200)).default(50),
  start: z.string().optional().transform((v) => (v ? new Date(v) : sevenDaysAgo())),
  end: z.string().optional().transform((v) => (v ? new Date(v) : new Date())),
  status: z.string().optional().transform((v) => v || 'SENT'),
});

export const ordersQuery = z.object({
  page: z.string().optional().transform((v) => parseIntOrDefault(v, 1)).pipe(z.number().int().min(1)).default(1),
  pageSize: z.string().optional().transform((v) => parseIntOrDefault(v, 50)).pipe(z.number().int().min(1).max(200)).default(50),
  status: z.string().optional().transform((v) => v || 'PENDING'),
});