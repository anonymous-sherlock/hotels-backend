import { Router } from 'express';
import { authenticateToken, login, register } from '../services/auth.services';

const authRouter: Router = Router();

authRouter.post('/sign-in', login);
authRouter.post('/sign-up', register);
authRouter.post('/session', authenticateToken);

export default authRouter;
