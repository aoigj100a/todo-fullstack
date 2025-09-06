// src/components/todos/TodosLoadingState.tsx
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TodosLoadingState() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(index => (
        <Card key={index} className="p-4">
          <div className="flex items-center">
            <div className="px-4">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="flex justify-between items-center w-full">
              <Skeleton className="h-8 w-[280px]" />
              <Skeleton className="h-[40px] w-[210px]" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
