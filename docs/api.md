# Todo Full Stack Application - API 文件

## 基本資訊

- **基礎 URL**: `http://localhost:4000/api`
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

- **特別說明**: 支援測試帳號，可直接使用 demo@example.com / demo1234 登入

### 2. 註冊

用於建立新使用者帳號。

- **路徑**: `/auth/register`
- **方法**: `POST`
- **請求體**:

  ```json
  {
    "name": "New User",
    "email": "user@example.com",
    "password": "password123"
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

獲取使用者的所有待辦事項。

- **路徑**: `/todos`
- **方法**: `GET`
- **認證**: 需要 Bearer Token（可選，取決於後端設定）
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
- **認證**: 需要 Bearer Token（可選，取決於後端設定）
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
- **認證**: 需要 Bearer Token（可選，取決於後端設定）
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
      "updatedAt": "2023-03-17T15:45:00.000Z",
      "completedAt": "2023-03-17T15:45:00.000Z"
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
- **認證**: 需要 Bearer Token（可選，取決於後端設定）
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

## 統計 API

### 1. 取得統計概覽

取得待辦事項的統計資訊。

- **路徑**: `/stats`
- **方法**: `GET`
- **認證**: 需要 Bearer Token（可選，取決於後端設定）
- **查詢參數** (可選):
  - `timeRange`: 時間範圍 (`7days`, `30days`, `thisMonth`)，預設為 `7days`
- **成功回應** (200):

  ```json
  {
    "success": true,
    "data": {
      "statusCounts": {
        "pending": 3,
        "inProgress": 2,
        "completed": 5,
        "total": 10
      },
      "completionRate": 50.0,
      "timeSeries": {
        "completed": [
          { "date": "2023-03-10", "count": 1 },
          { "date": "2023-03-11", "count": 0 }
          // ...其他日期
        ]
      },
      "productivity": {
        "byHour": [
          { "hour": 0, "count": 0 },
          { "hour": 1, "count": 0 }
          // ...其他小時
        ],
        "mostProductiveHour": { "hour": 14, "count": 3 }
      },
      "averageCompletionTime": {
        "milliseconds": 86400000,
        "hours": 24.0,
        "days": 1.0
      }
    }
  }
  ```

### 2. 取得完成時間統計

取得任務完成時間的詳細統計。

- **路徑**: `/stats/completion-time`
- **方法**: `GET`
- **認證**: 需要 Bearer Token（可選，取決於後端設定）
- **成功回應** (200):

  ```json
  {
    "success": true,
    "data": {
      "average": {
        "milliseconds": 86400000,
        "hours": 24.0,
        "days": 1.0
      },
      "fastest": {
        "milliseconds": 3600000,
        "hours": 1.0
      },
      "slowest": {
        "milliseconds": 604800000,
        "hours": 168.0
      },
      "totalCompleted": 5,
      "distribution": [
        { "category": "fast", "label": "Under 1 hour", "count": 1 },
        { "category": "medium", "label": "1-24 hours", "count": 3 },
        { "category": "slow", "label": "Over 24 hours", "count": 1 }
      ]
    }
  }
  ```

### 3. 取得生產力統計

取得生產力分析統計。

- **路徑**: `/stats/productivity`
- **方法**: `GET`
- **認證**: 需要 Bearer Token（可選，取決於後端設定）
- **成功回應** (200):

  ```json
  {
    "success": true,
    "data": {
      "byHour": [
        { "hour": 0, "count": 0 },
        { "hour": 1, "count": 0 }
        // ...其他小時
      ],
      "mostProductiveHour": { "hour": 14, "count": 3 },
      "byDayOfWeek": [
        { "dayOfWeek": 1, "dayName": "Sunday", "count": 1 }
        // ...其他天
      ],
      "mostProductiveDay": { "dayOfWeek": 3, "dayName": "Tuesday", "count": 4 },
      "completionTime": {
        "average": {
          "milliseconds": 86400000,
          "hours": 24.0,
          "days": 1.0
        }
      },
      "efficiency": {
        "weeklyCompletionRate": 75.0,
        "tasksCompletedThisWeek": 3,
        "tasksCreatedThisWeek": 4
      }
    }
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
    "timestamp": "2025-03-07T16:00:00.000Z",
    "uptime": 3600
  }
  ```

## 資料模型

### Todo 模型

```typescript
{
  _id: string;          // MongoDB ID
  title: string;        // 標題 (必填)
  description?: string; // 描述 (選填)
  status: string;       // 狀態: "pending", "in-progress", "completed"
  assignedTo?: string;  // 指派給誰 (選填)
  createdAt: Date;      // 建立時間
  updatedAt: Date;      // 最後更新時間
  completedAt?: Date;   // 完成時間 (當狀態改為 completed 時設置)
}
```

### User 模型

```typescript
{
  _id: string; // MongoDB ID
  name: string; // 用戶名稱
  email: string; // 電子郵件 (唯一)
  password: string; // 加密密碼 (不會回傳給客戶端)
  createdAt: Date; // 建立時間
  updatedAt: Date; // 最後更新時間
}
```

## CORS 設定

API 默認允許來自 `http://localhost:3000` 的請求，CORS 設定如下：

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
```

## 錯誤處理

### 常見錯誤代碼

- `400` - 錯誤的請求（如缺少必填欄位、格式錯誤）
- `401` - 未授權（如缺少或無效的令牌）
- `404` - 找不到資源
- `500` - 伺服器內部錯誤

### 驗證錯誤

當創建或更新 Todo 時，會進行以下驗證：

- `title` 必須存在且不為空
- `status` 必須是有效值：`pending`, `in-progress`, `completed`

## API 路由摘要

| 方法   | 路徑                       | 描述             | 認證       |
| ------ | -------------------------- | ---------------- | ---------- |
| POST   | /api/auth/login            | 使用者登入       | 否         |
| POST   | /api/auth/register         | 使用者註冊       | 否         |
| GET    | /api/todos                 | 獲取所有待辦事項 | 視後端設定 |
| POST   | /api/todos                 | 建立待辦事項     | 視後端設定 |
| PUT    | /api/todos/:id             | 更新待辦事項     | 視後端設定 |
| DELETE | /api/todos/:id             | 刪除待辦事項     | 視後端設定 |
| GET    | /api/stats                 | 取得統計概覽     | 視後端設定 |
| GET    | /api/stats/completion-time | 取得完成時間統計 | 視後端設定 |
| GET    | /api/stats/productivity    | 取得生產力統計   | 視後端設定 |
| GET    | /api/health                | 健康檢查         | 否         |

## 使用範例

### Node.js/Fetch 調用範例

```javascript
// 登入並獲取 token
async function login() {
  const response = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'demo@example.com',
      password: 'demo1234',
    }),
  });

  const data = await response.json();
  return data.token;
}

// 獲取所有待辦事項
async function getTodos(token) {
  const response = await fetch('http://localhost:5001/api/todos', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
}

// 使用範例
(async () => {
  try {
    const token = await login();
    const todos = await getTodos(token);
    console.log(todos);
  } catch (error) {
    console.error('API 調用失敗:', error);
  }
})();
```

## 注意事項

1. **授權狀態**: 根據程式碼實現，部分 API 端點可能不需要驗證即可訪問，但建議在實際使用時仍進行驗證。

2. **測試帳號**: 系統內建了測試帳號 (demo@example.com/demo1234)，方便開發測試使用。

3. **環境變數**: API 伺服器依賴以下環境變數：

   - `MONGO_URI`: MongoDB 連接字串
   - `JWT_SECRET`: JWT 簽名密鑰
   - `PORT`: 伺服器端口 (預設 5001)
   - `FRONTEND_URL`: 前端 URL (CORS 用途)

4. **開發模式**: 當環境變數 `NODE_ENV` 設為 `development` 時，系統會提供更詳細的日誌和錯誤信息。
