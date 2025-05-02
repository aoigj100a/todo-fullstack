// src/types/api.ts
// API 相關型別定義

/**
 * API 成功回應格式
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API 錯誤回應格式
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: number;
  details?: any;
}

/**
 * API 回應統一格式
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API 錯誤碼
 */
export enum ApiErrorCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  VALIDATION_ERROR = 422,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * 分頁請求參數
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * 分頁回應格式
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * 排序參數
 */
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * 檢索參數
 */
export interface QueryParams {
  pagination?: PaginationParams;
  sort?: SortParams;
  filters?: Record<string, any>;
  search?: string;
}
