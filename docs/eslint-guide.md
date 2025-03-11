# Todo App ESLint 開發指南

## 簡介

本專案採用 ESLint 作為程式碼規範工具，確保團隊開發過程中的程式碼品質和一致性。本指南將幫助您理解專案的 ESLint 配置及如何遵循這些規則。

## 基本設置

專案使用 Monorepo 架構，ESLint 配置分為三層：

1. **根層級**：適用於所有子專案的基本規則 (`.eslintrc.js`)
2. **前端層級**：Next.js 前端特定規則 (`apps/frontend/.eslintrc.js`)
3. **後端層級**：Express.js 後端特定規則 (`apps/backend/.eslintrc.js`)

## 安裝與運行

```bash
# 安裝所有依賴（包含 ESLint）
pnpm install

# 檢查程式碼
pnpm lint

# 自動修復問題
pnpm lint:fix

# 只檢查特定專案
pnpm --filter ./apps/frontend lint
```

## 核心規則說明

### 1. 程式碼風格

```javascript
<!-- prettier-ignore-start -->
// ❌ 不正確的格式
function example(){
    const x=1;
    if(x>0) {
        return true
    }
}
  <!-- prettier-ignore-end -->
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
- 使用單引號 (singleQuote: true)
- 語句結尾使用分號 (semi: true)
- 行寬限制為 100 字元 (printWidth: 100)
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

- 使用 `@typescript-eslint/recommended` 規則集
- 警告但不禁止使用 `any` 類型
- 函數無需顯式聲明返回類型
- 嚴格的類型檢查由 TypeScript 編譯器處理

### 3. React 規則

```jsx
// ❌ 不正確的 JSX
function MyComponent() {
  return <div className="wrong-quotes">Text</div>;
}

// ✅ 正確的 JSX
function MyComponent() {
  return <div className="right-quotes">Text</div>;
}
```

主要 React 規則：

- 使用 `react/recommended` 規則集
- 不要求 React 導入 (react-in-jsx-scope: off)
- 不要求 Props 類型檢查 (prop-types: off)
- 前端特定規則在 `apps/frontend/.eslintrc.js` 中定義

## 特殊規則與例外

### 1. 未使用變數處理

```typescript
// eslint-disable-next-line no-unused-vars
function handler(event, userId) {
  console.log(`Processing for user: ${userId}`);
}

// Express 錯誤處理中間件特殊例外
app.use((err, req, res, next) => {
  // Express 錯誤處理中必須保留 next 參數
  res.status(500).send('Server Error');
});
```

### 2. Console 語句處理

根據專案設定，Console 語句處理如下：

```javascript
// 前端：警告所有 console
console.log('This will trigger a warning'); // 警告

// 後端：允許 info, warn, error
console.log('This will trigger a warning'); // 警告
console.info('This is allowed'); // 允許
console.warn('This is allowed'); // 允許
console.error('This is allowed'); // 允許
```

## 根據專案實際配置的規則

從專案的 `.eslintrc.js` 文件可以看出以下規則：

```javascript
// 根目錄配置摘要
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended', // Prettier 集成
  ],
  plugins: ['prettier'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',
    'no-unused-vars': 'warn',
    indent: ['warn', 2],
    quotes: ['warn', 'single'],
    semi: ['warn', 'always'],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prettier/prettier': 'error',
  },
};
```

## 常見問題解決

### 問題 1: ESLint 和 Prettier 衝突

```bash
Error: Conflicting ESLint and Prettier rules
```

解決方案：

- 已通過 `eslint-config-prettier` 和 `eslint-plugin-prettier` 解決衝突
- 如果仍有問題，請確保 `.prettierrc.js` 和 ESLint 配置一致

### 問題 2: 未使用變數/導入警告

```bash
'useState' is defined but never used
```

解決方案：

- 移除未使用的導入
- 暫時需要保留的變數前加下劃線 (例如 `_unusedVar`)
- 或使用 `// eslint-disable-next-line no-unused-vars`

### 問題 3: 規則太嚴格

如果某些規則對開發效率造成影響，可以在團隊討論後調整規則嚴格程度：

```javascript
// 從 error 降級為 warning
'@typescript-eslint/no-explicit-any': 'warn',

// 或完全禁用
'@typescript-eslint/explicit-module-boundary-types': 'off',
```

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
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
}
```

### 安裝推薦的擴展

- ESLint: `dbaeumer.vscode-eslint`
- Prettier: `esbenp.prettier-vscode`

## 專案特定配置

本專案的 ESLint 配置文件位於：

- 根目錄: `.eslintrc.js`
- 前端: `apps/frontend/.eslintrc.js`
- 後端: `apps/backend/.eslintrc.js`

## 與 Prettier 的整合

本專案使用 Prettier 處理代碼格式化，ESLint 負責程式碼品質檢查：

```javascript
// .prettierrc.js 配置摘要
module.exports = {
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  trailingComma: 'es5',
  endOfLine: 'auto',
  arrowParens: 'avoid',
  bracketSpacing: true,
};
```

## Package.json 腳本

專案根目錄的 `package.json` 提供了以下與 ESLint 相關的腳本：

```json
{
  "scripts": {
    "lint": "pnpm -r lint",
    "lint:fix": "pnpm -r run lint:fix",
    "format": "prettier --write \"**/*.{js,ts,tsx,json,md}\""
  }
}
```

## 總結

遵循本指南和專案設定的 ESLint 規則，可以幫助團隊:

1. 保持程式碼風格一致性
2. 提前發現潛在問題
3. 減少程式錯誤
4. 提高代碼可讀性和可維護性

如有任何規則調整的建議，請先與團隊討論並取得共識後再進行修改。

這份更新後的指南更準確地反映了專案中的實際 ESLint 配置，包括與 Prettier 的整合以及前後端特定的規則設定。
