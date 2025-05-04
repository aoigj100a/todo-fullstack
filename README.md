# Todo Full Stack Project

## 專案目標

- 建立一個前後端分離的 Todo List 應用，實際走一次完整的全端開發流程
- 輕量級任務管理工具，用於：任務追蹤與管理、狀態更新、進度可視化

## 測試帳號

- email: <demo@example.com>
- password: demo1234

## 技術選擇

### 前端（Next.js）

- TypeScript
- Tailwind CSS 樣式
- shadcn/ui 元件庫

### 後端（Express.js）

- TypeScript
- MongoDB 資料庫
- JWT 身份驗證

## 專案進度

### 1. 專案初始設定 ✅

- [x] 建立基本的 Express 應用程式
- [x] 設定 TypeScript
- [x] 加入 CORS
- [x] 建立 Git 版控
- [x] 設定環境變數 (.env)
- [x] monorepo 初始設定
- [x] 建立資料夾結構
- [x] 設置共用ESLint配置
- [x] 加入 ESLint 規則

### 2. 專案架構 ✅

```

todo-fullstack/
├── apps/                    # 應用程式
│   ├── frontend/           # Next.js 前端
│   └── backend/            # Express.js 後端
├── packages/               # 共用套件
│   └── shared/            # 共用型別和工具
├── package.json           # 根目錄配置
└── README.md
```

### 3. 前端功能

#### 3.1 基礎頁面建置 ✅

- [x] 登入頁面 (/login)
- [x] 註冊頁面 (/register)
- [x] 待辦事項主頁面 (/todos)
- [x] 待辦事項詳情頁面 (/todos/:id)

#### 3.2 Todo 列表介面 ✅

- [x] 列表容器與卡片設計
- [x] Todo 項目的展示樣式
- [x] 空列表提示狀態
- [x] 載入狀態

#### 3.3 Todo 操作介面 ✅

- [x] 新增 Todo 對話框
- [x] 編輯 Todo 對話框
- [x] 刪除 Todo 功能
- [x] 刪除撤銷功能

### 3.4 Todo 狀態切換功能 ✅

- [x] 實現點擊圖標切換 Todo 狀態
- [x] 添加狀態變更反饋動畫
- [x] 設計狀態切換的循環順序 (待處理 → 進行中 → 已完成)
- [x] 優化狀態更新的使用者體驗
- [x] 實現即時的 UI 更新反饋

### 3.5 Todo 篩選功能 ✅

- [x] 添加篩選狀態的狀態管理
- [x] 創建切換視圖的控制
- [x] 實現看板視圖 (Board View) - 按狀態分組顯示
- [x] 實現列表視圖 (List View) - 只顯示選中狀態的項目

#### 3.6 UI 元件整合 ✅

- [x] shadcn/ui 元件配置
- [x] 響應式基本支援

### 3.7 數據視覺化儀表板 🚧

- [x] 設計任務完成率圖表
- [ ] 加入時間趨勢分析(每日/週/月完成量)
- [ ] 創建任務分類分佈圖
- [ ] 實作互動式篩選控制
- [ ] 實作資料下載功能

### 3.8 更多工作項目（選）

- [ ] 使用者設定頁面
- [ ] 任務分類與標籤系統
- [ ] 日期排序與篩選功能
- [ ] 多主題支援 (深色模式)
- [ ] 任務統計與數據視覺化
- [ ] 優雅地處理和顯示各種API錯誤
- [ ] 支援英文與中文

### 4. 後端功能

#### 4.1 資料庫設定 ✅

- [x] MongoDB 連接設定
- [x] 資料庫錯誤處理
- [x] 請求日誌功能
- [x] 健康檢查路由 (/api/health)

#### 4.2 Todo API ✅

- [x] Todo Model
- [x] Todo Routes
- [x] Todo Controllers
- [x] CRUD API端點:
  - [x] GET /api/todos (取得所有)
  - [x] POST /api/todos (新增)
  - [x] PUT /api/todos/:id (更新)
  - [x] DELETE /api/todos/:id (刪除)

#### 4.3 認證功能 ✅

- [x] User Model
- [x] JWT身份驗證
- [x] 登入/註冊API
- [x] 測試帳號支援

#### 4.4 安全性設定 ✅

- [x] CORS規則
- [x] 基本錯誤處理

#### 4.5 數據統計 API ✅

- [x] 任務完成率統計端點
- [x] 時間趨勢分析資料端點
- [x] 任務分類分佈資料端點

### 5. 種子資料 ✅

- [x] 測試用 Todo 資料

### 6. 部署前檢查清單 🚧

- [ ] 移除測試或開發用資料
- [ ] 確認所有環境變數已設定
- [ ] 驗證 API 基礎 URL 設定
- [ ] 測試生產構建
- [ ] 設定 MongoDB 資料庫存取權限

### 7. 技術改進 🚧

- [ ] 遷移到 pnpm v8
- [ ] API 請求緩存優化
- [ ] 單元測試覆蓋率提升
- [ ] 實作自動化測試流程
- [ ] 優化 MongoDB 查詢效能

### 8. 部署與維運 🚧

- [ ] 配置 CI/CD 流程
- [ ] 實作容器化部署 (Docker)
- [ ] 配置錯誤監控系統
- [ ] 建立資料庫備份策略
- [ ] 性能監控整合

### 9. 鍵盤快速鍵操作 ✅

- [x] 實作全域 Todo 列表鍵盤導航 (上下箭頭)
- [x] 實作快速新增待辦事項鍵 (N)
- [x] 實作狀態切換快速鍵 (Space)
- [x] 實作編輯快速鍵 (E)
- [x] 實作表單提交快速鍵 (Ctrl+Enter)
- [x] 添加鍵盤導航視覺提示
- [x] 實作表單焦點管理
- [x] 鍵盤/滑鼠模式自動切換
- [x] 建立快速鍵說明區塊

### 多國語言功能 🚧

- [x] 首頁完整支援多語言顯示
- [x] 語言上下文設定 (LanguageContext.tsx)
- [x] 建立 LanguageSwitcher 組件
- [x] 使用 localStorage 儲存語言偏好
- [x] 實作 useLanguage hook 讓組件可以存取語言上下文
- [x] 建立 ClientProviders 在應用程式層級提供語言上下文
- [ ] 實作基於語言的 URL 路由 (如 /en/todos, /zh-TW/todos)
- [x] Todo 列表頁面的多語言支援
- [x] 登入和註冊頁面的多語言整合
- [x] 任務詳情頁面的多語言支援
- [ ] 實作翻譯的自動化管理工具
- [x] 完善瀏覽器語言檢測與設定邏輯
- [ ] 確保 URL 參數在語言變更時保持一致

## 快速開始

### 開發環境設定

1. 安裝依賴套件

```bash
pnpm install
```

2. 啟動後端

```bash
cd apps/backend
pnpm dev
```

3. 啟動前端

```bash
cd apps/frontend
pnpm dev
```

4. 瀏覽應用

```
前端: http://localhost:3000
API: http://localhost:5001/api
```

### 後端環境變數 (.env)

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/todo-app
JWT_SECRET=your-secret-key
```

### 前端環境變數 (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 功能說明

1. 使用者認證系統

- 透過 JWT (JSON Web Token) 實現安全的身份驗證機制，包含以下功能
  - 使用者註冊：建立新帳號，支援基本資料驗證
  - 使用者登入：透過安全的 JWT 認證機制登入系統
  - 權限控制：保護路由，確保只有已登入使用者可訪問私人頁面
  - 測試帳號：內建測試帳號方便開發與測試

2. 任務管理功能

- 核心的待辦事項管理功能，使用直覺的操作介面
  - 任務清單：查看所有待辦事項，支援多種檢視模式（列表/看板視圖）
  - 任務操作：完整的 CRUD 功能（新增、讀取、更新、刪除）
  - 狀態追蹤：任務可標記為「待處理」、「進行中」或「已完成」
  - 即時狀態切換：透過點擊可快速切換任務狀態
  - 任務詳情：查看任務的詳細資訊，包含建立時間與更新時間
  - 可撤銷刪除：刪除操作支援撤銷功能，防止意外操作

3. 多語言支援

- 應用程式支援多國語言，提升國際化體驗
  - 語言切換：在英文與繁體中文間輕鬆切換
  - 語言記憶：記住使用者語言偏好
  - 瀏覽器偵測：自動根據瀏覽器語言設定初始語言

4. 個人儀表板

- 數據視覺化儀表板幫助使用者掌握任務狀況：
  - 狀態分佈圖：查看不同狀態的任務分佈
  - 完成率統計：展示任務完成率
  - 時間趨勢圖：顯示任務完成的時間趨勢

## Commit 訊息格式

```
<type>(<scope>): <subject>
```

- type: feat, fix, docs, style, refactor, perf, test, chore
- scope: 變更範圍 (frontend, backend, shared)
- subject: 簡短描述

例如：

- feat(frontend): add todo filter component
- fix(backend): resolve connection timeout issue
