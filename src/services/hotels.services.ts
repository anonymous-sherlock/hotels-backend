import { db } from '../db';
import express from 'express';
import { hotelsQuerySchema } from '../validation/hotels.schema';
export const getHotels = async (req: express.Request, res: express.Response) => {
  try {
    const queryParams = hotelsQuerySchema.safeParse(req.query);
    if (!queryParams.success) {
      const defaultParams = { limit: '10', page: '1' };
      const queryString = new URLSearchParams(defaultParams).toString();
      return res.redirect(`${req.originalUrl.split('?')[0]}?${queryString}`);
    }
    const { limit, page } = queryParams.data;

    const limitValue = limit !== undefined ? parseInt(limit, 10) : 10;
    const pageValue = page !== undefined ? parseInt(page, 10) : 1;
    const skip = (pageValue - 1) * limitValue;
    const hotels = await db.hotel.findMany({
      take: limitValue,
      skip: skip,
    });

    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
