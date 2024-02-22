import { db } from '@/src/db';
import { AuthJwtPayload, AuthUser, AuthJwtPayloadResponse } from '@/types/auth';
import * as jwt from 'jsonwebtoken';

export const encodeAuthToken = (payload: AuthJwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};
export const decodeAuthToken = (token: string): AuthJwtPayloadResponse | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return decoded as AuthJwtPayloadResponse;
  } catch (error) {
    throw error;
  }
};

export const getAuthUser = async (userId: string, email?: String): Promise<AuthUser | null> => {
  try {
    const user: AuthUser | null = await db.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Error fetching authenticated user:', error);
    return null;
  }
};
