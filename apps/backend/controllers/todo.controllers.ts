import { Request, Response } from "express";
import { Todo } from "../models/Todo";

// 取得所有 Todo
export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (error) {
    console.log("Error in get todos", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch todos" 
    });
  }
};

// 建立新的 Todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    // 建立新 Todo 文件
    const todo = new Todo({
      title,
      description,
      completed: false,
    });

    // 存檔到資料庫
    const savedTodo = await todo.save();

    res.status(201).json({
      success: true,
      data: savedTodo,
    });
  } catch (error) {
    console.log("Error in create todo:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors,
      });
    }
    res.status(500).json({ success: false, error: "Failed to create todo" });
  }
};
