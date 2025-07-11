// apps/frontend/src/components/features/todos/TodoCard.tsx
import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TodoStatusIcon from '../../shared/TodoStatusIcon';

import { useLanguage } from '@/contexts/LanguageContext';
import { todoService } from '@/service/todo';

interface TodoCardProps {
  _id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
  isFocused?: boolean;
  isDragging?: boolean; // 新增拖曳狀態
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
}: TodoCardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // 定義狀態顏色映射
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  // 定義狀態顯示名稱
  const statusTranslationKeys = {
    pending: 'status.pending',
    'in-progress': 'status.inProgress',
    completed: 'status.completed',
  };

  // 處理點擊狀態圖標的事件
  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating || isDragging) return; // 拖曳時不處理點擊

    setIsUpdating(true);
    try {
      await todoService.toggleTodoStatus(_id, status);
      toast.success(t('toast.statusUpdated'));
      onStatusChange();
    } catch (error) {
      toast.error(t('toast.error.update'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return; // 拖曳時不處理點擊

    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.stopPropagation();
      return;
    }
    router.push(`/todos/${_id}`);
  };

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-200 
      hover:shadow-md ${isDragging ? '' : 'cursor-pointer'}
      ${isFocused ? 'ring-2 ring-teal-500 ring-offset-2' : ''}
      ${isDragging ? 'shadow-lg' : ''}`}
      onMouseEnter={() => !isDragging && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      tabIndex={isFocused ? 0 : -1}
      data-todo-id={_id}
    >
      <div className="flex items-center gap-4 p-4">
        <div
          onClick={handleStatusToggle}
          className={isDragging ? 'pointer-events-none' : 'cursor-pointer'}
        >
          <TodoStatusIcon status={status} isUpdating={isUpdating} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold line-clamp-2">{title}</h3>
            <Badge
              className={`${statusColor[status]} hidden sm:block flex-shrink-0 self-start sm:self-center`}
            >
              {t(statusTranslationKeys[status])}
            </Badge>
          </div>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
