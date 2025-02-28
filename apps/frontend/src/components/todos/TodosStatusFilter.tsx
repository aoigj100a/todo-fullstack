// src/components/todos/TodosStatusFilter.tsx
import { Check, Clock, ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TodosStatusFilterProps {
  className?: string;
}

export function TodosStatusFilter({ className }: TodosStatusFilterProps) {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>

      <Button
        variant="outline"
        size="sm"
        className="bg-background border-primary text-primary"
      >
        <ListFilter className="h-4 w-4 mr-1" />
        All
        <Badge
          className="ml-1 bg-primary text-primary-foreground"
          variant="secondary"
        >
          12
        </Badge>
      </Button>

      <Button variant="outline" size="sm">
        <X className="h-4 w-4 mr-1 text-yellow-500" />
        Pending
        <Badge className="ml-1" variant="outline">
          5
        </Badge>
      </Button>

      <Button variant="outline" size="sm">
        <Clock className="h-4 w-4 mr-1 text-blue-500" />
        In Progress
        <Badge className="ml-1" variant="outline">
          3
        </Badge>
      </Button>

      <Button variant="outline" size="sm">
        <Check className="h-4 w-4 mr-1 text-green-500" />
        Completed
        <Badge className="ml-1" variant="outline">
          4
        </Badge>
      </Button>
    </div>
  );
}
