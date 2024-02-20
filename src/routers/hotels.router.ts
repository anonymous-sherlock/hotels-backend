import { Router } from 'express';
import { getHotels, getSingleHotel } from '../services/hotels.services';

const hotelsRouter: Router = Router();

hotelsRouter.get('/hotels', getHotels);
hotelsRouter.get('/hotels/:id', getSingleHotel);

export default hotelsRouter;
