import { Router } from 'express';
import { getTodos, createTodo, deleteTodo, updateTodo } from '../controllers/todo.controllers';
import {
  createTodoValidation,
  updateTodoValidation,
  deleteTodoValidation,
  getTodosValidation,
} from '../validators/todo.validators';
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
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(headerSecurity);
router.use(contentValidation);
router.use(mongoInjectionProtection);
router.use(xssProtection);
router.use(sqlInjectionProtection);

router.get('/', protect, getTodosValidation, handleValidationErrors, getTodos);

router.post(
  '/',
  protect,
  rateLimitSensitiveOps(20, 5 * 60 * 1000),
  createTodoValidation,
  handleValidationErrors,
  createTodo
);

router.put('/:id', protect, updateTodoValidation, handleValidationErrors, updateTodo);

router.delete(
  '/:id',
  protect,
  rateLimitSensitiveOps(10, 5 * 60 * 1000),
  deleteTodoValidation,
  handleValidationErrors,
  deleteTodo
);

export default router;
