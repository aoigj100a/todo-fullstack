"use client";

import { useState, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { TodosLoadingState } from "@/components/todos/TodosLoadingState";
import { CreateTodoDialog } from "@/components/todos/CreateTodoDialog";
import { TodoCard } from "@/components/todos/TodoCard";

import { Todo } from "@/types/todo";
import { todoService } from "@/service/todo";


function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
      loadTodos();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Todos</h1>
        <CreateTodoDialog onSuccess={loadTodos} />
      </div>

      {isLoading ? (
        <TodosLoadingState />
      ) : (
        <div className="space-y-4">
          {todos.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              <p className="text-lg">No todos yet. Create one to get started!</p>
            </Card>
          ) : (
            todos.map((todo) => (
              <TodoCard
                key={todo._id}
                title={todo.title}
                description={todo.description}
                status={todo.status}
                onDelete={() => handleDelete(todo._id)}
                onEdit={() => console.log('edit', todo._id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default TodosPage;