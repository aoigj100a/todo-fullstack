// src/components/todos/TodosFilterBar.tsx
import { LayoutGrid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

type ViewType = 'list' | 'board';

interface TodosFilterBarProps {
  className?: string;
  viewType: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function TodosFilterBar({ className, viewType, onViewChange }: TodosFilterBarProps) {
  const { t } = useLanguage();
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-lg shadow-sm ${className}`}
    >
      <div className="flex gap-2 border rounded-md p-1 bg-muted/20">
        <Button
          size="sm"
          variant={viewType === 'list' ? 'default' : 'ghost'}
          className={`flex items-center gap-1 px-3 py-1 ${viewType === 'list' ? 'shadow-sm' : ''}`}
          onClick={() => onViewChange('list')}
        >
          <ListIcon className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t('view.list')}</span>
        </Button>
        <Button
          size="sm"
          variant={viewType === 'board' ? 'default' : 'ghost'}
          className={`flex items-center gap-1 px-3 py-1 ${viewType === 'board' ? 'shadow-sm' : ''}`}
          onClick={() => onViewChange('board')}
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="hidden sm:inline-block">Board</span>
        </Button>
      </div>
    </div>
  );
}
