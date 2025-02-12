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

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 檢查 id 是否存在
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Todo ID is required",
      });
    }

    // 檢查 id 格式是否有效
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: "Invalid todo ID format",
      });
    }

    // 刪除指定的 todo
    const deletedTodo = await Todo.findByIdAndDelete(id);

    // 如果找不到對應的 todo
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    // 回傳成功訊息
    res.json({
      success: true,
      message: "Todo deleted successfully",
      data: deletedTodo,
    });

  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete todo",
    });
  }
};