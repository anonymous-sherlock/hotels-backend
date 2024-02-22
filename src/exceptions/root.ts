import type { NextFunction, Request, Response } from 'express';

export class HttpException extends Error {
  errorCode: any;
  statusCode: number;
  errors: any;
  constructor(statusCode: number, errorCode: number, message: string, errors?: any) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCodes {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  TOKEN_BLACKLISTED = 497,
  TOKEN_EXPIRED = 498,
  INVALID_TOKEN = 499,
}

export const errorHandler = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, errorCode, message, errors } = error;
  res.status(statusCode).json({
    error: {
      code: errorCode,
      message,
      errors,
    },
  });
};
