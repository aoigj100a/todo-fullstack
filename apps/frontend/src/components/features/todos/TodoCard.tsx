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
  variant?: 'default' | 'compact'; // 新增變體支援
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
    ${variant === 'compact' ? 'p-3' : ''}
  `;

  return (
    <Card
      className={cardClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      tabIndex={isFocused ? 0 : -1}
      data-todo-id={_id}
    >
      <div className={`flex items-center gap-4 ${variant === 'compact' ? 'p-2' : 'p-4'}`}>
        {/* 狀態圖標 */}
        <div
          onClick={handleStatusToggle}
          className={
            isDragging
              ? 'pointer-events-none'
              : 'cursor-pointer hover:scale-110 transition-transform'
          }
        >
          <TodoStatusIcon status={status} disabled={isUpdating} />
        </div>

        {/* 內容區域 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{title}</h3>
          {description && variant === 'default' && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
          )}
          {variant === 'default' && (
            <Badge className={`mt-2 ${statusColor[status]}`}>
              {t(statusTranslationKeys[status])}
            </Badge>
          )}
        </div>

        {/* 操作按鈕 */}
        {(isHovered || isFocused) && !isDragging && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
