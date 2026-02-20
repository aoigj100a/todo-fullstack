// 測試 TodoCard 元件：標題/描述顯示，以及編輯、刪除按鈕的觸發行為

import { LanguageProvider } from '@/contexts/LanguageContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { TodoCard } from '../TodoCard';

// mock todoService - useTodoCard hook 呼叫 toggleTodoStatus
vi.mock('../../../service/todo', () => ({
  todoService: {
    toggleTodoStatus: vi.fn().mockResolvedValue(undefined),
  },
}));

// mock sonner - useTodoCard hook 呼叫 toast.success / toast.error
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// 包裝 LanguageProvider，useTodoCard 內部依賴 useLanguage hook
const renderWithLanguage = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

const defaultProps = {
  _id: 'todo-1',
  title: 'Fix login bug',
  status: 'pending' as const,
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  onStatusChange: vi.fn(),
};

describe('TodoCard', () => {
  // 基本 render 測試
  test('renders todo title', () => {
    renderWithLanguage(<TodoCard {...defaultProps} />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  // props 測試 - 有描述時顯示描述內容
  test('displays description when provided', () => {
    renderWithLanguage(<TodoCard {...defaultProps} description="This is a description" />);
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  test('does not display description when not provided', () => {
    renderWithLanguage(<TodoCard {...defaultProps} />);
    expect(screen.queryByText('This is a description')).not.toBeInTheDocument();
  });

  // 互動測試 - 編輯按鈕觸發 onEdit callback
  test('triggers onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    renderWithLanguage(<TodoCard {...defaultProps} onEdit={onEdit} />);
    // 卡片右側有兩個 button：edit (index 0)、delete (index 1)
    const [editButton] = screen.getAllByRole('button');
    await userEvent.click(editButton);
    expect(onEdit).toHaveBeenCalledOnce();
  });

  // 互動測試 - 刪除按鈕觸發 onDelete callback
  test('triggers onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    renderWithLanguage(<TodoCard {...defaultProps} onDelete={onDelete} />);
    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons[1];
    await userEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledOnce();
  });
});
