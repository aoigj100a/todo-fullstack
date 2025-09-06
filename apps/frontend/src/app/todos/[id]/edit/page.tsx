'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

import { useToast } from '@/hooks/use-toast';
import { Todo } from '@/types/todo';
import { todoService } from '@/service/todo';

export default function EditTodoPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 表單狀態
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  useEffect(() => {
    const id = params.id as string;

    const loadTodo = async () => {
      try {
        const data = await todoService.getTodos();
        const foundTodo = data.find((todo: Todo) => todo._id === id);
        if (foundTodo) {
          setTodo(foundTodo);
          // 初始化表單值
          setTitle(foundTodo.title);
          setDescription(foundTodo.description || '');
          setStatus(foundTodo.status as 'pending' | 'in-progress' | 'completed');
        } else {
          toast({
            title: 'Error',
            description: 'Todo not found',
            variant: 'destructive',
          });
          router.push('/todos');
        }
      } catch (_) {
        toast({
          title: 'Error',
          description: 'Failed to load todo',
          variant: 'destructive',
        });
        router.push('/todos');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodo();
  }, [params.id, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todo) return;

    // 驗證
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await todoService.updateTodo(todo._id, {
        title,
        description,
        status,
        assignedTo: todo.assignedTo,
      });

      toast({
        title: 'Success',
        description: 'Todo updated successfully',
      });

      // 導航回詳情頁
      router.push(`/todos/${todo._id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update todo',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card className="text-center p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Todo not found</h2>
            <p className="text-gray-600">The requested todo does not exist.</p>
            <Button asChild className="mt-4 bg-teal-500 hover:bg-teal-600">
              <Link href="/todos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Todos
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center">
        <Button
          asChild
          variant="ghost"
          className="mr-4 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
        >
          <Link href={`/todos/${todo._id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Todo</h1>
      </div>

      <Card className="overflow-hidden border-gray-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-white border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-800">Edit Todo Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter todo title"
                required
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter todo description (optional)"
                rows={4}
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700">
                Status
              </Label>
              <Select
                value={status}
                onValueChange={(value: 'pending' | 'in-progress' | 'completed') => setStatus(value)}
              >
                <SelectTrigger id="status" className="border-gray-300 focus:ring-teal-500">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/todos/${todo._id}`)}
                className="flex-1 border-teal-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-teal-500 hover:bg-teal-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
