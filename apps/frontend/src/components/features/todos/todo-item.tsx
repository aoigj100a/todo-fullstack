// src/components/features/todos/todo-item.tsx
import { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Todo } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (todo: Todo) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
      await onUpdate({ ...todo, status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(todo.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleStatusToggle}
            disabled={isUpdating}
          >
            {todo.status === 'completed' ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full border-2" />
            )}
          </Button>
          
          <div>
            <h3 className={`font-medium ${
              todo.status === 'completed' ? 'line-through text-muted-foreground' : ''
            }`}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-muted-foreground">
                {todo.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge
            className={`${getStatusColor(todo.status)} text-white`}
          >
            {todo.status}
          </Badge>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {/* TODO: Implement edit */}}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}