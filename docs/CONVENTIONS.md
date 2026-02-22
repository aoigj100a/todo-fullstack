# Code Conventions

本文件定義專案中程式碼撰寫層面的規範，涵蓋命名、import、錯誤處理、測試、commit 與註解。

> 專案架構與資料夾結構請參閱 [ARCHITECTURE.md](./ARCHITECTURE.md)，常用指令請參閱根目錄 [CLAUDE.md](../CLAUDE.md)。

---

## 1. 命名規則

### 檔案命名

| 類別                       | 規則                           | 範例                                                    |
| -------------------------- | ------------------------------ | ------------------------------------------------------- |
| React 元件                 | PascalCase                     | `TodoCard.tsx`, `LoginForm.tsx`, `CreateTodoDialog.tsx` |
| Pages (Next.js App Router) | `page.tsx` 置於路由資料夾下    | `app/todos/page.tsx`, `app/(auth)/login/page.tsx`       |
| Hooks                      | camelCase，以 `use` 開頭       | `useTodoCard.ts`, `useSoftDelete.ts`, `use-toast.ts`    |
| Service 層                 | camelCase                      | `todo.ts`, `auth.ts`, `stats.ts`                        |
| 型別定義                   | camelCase                      | `todo.ts`, `auth.ts`, `api.ts`                          |
| Context                    | PascalCase                     | `AuthContext.tsx`, `LanguageContext.tsx`                |
| 後端 Controller            | kebab-case 或 dot notation     | `todo.controllers.ts`, `auth.controller.ts`             |
| 後端 Model                 | PascalCase                     | `Todo.ts`, `User.ts`                                    |
| 後端 Route                 | dot notation                   | `todo.routes.ts`, `auth.routes.ts`                      |
| 後端 Middleware            | camelCase 或 dot notation      | `errorHandler.ts`, `auth.middleware.ts`                 |
| 後端 Validator             | dot notation                   | `todo.validators.ts`, `auth.validators.ts`              |
| 後端 Service               | kebab-case                     | `todo-stats.service.ts`                                 |
| shadcn/ui 元件             | kebab-case（遵循 shadcn 預設） | `button.tsx`, `dialog.tsx`, `select.tsx`                |

### 變數與函式命名

| 類別           | 規則                         | 範例                                                |
| -------------- | ---------------------------- | --------------------------------------------------- |
| 一般變數       | camelCase                    | `isLoading`, `statusColor`, `currentDate`           |
| 布林變數       | `is` / `has` / `should` 前綴 | `isUpdating`, `isAuthenticated`, `isControlled`     |
| 事件處理函式   | `handle` 前綴                | `handleSubmit`, `handleStatusToggle`, `handleClick` |
| Callback props | `on` 前綴                    | `onDelete`, `onEdit`, `onStatusChange`, `onSuccess` |
| 常數           | UPPER_SNAKE_CASE             | `JWT_SECRET`, `JWT_EXPIRES_IN`, `API_URL`           |
| Enum 值        | UPPER_SNAKE_CASE             | `ErrorCode.NOT_FOUND`, `ApiErrorCode.BAD_REQUEST`   |

### React 元件命名

| 類別             | 規則                       | 範例                                                       |
| ---------------- | -------------------------- | ---------------------------------------------------------- |
| 元件名稱         | PascalCase，功能描述性命名 | `TodoCard`, `StatsCards`, `LoginHeader`                    |
| 元件 Props 型別  | `{ComponentName}Props`     | `TodoCardProps`, `LoginFormProps`, `CreateTodoDialogProps` |
| Context          | `{Name}Context`            | `AuthContext`                                              |
| Context Provider | `{Name}Provider`           | `AuthProvider`                                             |
| Custom Hook      | `use{Name}`                | `useAuth`, `useTodoCard`, `useLanguage`                    |

### TypeScript 型別命名

| 類別               | 規則                                      | 範例                                             |
| ------------------ | ----------------------------------------- | ------------------------------------------------ |
| Interface          | PascalCase，不加 `I` 前綴（前端）         | `Todo`, `User`, `AuthResponse`                   |
| Interface          | PascalCase，加 `I` 前綴（後端 Model）     | `ITodo`, `IUser`                                 |
| Type alias         | PascalCase                                | `TodoStatus`, `FilterStatus`, `TodoViewType`     |
| Enum               | PascalCase                                | `ErrorCode`, `ApiErrorCode`, `AuthErrorType`     |
| Input/Request 型別 | `{Action}{Entity}Input`                   | `CreateTodoInput`, `LoginInput`, `RegisterInput` |
| Response 型別      | `{Entity}Response` 或 `Api{Type}Response` | `AuthResponse`, `ApiSuccessResponse<T>`          |

### 後端命名

| 類別            | 規則                         | 範例                                                        |
| --------------- | ---------------------------- | ----------------------------------------------------------- |
| Controller 函式 | camelCase，動詞開頭          | `getTodos`, `createTodo`, `deleteTodo`                      |
| Middleware 函式 | camelCase，描述性命名        | `handleValidationErrors`, `mongoInjectionProtection`        |
| Validator 陣列  | `{action}{Entity}Validation` | `createTodoValidation`, `loginValidation`                   |
| Model 匯出      | PascalCase，單數             | `Todo`, `User`                                              |
| Service 函式    | camelCase，描述性命名        | `calculateAverageCompletionTime`, `getCompletedTasksByDate` |

---

## 2. Import 排序與分組

Import 按以下順序分組，各組之間以空行分隔：

```typescript
// 1. React / Node.js 內建模組
import { useState, useEffect } from 'react';

// 2. 第三方套件
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import mongoose, { Schema, Document } from 'mongoose';

// 3. 內部共用元件（使用 @/ alias）
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// 4. 功能模組內的相對引入
import { LoginHeader } from './_components/LoginHeader';
import { LoginForm } from './_components/LoginForm';

// 5. Context / Hooks
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

// 6. Service 層
import { todoService } from '@/service/todo';

// 7. 型別定義
import { CreateTodoInput, Todo, TodoStatus } from '@/types';
```

**注意事項：**

- 前端使用 `@/` path alias 指向 `src/`
- 後端使用相對路徑 `../` 引入
- 同一分組內的 import 不需要特定排序
- 型別如果與其他 import 混用在同一來源，可以合併（不需要獨立的 `import type`）

---

## 3. 錯誤處理

### 後端 Controller：try/catch + 統一回應格式

所有 Controller 函式使用 `try/catch` 包裹，回應格式統一為 `{ success, data/error }`：

```typescript
export const createTodo = async (req: Request, res: Response) => {
  try {
    // 驗證與業務邏輯
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Title is required',
      });
    }

    const todo = new Todo({ title, description });
    await todo.save();

    // 成功回應
    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create todo',
    });
  }
};
```

**API 回應格式：**

- 成功：`{ success: true, data: T, message?: string }`
- 失敗：`{ success: false, error: string, details?: object }`

### 後端自訂錯誤類別

使用 `AppError` 類別處理可預期的錯誤，搭配 `ErrorCode` enum：

```typescript
throw new AppError('Todo not found', ErrorCode.NOT_FOUND, 404, { id: requestedId });
```

### 前端：try/catch + toast 通知

前端非同步操作統一使用 `try/catch`，搭配 toast 顯示結果：

```typescript
try {
  await todoService.createTodo(data);
  toast({ title: 'Success', description: t('toast.createSuccess') });
} catch (_) {
  toast({
    title: 'Error',
    description: t('toast.error.create'),
    variant: 'destructive',
  });
} finally {
  setIsLoading(false);
}
```

**要點：**

- 不需要使用的 error 變數命名為 `_`
- `finally` 區塊負責重置 loading 狀態
- toast 訊息使用 i18n 翻譯鍵（`t('...')`）
- 需要 log 的錯誤使用 `console.error('{Context} error:', error)`

### 前端 Service 層：捕獲後重新拋出

Service 函式捕獲錯誤後 log 並重新拋出，讓呼叫端決定如何處理：

```typescript
export const todoService = {
  getTodos: async () => {
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },
};
```

---

## 4. 測試

### 測試框架

- 前端：Vitest + @testing-library/react

### 測試檔案位置

- 測試檔案放在被測模組同層的 `__test__/` 目錄下（co-location）
- 全域測試設定檔放在 `src/test/`

```md
src/components/todos/
├── **test**/
│ └── TodoCard.test.tsx
├── TodoCard.tsx
└── TodoList.tsx

src/hooks/
├── **test**/
│ └── useTodoCard.test.ts
└── useTodoCard.ts
```

### 檔案命名

```
{ComponentName}.test.tsx   // React 元件測試
{moduleName}.test.ts       // 工具函式 / service 測試
```

### 測試結構

使用 `describe` + `test`（不使用 `it`）：

```typescript
import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 測試命名規範

- `describe`：描述被測試的模組或元件名稱
- `test`：描述預期行為，使用動詞開頭（`renders...`, `returns...`, `throws...`）

---

## 5. Git Commit Message

### 格式

```
type(scope): message
```

### Type 列表

| Type       | 用途                             |
| ---------- | -------------------------------- |
| `feat`     | 新功能                           |
| `fix`      | 修復 bug                         |
| `refactor` | 重構（不改變功能）               |
| `chore`    | 維護性工作（格式化、設定調整等） |
| `docs`     | 文件變更                         |
| `test`     | 測試相關                         |
| `style`    | 程式碼格式（不影響邏輯）         |

### Scope

| Scope      | 用途                     |
| ---------- | ------------------------ |
| `frontend` | 前端變更                 |
| `backend`  | 後端變更                 |
| 省略       | 跨前後端或專案層級的變更 |

### 範例

```
feat(frontend): add dark mode toggle
fix(backend): handle duplicate email on registration
refactor(frontend): extract login page into sub-components
chore: format code and fix style consistency across project
docs: update API documentation
```

### 規則

- message 使用英文，小寫開頭
- 簡潔描述「做了什麼」，不加句號結尾
- 一次 commit 只做一件事

---

## 6. 註解

### 使用時機

- **說明「為什麼」**，而非「做了什麼」——程式碼本身應足以說明 what
- **標記待處理事項**：使用 `// TODO -` 前綴
- **區分 UI 區域**：JSX 中用中文註解標示各區塊的用途
- **型別檔案**：使用 JSDoc `/** */` 為每個 interface/type 加上說明

### 風格

```typescript
// 單行註解：說明邏輯意圖
// 處理狀態切換
const handleStatusToggle = async (e: React.MouseEvent) => { ... };

// TODO 標記：描述待辦事項
assignedTo: 'Jenny', // TODO - 暫時寫死，之後要改成當前登入使用者

// JSX 區域標示
{/* 狀態圖標 - 左側互動區域 */}
{/* 內容區域 - 中間拖曳區域 */}
{/* 操作按鈕 - 右側互動區域 */}

// 型別檔案的 JSDoc
/**
 * 待辦事項狀態
 */
export type TodoStatus = 'pending' | 'in-progress' | 'completed';

/**
 * 建立待辦事項請求參數
 */
export interface CreateTodoInput {
  title: string;
  description?: string;
}
```

### 語言

- 程式碼中的一般註解：中文或英文皆可，依上下文自然使用
- 型別檔案的 JSDoc：使用中文
- TODO 註解：`// TODO -` 後接中文或英文說明
- 面向使用者的錯誤訊息（API response）：英文
