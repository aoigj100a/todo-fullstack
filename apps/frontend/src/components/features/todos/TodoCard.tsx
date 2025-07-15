// components/features/todos/TodoCard.tsx
import { Trash2, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TodoStatusIcon from '../../shared/TodoStatusIcon';
import { useTodoCard } from '@/hooks/useTodoCard';

interface TodoCardProps {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
  isFocused?: boolean;
  isDragging?: boolean;
  variant?: 'default' | 'compact';
}

export function TodoCard({
  title,
  description,
  status,
  _id,
  onDelete,
  onEdit,
  onStatusChange,
  isFocused = false,
  isDragging = false,
  variant = 'default',
}: TodoCardProps) {
  const {
    t,
    isHovered,
    isUpdating,
    statusColor,
    statusTranslationKeys,
    handleStatusToggle,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
  } = useTodoCard({
    _id,
    status,
    onDelete,
    onEdit,
    onStatusChange,
    isDragging,
  });

  const cardClasses = `
    group relative overflow-hidden transition-all duration-200 
    hover:shadow-md ${isDragging ? '' : 'cursor-pointer'}
    ${isFocused ? 'ring-2 ring-teal-500 ring-offset-2' : ''}
    ${isDragging ? 'shadow-lg' : ''}
    ${variant === 'compact' ? 'p-1' : ''}
  `;

  // 處理編輯按鈕點擊
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      onEdit();
    }
  };

  // 處理刪除按鈕點擊
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragging) {
      onDelete();
    }
  };

  return (
    <Card
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      tabIndex={isFocused ? 0 : -1}
      data-todo-id={_id}
    >
      <div className={`flex items-center gap-4 ${variant === 'compact' ? 'p-3' : 'p-4'}`}>
        {/* 狀態圖標 - 左側互動區域 */}
        <div
          onClick={handleStatusToggle}
          className={`status-icon transition-colors relative z-50 flex-shrink-0 ${
            isDragging ? 'pointer-events-none' : 'cursor-pointer hover:bg-gray-100 rounded-full p-1'
          }`}
        >
          <TodoStatusIcon status={status} isUpdating={isUpdating} />
        </div>

        {/* 內容區域 - 中間拖曳區域 */}
        <div className="flex-1 min-w-0 py-2 relative">
          <h3
            className={`font-medium text-gray-900 truncate select-none ${
              variant === 'compact' ? 'text-sm' : 'text-base'
            }`}
          >
            {title}
          </h3>

          {/* 描述 - 根據變體調整顯示 */}
          {description && variant === 'default' && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 select-none">{description}</p>
          )}
          {description && variant === 'compact' && (
            <p className="text-xs text-gray-400 mt-1 truncate select-none">{description}</p>
          )}

          {/* 狀態徽章 - 只在 default 模式顯示 */}
          {variant === 'default' && (
            <Badge className={`mt-2 ${statusColor[status]} select-none`}>
              {t(statusTranslationKeys[status])}
            </Badge>
          )}

          {/* Compact 模式的狀態指示 */}
          {variant === 'compact' && (
            <div
              className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${statusColor[status]} select-none`}
            >
              {t(statusTranslationKeys[status])}
            </div>
          )}
        </div>

        {/* 操作按鈕 - 右側互動區域 */}
        <div className="flex items-center gap-2 relative z-50 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
            className={`transition-all duration-200 relative z-50 ${
              variant === 'compact'
                ? 'opacity-60 hover:opacity-100' // Board 視圖中始終可見
                : 'opacity-0 group-hover:opacity-100' // List 視圖中 hover 顯示
            } ${isDragging ? 'pointer-events-none' : 'pointer-events-auto'}`}
            disabled={isDragging}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className={`transition-all duration-200 text-red-600 hover:text-red-700 relative z-50 ${
              variant === 'compact'
                ? 'opacity-60 hover:opacity-100' // Board 視圖中始終可見
                : 'opacity-0 group-hover:opacity-100' // List 視圖中 hover 顯示
            } ${isDragging ? 'pointer-events-none' : 'pointer-events-auto'}`}
            disabled={isDragging}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
