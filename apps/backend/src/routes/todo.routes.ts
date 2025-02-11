import { Router } from 'express';
import { todoController } from '../controllers/todo.controller';

const router = Router();

// 基本的 CRUD 路由
router.route('/')
  .get(todoController.getTodos.bind(todoController))
  .post(todoController.createTodo.bind(todoController));

router.route('/:id')
  .put(todoController.updateTodo.bind(todoController))
  .delete(todoController.deleteTodo.bind(todoController));

export default router;