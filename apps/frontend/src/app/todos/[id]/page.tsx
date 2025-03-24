'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Calendar, Clock, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useToast } from '@/hooks/use-toast';
import { Todo } from '@/types/todo';
import { todoService } from '@/service/todo';

const statusColorMap = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
} as const;

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const id = params.id as string;

    const loadTodo = async () => {
      try {
        const data = await todoService.getTodos();
        const foundTodo = data.find((todo: Todo) => todo._id === id);
        if (foundTodo) {
          setTodo(foundTodo);
        } else {
          toast({
            title: 'Error',
            description: 'Todo not found',
            variant: 'destructive',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load todo details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTodo();
  }, [params.id, toast]);

  const handleDelete = async () => {
    if (!todo) return;
    setIsDeleting(true);

    try {
      await todoService.deleteTodo(todo._id);
      toast({
        title: 'Success',
        description: 'Todo deleted successfully',
      });
      router.push('/todos');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete todo',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
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
          <Link href="/todos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Todo Details</h1>
      </div>

      <Card className="overflow-hidden border-gray-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-white border-b border-gray-100 pb-4">
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle className="text-xl font-bold text-gray-800">{todo.title}</CardTitle>
            <Badge className={statusColorMap[todo.status as keyof typeof statusColorMap]}>
              {todo.status.charAt(0).toUpperCase() + todo.status.slice(1).replace('-', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {todo.description && (
              <div className="mt-2">
                <h3 className="mb-2 text-sm font-medium text-gray-500">Description</h3>
                <p className="rounded-lg bg-gray-50 p-4 text-gray-700">{todo.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2 h-4 w-4 text-teal-500" />
                  <span className="text-sm font-medium">Created:</span>
                  <span className="ml-2 text-sm">{format(new Date(todo.createdAt), 'PPP')}</span>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2 h-4 w-4 text-teal-500" />
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="ml-2 text-sm">{format(new Date(todo.updatedAt), 'PPP')}</span>
                </div>
              </div>
            </div>

            {todo.assignedTo && (
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2 text-teal-500">👤</span>
                  <span className="text-sm font-medium">Assigned to:</span>
                  <span className="ml-2 text-sm">{todo.assignedTo}</span>
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                className="flex-1 border-teal-200 text-teal-600 hover:bg-teal-50 hover:text-teal-700"
                onClick={() => router.push(`/todos/${todo._id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Todo
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {isDeleting ? 'Deleting...' : 'Delete Todo'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
