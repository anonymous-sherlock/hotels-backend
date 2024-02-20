import { z } from 'zod';

export const hotelsQuerySchema = z.object({
  id: z.string().optional(),
  q: z.string().optional(),
  limit: z.string().regex(/^\d+$/).default('10').optional(),
  page: z.string().regex(/^\d+$/).default('1').optional(),
});

export const hotelSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  address: z.string(),
  phone_number: z.string(),
  website: z.string().optional(),
  images: z.array(z.string()),
  rating: z.number().nullable(),
  amenities: z.array(z.string()),
});

export type HotelsQuery = z.infer<typeof hotelsQuerySchema>;
export type HotelSchema = z.infer<typeof hotelSchema>;
