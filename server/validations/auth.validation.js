import { z } from 'zod';

// Registration Schema
export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/\d/, { message: 'Password must contain at least one number' })
    .regex(/[@#$%^&*!]/, { message: 'Password must contain at least one special character (@#$%^&*!)' }),
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }),
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Invalid email format' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Pagination Query Schema
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1).default(1)),
  pageSize: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20))
    .pipe(z.number().int().min(1).max(100).default(20)),
});