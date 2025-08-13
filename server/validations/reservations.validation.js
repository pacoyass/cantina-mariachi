import { z } from 'zod';

export const reservationStatusEnum = z.enum(['PENDING','CONFIRMED','SEATED','COMPLETED','CANCELLED']);

export const createReservationSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(7),
  date: z.string().transform((v)=> new Date(v)),
  time: z.string().trim().min(3),
  partySize: z.number().int().min(1).max(20),
  notes: z.string().optional(),
});

export const updateReservationStatusSchema = z.object({
  status: reservationStatusEnum,
});

export const availabilityQuerySchema = z.object({
  date: z.string().transform((v)=> new Date(v)),
  time: z.string().trim().optional(),
});