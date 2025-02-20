import { useState } from "react";

import { Trash2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TodoStatusIcon from "../shared/TodoStatusIcon";

import { useRouter } from "next/navigation";

interface TodoCardProps {
  _id: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  onDelete: () => void;
  onEdit: () => void;
}

export function TodoCard({
  title,
  description,
  status,
  _id,
  onDelete,
  onEdit,
}: TodoCardProps) {

  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

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
        <TodoStatusIcon status={status} />
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
