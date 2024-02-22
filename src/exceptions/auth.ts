import { ErrorCodes, HttpException } from './root';

export class Unauthorized extends HttpException {
  constructor() {
    super(401, ErrorCodes.UNAUTHORIZED, 'Unauthorized', undefined);
  }
}

export class Forbidden extends HttpException {
  constructor() {
    super(403, ErrorCodes.FORBIDDEN, 'Forbidden', undefined);
  }
}

export class Conflict extends HttpException {
  constructor(message: string) {
    super(409, ErrorCodes.USER_ALREADY_EXISTS, message, undefined);
  }
}

export class NotFoundUser extends HttpException {
  constructor() {
    super(404, ErrorCodes.USER_NOT_FOUND, 'User not found', undefined);
  }
}

export class InvalidCredentialsError extends HttpException {
  constructor() {
    super(401, ErrorCodes.INCORRECT_PASSWORD, 'Invalid email or password', undefined);
  }
}
export class InvalidTokenError extends HttpException {
  constructor() {
    super(401, ErrorCodes.INVALID_TOKEN, 'Invalid token provided', undefined);
  }
}

export class TokenExpired extends HttpException {
  constructor() {
    super(403, ErrorCodes.TOKEN_EXPIRED, 'Token expired', undefined);
  }
}

export class TokenBlacklistedError extends HttpException {
  constructor() {
    super(403, ErrorCodes.TOKEN_BLACKLISTED, 'Token has been blacklisted', undefined);
  }
}
