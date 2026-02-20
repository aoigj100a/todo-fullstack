// 測試 TodosEmptyState 元件：根據篩選狀態顯示不同內容與按鈕

import { LanguageProvider } from '@/contexts/LanguageContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { TodosEmptyState } from '../TodosEmptyState';

// 包裝 LanguageProvider，元件依賴 useLanguage hook
const renderWithLanguage = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

describe('TodosEmptyState', () => {
  // 基本 render 測試 - 無篩選時
  test('renders create todo button when filter is all', () => {
    renderWithLanguage(
      <TodosEmptyState filterStatus="all" onClearFilter={vi.fn()} onCreateTodo={vi.fn()} />
    );
    expect(screen.getByText('Create Todo')).toBeInTheDocument();
  });

  // props 測試 - 有篩選條件時顯示清除按鈕
  test('renders clear filter button when filter is active', () => {
    renderWithLanguage(
      <TodosEmptyState filterStatus="pending" onClearFilter={vi.fn()} onCreateTodo={vi.fn()} />
    );
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
  });

  test('does not render clear filter button when filter is all', () => {
    renderWithLanguage(
      <TodosEmptyState filterStatus="all" onClearFilter={vi.fn()} onCreateTodo={vi.fn()} />
    );
    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();
  });

  // 互動測試 - 按鈕觸發 callback
  test('triggers onCreateTodo when create button is clicked', async () => {
    const onCreateTodo = vi.fn();
    renderWithLanguage(
      <TodosEmptyState filterStatus="all" onClearFilter={vi.fn()} onCreateTodo={onCreateTodo} />
    );
    await userEvent.click(screen.getByText('Create Todo'));
    expect(onCreateTodo).toHaveBeenCalledOnce();
  });

  test('triggers onClearFilter when clear filter button is clicked', async () => {
    const onClearFilter = vi.fn();
    renderWithLanguage(
      <TodosEmptyState
        filterStatus="pending"
        onClearFilter={onClearFilter}
        onCreateTodo={vi.fn()}
      />
    );
    await userEvent.click(screen.getByText('Clear Filters'));
    expect(onClearFilter).toHaveBeenCalledOnce();
  });
});
