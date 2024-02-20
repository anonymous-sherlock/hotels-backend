import { z } from 'zod';

export const hotelsQuerySchema = z.object({
  id: z.string().optional(),
  query: z.string().optional(),
  limit: z.string().regex(/^\d+$/).default('10').optional(),
  page: z.string().regex(/^\d+$/).default('1').optional(),
});

export type HotelsQuery = z.infer<typeof hotelsQuerySchema>;
