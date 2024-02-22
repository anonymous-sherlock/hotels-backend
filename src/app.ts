require('dotenv').config();
import authRouter from '@/src/routers/auth.router';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import httpErrors from 'http-errors';
import { DEFAULT_ROUTES } from './constant/routes';
import hotelsRouter from './routers/hotels.router';
import multer from 'multer';
import { errorHandler } from '@/exceptions/root';

const PORT: number | string = process.env.PORT || 5000;
const app: express.Express = express();
const server: http.Server = http.createServer(app);
const upload = multer();
// middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', async (req, res, next) => {
  res.status(200).json(DEFAULT_ROUTES);
});

app.use(upload.none());

app.use('/api/auth', authRouter);
app.use('/api/v1', hotelsRouter);
app.use('/api/hello', (req, res, next) => {
  console.log(req.body);

  return res.json(req.body);
});

// Error handling for uncaught errors and not found error
app.use((req, res, next) => {
  next(new httpErrors.NotFound());
});

app.use(errorHandler);

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
