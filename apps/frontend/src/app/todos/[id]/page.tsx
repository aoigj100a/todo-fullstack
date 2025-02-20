"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { todoService } from "@/service/todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Todo } from "@/types/todo";

const statusColorMap = {
  pending: "bg-gray-500",
  "in-progress": "bg-blue-500",
  completed: "bg-green-500",
} as const;

export default function TodoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    
    const loadTodo = async () => {
      try {
        const data = await todoService.getTodos();
        const foundTodo = data.find(t => t._id === id);
        if (foundTodo) {
          setTodo(foundTodo);
        } else {
          toast({
            title: "Error",
            description: "Todo not found",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load todo details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTodo();
  }, [params.id, toast]);

  const handleDelete = async () => {
    if (!todo) return;
    
    try {
      await todoService.deleteTodo(todo._id);
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
      router.push('/todos');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!todo) {
    return (
      <Card className="mx-auto max-w-2xl p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Todo not found</h2>
          <p className="mt-2 text-gray-600">The requested todo does not exist.</p>
          <Button asChild className="mt-4">
            <Link href="/todos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Todos
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center">
        <Button asChild variant="ghost" className="mr-4">
          <Link href="/todos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Todo Details</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{todo.title}</CardTitle>
          <Badge className={statusColorMap[todo.status as keyof typeof statusColorMap]}>
            {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todo.description && (
              <div className="mt-4">
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-gray-600">{todo.description}</p>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                Created: {format(new Date(todo.createdAt), "PPP")}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="mr-2 h-4 w-4" />
                Last Updated: {format(new Date(todo.updatedAt), "PPP")}
              </div>
              {todo.assignedTo && (
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">👤</span>
                  Assigned to: {todo.assignedTo}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/todos/${todo._id}/edit`)}
              >
                Edit Todo
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
                Delete Todo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}