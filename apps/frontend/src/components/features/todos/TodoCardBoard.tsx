// components/features/todos/TodoCardBoard.tsx
import { useDraggable } from '@dnd-kit/core';
import { TodoCard } from './TodoCard';
import { Todo } from '@/types';

interface TodoCardBoardProps {
  todo: Todo;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
}

export function TodoCardBoard({ todo, onDelete, onEdit, onStatusChange }: TodoCardBoardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: todo._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      <TodoCard
        {...todo}
        onDelete={onDelete}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
        isDragging={isDragging}
        variant="compact"
      />
    </div>
  );
}
