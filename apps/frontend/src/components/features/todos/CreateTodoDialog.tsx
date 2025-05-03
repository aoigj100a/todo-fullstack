// src/components/features/todos/CreateTodoDialog.tsx 修復受控模式
import { useState, useEffect, useRef } from 'react';
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
import { KeyboardIcon, Plus } from 'lucide-react';

interface CreateTodoDialogProps {
  onSuccess: () => void;
  open?: boolean; // 受控打開狀態
  onOpenChange?: (open: boolean) => void; // 打開狀態變更回調
}

export function CreateTodoDialog({
  onSuccess,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
}: CreateTodoDialogProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  // 當存在外部控制時，不使用內部狀態
  const [internalOpen, setInternalOpen] = useState(false);

  // 判斷是受控模式還是非受控模式
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const titleInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [isLoading, setIsLoading] = useState(false);

  // 處理對話框開關狀態變更
  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }

    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    }

    // 重置表單 (當對話框關閉時)
    if (!newOpen) {
      resetForm();
    }
  };

  // 當對話框打開時，聚焦到標題輸入框
  useEffect(() => {
    if (open && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus('pending');
  };

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
        assignedTo: 'Jenny', // TODO - 暫時寫死，之後要改成當前登入使用者
      });

      toast({
        title: 'Success',
        description: t('toast.createSuccess'),
      });

      handleOpenChange(false);
      onSuccess();
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

  // 鍵盤事件處理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter 或 Cmd+Enter (Mac) 提交表單
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
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
      <DialogContent className="sm:max-w-[425px]" onKeyDown={handleKeyDown}>
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
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('form.titlePlaceholder')}
                className="focus-visible:ring-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('form.description')}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('form.descriptionPlaceholder')}
                className="focus-visible:ring-teal-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">{t('form.status')}</Label>
              <Select
                value={status}
                onValueChange={(value: 'pending' | 'in-progress' | 'completed') => setStatus(value)}
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
