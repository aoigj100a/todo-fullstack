import React from 'react';
import { X, Minus, Check } from 'lucide-react';

interface TodoStatusIconProps {
  status: 'pending' | 'in-progress' | 'completed';
}

const TodoStatusIcon: React.FC<TodoStatusIconProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return (
          <div className="text-red-500 rounded-[16px] p-1 bg-red-100">
            <X size={32} />
          </div>
        );
      case 'in-progress':
        return (
          <div className="text-yellow-500 rounded-[16px]l p-1 bg-yellow-100">
            <Minus size={32} />
          </div>
        );
      case 'completed':
        return (
          <div className="text-green-500 rounded-[16px] p-1 bg-green-100">
            <Check size={32} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="inline-flex items-center">
      {getStatusIcon()}
    </div>
  );
};

export default TodoStatusIcon;