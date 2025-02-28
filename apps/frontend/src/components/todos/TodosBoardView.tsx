// src/components/todos/TodosBoardView.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TodoCard } from "@/components/todos/TodoCard";
import { Todo } from "@/types/todo";

interface TodosBoardViewProps {
  todos: Todo[];
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onStatusChange: () => void;
}

export function TodosBoardView({
  todos,
  onDelete,
  onEdit,
  onStatusChange,
}: TodosBoardViewProps) {
  // 按狀態分組 todos，不考慮篩選 (我們已經接收篩選後的 todos)
  const todosByStatus = {
    pending: todos.filter((todo) => todo.status === "pending"),
    "in-progress": todos.filter((todo) => todo.status === "in-progress"),
    completed: todos.filter((todo) => todo.status === "completed"),
  };

  // 定義每個狀態欄的顏色和標題
  const columns = [
    {
      id: "pending",
      title: "Pending",
      color: "bg-yellow-100",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-100",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
    },
    {
      id: "completed",
      title: "Completed",
      color: "bg-green-100",
      textColor: "text-green-700",
      borderColor: "border-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((column) => (
        <div key={column.id} className="space-y-4">
          <Card className={`${column.color} border ${column.borderColor}`}>
            <CardHeader className="px-4 py-3">
              <CardTitle
                className={`text-md font-medium flex items-center justify-between ${column.textColor}`}
              >
                {column.title}
                <span className="bg-white text-xs font-normal px-2 py-1 rounded-full">
                  {
                    todosByStatus[column.id as keyof typeof todosByStatus]
                      .length
                  }
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 pb-2 max-h-[calc(100vh-220px)] overflow-y-auto">
              <div className="space-y-2">
                {todosByStatus[column.id as keyof typeof todosByStatus].length >
                0 ? (
                  todosByStatus[column.id as keyof typeof todosByStatus].map(
                    (todo) => (
                      <TodoCard
                        key={todo._id}
                        {...todo}
                        onDelete={() => onDelete(todo._id)}
                        onEdit={() => onEdit(todo)}
                        onStatusChange={onStatusChange}
                      />
                    )
                  )
                ) : (
                  <div className="text-center p-4 border border-dashed rounded-lg bg-white/50">
                    No tasks in this status
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
