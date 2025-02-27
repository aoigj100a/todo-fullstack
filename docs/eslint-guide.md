# Todo App ESLint 開發指南

## 簡介

本專案採用 ESLint 作為程式碼規範工具，確保團隊開發過程中的程式碼品質和一致性。本指南將幫助您理解專案的 ESLint 配置及如何遵循這些規則。

## 基本設置

專案使用 Monorepo 架構，ESLint 配置分為三層：

1. **根層級**：適用於所有子專案的基本規則
2. **前端層級**：Next.js 前端特定規則
3. **後端層級**：Express.js 後端特定規則

## 安裝與運行

```bash
# 安裝所有依賴（包含 ESLint）
pnpm install

# 檢查程式碼
pnpm lint

# 自動修復問題
pnpm lint:fix

# 只檢查特定專案
pnpm --filter @todo-fullstack/frontend lint
```

## 核心規則說明

### 1. 程式碼風格

```javascript
// ❌ 不正確的格式
function example(){
    const x=1;
    if(x>0) {
        return true
    }
}

// ✅ 正確的格式
function example() {
  const x = 1;
  if (x > 0) {
    return true;
  }
}
```

主要風格規則：

- 使用 2 個空格縮排
- 使用單引號
- 語句結尾使用分號
- 運算符周圍使用空格

### 2. TypeScript 規則

```typescript
// ❌ 不推薦的做法
function getData(id): any {
  return fetch(`/api/data/${id}`);
}

// ✅ 推薦的做法
function getData(id: string): Promise<Data> {
  return fetch(`/api/data/${id}`);
}
```

主要 TypeScript 規則：

- 避免使用 `any` 類型
- 優先使用介面而非類型別名
- 函數需明確返回類型
- 強制使用 TypeScript 嚴格模式

### 3. React 規則

```jsx
// ❌ 不正確的 Hook 使用
function MyComponent() {
  if (condition) {
    const [state, setState] = useState('');
  }
  
  useEffect(() => {
    // 缺少依賴項
  }, []);
}

// ✅ 正確的 Hook 使用
function MyComponent() {
  const [state, setState] = useState('');
  
  useEffect(() => {
    // 完整的依賴項
  }, [dependency1, dependency2]);
}
```

主要 React 規則：
- Hooks 規則強制執行
- 組件命名必須使用 PascalCase
- Props 傳遞檢查
- JSX 語法檢查

## 特殊規則與例外

### 1. 未使用變數處理

```typescript
// 忽略未使用的參數（使用下劃線前綴）
function handler(_event, userId) {
  console.log(`Processing for user: ${userId}`);
}

// 忽略特定行
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Express 錯誤處理中必須保留 next 參數
});
```

### 2. Console 語句處理

```javascript
// 開發環境允許
console.log('Debugging info');

// 建議在生產環境前替換為日誌系統
import logger from '../utils/logger';
logger.info('Structured logging');
```

## 常見問題解決

### 問題 1: 間距與縮排錯誤

```bash
Expected indentation of 2 spaces but found 4 
```

解決方案：

- 使用編輯器的自動格式化功能
- 運行 `pnpm lint:fix`
- 確保編輯器設置為使用 2 空格縮排

### 問題 2: 未使用變數/導入警告

```bash
'useState' is defined but never used
```

解決方案：

- 移除未使用的導入
- 如果暫時需要保留，使用 `// eslint-disable-next-line no-unused-vars`

### 問題 3: Missing React Version

```bash
Warning: React version not specified in eslint-plugin-react settings
```

解決方案：

- 已在根配置中設置 `version: 'detect'`，通常不需要額外操作
- 如果仍出現，確保專案中已安裝 React

## 編輯器集成

### VS Code 設置

將以下配置添加到 `.vscode/settings.json`：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ]
}
```

### 安裝推薦的擴展

- ESLint: `dbaeumer.vscode-eslint`
- Prettier: `esbenp.prettier-vscode`

## 定製規則

如需修改或添加規則，請遵循以下步驟：

1. 與團隊討論並達成共識
2. 更新根目錄的 `.eslintrc.js` 或相應子專案的配置
3. 記錄更改原因和目的
4. 提交更新後的配置

## 專案特定配置

本專案的 ESLint 配置文件位於：

- 根目錄: `.eslintrc.js`
- 前端: `apps/frontend/.eslintrc.js`
- 後端: `apps/backend/.eslintrc.js`
- 共用: `packages/shared/.eslintrc.js`

## 進階主題

### Git Hooks 集成

專案使用 Husky 和 lint-staged 在提交前運行 lint 檢查：

```bash
# package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

### CI/CD 集成

在 CI 流程中添加 lint 檢查：

```yaml
# .github/workflows/ci.yml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
```

## 參考資源

- [ESLint 官方文件](https://eslint.org/docs/user-guide/)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [React ESLint Plugin](https://github.com/jsx-eslint/eslint-plugin-react)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)
