// components/features/todos/TodosBoardView.tsx
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TodoCardBoard } from './TodoCardBoard';
import { Todo } from '@/types/todo';

interface TodosBoardViewProps {
  todos: Todo[];
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onStatusChange: () => void;
}

const DroppableColumn = ({ children, id }: { children: React.ReactNode; id: string }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] transition-colors duration-200 ${
        isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
      }`}
    >
      {children}
    </div>
  );
};

export function TodosBoardView({ todos, onDelete, onEdit, onStatusChange }: TodosBoardViewProps) {
  const todosByStatus = {
    pending: todos.filter((todo) => todo.status === 'pending'),
    'in-progress': todos.filter((todo) => todo.status === 'in-progress'),
    completed: todos.filter((todo) => todo.status === 'completed'),
  };

  const columns = [
    {
      id: 'pending',
      title: 'Pending',
      color: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-blue-100',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column, colIndex) => (
        <motion.div
          key={column.id}
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: colIndex * 0.1, duration: 0.3 }}
        >
          <Card className={`${column.color} border ${column.borderColor}`}>
            <CardHeader className="px-4 py-3">
              <CardTitle
                className={`text-md font-medium flex items-center justify-between ${column.textColor}`}
              >
                {column.title}
                <span className="bg-white text-xs font-normal px-2 py-1 rounded-full">
                  {todosByStatus[column.id as keyof typeof todosByStatus].length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2 max-h-[calc(100vh-220px)] overflow-y-auto">
              <DroppableColumn id={column.id}>
                <div className="space-y-2">
                  {todosByStatus[column.id as keyof typeof todosByStatus].map((todo) => (
                    <TodoCardBoard
                      key={todo._id}
                      todo={todo}
                      onDelete={() => onDelete(todo._id)}
                      onEdit={() => onEdit(todo)}
                      onStatusChange={onStatusChange}
                    />
                  ))}
                </div>
              </DroppableColumn>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
