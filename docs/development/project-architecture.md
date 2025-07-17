# Todo Full Stack 專案架構說明

## 1. 專案概述

本專案是一個使用 Monorepo 架構的全端應用程式，採用前後端分離設計，旨在提供完整的任務管理功能。專案透過 pnpm workspace 管理多個子專案，實現程式碼共享和統一管理。

## 2. 技術堆疊

### 2.1 前端技術

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 元件**: shadcn/ui
- **狀態管理**: React 內置狀態管理
- **API 請求**: fetch API
- **表單處理**: 原生處理

### 2.2 後端技術

- **框架**: Express.js
- **語言**: TypeScript
- **資料庫**: MongoDB
- **身份驗證**: JWT (JSON Web Token)
- **API 設計**: RESTful API
- **錯誤處理**: 自定義錯誤處理中間件

### 2.3 共用技術

- **套件管理**: pnpm
- **Monorepo 管理**: pnpm workspace
- **程式碼品質**: ESLint
- **型別定義**: TypeScript
- **版本控制**: Git

## 3. 專案結構

```
todo-fullstack/
├── apps/                    # 應用程式目錄
│   ├── frontend/           # 前端專案
│   │   ├── public/        # 靜態資源
│   │   ├── src/           # 源代碼
│   │   │   ├── app/      # Next.js App Router
│   │   │   ├── components/ # React 元件
│   │   │   ├── hooks/    # 自定義 hooks
│   │   │   ├── lib/      # 工具函數
│   │   │   ├── service/  # API 服務
│   │   │   └── types/    # TypeScript 型別定義
│   │   ├── .env.example  # 環境變數範例
│   │   └── next.config.js # Next.js 配置
│   │
│   └── backend/            # 後端專案
│       ├── src/           # 源代碼
│       │   ├── configs/   # 配置文件
│       │   ├── controllers/ # 控制器
│       │   ├── middlewares/ # 中間件
│       │   ├── models/    # 資料模型
│       │   ├── routes/    # 路由
│       │   ├── scripts/   # 腳本文件
│       │   ├── utils/     # 工具函數
│       │   ├── app.ts     # Express 應用
│       │   └── server.ts  # 服務器入口
│       └── .env.example   # 環境變數範例
│
├── packages/               # 共用套件目錄
│   └── shared/            # 共用元件和型別
│       └── src/           # 共用源代碼
│
├── doc/                    # 文檔目錄
│   └── architecture.md    # 架構說明文檔
│
├── pnpm-workspace.yaml    # pnpm workspace 配置
├── package.json           # 根目錄套件配置
└── README.md              # 專案說明
```

## 4. 核心架構說明

### 4.1 Monorepo 架構

本專案採用 Monorepo 架構，使用 pnpm workspace 管理多個相關的子專案，主要優勢包括：

- **程式碼共享**: 前後端之間可以共享型別定義和工具函數
- **統一版本控制**: 所有相關專案在同一個儲存庫中管理
- **簡化依賴管理**: 相關套件可以集中管理，避免版本衝突
- **協同開發**: 便於團隊協作，確保前後端開發的一致性

### 4.2 前端架構

前端採用 Next.js 的 App Router 架構，具有以下特點：

- **檔案路由系統**: 基於檔案結構的路由，直觀且易於維護
- **伺服器組件**: 利用 React Server Components 提升性能和 SEO
- **客戶端組件**: 對於需要互動的部分使用客戶端渲染
- **組件分層**:
  - `ui/`: 基礎 UI 元件，主要來自 shadcn/ui
  - `components/`: 業務邏輯組件，如 TodoCard, CreateTodoDialog 等
  - `hooks/`: 自定義 React hooks，封裝共用邏輯

### 4.3 後端架構

後端採用 Express.js 框架，實現 RESTful API 設計：

- **MVC 模式**:
  - Model: MongoDB 模型定義 (models/)
  - Controller: 業務邏輯處理 (controllers/)
  - Router: API 路由定義 (routes/)
- **中間件**:
  - 身份驗證 (auth.middleware.ts)
  - 錯誤處理 (errorHandler.ts)
  - 請求日誌 (requestLogger.ts)
- **資料庫**: 使用 MongoDB 作為資料庫，通過 Mongoose ODM 進行操作

### 4.4 資料流

![資料流程圖](https://i.imgur.com/5v0w6YW.png)

1. **用戶操作**: 用戶在前端 UI 進行操作（如創建待辦事項）
2. **前端處理**: React 組件捕獲操作，調用相應的服務函數
3. **API 請求**: 前端 service 層向後端 API 發送請求
4. **後端路由**: Express 路由接收請求並路由到適當的控制器
5. **業務邏輯**: 控制器處理業務邏輯，包括資料驗證和操作
6. **資料庫操作**: 通過 Mongoose 模型操作 MongoDB 資料庫
7. **回應處理**: 後端返回結果，前端根據回應更新 UI 狀態

## 5. 身份驗證流程

本專案使用基於 JWT 的身份驗證機制：

1. **登入流程**:

   - 用戶提交登入表單（email/password）
   - 後端驗證憑證並生成 JWT
   - 返回 token 和用戶資訊
   - 前端儲存 token 到 localStorage

2. **請求授權**:

   - 前端在 API 請求中加入 Authorization 標頭
   - 後端中間件驗證 token 的有效性
   - 驗證成功後處理請求，失敗則返回 401 錯誤

3. **登出流程**:
   - 前端移除本地儲存的 token
   - 重定向到登入頁面

## 6. API 架構

API 遵循 RESTful 設計原則，主要端點包括：

### 6.1 認證 API

```
POST /api/auth/register - 註冊新用戶
POST /api/auth/login    - 用戶登入
```

### 6.2 Todo API

```
GET    /api/todos       - 獲取所有待辦事項
POST   /api/todos       - 創建新待辦事項
PUT    /api/todos/:id   - 更新特定待辦事項
DELETE /api/todos/:id   - 刪除特定待辦事項
```

## 7. 資料模型

### 7.1 用戶模型 (User)

```typescript
{
  _id: ObjectId,
  email: String,
  password: String,
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 7.2 待辦事項模型 (Todo)

```typescript
{
  _id: ObjectId,
  title: String,
  description: String,
  status: "pending" | "in-progress" | "completed",
  assignedTo: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 8. 環境配置

專案支援多環境配置，通過 .env 文件進行設定：

### 8.1 前端環境變數

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 8.2 後端環境變數

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-secret-key
```

## 9. 結論

Todo Full Stack 專案採用了現代化的前後端分離架構，利用 Monorepo 模式統一管理相關的子專案。前端使用 Next.js 提供優秀的用戶體驗，後端通過 Express.js 和 MongoDB 構建穩定的 API 服務。這種架構設計使得專案具有良好的可維護性、可擴展性和開發體驗。
