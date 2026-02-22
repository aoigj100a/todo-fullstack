// 測試 TodosFilterBar 元件：視圖切換按鈕的顯示與互動行為

import { LanguageProvider } from '@/contexts/LanguageContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { TodosFilterBar } from '../TodosFilterBar';

// 包裝 LanguageProvider，元件依賴 useLanguage hook
const renderWithLanguage = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

describe('TodosFilterBar', () => {
  // 基本 render 測試 - 兩個視圖切換按鈕都存在
  test('renders list and board view buttons', () => {
    renderWithLanguage(<TodosFilterBar viewType="list" onViewChange={vi.fn()} />);
    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Board')).toBeInTheDocument();
  });

  // props 測試 - 當前視圖對應 active 樣式
  test('displays list button with active shadow when viewType is list', () => {
    renderWithLanguage(<TodosFilterBar viewType="list" onViewChange={vi.fn()} />);
    const listButton = screen.getByText('List').closest('button');
    expect(listButton).toHaveClass('shadow-sm');
  });

  test('displays board button with active shadow when viewType is board', () => {
    renderWithLanguage(<TodosFilterBar viewType="board" onViewChange={vi.fn()} />);
    const boardButton = screen.getByText('Board').closest('button');
    expect(boardButton).toHaveClass('shadow-sm');
  });

  // 互動測試 - 點擊切換視圖
  test('triggers onViewChange with board when board button is clicked', async () => {
    const onViewChange = vi.fn();
    renderWithLanguage(<TodosFilterBar viewType="list" onViewChange={onViewChange} />);
    await userEvent.click(screen.getByText('Board'));
    expect(onViewChange).toHaveBeenCalledWith('board');
  });

  test('triggers onViewChange with list when list button is clicked', async () => {
    const onViewChange = vi.fn();
    renderWithLanguage(<TodosFilterBar viewType="board" onViewChange={onViewChange} />);
    await userEvent.click(screen.getByText('List'));
    expect(onViewChange).toHaveBeenCalledWith('list');
  });
});
