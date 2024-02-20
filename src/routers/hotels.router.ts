import { Router } from 'express';
import { createNewHotel, getHotels, getSingleHotel } from '../services/hotels.services';

const hotelsRouter: Router = Router();

hotelsRouter.get('/hotels', getHotels);
hotelsRouter.get('/hotels/:id', getSingleHotel);
hotelsRouter.post('/hotels', createNewHotel);

export default hotelsRouter;
