import { z } from 'zod';

export const registerWebhookSchema = z.object({
  url: z.string().url(),
  status: z.enum(['ACTIVE','DISABLED']).optional().default('ACTIVE'),
  integrationId: z.string().optional(),
  details: z.any().optional().default({}),
});

export const webhookIdParam = z.object({ id: z.string() });

export const triggerSchema = z.object({
  event: z.string().trim().min(2),
  payload: z.any().optional().default({}),
});