// src/controllers/todo.controllers.ts
import { Request, Response } from "express";
import { Todo } from "../models/Todo";
// import { AppError, ErrorCode } from "../utils/errors";

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch todos",
    });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, status, assignedTo } = req.body;

    // 驗證必要欄位
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    // 驗證 status 欄位
    const validStatuses = ["pending", "in-progress", "completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value",
        validValues: validStatuses,
      });
    }

    // 創建新的 Todo
    const todo = new Todo({
      title,
      description,
      status: status || "pending", // 預設為 pending
      assignedTo,
    });

    // 儲存到資料庫
    await todo.save();

    // 回傳成功結果
    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create todo",
    });
  }
};
