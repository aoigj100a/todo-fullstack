import { Router } from "express";
import { getTodos, createTodo } from "../controllers/todo.controllers";

const router = Router();

router.get('/', getTodos);
router.post('/', createTodo);

export default router;
