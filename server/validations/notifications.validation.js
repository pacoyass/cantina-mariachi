import { z } from 'zod';

export const notificationTypeEnum = z.enum(['EMAIL','SMS','PUSH','WEBHOOK']);

export const dispatchNotificationSchema = z.object({
  type: notificationTypeEnum,
  target: z.string().trim().min(3),
  content: z.string().trim().min(1),
  provider: z.string().trim().optional(),
});