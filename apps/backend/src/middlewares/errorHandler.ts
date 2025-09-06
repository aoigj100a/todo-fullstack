// src/middleware/errorHandler.ts
import { AppError } from '@/utils/errors';
import { Request, Response } from 'express';

const errorHandler = (err: Error, req: Request, res: Response) => {
  // Set defaults
  let statusCode = 500;
  let message = 'Internal Server Error';
  let stack: string | undefined = undefined;

  // Handle AppError instances
  if (err instanceof AppError) {
    statusCode = err.status;
    message = err.message;
  }
  // Only show stack traces in development
  if (process.env.NODE_ENV === 'development') {
    stack = err.stack;
  }
  // Log error
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${err.name}: ${err.message}`);
    console.error(err.stack);
  }

  // Send response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(stack && { stack }),
  });
};

export default errorHandler;
