import { Request, Response, NextFunction } from "express";
import { Todo, ITodoDocument } from "../models/Todo";
import { AppError } from '../utils/errors';
import { Error as MongooseError } from 'mongoose';

class TodoController {
  // 取得所有 Todo
  async getTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const todos = await Todo.find()
        .sort({ createdAt: -1 })
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .exec();

      res.json({
        success: true,
        data: todos
      });
    } catch (error) {
      next(new AppError(
        'Failed to fetch todos', 
        'DATABASE', 
        500, 
        error instanceof Error ? error.message : 'Unknown error'
      ));
    }
  }

  // 建立新的 Todo
  async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, assignedTo } = req.body;
      
      // 驗證輸入
      if (!title?.trim()) {
        throw new AppError('Title is required', 'VALIDATION', 400);
      }

      // 建立新 Todo
      const todo = new Todo({
        title,
        description,
        assignedTo,
        createdBy: req.user?._id,
        status: 'pending'
      });

      const savedTodo = await todo.save();
      
      // 回傳已儲存的 todo，並帶入關聯資料
      const populatedTodo = await Todo.findById(savedTodo._id)
        .populate("assignedTo", "name email")
        .populate("createdBy", "name email")
        .exec();

      res.status(201).json({
        success: true,
        data: populatedTodo
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else if (error instanceof MongooseError.ValidationError) {
        next(new AppError(
          'Validation failed',
          'VALIDATION',
          400,
          error.errors
        ));
      } else {
        next(new AppError(
          'Failed to create todo',
          'DATABASE',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        ));
      }
    }
  }

  // 更新 Todo
  async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const todo = await Todo.findById(id).exec();
      
      if (!todo) {
        throw new AppError('Todo not found', 'NOT_FOUND', 404);
      }

      // 檢查權限
      const createdById = todo.get('createdBy');
      if (createdById.toString() !== req.user?._id) {
        throw new AppError('Permission denied', 'FORBIDDEN', 403);
      }

      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { $set: updates },
        { 
          new: true,
          runValidators: true
        }
      )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .exec();

      res.json({
        success: true,
        data: updatedTodo
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else if (error instanceof MongooseError.ValidationError) {
        next(new AppError(
          'Validation failed',
          'VALIDATION',
          400,
          error.errors
        ));
      } else {
        next(new AppError(
          'Failed to update todo',
          'DATABASE',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        ));
      }
    }
  }

  // 刪除 Todo
  async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const todo = await Todo.findById(id).exec();
      
      if (!todo) {
        throw new AppError('Todo not found', 'NOT_FOUND', 404);
      }

      // 檢查權限
      const createdById = todo.get('createdBy');
      if (createdById.toString() !== req.user?._id) {
        throw new AppError('Permission denied', 'FORBIDDEN', 403);
      }

      await todo.deleteOne();

      res.json({
        success: true,
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new AppError(
          'Failed to delete todo',
          'DATABASE',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        ));
      }
    }
  }
}

// 創建並匯出控制器實例
export const todoController = new TodoController();