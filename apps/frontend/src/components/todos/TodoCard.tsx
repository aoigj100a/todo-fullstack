import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TodoStatusIcon from "../shared/TodoStatusIcon";

import { todoService } from "@/service/todo";
import { TodoStatus } from "@/types/todo";

interface TodoCardProps {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  onDelete: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
}

export function TodoCard({
  title,
  description,
  status,
  _id,
  onDelete,
  onEdit,
  onStatusChange,
}: TodoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  // 處理點擊狀態圖標的事件
  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await todoService.toggleTodoStatus(_id, status);
      toast.success("Status updated");
      onStatusChange(); // 通知父組件狀態已更新
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // 使用 useCallback 來優化性能，並確保可以訪問到 _id
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      e.stopPropagation(); // 阻止事件冒泡
      return;
    }
    router.push(`/todos/${_id}`);
  };

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-center gap-4 p-4">
        <div onClick={handleStatusToggle} className="cursor-pointer">
          <TodoStatusIcon status={status} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
