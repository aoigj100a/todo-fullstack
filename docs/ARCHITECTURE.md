# Architecture

## 系統總覽

全端 Todo 應用，採用 pnpm workspaces monorepo 架構，前後端分離。

```
┌─────────────┐       HTTP/REST        ┌─────────────┐       Mongoose       ┌─────────┐
│   Frontend  │  ──────────────────►   │   Backend   │  ──────────────►    │ MongoDB │
│  Next.js 14 │  ◄──────────────────   │  Express.js │  ◄──────────────    │         │
│  :3000      │    JSON API            │  :4000      │                     │  :27017 │
└─────────────┘                        └─────────────┘                     └─────────┘
```

**前端**負責 UI 渲染、路由、狀態管理與國際化；**後端**負責 RESTful API、身份驗證、輸入驗證與安全防護；**MongoDB** 為唯一資料儲存。

---

## 資料夾結構

```
todo-fullstack/
├── apps/
│   ├── frontend/                  # Next.js 14 前端
│   │   ├── src/
│   │   │   ├── app/               # App Router 頁面
│   │   │   │   ├── (auth)/        # 登入、註冊（route group）
│   │   │   │   ├── dashboard/     # 儀表板
│   │   │   │   ├── profile/       # 個人資料
│   │   │   │   └── todos/         # Todo CRUD（含 [id] 動態路由）
│   │   │   ├── components/
│   │   │   │   ├── ui/            # shadcn/ui 基礎元件
│   │   │   │   ├── layout/        # Navbar、BottomNavigation
│   │   │   │   ├── shared/        # 跨功能共用元件
│   │   │   │   └── features/      # 依功能分類的業務元件
│   │   │   │       ├── dashboard/
│   │   │   │       └── todos/
│   │   │   ├── contexts/          # React Context（Auth、Language）
│   │   │   ├── hooks/             # 自訂 hooks
│   │   │   ├── service/           # API 呼叫封裝
│   │   │   └── types/             # TypeScript 型別定義
│   │   └── public/
│   │
│   └── backend/                   # Express.js API
│       └── src/
│           ├── configs/           # 資料庫連線設定
│           ├── controllers/       # 請求處理邏輯
│           ├── middlewares/       # 驗證、安全、限流中介層
│           ├── models/            # Mongoose schema 定義
│           ├── routes/            # API 路由定義與驗證規則
│           ├── validators/        # express-validator 驗證規則
│           ├── errors.ts          # 統一錯誤型別與工具
│           ├── app.ts             # Express app 設定與中介層註冊
│           └── server.ts          # 伺服器啟動進入點
│
├── packages/
│   └── shared/                    # 共用型別（目前為基礎 Todo interface）
│
└── docs/                          # 專案文件
    ├── api/                       # API 文件
    ├── development/               # 開發指南
    ├── deployment/                # 部署文件
    └── security.md                # 安全機制說明
```

---

## 資料流

### 認證流程

```
1. 使用者提交 login/register 表單
2. Frontend authService → POST /api/auth/login 或 /register
3. Backend 驗證輸入 → 安全中介層鏈（見下方）→ controller 處理
4. 密碼以 bcrypt（12 rounds）雜湊比對
5. 成功後簽發 JWT（含 userId、email，預設 24h 過期）
6. Frontend 將 token 存入 localStorage（勾選記住）或 sessionStorage
7. 後續 API 請求以 Authorization: Bearer <token> 標頭發送
8. Backend auth middleware 驗證 token 並注入 req.user
```

### Todo CRUD 資料流

```
Frontend 元件
  → service 層（fetch API 封裝）
    → Backend route（驗證規則 + 安全中介層）
      → controller（業務邏輯）
        → Mongoose model（MongoDB 操作）
          → 回傳統一格式 JSON
```

### API 回應格式

所有 API 遵循統一回應結構：

```typescript
// 成功
{ success: true, data: T, message?: string }

// 錯誤
{ success: false, error: string, type?: string, details?: object }
```

---

## 關鍵設計決策

### 前端

| 決策                                                           | 理由                                                             |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Next.js App Router**                                         | 利用 React Server Components 與 layout 嵌套，頁面載入效能較佳    |
| **React Context 管理狀態**（非 Redux）                         | 應用規模適中，Context + hooks 足以應付，避免額外依賴             |
| **service 層封裝 API 呼叫**                                    | 將 fetch 邏輯集中管理，元件不直接處理 HTTP 細節                  |
| **依功能分類元件**（`features/todos/`、`features/dashboard/`） | 比全部平鋪在 `components/` 更易維護，檔案歸屬明確                |
| **key-based i18n**（LanguageContext）                          | 輕量實作，不依賴 next-intl 或 i18next，支援 en / zh-TW           |
| **token 雙儲存策略**                                           | localStorage 持久記住、sessionStorage 關閉即失效，兼顧便利與安全 |

### 後端

| 決策                             | 理由                                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **MVC 分層架構**                 | controller、model、route 職責分離，新增功能時改動範圍明確                                            |
| **多層安全中介層鏈**             | 每條敏感路由依序經過 header 安全、content 驗證、MongoDB injection 防護、XSS 防護、SQL injection 防護 |
| **express-validator 宣告式驗證** | 驗證規則與路由定義在同一處，易於審閱與維護                                                           |
| **In-memory rate limiting**      | 開發階段足夠，不需額外 Redis 依賴；產品環境可替換為分散式方案                                        |
| **bcrypt + 12 rounds**           | 業界標準密碼雜湊，12 rounds 在安全性與效能間取得平衡                                                 |
| **統一 AppError 型別**           | 錯誤碼分類（1xx 資料、2xx 驗證、3xx 權限、4xx 資料庫、5xx 系統），方便前端統一處理                   |

### 整體

| 決策                                | 理由                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------- |
| **pnpm workspaces monorepo**        | 統一管理依賴版本、共用腳本與設定，前後端可獨立建置                          |
| **前後端獨立型別定義**              | 目前 `packages/shared` 僅有基礎 interface，前後端各自維護完整型別以保持彈性 |
| **TypeScript strict mode 全面啟用** | 減少執行期錯誤，強制型別安全                                                |

---

## 外部服務整合

### MongoDB

- 唯一資料庫，透過 Mongoose ODM 操作
- 連線設定：`apps/backend/src/configs/database.ts`
- 預設 URI：`mongodb://127.0.0.1:27017/todo-app`（可由 `MONGODB_URI` 環境變數覆蓋）
- 支援 graceful shutdown（server.ts 中處理 SIGTERM/SIGINT）

### 環境變數

| 變數                   | 用途                 | 預設值                               |
| ---------------------- | -------------------- | ------------------------------------ |
| `PORT`                 | 後端伺服器 port      | `5001`（.env 設為 `4000`）           |
| `MONGODB_URI`          | MongoDB 連線字串     | `mongodb://localhost:27017/todo-app` |
| `JWT_SECRET`           | JWT 簽名金鑰         | 需自行設定                           |
| `JWT_EXPIRE`           | JWT 過期時間         | `7d`                                 |
| `CORS_ORIGIN`          | 允許的前端來源       | `http://localhost:3000`              |
| `RATE_LIMIT_WINDOW_MS` | 限流時間窗口（毫秒） | `900000`（15 分鐘）                  |
| `RATE_LIMIT_MAX`       | 限流最大請求數       | `100`                                |
| `NEXT_PUBLIC_API_URL`  | 前端 API 位址        | `http://localhost:4000/api`          |
| `NEXT_PUBLIC_MVP_MODE` | MVP 模式旗標         | `true`                               |

---

## 後端中介層鏈

敏感路由（如 auth）的完整中介層執行順序：

```
Request
  → headerSecurity          # 設定安全 response headers
  → contentValidation       # 驗證 Content-Type 與 payload 大小
  → mongoInjectionProtection # 防止 MongoDB 注入
  → xssProtection           # DOMPurify 清理 HTML/script
  → sqlInjectionProtection  # 偵測 SQL 關鍵字
  → rateLimitSensitiveOps   # IP 限流
  → 路由專屬驗證            # express-validator 規則
  → handleValidationErrors  # 統一回傳驗證錯誤
  → controller              # 業務邏輯處理
```

---

## 資料模型

### User

| 欄位        | 型別   | 說明                                   |
| ----------- | ------ | -------------------------------------- |
| `email`     | String | 唯一、必填、小寫正規化                 |
| `password`  | String | bcrypt 雜湊、不回傳（`select: false`） |
| `name`      | String | 2-50 字元                              |
| `createdAt` | Date   | 自動產生                               |
| `updatedAt` | Date   | 自動產生                               |

### Todo

| 欄位          | 型別         | 說明                                    |
| ------------- | ------------ | --------------------------------------- |
| `title`       | String       | 3-100 字元，必填                        |
| `description` | String       | 最多 500 字元，選填                     |
| `status`      | Enum         | `pending` / `in-progress` / `completed` |
| `assignedTo`  | String       | 選填                                    |
| `completedAt` | Date \| null | 完成時自動設定                          |
| `createdAt`   | Date         | 自動產生                                |
| `updatedAt`   | Date         | 自動產生                                |
