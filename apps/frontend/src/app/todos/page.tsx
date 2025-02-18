"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TodoStatusIcon from "@/components/shared/TodoStatusIcon";
import { TodosLoadingState } from "@/components/todos/TodosLoadingState";

import { Todo } from "@/types/todo";
import { todoService } from "@/service/todo";

interface TodoCardProps {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  onDelete: () => void;
  onEdit: () => void;
}

function TodoCard({
  title,
  description,
  status,
  onDelete,
  onEdit,
}: TodoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-6 p-6">
        <div className="flex items-center">
          <TodoStatusIcon status={status} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>

            <div
              className={`flex gap-2 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8 w-8 p-0 hover:bg-gray-100"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {description && (
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {/* <div
        className={`absolute bottom-0 left-0 h-1 w-full
          ${
            status === "completed"
              ? "bg-green-500"
              : status === "in-progress"
                ? "bg-blue-500"
                : "bg-gray-300"
          }`}
      /> */}
    </Card>
  );
}

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

  // if (isLoading) {
  //   return (
  //     <div className="flex h-96 items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
  //     </div>
  //   );
  // }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Todos</h1>
        <Button variant="default" className="bg-teal-500 hover:bg-teal-600">
          Add Todo
        </Button>
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
