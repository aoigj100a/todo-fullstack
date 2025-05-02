// src/components/todos/CreateTodoDialog.tsx
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useLanguage } from '@/contexts/LanguageContext';

interface CreateTodoDialogProps {
  onSuccess: () => void;
}

export function CreateTodoDialog({ onSuccess }: CreateTodoDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const [isLoading, setIsLoading] = useState(false);

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
      await todoService.createTodo({
        title,
        description,
        status,
        assignedTo: 'Jenny', //TODO -  暫時寫死，之後要改成當前登入使用者
      });

      toast({
        title: 'Success',
        description: t('toast.createSuccess'),
      });

      setOpen(false);
      onSuccess();

      // 重置表單
      setTitle('');
      setDescription('');
      setStatus('pending');
    } catch (error) {
      toast({
        title: 'Error',
        description: t('toast.error.create'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-teal-500 hover:bg-teal-600 text-white">
          {t('button.addTodo')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('dialog.createTitle')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('form.title')}</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('form.titlePlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {isLoading ? 'Creating...' : t('button.createTodo')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
