import { Request, Response, NextFunction } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { createError } from '../utils/errors';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const mongoInjectionProtection = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Potential MongoDB injection attempt from ${req.ip}: ${key}`);
  },
});

export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      const sanitized = purify.sanitize(value, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });

      if (sanitized !== value && sanitized.length < value.length) {
        console.warn(`XSS attempt detected from ${req.ip}: ${value}`);
      }

      return sanitized;
    }

    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }

    if (value && typeof value === 'object') {
      const sanitizedObj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        sanitizedObj[key] = sanitizeValue(val);
      }
      return sanitizedObj;
    }

    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query) as Record<string, string>;
  }

  if (req.params) {
    req.params = sanitizeValue(req.params) as Record<string, string>;
  }

  next();
};

export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const sqlKeywords = [
    'SELECT',
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'CREATE',
    'ALTER',
    'EXEC',
    'UNION',
    'ORDER BY',
    'GROUP BY',
    'HAVING',
    'SCRIPT',
    'javascript:',
    'vbscript:',
    'onload',
    'onerror',
    'onclick',
  ];

  const checkForSqlInjection = (value: string): boolean => {
    const upperValue = value.toUpperCase();
    return sqlKeywords.some(
      keyword =>
        upperValue.includes(keyword) &&
        (upperValue.includes("'") || upperValue.includes('"') || upperValue.includes(';'))
    );
  };

  const validateValue = (value: unknown, path: string = ''): void => {
    if (typeof value === 'string') {
      if (checkForSqlInjection(value)) {
        console.warn(`Potential SQL injection attempt from ${req.ip} at ${path}: ${value}`);
        throw new Error('Invalid input detected');
      }
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => validateValue(item, `${path}[${index}]`));
    } else if (value && typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([key, val]) =>
        validateValue(val, path ? `${path}.${key}` : key)
      );
    }
  };

  try {
    validateValue(req.body, 'body');
    validateValue(req.query, 'query');
    validateValue(req.params, 'params');
    next();
  } catch (error) {
    res.status(400).json(
      createError('Invalid input detected', {
        type: 'SECURITY_VIOLATION',
      })
    );
  }
};

export const headerSecurity = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  res.removeHeader('X-Powered-By');

  next();
};

export const contentValidation = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.get('Content-Type');

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json(
        createError('Unsupported Media Type. Content-Type must be application/json', {
          type: 'INVALID_CONTENT_TYPE',
        })
      );
    }

    const contentLength = req.get('Content-Length');
    if (contentLength && parseInt(contentLength) > 1024 * 1024) {
      // 1MB limit
      return res.status(413).json(
        createError('Payload too large. Maximum size is 1MB', {
          type: 'PAYLOAD_TOO_LARGE',
        })
      );
    }
  }

  next();
};
