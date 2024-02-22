import { User } from '@prisma/client';
import type { Request as ExpressRequest } from 'express';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
}

export interface AuthJwtPayload {
  userId: string;
  email: string;
}

export interface AuthJwtPayloadResponse extends AuthJwtPayload {
  iat: number;
  exp: number;
}
