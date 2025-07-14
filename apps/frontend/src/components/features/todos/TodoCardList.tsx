// components/features/todos/TodoCardList.tsx
import { TodoCard } from './TodoCard';
import { Todo } from '@/types';

interface TodoCardListProps {
  todo: Todo;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
  isFocused?: boolean;
}

export function TodoCardList({ todo, ...props }: TodoCardListProps) {
  return <TodoCard {...todo} {...props} variant="default" />;
}
