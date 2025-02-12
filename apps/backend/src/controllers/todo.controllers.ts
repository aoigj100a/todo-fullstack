// src/controllers/todo.controllers.ts
import { Request, Response } from "express";
import { Todo } from "../models/Todo";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch todos"
    });
  }
};