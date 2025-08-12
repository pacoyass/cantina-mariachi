
import { z } from 'zod';



export const paginationQuery = z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
  });