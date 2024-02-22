import { loginSchema, registerSchema } from '@/src/validation/auth.schema';
import bcrypt from 'bcrypt';
import express, { NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { db } from '../db';
import {
  Conflict,
  InvalidCredentialsError,
  InvalidTokenError,
  NotFoundUser,
  TokenBlacklistedError,
  TokenExpired,
} from '../exceptions/auth';
import { ZodValidationError } from '../exceptions/zod-validation';
import { decodeAuthToken, encodeAuthToken, getAuthUser } from '../lib/helpers/auth.helpers';

const tokenBlacklist = new Set([
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbHNxOWxmamowMDAwMmRteWdidmphOTByIiwiZW1haWwiOiJ0ZXN0QGdtYWlsLmNvbSIsImlhdCI6MTcwODYxMDY5NSwiZXhwIjoxNzA5MjE1NDk1fQ.5tuGvpTZZrMzFLTzOrXawq1QzGpklFpgOQze2Gun8PE',
]);

export const register = async (req: express.Request, res: express.Response, next: NextFunction) => {
  const body = req.body;
  try {
    const { name, email, password } = registerSchema.parse(body);
    const randomNumber = Math.floor(Math.random() * 30) + 1;
    const userImageUrl = `https://d2u8k2ocievbld.cloudfront.net/memojis/male/${randomNumber}.png`;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new Conflict('User already exists'));
    }
    const { id, ...restUserDetails } = await db.user.create({
      data: {
        name,
        email,
        password: bcrypt.hashSync(password, 12),
        image: userImageUrl,
      },
    });
    res.status(201).json({ message: 'Registration successful', data: { restUserDetails } });
  } catch (err) {
    if (err instanceof ZodError) {
      return next(new ZodValidationError(err));
    } else {
      console.error(err);
      return next(err);
    }
  }
};

export const login = async (req: express.Request, res: express.Response, next: NextFunction) => {
  try {
    const body = req.body;
    const { email, password } = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundUser();
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password || '');

    if (!user.password || !isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Generate JWT token
    const token = encodeAuthToken({ userId: user.id, email: user.email });
    res
      .cookie('auth.session-token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ message: 'Login successful', data: { email, token } });
  } catch (err) {
    if (err instanceof ZodError) {
      return next(new ZodValidationError(err));
    } else {
      return next(err);
    }
  }
};

export const authenticateSession = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token =
      req.cookies['auth.session-token'] || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token missing' });
    }

    // Check if the token is blacklisted
    if (tokenBlacklist.has(token)) throw new TokenBlacklistedError();

    const authToken = decodeAuthToken(token);
    if (!authToken) throw new InvalidTokenError();

    const user = await getAuthUser(authToken.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const expirationTimeInSeconds = authToken.exp;
    const expiration = new Date(expirationTimeInSeconds * 1000);
    req.auth = {
      user: user,
      expires: expiration,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) return next(new TokenExpired());
    if (error instanceof jwt.JsonWebTokenError) return next(new InvalidTokenError());
    return next(error);
  }
};

export const getSession = (req: express.Request, res: express.Response) => {
  res.json({ user: req.auth.user, expires: req.auth.expires });
};

export const logoutSession = (req: express.Request, res: express.Response) => {
  const token = req.cookies['auth.session-token'];
  tokenBlacklist.add(token);
  res.clearCookie('auth.session-token');
  res.status(200).json({ message: 'Logout successful' });
};
// export const googleLogin = async (req: express.Request, res: express.Response) => {
//   const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=profile email`;
//   res.redirect(url);
// };
