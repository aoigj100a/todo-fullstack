'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, PieChart, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/features/dashboard/StatsCards';
import { StatusDistributionChart } from '@/components/features/dashboard/StatusDistributionChart';
import { TaskTrendsChart } from '@/components/features/dashboard/TaskTrendsChart';

import { statsService, TodoStats } from '@/service/stats';
import { todoService } from '@/service/todo';
import { Todo } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { DashboardLoadingState } from '@/components/features/dashboard/DashboardLoadingState';

type TimeRange = '7days' | '30days' | 'thisMonth';

export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statsData, setStatsData] = useState<TodoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('7days');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  // 載入基本 Todos 數據
  const loadTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos', error);
      toast({
        title: 'Error',
        description: 'Failed to load todos',
        variant: 'destructive',
      });
    }
  };

  // 載入統計數據
  const loadStatsData = async (timeRange: TimeRange = selectedTimeRange) => {
    try {
      setError(null);
      const stats = await statsService.getStats(timeRange);
      setStatsData(stats);
    } catch (error) {
      console.error('Failed to load stats data', error);
      setError('Failed to load statistics');

      // 如果統計 API 失敗，顯示錯誤但繼續顯示基本數據
      toast({
        title: 'Warning',
        description: 'Unable to load advanced statistics. Showing basic data.',
        variant: 'destructive',
      });
    }
  };

  // 重新整理數據
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadTodos(), loadStatsData(selectedTimeRange)]);

      toast({
        title: 'Success',
        description: 'Dashboard data refreshed',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh some data',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // 處理時間範圍變更
  const handleTimeRangeChange = async (timeRange: TimeRange) => {
    setSelectedTimeRange(timeRange);
    setIsRefreshing(true);
    try {
      await loadStatsData(timeRange);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 初始載入
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadTodos(), loadStatsData()]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 計算基本統計數據（從本地 todos 計算，作為後備）
  const basicStats = {
    all: todos.length,
    pending: todos.filter((todo) => todo.status === 'pending').length,
    inProgress: todos.filter((todo) => todo.status === 'in-progress').length,
    completed: todos.filter((todo) => todo.status === 'completed').length,
  };

  const completionRate =
    todos.length > 0 ? Math.round((basicStats.completed / todos.length) * 100) : 0;

  // 計算今日完成數量
  const todayCompleted = todos.filter((todo) => {
    if (!todo.completedAt) return false;
    const completedDate = new Date(todo.completedAt);
    const today = new Date();
    return completedDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  }).length;

  // 使用統計 API 數據或後備到基本計算
  const displayStats = statsData
    ? {
        all: statsData.statusCounts.total,
        pending: statsData.statusCounts.pending,
        inProgress: statsData.statusCounts.inProgress,
        completed: statsData.statusCounts.completed,
      }
    : basicStats;

  const displayCompletionRate = statsData?.completionRate ?? completionRate;

  // 準備圖表數據
  const chartData = statsData?.timeSeries.completed
    ? {
        labels: statsData.timeSeries.completed.map((item) => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        }),
        datasets: [
          {
            label: 'Completed Tasks',
            data: statsData.timeSeries.completed.map((item) => item.count),
            borderColor: 'rgb(20, 184, 166)',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
          },
        ],
      }
    : undefined;

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center">
            <Button
              asChild
              variant="ghost"
              className="mr-4 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
            >
              <Link href="/todos">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Todos
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* 時間範圍選擇器 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { value: '7days' as TimeRange, label: '7 Days' },
                { value: '30days' as TimeRange, label: '30 Days' },
                { value: 'thisMonth' as TimeRange, label: 'This Month' },
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={selectedTimeRange === option.value ? 'default' : 'ghost'}
                  size="sm"
                  className={`h-8 px-3 text-xs font-medium transition-colors ${
                    selectedTimeRange === option.value
                      ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm'
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  onClick={() => handleTimeRangeChange(option.value)}
                  disabled={isRefreshing}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* 重新整理按鈕 */}
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">{error}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <DashboardLoadingState />
      ) : (
        <div className="space-y-6">
          {/* 統計卡片 */}
          <StatsCards
            totalTasks={displayStats.all}
            completedTasks={displayStats.completed}
            pendingTasks={displayStats.pending}
            inProgressTasks={displayStats.inProgress}
            completionRate={displayCompletionRate}
            todayCompleted={todayCompleted}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 狀態分布圖 */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Task Status Distribution
                </CardTitle>
                <PieChart className="h-5 w-5 text-teal-500" />
              </CardHeader>
              <CardContent className="pt-6">
                <StatusDistributionChart statusCounts={displayStats} />
              </CardContent>
            </Card>

            {/* 最近活動 */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Recent Activity
                </CardTitle>
                <Clock className="h-5 w-5 text-teal-500" />
              </CardHeader>
              <CardContent className="pt-6">
                {todos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks yet. Create your first todo to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todos.slice(0, 5).map((todo) => (
                      <div
                        key={todo._id}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${
                              todo.status === 'completed'
                                ? 'bg-green-500'
                                : todo.status === 'in-progress'
                                  ? 'bg-blue-500'
                                  : 'bg-yellow-500'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {todo.title}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {todo.status.replace('-', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-4 flex-shrink-0">
                          {new Date(todo.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    ))}
                    {todos.length > 5 && (
                      <div className="text-center pt-4">
                        <Link
                          href="/todos"
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                        >
                          View all todos →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 趨勢圖表 */}
          <TaskTrendsChart chartData={chartData} />

          {/* 統計洞察卡片 */}
          {statsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 生產力洞察 */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Most Productive Hour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsData.productivity.mostProductiveHour.hour}:00
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {statsData.productivity.mostProductiveHour.count} tasks completed
                  </p>
                </CardContent>
              </Card>

              {/* 平均完成時間 */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Avg Completion Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsData.averageCompletionTime.hours.toFixed(1)}h
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {statsData.averageCompletionTime.days.toFixed(1)} days average
                  </p>
                </CardContent>
              </Card>

              {/* 週完成率 */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Weekly Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsData.productivity.weeklyCompletionRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {statsData.productivity.tasksCompletedThisWeek}/
                    {statsData.productivity.tasksCreatedThisWeek} tasks this week
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
