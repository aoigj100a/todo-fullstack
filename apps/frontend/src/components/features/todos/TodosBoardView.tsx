// apps/frontend/src/components/features/todos/TodosBoardView.tsx
import { motion } from 'framer-motion';
import { useDraggable, useDroppable } from '@dnd-kit/core';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TodoCard } from '@/components/features/todos/TodoCard';
import { Todo } from '@/types/todo';

interface TodosBoardViewProps {
  todos: Todo[];
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onStatusChange: () => void;
}

// 可拖放區域組件 - 無虛線版本
const DroppableColumn = ({ children, id }: { children: React.ReactNode; id: string }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[200px] transition-colors duration-200 rounded-lg ${
        isOver ? 'bg-blue-50' : ''
      }`}
    >
      {children}
    </div>
  );
};

// 可拖曳的 TodoCard 包裝器 - 保持原有的手指游標
const DraggableTodoCard = ({
  todo,
  onDelete,
  onEdit,
  onStatusChange,
}: {
  todo: Todo;
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
}) => {
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
      {...attributes}
      className={`transition-all duration-200 select-none relative ${
        isDragging ? 'opacity-50 z-50 cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <TodoCard
        {...todo}
        onDelete={onDelete}
        onEdit={onEdit}
        onStatusChange={onStatusChange}
        isDragging={isDragging}
        variant="compact"
      />

      {/* 專門的拖曳區域 - 保持手指游標 */}
      <div
        {...listeners}
        className={`absolute top-0 left-12 right-20 bottom-0 z-10 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        title="拖曳此區域移動任務"
      />
    </div>
  );
};

// 保持其餘的程式碼不變...
export function TodosBoardView({ todos, onDelete, onEdit, onStatusChange }: TodosBoardViewProps) {
  // 按狀態分組 todos
  const todosByStatus = {
    pending: todos.filter(todo => todo.status === 'pending'),
    'in-progress': todos.filter(todo => todo.status === 'in-progress'),
    completed: todos.filter(todo => todo.status === 'completed'),
  };

  // 定義每個狀態欄的顏色和標題
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
                  {todosByStatus[column.id as keyof typeof todosByStatus].length > 0 ? (
                    todosByStatus[column.id as keyof typeof todosByStatus].map((todo, index) => (
                      <motion.div
                        key={todo._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.1 + index * 0.05,
                          duration: 0.2,
                        }}
                        className="group"
                      >
                        <DraggableTodoCard
                          todo={todo}
                          onDelete={() => onDelete(todo._id)}
                          onEdit={() => onEdit(todo)}
                          onStatusChange={onStatusChange}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="text-center p-4 border border-dashed rounded-lg bg-white/50"
                    >
                      No tasks in this status
                    </motion.div>
                  )}
                </div>
              </DroppableColumn>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
