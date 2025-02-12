import { Router } from 'express';
import { getTodos } from '../controllers/todo.controllers';

const router = Router();

router.get('/', getTodos);

export default router;