import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

// 擴展 Express 的 Request 型別來包含使用者資訊
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        name: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // 暫時移除認證需求，讓開發更順暢
    // 模擬一個測試用戶
    req.user = {
      _id: '507f1f77bcf86cd799439011', // 測試用的 MongoDB ObjectId
      email: 'test@example.com',
      name: 'Test User'
    };
    
    next();
  } catch (error) {
    next(new AppError('Authentication failed', 'UNAUTHORIZED', 401));
  }
};