"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { TodosLoadingState } from "@/components/todos/TodosLoadingState";
import { TodoCard } from "@/components/todos/TodoCard";
import { Button } from "@/components/ui/button";

import { Todo } from "@/types/todo";
import { todoService } from "@/service/todo";

const UNDO_TIMEOUT = 5000; // 5 seconds for undo window

function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const pendingDeletions = useRef<Map<string, {
    todo: Todo;
    timeoutId: NodeJS.Timeout;
    toastId?: string;
  }>>(new Map());

  useEffect(() => {
    loadTodos();
    return () => {
      pendingDeletions.current.forEach(({ timeoutId }) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(prevTodos => {
        const pendingTodoIds = Array.from(pendingDeletions.current.keys());
        return data.filter(todo => !pendingTodoIds.includes(todo._id));
      });
    } catch (error) {
      toast.error("Failed to load todos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (todoId: string) => {
    console.log('Starting delete process for:', todoId);
    
    const todoToDelete = todos.find(t => t._id === todoId);
    if (!todoToDelete) return;

    // Clear any existing timeout
    if (pendingDeletions.current.has(todoId)) {
      const { timeoutId, toastId } = pendingDeletions.current.get(todoId)!;
      clearTimeout(timeoutId);
      if (toastId) toast.dismiss(toastId);
    }

    // Optimistically remove from UI
    setTodos(currentTodos => 
      currentTodos.filter(todo => todo._id !== todoId)
    );

    // Show toast with undo button
    const toastId = toast("Todo deleted", {
      action: {
        label: "Undo",
        onClick: () => handleUndo(todoId),
      },
      duration: UNDO_TIMEOUT,
      description: `"${todoToDelete.title}" has been removed`,
    });

    // Set deletion timeout
    const timeoutId = setTimeout(async () => {
      try {
        console.log('Executing final delete for:', todoId);
        await todoService.deleteTodo(todoId);
        console.log('Delete completed successfully');
        pendingDeletions.current.delete(todoId);
      } catch (error) {
        console.error('Delete failed:', error);
        handleUndo(todoId);
        toast.error("Failed to delete todo");
      }
    }, UNDO_TIMEOUT);

    // Store in pending deletions
    pendingDeletions.current.set(todoId, {
      todo: todoToDelete,
      timeoutId,
      toastId,
    });
  };

  const handleUndo = (todoId: string) => {
    const pendingDeletion = pendingDeletions.current.get(todoId);
    if (!pendingDeletion) return;

    clearTimeout(pendingDeletion.timeoutId);
    if (pendingDeletion.toastId) {
      toast.dismiss(pendingDeletion.toastId);
    }
    pendingDeletions.current.delete(todoId);

    setTodos(currentTodos => {
      if (currentTodos.some(t => t._id === todoId)) return currentTodos;
      return [...currentTodos, pendingDeletion.todo];
    });

    toast.success("Todo restored", {
      description: `"${pendingDeletion.todo.title}" has been restored`,
    });
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Todos</h1>
      </div>

      {isLoading ? (
        <TodosLoadingState />
      ) : (
        <div className="space-y-4">
          {todos.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              <p className="text-lg">
                No todos yet. Create one to get started!
              </p>
            </Card>
          ) : (
            todos.map((todo) => (
              <TodoCard
                key={todo._id}
                {...todo}
                onDelete={() => handleDelete(todo._id)}
                onEdit={() => console.log("edit", todo._id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TodosPage;