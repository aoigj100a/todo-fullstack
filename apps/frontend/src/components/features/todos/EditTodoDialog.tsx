// src/components/todos/EditTodoDialog.tsx
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { todoService } from '@/service/todo';
import { Todo } from '@/types/todo';
import { useLanguage } from '@/contexts/LanguageContext';

interface EditTodoDialogProps {
  todo: Todo;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditTodoDialog({ todo, open, onClose, onSuccess }: EditTodoDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>(
    todo.status as 'pending' | 'in-progress' | 'completed'
  );
  const [isLoading, setIsLoading] = useState(false);

  // 當 todo 改變時更新表單
  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setStatus(todo.status as 'pending' | 'in-progress' | 'completed');
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: 'Error',
        description: t('toast.validation.title'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await todoService.updateTodo(todo._id, {
        title,
        description,
        status,
        assignedTo: todo.assignedTo, // 保持原本的指派人
      });

      toast({
        title: 'Success',
        description: t('toast.updateSuccess'),
      });

      onSuccess();
      onClose();
    } catch (_) {
      toast({
        title: 'Error',
        description: t('toast.error.update'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('dialog.editTitle')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('form.title')}</Label>
              <Input
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t('form.titlePlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t('form.descriptionPlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t('form.status')}</Label>
              <Select
                value={status}
                onValueChange={(value: 'pending' | 'in-progress' | 'completed') => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('form.selectStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="in-progress">{t('status.inProgress')}</SelectItem>
                  <SelectItem value="completed">{t('status.completed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t('button.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-teal-500 hover:bg-teal-600">
              {isLoading ? 'Updating...' : t('button.updateTodo')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
