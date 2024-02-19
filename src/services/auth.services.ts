import { loginSchema, registerSchema } from '@/src/validation/auth.schema';
import bcrypt from 'bcrypt';
import express from 'express';
import * as jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { db } from '../db';
import { User } from '@prisma/client';

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const body = req.body;
    const { email, password } = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User Not Found' });
    }

    if (!user.password) {
      throw new Error('Invalid User Credential.');
    }

    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '1h',
    });

    res
      .cookie('auth-token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'lax',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({ message: 'Login successful', data: { email, token } });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      res.status(400).json({ message: 'Validation error', errors: formattedErrors });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  const body = req.body;
  try {
    const { name, email, password } = registerSchema.parse(body);
    const hashedPassword = await bcrypt.hash(password, 16);
    const randomNumber = Math.floor(Math.random() * 30) + 1;
    const imageUrl = `https://d2u8k2ocievbld.cloudfront.net/memojis/male/${randomNumber}.png`;
    const userImageUrl = `https://d2u8k2ocievbld.cloudfront.net/memojis/male/30.png`;
    const { id, ...restUserDetails } = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image: imageUrl,
      },
    });
    res.status(201).json({ message: 'Registration successful', data: { restUserDetails } });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      res.status(400).json({ message: 'Validation error', errors: formattedErrors });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

interface UserRequestObject extends express.Request {
  user?: User;
}

export const authenticateToken = async (req: UserRequestObject, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies['auth-token'] || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', async (err: jwt.VerifyErrors | null, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const userId = decoded.userId;

    try {
      const user = await db.user.findFirst({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};
