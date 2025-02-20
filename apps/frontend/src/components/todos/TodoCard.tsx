import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TodoStatusIcon from "@/components/shared/TodoStatusIcon";

interface TodoCardProps {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  onDelete: () => void;
  onEdit: () => void;
}

export function TodoCard({
  _id,
  title,
  description,
  status,
  onDelete,
  onEdit,
}: TodoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // 使用 useCallback 來優化性能，並確保可以訪問到 _id
  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
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
      <div className="flex gap-6 p-6">
        <div className="flex items-center">
          <TodoStatusIcon status={status} />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-lg line-clamp-1">{title}</h3>

            <div
              className={`flex gap-2 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
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
    </Card>
  );
}