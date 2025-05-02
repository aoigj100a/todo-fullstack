// apps/frontend/src/components/todos/TodoCard.tsx
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
}

export function TodoCard({
  title,
  description,
  status,
  _id,
  onDelete,
  onEdit,
  onStatusChange,
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
    e.stopPropagation(); // 阻止事件冒泡
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await todoService.toggleTodoStatus(_id, status);
      toast.success(t('toast.statusUpdated'));
      onStatusChange(); // 通知父組件狀態已更新
    } catch (error) {
      toast.error(t('toast.error.update'));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.stopPropagation(); // 阻止事件冒泡
      return;
    }
    router.push(`/todos/${_id}`);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 p-4">
        <div onClick={handleStatusToggle} className="cursor-pointer">
          <TodoStatusIcon status={status} isUpdating={isUpdating} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold">{title}</h3>
            <Badge className={`${statusColor[status]} ml-2`}>
              {t(statusTranslationKeys[status])}
            </Badge>
          </div>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>

        <div className="flex items-center gap-2">
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
