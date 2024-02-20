import { db } from '../db';
import express from 'express';
import { hotelSchema, hotelsQuerySchema } from '../validation/hotels.schema';
import { ZodError } from 'zod';
export const getHotels = async (req: express.Request, res: express.Response) => {
  try {
    const queryParams = hotelsQuerySchema.safeParse(req.query);
    if (!queryParams.success) {
      const defaultParams = { limit: '10', page: '1' };
      const queryString = new URLSearchParams(defaultParams).toString();
      return res.redirect(`${req.originalUrl.split('?')[0]}?${queryString}`);
    }
    const { limit, page, id, q } = queryParams.data;

    const limitValue = limit !== undefined ? parseInt(limit, 10) : 10;
    const pageValue = page !== undefined ? parseInt(page, 10) : 1;
    const skip = (pageValue - 1) * limitValue;

    const searchString = q
      ?.split(' ')
      .filter((word) => word.length > 0)
      .join(' & ');
    const hotels = await db.hotel.findMany({
      where: {
        id,
        AND: [
          {
            OR: [
              { name: { search: searchString } },
              { description: { search: searchString } },
              { address: { search: searchString } },
              {
                amenities: {
                  hasSome: [q ?? ''],
                },
              },
            ],
          },
        ],
      },

      take: limitValue,
      skip: skip,
    });

    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSingleHotel = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;

  try {
    const hotel = await db.hotel.findFirst({
      where: {
        id,
      },
    });
    if (!hotel) {
      res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const createNewHotel = async (req: express.Request, res: express.Response) => {
  try {
    const data = req.body;
    const { address, amenities, description, images, name, phone_number, rating, website } = hotelSchema.parse(data);

    const newHotel = await db.hotel.create({
      data: {
        name,
        description,
        phoneNumber: phone_number,
        images,
        rating,
        website,
        address,
        amenities,
      },
    });

    res.status(201).json({ message: 'Hotel Added Sucessfully', data: { newHotel } });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      res.status(400).json({ message: 'Validation error', errors: formattedErrors });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    }
  }
};
