# Backend Security Mechanisms

## Overview

The backend implements multiple security layers to protect against common web vulnerabilities and attacks. All security features are automatically enabled and require no additional configuration.

主要內容：

- 認證安全：密碼要求、暴力破解防護、電子郵件驗證
- 速率限制：IP 限制、敏感操作保護
- 輸入驗證：XSS 防護、資料清理、格式驗證
- 錯誤處理：統一回應格式、錯誤分類
- 安全標頭：CORS 設定、環境保護

開發者參考：

- 各機制的實作檔案位置
- 錯誤回應格式範例
- 開發環境的限制繞過方法
- 中間件執行順序

## Authentication Security

### Password Requirements

- Minimum 8 characters, maximum 128 characters
- Must contain: lowercase letter, uppercase letter, number, special character (@$!%\*?&)
- Password reuse prevention - users cannot reuse their current password
- Email domain validation with disposable email blocking

### Brute Force Protection

- Maximum 5 failed login attempts per email+IP combination
- 15-minute lockout period after exceeding limit
- Automatic tracking of failed attempts
- Lockout cleared on successful login

Implementation: `authValidation.middleware.ts:preventBruteForce()`

## Rate Limiting

### General Rate Limiting

- 5 requests per 15-minute window per IP address
- Applies to sensitive operations (registration, password reset)
- Returns `429` status with retry-after header

Implementation: `validation.middleware.ts:rateLimitSensitiveOps()`

### Response Format

```json
{
  "success": false,
  "error": "Too many attempts. Please try again later.",
  "type": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 650
}
```

## Input Validation & Sanitization

### Request Sanitization

- XSS protection: strips `<>` characters and javascript: URLs
- Event handler removal: removes `on*=` attributes
- Recursive object sanitization for nested data
- Applied to body, query, and URL parameters

### Validation Rules

- Email format validation and normalization
- MongoDB ObjectId validation for IDs
- String length limits and character restrictions
- Date format validation with past-date checks

Implementation: `validation.middleware.ts:sanitizeInput()`

## Error Handling

### Centralized Error Processing

- Structured error responses with consistent format
- Development vs production error detail levels
- Error code categorization (1xx-5xx ranges)
- Request logging and error tracking

### Error Response Structure

```json
{
  "success": false,
  "error": "Error message",
  "type": "ERROR_TYPE",
  "details": {...}
}
```

## Security Headers & CORS

### CORS Configuration

- Restricted origin to frontend URL only
- Credentials support enabled
- Limited HTTP methods: GET, POST, PUT, DELETE
- Specific allowed headers: Content-Type, Authorization

### Environment-Based Security

- JWT secret validation
- Database connection string protection
- Debug information limited to development mode

## Development Notes

### Bypassing Limits (Development Only)

Restart the backend server to clear in-memory rate limiting:

```bash
pkill -f "node dist/server.js"
pnpm --filter backend dev
```

### Security Middleware Chain

1. CORS validation
2. Input sanitization
3. Request validation
4. Rate limiting check
5. Authentication verification
6. Route handling
7. Centralized error handling

All security mechanisms are implemented as Express middleware and automatically applied to relevant routes.
