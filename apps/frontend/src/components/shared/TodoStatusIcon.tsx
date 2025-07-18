// src/components/shared/TodoStatusIcon.tsx
import React from 'react';
import { X, Minus, Check, Loader2 } from 'lucide-react';

interface TodoStatusIconProps {
  status: 'pending' | 'in-progress' | 'completed';
  isUpdating?: boolean; // 添加更新中狀態
}

const TodoStatusIcon: React.FC<TodoStatusIconProps> = ({ status, isUpdating = false }) => {
  // 如果正在更新，顯示加載圖標
  if (isUpdating) {
    return (
      <div className="text-blue-500 rounded-[16px] p-1 bg-blue-100 status-icon transition-all duration-200 hover:shadow-md hover:scale-105">
        <Loader2 size={32} className="animate-spin" />
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="text-red-500 rounded-[16px] p-1 bg-red-100 status-icon transition-all duration-200 hover:shadow-md hover:shadow-red-200/50 hover:scale-105 cursor-pointer">
            <X size={32} />
          </div>
        );
      case 'in-progress':
        return (
          <div className="text-yellow-500 rounded-[16px] p-1 bg-yellow-100 status-icon transition-all duration-200 hover:shadow-md hover:shadow-yellow-200/50 hover:scale-105 cursor-pointer">
            <Minus size={32} />
          </div>
        );
      case 'completed':
        return (
          <div className="text-green-500 rounded-[16px] p-1 bg-green-100 status-icon transition-all duration-200 hover:shadow-md hover:shadow-green-200/50 hover:scale-105 cursor-pointer">
            <Check size={32} />
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="inline-flex items-center">{getStatusIcon()}</div>;
};

export default TodoStatusIcon;
