// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../validators/auth.validators';
import {
  handleValidationErrors,
  rateLimitSensitiveOps,
} from '../middlewares/validation.middleware';
import {
  mongoInjectionProtection,
  xssProtection,
  sqlInjectionProtection,
  contentValidation,
  headerSecurity,
} from '../middlewares/security.middleware';
import {
  validatePasswordStrength,
  preventReusedPasswords,
  validateEmailDomain,
  preventBruteForce,
} from '../middlewares/authValidation.middleware';

const router = Router();

router.use(headerSecurity);
router.use(contentValidation);
router.use(mongoInjectionProtection);
router.use(xssProtection);
router.use(sqlInjectionProtection);

router.post(
  '/register',
  rateLimitSensitiveOps(3, 15 * 60 * 1000),
  validateEmailDomain(),
  validatePasswordStrength,
  preventReusedPasswords,
  registerValidation,
  handleValidationErrors,
  register
);

router.post(
  '/login',
  rateLimitSensitiveOps(5, 15 * 60 * 1000),
  preventBruteForce(),
  loginValidation,
  handleValidationErrors,
  login
);

export default router;
