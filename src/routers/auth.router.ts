import { Router } from 'express';
import { authenticateSession, getSession, login, logoutSession, register } from '../services/auth.services';

const authRouter: Router = Router();

authRouter.post('/sign-up', register);
authRouter.post('/sign-in', login);
authRouter.all('/session', authenticateSession, getSession);
authRouter.all('/logout', logoutSession);
// authRouter.get('/google', googleLogin);

export default authRouter;
