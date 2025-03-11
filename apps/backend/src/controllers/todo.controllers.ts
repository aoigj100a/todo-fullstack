// src/controllers/todo.controllers.ts
import { Request, Response } from 'express';
import { Todo } from '../models/Todo';

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json({ success: true, data: todos });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch todos',
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
        error: 'Title is required',
      });
    }

    // 驗證 status 欄位
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status value',
        validValues: validStatuses,
      });
    }

    // 創建新的 Todo
    const todo = new Todo({
      title,
      description,
      status: status || 'pending', // 預設為 pending
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
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create todo',
    });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;
    // 檢查 id 是否存在
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Todo ID is required',
      });
    }
    // 檢查 id 格式是否有效
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format',
      });
    }

    // 檢查是否有要更新的資料
    if (!title && !description && !status && !assignedTo) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided',
      });
    }
    // 建立更新物件
    const updateData: any = {};

    // 只更新有提供的欄位
    if (title?.trim()) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status) {
      // 驗證 status 欄位
      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid status value',
          validValues: validStatuses,
        });
      }
      updateData.status = status;
    }
    // 如果狀態改為已完成，設置 completedAt
    if (status === 'completed') {
      updateData.completedAt = new Date();
    } else {
      // 如果狀態從已完成變為其他狀態，清除 completedAt
      updateData.completedAt = null;
    }

    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;

    // 使用 { new: true } 來返回更新後的文件
    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, // 確保更新時也運行驗證
    });
    // 如果找不到對應的 todo
    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }
    // 回傳更新後的資料
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update todo',
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
        error: 'Todo ID is required',
      });
    }

    // 檢查 id 格式是否有效
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid todo ID format',
      });
    }

    // 刪除指定的 todo
    const deletedTodo = await Todo.findByIdAndDelete(id);

    // 如果找不到對應的 todo
    if (!deletedTodo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found',
      });
    }

    // 回傳成功訊息
    res.json({
      success: true,
      message: 'Todo deleted successfully',
      data: deletedTodo,
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete todo',
    });
  }
};
