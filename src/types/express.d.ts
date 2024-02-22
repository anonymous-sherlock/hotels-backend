import { AuthUser } from './auth';

declare global {
  namespace Express {
    interface Request {
      auth: {
        user?: AuthUser;
        expires: Date;
      };
    }
  }
}
