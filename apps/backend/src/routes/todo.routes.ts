import { Router } from 'express';
import { getTodos, createTodo, deleteTodo, updateTodo } from '../controllers/todo.controllers';

const router = Router();

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
