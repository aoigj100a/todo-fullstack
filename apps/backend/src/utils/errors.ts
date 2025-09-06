// src/utils/errors.ts

// 定義錯誤代碼列舉
/* eslint-disable no-unused-vars */
export enum ErrorCode {
  // 資料相關錯誤 (1xx)
  INVALID = 100, // 無效的資料
  NOT_FOUND = 101, // 找不到資料
  DUPLICATE = 102, // 重複的資料
  VALIDATION = 103, // 驗證失敗

  // 認證相關錯誤 (2xx)
  AUTH_FAILED = 200, // 認證失敗
  TOKEN_EXPIRED = 201, // Token 過期
  TOKEN_INVALID = 202, // 無效的 Token

  // 權限相關錯誤 (3xx)
  PERMISSION = 300, // 權限不足
  FORBIDDEN = 301, // 禁止訪問

  // 資料庫相關錯誤 (4xx)
  DATABASE = 400, // 資料庫操作錯誤
  QUERY_FAILED = 401, // 查詢失敗

  // 系統相關錯誤 (5xx)
  SYSTEM = 500, // 系統錯誤
  NETWORK = 501, // 網路錯誤
  TIMEOUT = 502, // 超時錯誤
}
/* eslint-enable no-unused-vars */

// 定義錯誤回應介面
export interface IErrorResponse {
  code: ErrorCode;
  message: string;
  status: number;
  details?: Record<string, unknown>;
  timestamp: string;
}

// 自定義應用程式錯誤類別
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: Record<string, unknown>;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode,
    status: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // 確保 Error.captureStackTrace 存在才調用
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // 將錯誤轉換為標準格式的回應
  public toResponse(): IErrorResponse {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

// 錯誤處理中間件
import { Request, Response } from 'express';

export const errorHandler = (err: Error | AppError, req: Request, res: Response) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // 如果是自定義的 AppError
  if (err instanceof AppError) {
    const response = err.toResponse();
    res.status(response.status).json(response);
    return;
  }

  // 處理 MongoDB 驗證錯誤
  if (err.name === 'ValidationError') {
    const appError = new AppError('Validation Failed', ErrorCode.VALIDATION, 400, err);
    res.status(appError.status).json(appError.toResponse());
    return;
  }

  // 其他未處理的錯誤
  const appError = new AppError(
    'Internal Server Error',
    ErrorCode.SYSTEM,
    500,
    process.env.NODE_ENV === 'development' ? err : undefined
  );
  res.status(appError.status).json(appError.toResponse());
};

// 使用範例：
/*
throw new AppError(
  '找不到該筆資料',
  ErrorCode.NOT_FOUND,
  404,
  { id: requestedId }
);

throw new AppError(
  '無效的驗證碼',
  ErrorCode.VALIDATION,
  400,
  { field: 'verificationCode' }
);
*/
