// src/components/todos/TodosEmptyState.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FilterX, Plus } from "lucide-react";

type FilterStatus = "all" | "pending" | "in-progress" | "completed";

interface TodosEmptyStateProps {
  filterStatus: FilterStatus;
  onClearFilter: () => void;
  onCreateTodo: () => void;
}

export function TodosEmptyState({
  filterStatus,
  onClearFilter,
  onCreateTodo,
}: TodosEmptyStateProps) {
  const isFiltered = filterStatus !== "all";

  const statusMessages = {
    all: "You don't have any todos yet. Create one to get started!",
    pending: "No pending tasks found.",
    "in-progress": "No tasks in progress.",
    completed: "No completed tasks yet.",
  };

  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        {isFiltered ? (
          <FilterX className="h-12 w-12 text-muted-foreground" />
        ) : (
          <Plus className="h-12 w-12 text-muted-foreground" />
        )}

        <h3 className="text-lg font-medium">
          {isFiltered ? "No matching tasks" : "No tasks yet"}
        </h3>

        <p className="text-muted-foreground">{statusMessages[filterStatus]}</p>

        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {isFiltered && (
            <Button
              variant="outline"
              onClick={onClearFilter}
              className="flex items-center gap-1"
            >
              <FilterX className="h-4 w-4" />
              Clear Filters
            </Button>
          )}

          <Button onClick={onCreateTodo} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Create Todo
          </Button>
        </div>
      </div>
    </Card>
  );
}
