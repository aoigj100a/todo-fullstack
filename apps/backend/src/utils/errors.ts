export type ErrorType = 
  | 'VALIDATION'
  | 'DATABASE'
  | 'NOT_FOUND'
  | 'FORBIDDEN'
  | 'UNAUTHORIZED'
  | 'INTERNAL';

export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}