# Todo 全端專案 API 設計文檔

## 基本資訊

- **基礎 URL**: `http://localhost:5001/api`
- **內容類型**: `application/json`
- **認證方式**: JWT Bearer Token

## 認證 API

### 1. 登入

用於使用者登入並獲取認證令牌。

- **路徑**: `/auth/login`
- **方法**: `POST`
- **請求體**:

  ```json
  {
    "email": "demo@example.com",
    "password": "demo1234"
  }
  ```

- **成功回應** (200):

  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "demo@example.com",
      "name": "Demo User"
    }
  }
  ```

- **錯誤回應** (401):

  ```json
  {
    "success": false,
    "error": "Invalid credentials"
  }
  ```

### 2. 註冊

用於建立新使用者帳號。

- **路徑**: `/auth/register`
- **方法**: `POST`
- **請求體**:

  ```json
  {
    "name": "New User",
    "email": "user@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- **成功回應** (201):

  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "New User"
    }
  }
  ```

- **錯誤回應** (400):

  ```json
  {
    "success": false,
    "error": "Email already registered"
  }
  ```

## Todo API

### 1. 獲取所有待辦事項

獲取用戶的所有待辦事項。

- **路徑**: `/todos`
- **方法**: `GET`
- **認證**: 需要 Bearer Token
- **查詢參數** (可選):
  - `status`: 根據狀態過濾 (`pending`, `in-progress`, `completed`)
  - `search`: 搜尋標題或描述
- **成功回應** (200):

  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "todo_id_1",
        "title": "Complete API documentation",
        "description": "Create detailed API docs for the project",
        "status": "in-progress",
        "assignedTo": "Jenny",
        "createdAt": "2023-03-15T10:30:00.000Z",
        "updatedAt": "2023-03-16T14:20:00.000Z"
      },
      {
        "_id": "todo_id_2",
        "title": "Fix login issues",
        "description": "Address reported login problems",
        "status": "pending",
        "assignedTo": "Jenny",
        "createdAt": "2023-03-14T09:15:00.000Z",
        "updatedAt": "2023-03-14T09:15:00.000Z"
      }
    ]
  }
  ```

- **錯誤回應** (500):

  ```json
  {
    "success": false,
    "error": "Failed to fetch todos"
  }
  ```

### 2. 建立待辦事項

建立新的待辦事項。

- **路徑**: `/todos`
- **方法**: `POST`
- **認證**: 需要 Bearer Token
- **請求體**:

  ```json
  {
    "title": "Review code",
    "description": "Review pull request #42",
    "status": "pending",
    "assignedTo": "Jenny"
  }
  ```

- **成功回應** (201):

  ```json
  {
    "success": true,
    "data": {
      "_id": "new_todo_id",
      "title": "Review code",
      "description": "Review pull request #42",
      "status": "pending",
      "assignedTo": "Jenny",
      "createdAt": "2023-03-17T11:00:00.000Z",
      "updatedAt": "2023-03-17T11:00:00.000Z"
    }
  }
  ```

- **錯誤回應** (400):

  ```json
  {
    "success": false,
    "error": "Title is required"
  }
  ```

### 3. 更新待辦事項

更新現有待辦事項的資訊。

- **路徑**: `/todos/:id`
- **方法**: `PUT`
- **認證**: 需要 Bearer Token
- **URL 參數**:
  - `id`: 待辦事項 ID
- **請求體** (只需包含要更新的欄位):

  ```json
  {
    "title": "Updated title",
    "status": "completed",
    "description": "Updated description"
  }
  ```

- **成功回應** (200):

  ```json
  {
    "success": true,
    "message": "Todo updated successfully",
    "data": {
      "_id": "todo_id",
      "title": "Updated title",
      "description": "Updated description",
      "status": "completed",
      "assignedTo": "Jenny",
      "createdAt": "2023-03-15T10:30:00.000Z",
      "updatedAt": "2023-03-17T15:45:00.000Z"
    }
  }
  ```

- **錯誤回應** (404):

  ```json
  {
    "success": false,
    "error": "Todo not found"
  }
  ```

### 4. 刪除待辦事項

刪除指定的待辦事項。

- **路徑**: `/todos/:id`
- **方法**: `DELETE`
- **認證**: 需要 Bearer Token
- **URL 參數**:
  - `id`: 待辦事項 ID
- **成功回應** (200):

  ```json
  {
    "success": true,
    "message": "Todo deleted successfully",
    "data": {
      "_id": "deleted_todo_id",
      "title": "Deleted todo"
    }
  }
  ```

- **錯誤回應** (404):

  ```json
  {
    "success": false,
    "error": "Todo not found"
  }
  ```

## 系統 API

### 1. 健康檢查

檢查 API 服務狀態。

- **路徑**: `/health`
- **方法**: `GET`
- **認證**: 不需要
- **成功回應** (200):

  ```json
  {
    "status": "ok",
    "timestamp": "2023-03-17T16:00:00.000Z",
    "uptime": 3600
  }
  ```

## 錯誤處理

### 錯誤回應格式

所有的錯誤回應都遵循統一的格式：

```json
{
  "success": false,
  "error": "錯誤訊息",
  "code": 錯誤代碼,
  "details": {
    // 額外詳細資訊 (可選)
  }
}
```

### 常見錯誤代碼

- `400` - 錯誤的請求（如缺少必填欄位、格式錯誤）
- `401` - 未授權（如缺少或無效的令牌）
- `403` - 禁止訪問（如權限不足）
- `404` - 找不到資源
- `500` - 伺服器內部錯誤

## 資料模型

### Todo 模型

```typescript
{
  _id: string;          // MongoDB ID
  title: string;        // 標題 (必填)
  description: string;  // 描述 (選填)
  status: string;       // 狀態: "pending", "in-progress", "completed"
  assignedTo: string;   // 指派給誰 
  createdAt: Date;      // 建立時間
  updatedAt: Date;      // 最後更新時間
}
```

### User 模型

```typescript
{
  _id: string;          // MongoDB ID
  name: string;         // 用戶名稱
  email: string;        // 電子郵件 (唯一)
  password: string;     // 加密密碼 (不會回傳給客戶端)
  createdAt: Date;      // 建立時間
  updatedAt: Date;      // 最後更新時間
}
```

## 認證與授權

### JWT 格式

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "user_id",
    "email": "user@example.com",
    "iat": 1615989000,
    "exp": 1616075400
  }
}
```

### 請求授權

對於需要授權的 API 端點，客戶端需要在請求標頭中添加：

```
Authorization: Bearer <token>
```

## 開發注意事項

1. **CORS 設定**：API 預設允許來自 `http://localhost:3000` 的請求

2. **環境變數**：
   - `PORT`: 伺服器端口（預設 5001）
   - `MONGO_URI`: MongoDB 連接字串
   - `JWT_SECRET`: JWT 加密密鑰
   - `JWT_EXPIRES_IN`: JWT 有效期（預設 24h）

3. **測試帳號**：
   - 電子郵件: `demo@example.com`
   - 密碼: `demo1234`

4. **錯誤處理**：
   - 使用 `try-catch` 捕獲並處理所有可能的錯誤
   - 返回適當的 HTTP 狀態碼和錯誤訊息

5. **請求速率限制**：
   - 尚未實現，計劃在未來版本中加入

## API 路由摘要

| 方法 | 路徑 | 描述 | 認證 |
|------|------|------|------|
| POST | /api/auth/login | 使用者登入 | 否 |
| POST | /api/auth/register | 使用者註冊 | 否 |
| GET | /api/todos | 獲取所有待辦事項 | 是 |
| POST | /api/todos | 建立待辦事項 | 是 |
| PUT | /api/todos/:id | 更新待辦事項 | 是 |
| DELETE | /api/todos/:id | 刪除待辦事項 | 是 |
| GET | /api/health | 健康檢查 | 否 |
