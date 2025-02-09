"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "完成前端開發", completed: false },
    { id: 2, text: "學習 shadcn/ui", completed: true },
    { id: 3, text: "製作 TodoList", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;

    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo,
        completed: false,
      },
    ]);
    setNewTodo("");
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello Tailwind
      </h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            待辦事項清單
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTodo} className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="新增待辦事項..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              新增
            </Button>
          </form>

          <div className="h-96 overflow-y-auto">
            <div className="space-y-4">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white border"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id)}
                    />
                    <span
                      className={`${
                        todo.completed ? "line-through text-slate-500" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-500 text-center">
            總計: {todos.length} 項 / 已完成:{" "}
            {todos.filter((t) => t.completed).length} 項
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TodoList;
