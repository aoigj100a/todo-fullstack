import { useState, useEffect, useCallback } from 'react';

import { statsService, TodoStats } from '@/service/stats';
import { todoService } from '@/service/todo';

import { Todo } from '@/types';

export type TimeRange = '7days' | '30days' | 'thisMonth';

interface UseDashboardReturn {
  todos: Todo[];
  statsData: TodoStats | null;
  isLoading: boolean;
  isRefreshing: boolean;
  selectedTimeRange: TimeRange;
  error: string | null;
  basicStats: {
    all: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  completionRate: number;
  todayCompleted: number;
  displayStats: {
    all: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  displayCompletionRate: number;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  } | undefined;
  loadTodos: () => Promise<void>;
  loadStatsData: (timeRange?: TimeRange) => Promise<void>;
  refreshData: () => Promise<void>;
  handleTimeRangeChange: (timeRange: TimeRange) => Promise<void>;
}

export function useDashboard(
  onError: (title: string, description: string, variant?: 'default' | 'destructive') => void,
  onSuccess: (title: string, description: string) => void,
  t: (key: string) => string
): UseDashboardReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statsData, setStatsData] = useState<TodoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('7days');
  const [error, setError] = useState<string | null>(null);

  // 載入基本 Todos 數據
  const loadTodos = useCallback(async () => {
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (_) {
      onError(t('toast.error'), t('error.loadTodos'), 'destructive');
    }
  }, [t, onError]);

  // 載入統計數據
  const loadStatsData = useCallback(
    async (timeRange: TimeRange = selectedTimeRange) => {
      try {
        setError(null);
        const stats = await statsService.getStats(timeRange);
        setStatsData(stats);
      } catch (_) {
        setError(t('error.loadStats'));

        onError(t('toast.warning'), t('error.advancedStats'), 'destructive');
      }
    },
    [selectedTimeRange, t, onError]
  );

  // 重新整理數據
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadTodos(), loadStatsData(selectedTimeRange)]);

      onSuccess(t('toast.success'), t('dashboard.refreshSuccess'));
    } catch (_) {
      onError(t('toast.error'), t('dashboard.refreshError'), 'destructive');
    } finally {
      setIsRefreshing(false);
    }
  }, [loadTodos, loadStatsData, selectedTimeRange, t, onError, onSuccess]);

  // 處理時間範圍變更
  const handleTimeRangeChange = useCallback(async (timeRange: TimeRange) => {
    setSelectedTimeRange(timeRange);
    setIsRefreshing(true);
    try {
      await loadStatsData(timeRange);
    } finally {
      setIsRefreshing(false);
    }
  }, [loadStatsData]);

  // 初始載入
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [todosData] = await Promise.all([
          todoService.getTodos(),
          statsService.getStats(selectedTimeRange).catch(() => null)
        ]);

        setTodos(todosData);
        if (statsService.getStats) {
          try {
            const stats = await statsService.getStats(selectedTimeRange);
            setStatsData(stats);
          } catch (_) {
            setError(t('error.loadStats'));
          }
        }
      } catch (_) {
        onError(t('toast.error'), t('error.loadTodos'), 'destructive');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 計算基本統計數據（從本地 todos 計算，作為後備）
  const basicStats = {
    all: todos.length,
    pending: todos.filter(todo => todo.status === 'pending').length,
    inProgress: todos.filter(todo => todo.status === 'in-progress').length,
    completed: todos.filter(todo => todo.status === 'completed').length,
  };

  const completionRate =
    todos.length > 0 ? Math.round((basicStats.completed / todos.length) * 100) : 0;

  // 計算今日完成數量
  const todayCompleted = todos.filter(todo => {
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
        labels: statsData.timeSeries.completed.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });
        }),
        datasets: [
          {
            label: t('dashboard.chartLabel.completedTasks'),
            data: statsData.timeSeries.completed.map(item => item.count),
            borderColor: 'rgb(20, 184, 166)',
            backgroundColor: 'rgba(20, 184, 166, 0.1)',
          },
        ],
      }
    : undefined;

  return {
    todos,
    statsData,
    isLoading,
    isRefreshing,
    selectedTimeRange,
    error,
    basicStats,
    completionRate,
    todayCompleted,
    displayStats,
    displayCompletionRate,
    chartData,
    loadTodos,
    loadStatsData,
    refreshData,
    handleTimeRangeChange,
  };
}
