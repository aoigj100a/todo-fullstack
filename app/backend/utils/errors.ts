// src/utils/errors.ts

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
    //   Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export const createError = (message: string, statusCode: number) => {
    return new AppError(message, statusCode);
  };
  
  // HTTP Status codes mapping
  export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
  } as const;