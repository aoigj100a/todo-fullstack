// 測試 CreateTodoDialog 元件：觸發按鈕、對話框開啟、表單輸入與空白標題驗證

import { todoService } from '@/service/todo';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { CreateTodoDialog } from '../CreateTodoDialog';

// mock todoService - 避免測試時發送真實 API 請求
vi.mock('@/service/todo', () => ({
  todoService: {
    createTodo: vi.fn(),
  },
}));

// 包裝 LanguageProvider，元件依賴 useLanguage hook
const renderWithLanguage = (ui: React.ReactElement) =>
  render(<LanguageProvider>{ui}</LanguageProvider>);

describe('CreateTodoDialog', () => {
  // 基本 render 測試 - uncontrolled 模式顯示觸發按鈕
  test('renders add todo trigger button in uncontrolled mode', () => {
    renderWithLanguage(<CreateTodoDialog onSuccess={vi.fn()} />);
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
  });

  // props 測試 - controlled 模式 open={true} 直接顯示對話框內容
  test('renders dialog content when open is true in controlled mode', () => {
    renderWithLanguage(<CreateTodoDialog onSuccess={vi.fn()} open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Create New Todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  // 互動測試 - 點擊觸發按鈕開啟對話框
  test('opens dialog when trigger button is clicked', async () => {
    renderWithLanguage(<CreateTodoDialog onSuccess={vi.fn()} />);
    await userEvent.click(screen.getByText('Add Todo'));
    expect(screen.getByText('Create New Todo')).toBeInTheDocument();
  });

  // 互動測試 - 可在 title 欄位輸入文字
  test('allows typing in title input', async () => {
    renderWithLanguage(<CreateTodoDialog onSuccess={vi.fn()} open={true} onOpenChange={vi.fn()} />);
    const titleInput = screen.getByLabelText('Title');
    await userEvent.type(titleInput, 'New Task');
    expect(titleInput).toHaveValue('New Task');
  });

  // 驗證測試 - 空白標題不呼叫 createTodo
  test('does not call createTodo when title is empty', async () => {
    vi.mocked(todoService.createTodo).mockResolvedValue({ _id: 'new-1', title: 'test' } as any);
    vi.clearAllMocks();
    renderWithLanguage(<CreateTodoDialog onSuccess={vi.fn()} open={true} onOpenChange={vi.fn()} />);
    await userEvent.click(screen.getByText('Create Todo'));
    expect(vi.mocked(todoService.createTodo)).not.toHaveBeenCalled();
  });
});
