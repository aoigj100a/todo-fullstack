// src/components/todos/TodosEmptyState.tsx
import { FilterX, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useLanguage } from '@/contexts/LanguageContext';

type FilterStatus = 'all' | 'pending' | 'in-progress' | 'completed';

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
  const { t } = useLanguage();
  const isFiltered = filterStatus !== 'all';

  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center gap-4">
        {isFiltered ? (
          <FilterX className="h-12 w-12 text-muted-foreground" />
        ) : (
          <Plus className="h-12 w-12 text-muted-foreground" />
        )}

        <h3 className="text-lg font-medium">
          {isFiltered ? t('todos.emptyStateFiltered') : t('todos.emptyState')}
        </h3>

        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {isFiltered && (
            <Button variant="outline" onClick={onClearFilter} className="flex items-center gap-1">
              <FilterX className="h-4 w-4" />
              {t('filter.clearFilters')}
            </Button>
          )}

          <Button onClick={onCreateTodo} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            {t('button.createTodo')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
