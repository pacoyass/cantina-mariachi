import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().trim().min(7, 'Phone must be at least 7 digits').optional(),
}).refine((data) => data.name !== undefined || data.phone !== undefined, {
  message: 'At least one field (name or phone) must be provided',
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[@#$%^&*!]/, { message: 'Password must contain at least one special character (@#$%^&*!)' }),
});