import { Router } from 'express';
import { getHotels } from '../services/hotels.services';

const hotelsRouter: Router = Router();

hotelsRouter.get('/hotels', getHotels);

export default hotelsRouter;
