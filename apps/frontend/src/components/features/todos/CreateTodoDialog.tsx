import { useState, useRef } from 'react';

import { KeyboardIcon, Plus } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

import { todoService } from '@/service/todo';

import { TodoStatus } from '@/types/todo';

interface CreateTodoDialogProps {
  onSuccess: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateTodoDialog({
  onSuccess,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: CreateTodoDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const titleInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TodoStatus>('pending');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    externalOnOpenChange?.(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  const submitTodo = async () => {
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
        assignedTo: 'Jenny', // TODO - replace with current logged-in user
      });

      toast({
        title: 'Success',
        description: t('toast.createSuccess'),
      });

      handleOpenChange(false);
      onSuccess();
    } catch (_) {
      toast({
        title: 'Error',
        description: t('toast.error.create'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTodo();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      submitTodo();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="bg-teal-500 hover:bg-teal-600 text-white flex gap-2 items-center"
          >
            <Plus className="h-4 w-4" />
            {t('button.addTodo')}
            <div className="hidden md:flex items-center text-xs bg-teal-600 px-1 rounded">
              <span className="opacity-75">N</span>
            </div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-[425px]"
        onKeyDown={handleKeyDown}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          titleInputRef.current?.focus();
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {t('dialog.createTitle')}
              <div className="text-xs bg-muted px-2 py-1 rounded-md flex items-center gap-1 font-normal opacity-70">
                <KeyboardIcon className="h-3 w-3" />
                <span>Ctrl+Enter</span>
                <span className="opacity-50">|</span>
                <span>Esc</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t('form.title')}</Label>
              <Input
                id="title"
                ref={titleInputRef}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t('form.titlePlaceholder')}
                className="focus-visible:ring-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t('form.descriptionPlaceholder')}
                className="focus-visible:ring-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t('form.status')}</Label>
              <Select
                value={status}
                onValueChange={(value: TodoStatus) => setStatus(value)}
              >
                <SelectTrigger id="status">
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
              {isLoading ? t('button.creating') : t('button.createTodo')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
