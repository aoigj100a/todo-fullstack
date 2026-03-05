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

const router = Router();

router.use(headerSecurity);
router.use(contentValidation);
router.use(mongoInjectionProtection);
router.use(xssProtection);
router.use(sqlInjectionProtection);

router.get('/', getTodosValidation, handleValidationErrors, getTodos);

router.post(
  '/',
  rateLimitSensitiveOps(20, 5 * 60 * 1000),
  createTodoValidation,
  handleValidationErrors,
  createTodo
);

router.put('/:id', updateTodoValidation, handleValidationErrors, updateTodo);

router.delete(
  '/:id',
  rateLimitSensitiveOps(10, 5 * 60 * 1000),
  deleteTodoValidation,
  handleValidationErrors,
  deleteTodo
);

export default router;
