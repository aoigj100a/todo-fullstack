// hooks/useTodoCard.ts
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { todoService } from '@/service/todo';

export const useTodoCard = ({
  _id,
  status,
  onStatusChange,
  isDragging = false,
}: {
  _id: string;
  status: 'pending' | 'in-progress' | 'completed';
  onStatusChange: () => void;
  isDragging?: boolean;
}) => {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // 狀態顏色映射
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
  };

  // 狀態顯示名稱
  const statusTranslationKeys = {
    pending: 'status.pending',
    'in-progress': 'status.inProgress',
    completed: 'status.completed',
  };

  // 處理狀態切換
  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating || isDragging) return;
    setIsUpdating(true);
    try {
      await todoService.toggleTodoStatus(_id, status);
      toast.success(t('toast.statusUpdated'));
      onStatusChange();
    } catch (_) {
      toast.error(t('toast.error.update'));
    } finally {
      setIsUpdating(false);
    }
  };

  // 處理點擊事件
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;

    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      e.stopPropagation();
      return;
    }
    router.push(`/todos/${_id}`);
  };

  // 處理滑鼠事件
  const handleMouseEnter = () => !isDragging && setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return {
    t,
    isHovered,
    isUpdating,
    statusColor,
    statusTranslationKeys,
    handleStatusToggle,
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    setIsHovered,
  };
};
