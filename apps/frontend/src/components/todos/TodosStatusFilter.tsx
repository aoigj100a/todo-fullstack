// src/components/todos/TodosStatusFilter.tsx (優化版)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, ListFilter, X } from "lucide-react";


type FilterStatus = "all" | "pending" | "in-progress" | "completed";

interface StatusCount {
  all: number;
  pending: number;
  "in-progress": number;
  completed: number;
}

interface TodosStatusFilterProps {
  className?: string;
  currentStatus: FilterStatus;
  statusCounts?: Partial<StatusCount>;
  onStatusChange: (status: FilterStatus) => void;
}

export function TodosStatusFilter({ 
  className, 
  currentStatus, 
  statusCounts = {}, 
  onStatusChange 
}: TodosStatusFilterProps) {
  // 創建一個帶默認值的安全計數對象
  const counts = {
    all: statusCounts.all || 0,
    pending: statusCounts.pending || 0,
    "in-progress": statusCounts["in-progress"] || 0,
    completed: statusCounts.completed || 0
  };

  // 定義每個狀態的顏色和圖標
  const statusConfig = {
    all: { icon: ListFilter, color: "text-gray-600" },
    pending: { icon: X, color: "text-yellow-500" },
    "in-progress": { icon: Clock, color: "text-blue-500" },
    completed: { icon: Check, color: "text-green-500" }
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="w-full md:w-auto flex flex-wrap gap-2">
        {Object.entries(statusConfig).map(([status, config]) => {
          const isActive = currentStatus === status;
          const Icon = config.icon;
          
          return (
            <Button 
              key={status}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`flex items-center gap-1 ${isActive ? "bg-primary" : "bg-background hover:bg-muted/30"} transition-colors`}
              onClick={() => onStatusChange(status as FilterStatus)}
            >
              <Icon className={`h-4 w-4 ${config.color}`} />
              <span className="capitalize">
                {status === "in-progress" ? "In Progress" : status}
              </span>
              <Badge 
                className={`ml-1 ${isActive ? "bg-primary-foreground text-primary" : "bg-muted text-muted-foreground"}`}
                variant={isActive ? "secondary" : "outline"}
              >
                {counts[status as keyof typeof counts]}
              </Badge>
              
            </Button>
          );
        })}
      </div>
    </div>
  );
}