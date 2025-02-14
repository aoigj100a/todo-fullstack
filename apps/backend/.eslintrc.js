// apps/backend/.eslintrc.js
module.exports = {
    extends: ['../../.eslintrc.js'],
    env: {
      node: true,
      jest: true
    },
    rules: {
      // 允許在特定檔案中使用 console
      'no-console': ['warn', {
        allow: ['warn', 'error']
      }],
      
      // 放寬 any 的使用限制，但保持警告
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // 未使用的變數處理
      '@typescript-eslint/no-unused-vars': ['warn', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }],
  
      // 允許空函數
      '@typescript-eslint/no-empty-function': 'off',
  
      // 強制使用更具體的類型
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true
      }]
    },
    overrides: [
      {
        // 測試檔案的特殊規則
        files: ['**/*.test.ts', '**/*.spec.ts'],
        rules: {
          'no-console': 'off',
          '@typescript-eslint/no-explicit-any': 'off'
        }
      }
    ]
  };