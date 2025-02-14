// src/app/todos/page.tsx
"use client";

import { useState, useEffect } from "react";

import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Todo } from "@/types/todo";
import { todoService } from "@/service/todo";

export default function TodoList() {
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
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <Button>Add Todo</Button>
      </div>

      <div className="space-y-4">
        {todos.length === 0 ? (
          <Card className="p-4 text-center text-gray-500">
            No todos yet. Create one to get started!
          </Card>
        ) : (
          todos.map((todo) => (
            <Card key={todo.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{todo.title}</h3>
                  {todo.description && (
                    <p className="text-sm text-gray-500">{todo.description}</p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Status: {todo.status}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}