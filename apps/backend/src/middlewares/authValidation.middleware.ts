import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { createError } from '../utils/errors';
import bcrypt from 'bcryptjs';

export const validatePasswordStrength = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return next();
  }

  const strengthChecks = {
    minLength: password.length >= 8,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&]/.test(password),
    maxLength: password.length <= 128,
  };

  const failedChecks = Object.entries(strengthChecks)
    .filter(([, passed]) => !passed)
    .map(([check]) => check);

  if (failedChecks.length > 0) {
    const messages = {
      minLength: 'Password must be at least 8 characters long',
      maxLength: 'Password must not exceed 128 characters',
      hasLower: 'Password must contain at least one lowercase letter',
      hasUpper: 'Password must contain at least one uppercase letter',
      hasNumber: 'Password must contain at least one number',
      hasSpecial: 'Password must contain at least one special character (@$!%*?&)',
    };

    return res.status(400).json(
      createError('Password does not meet requirements', {
        type: 'WEAK_PASSWORD',
        details: failedChecks.map(check => messages[check as keyof typeof messages]),
      })
    );
  }

  next();
};

export const preventReusedPasswords = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next();
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (user) {
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).json(
          createError('Please choose a different password', {
            type: 'PASSWORD_REUSED',
          })
        );
      }
    }
    next();
  } catch (error) {
    next();
  }
};

export const validateEmailDomain = (allowedDomains?: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next();
    }

    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
      return res.status(400).json(
        createError('Invalid email format', {
          type: 'INVALID_EMAIL_DOMAIN',
        })
      );
    }

    const suspiciousDomains = [
      'tempmail.org',
      '10minutemail.com',
      'guerrillamail.com',
      'throwaway.email',
    ];

    if (suspiciousDomains.includes(domain)) {
      return res.status(400).json(
        createError('Temporary email addresses are not allowed', {
          type: 'DISPOSABLE_EMAIL',
        })
      );
    }

    if (allowedDomains && !allowedDomains.includes(domain)) {
      return res.status(400).json(
        createError(
          `Only emails from allowed domains are permitted: ${allowedDomains.join(', ')}`,
          {
            type: 'DOMAIN_NOT_ALLOWED',
          }
        )
      );
    }

    next();
  };
};

export const preventBruteForce = () => {
  const loginAttempts = new Map<
    string,
    { attempts: number; lastAttempt: number; blocked: boolean }
  >();
  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes

  return (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const clientIP = req.ip;
    const key = `${email}:${clientIP}`;
    const now = Date.now();

    const record = loginAttempts.get(key);

    if (record) {
      // Check if the block period has expired
      if (record.blocked && now - record.lastAttempt > BLOCK_DURATION) {
        loginAttempts.delete(key);
      } else if (record.blocked) {
        const remainingTime = Math.ceil((BLOCK_DURATION - (now - record.lastAttempt)) / 1000 / 60);
        return res.status(429).json(
          createError(
            `Account temporarily locked due to multiple failed attempts. Try again in ${remainingTime} minutes.`,
            {
              type: 'ACCOUNT_LOCKED',
              retryAfter: remainingTime * 60,
            }
          )
        );
      }

      // Reset attempts if outside the window
      if (now - record.lastAttempt > WINDOW_SIZE) {
        loginAttempts.set(key, { attempts: 1, lastAttempt: now, blocked: false });
      }
    } else {
      loginAttempts.set(key, { attempts: 1, lastAttempt: now, blocked: false });
    }

    // Add method to track failed attempts
    res.locals.trackFailedLogin = () => {
      const currentRecord = loginAttempts.get(key);
      if (currentRecord) {
        currentRecord.attempts++;
        currentRecord.lastAttempt = now;
        if (currentRecord.attempts >= MAX_ATTEMPTS) {
          currentRecord.blocked = true;
        }
        loginAttempts.set(key, currentRecord);
      }
    };

    // Add method to clear attempts on successful login
    res.locals.clearLoginAttempts = () => {
      loginAttempts.delete(key);
    };

    next();
  };
};
