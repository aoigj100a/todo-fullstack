import { Trash2, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TodoStatusIcon from "../shared/TodoStatusIcon";

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
  onDelete,
  onEdit,
}: TodoCardProps) {
  return (
    <Card>
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
