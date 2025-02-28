// src/components/todos/TodosFilterBar.tsx
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TodosFilterBarProps {
  className?: string;
}

export function TodosFilterBar({ className }: TodosFilterBarProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-lg shadow-sm ${className}`}>
      
      <Tabs defaultValue="list" className="w-full sm:w-auto">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-1 px-3 py-2">
            <ListIcon className="h-4 w-4" />
            <span className="hidden sm:inline-block">List</span>
          </TabsTrigger>
          <TabsTrigger value="board" className="flex items-center gap-1 px-3 py-2">
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline-block">Board</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}