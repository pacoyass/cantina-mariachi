import { z } from 'zod';

export const createDriverSchema = z.object({
  name: z.string().trim().min(2),
  phone: z.string().trim().min(7),
  deliveryZone: z.string().trim().optional(),
  vehicleDetails: z.string().trim().optional(),
  currentStatus: z.enum(['Available','On Delivery','Offline']).optional().default('Available'),
  active: z.boolean().optional().default(true),
  userId: z.string().optional(),
});

export const updateDriverSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().min(7).optional(),
  deliveryZone: z.string().trim().optional(),
  vehicleDetails: z.string().trim().optional(),
  currentStatus: z.enum(['Available','On Delivery','Offline']).optional(),
  active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' });

export const updateDriverStatusSchema = z.object({
  currentStatus: z.enum(['Available','On Delivery','Offline']),
});

export const linkDriverSchema = z.object({
  userId: z.string(),
});

export const assignmentSchema = z.object({
  orderNumber: z.string().min(5),
  driverId: z.string(),
});