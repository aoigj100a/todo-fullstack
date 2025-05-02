'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BarChart3, PieChart, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/features/dashboard/StatsCards';
import { StatusDistributionChart } from '@/components/features/dashboard/StatusDistributionChart';
import { TaskTrendsChart } from '@/components/features/dashboard/TaskTrendsChart';
import { todoService } from '@/service/todo';
import { Todo } from '@/types';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await todoService.getTodos();
        setTodos(data);
      } catch (error) {
        console.error('Failed to load todos', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  // 計算各種指標
  const statusCounts = {
    all: todos.length,
    pending: todos.filter((todo) => todo.status === 'pending').length,
    inProgress: todos.filter((todo) => todo.status === 'in-progress').length,
    completed: todos.filter((todo) => todo.status === 'completed').length,
  };

  // 計算完成率
  const completionRate =
    todos.length > 0 ? Math.round((statusCounts.completed / todos.length) * 100) : 0;

  // 計算今日完成數量(基於 completedAt 日期)
  const todayCompleted = todos.filter((todo) => {
    if (!todo.completedAt) return false;
    const completedDate = new Date(todo.completedAt);
    const today = new Date();
    return completedDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  }).length;

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button asChild variant="ghost" className="mr-4">
            <Link href="/todos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Todos
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <StatsCards
            totalTasks={statusCounts.all}
            completedTasks={statusCounts.completed}
            pendingTasks={statusCounts.pending}
            inProgressTasks={statusCounts.inProgress}
            completionRate={completionRate}
            todayCompleted={todayCompleted}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Task Status Distribution</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <StatusDistributionChart statusCounts={statusCounts} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todos.slice(0, 5).map((todo) => (
                    <div key={todo._id} className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          todo.status === 'completed'
                            ? 'bg-green-500'
                            : todo.status === 'in-progress'
                              ? 'bg-blue-500'
                              : 'bg-yellow-500'
                        }`}
                      />
                      <div className="flex-1 truncate">{todo.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(todo.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 添加的趨勢圖表 */}
          <TaskTrendsChart />
        </div>
      )}
    </div>
  );
}
