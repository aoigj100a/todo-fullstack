// 測試 TodoStatusIcon 元件的 render 行為與 props 對應

import { render } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import TodoStatusIcon from '../TodoStatusIcon';

describe('TodoStatusIcon', () => {
  // 基本 render 測試 - 各狀態對應樣式
  test('renders pending status with red styling', () => {
    const { container } = render(<TodoStatusIcon status="pending" />);
    expect(container.querySelector('.text-red-500')).toBeInTheDocument();
  });

  test('renders in-progress status with yellow styling', () => {
    const { container } = render(<TodoStatusIcon status="in-progress" />);
    expect(container.querySelector('.text-yellow-500')).toBeInTheDocument();
  });

  test('renders completed status with green styling', () => {
    const { container } = render(<TodoStatusIcon status="completed" />);
    expect(container.querySelector('.text-green-500')).toBeInTheDocument();
  });

  // props 測試 - isUpdating 狀態
  test('renders loading spinner when isUpdating is true', () => {
    const { container } = render(<TodoStatusIcon status="pending" isUpdating={true} />);
    expect(container.querySelector('.text-blue-500')).toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  test('renders icon without spinner when isUpdating is false', () => {
    const { container } = render(<TodoStatusIcon status="completed" isUpdating={false} />);
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument();
    expect(container.querySelector('.text-green-500')).toBeInTheDocument();
  });
});
