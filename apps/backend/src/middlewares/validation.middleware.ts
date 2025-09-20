import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { createError } from '../utils/errors';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((error: ValidationError) => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg,
      value: error.type === 'field' ? error.value : undefined,
    }));

    return res.status(400).json(
      createError('Validation failed', {
        details: validationErrors,
        type: 'VALIDATION_ERROR',
      })
    );
  }

  next();
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> => {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = value
          .trim()
          .replace(/[<>]/g, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+=/gi, '');
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  };

  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query as Record<string, unknown>) as Record<string, string>;
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params) as Record<string, string>;
  }

  next();
};

export const rateLimitSensitiveOps = (
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const clientAttempts = attempts.get(clientId);

    if (clientAttempts) {
      if (now > clientAttempts.resetTime) {
        attempts.set(clientId, { count: 1, resetTime: now + windowMs });
      } else if (clientAttempts.count >= maxAttempts) {
        return res.status(429).json(
          createError('Too many attempts. Please try again later.', {
            type: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((clientAttempts.resetTime - now) / 1000),
          })
        );
      } else {
        clientAttempts.count++;
      }
    } else {
      attempts.set(clientId, { count: 1, resetTime: now + windowMs });
    }

    next();
  };
};
