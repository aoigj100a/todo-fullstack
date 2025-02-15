// src/app/todos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Minus, Check } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Todo } from "@/types/todo";
import { todoService } from "@/service/todo";
import TodoStatusIcon from "@/components/shared/TodoStatusIcon";

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

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-[48px]">
      <div className="flex justify-between items-center mt-[8px]">
        <h1 className="text-[48px] font-bold">My Todos</h1>
        <Button
          variant="default"
          className="text-[32px] bg-teal-500 hover:bg-teal-600"
        >
          Add Todo
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="p-4 text-center text-gray-500 border-teal-600 w-full">
          <div className="flex items-center">
            <div className="text-sm text-gray-500 text-[32px] px-[16px]">
              <TodoStatusIcon status={"completed"} />
            </div>
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[32px] truncate max-w-[280px]">
                完成專案文件
              </h3>
              <p className="text-sm text-gray-500 text-[16px] max-w-[220px] text-left text-overflow overflow-hidden line-clamp-2">
                撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 text-center text-gray-500 border-teal-600">
          <div className="flex items-center">
            <div className="text-sm text-gray-500 text-[32px] px-[16px]">
              <TodoStatusIcon status={"pending"} />
            </div>
            <div className="flex justify-between items-center  w-full">
              <h3 className="text-[32px] truncate max-w-[280px]">
                列表容器與卡片設計列表容器與卡片設計列表容器與卡片設計列表容器與卡片設計列表容器與卡片設計列表容器與卡片設計
              </h3>
              <p className="text-sm text-gray-500 text-[16px] max-w-[210px] text-left overflow-hidden line-clamp-2">
                撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件撰寫專案的技術文件
              </p>
            </div>
          </div>
        </Card>
      </div>
      {/* <div className="space-y-4">
        {todos.length === 0 ? (
          <Card className="p-4 text-center text-gray-500 border-teal-600">
            No todos yet. Create one to get started!
          </Card>
        ) : (
          todos.map((todo) => (
            <Card key={todo.id} className="p-4 border-teal-600">
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
      </div> */}
    </div>
  );
}
