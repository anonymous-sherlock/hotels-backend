import { ZodError } from 'zod';
import { ErrorCodes, HttpException } from './root';

export class ZodValidationError extends HttpException {
  constructor(errors: ZodError) {
    const formattedErrors = errors.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    super(400, ErrorCodes.VALIDATION_ERROR, 'Validation error', formattedErrors);
  }
}
