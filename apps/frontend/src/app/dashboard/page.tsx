'use client';

import Link from 'next/link';
import { ArrowLeft, PieChart, Clock, RefreshCw, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/features/dashboard/StatsCards';
import { StatusDistributionChart } from '@/components/features/dashboard/StatusDistributionChart';
import { TaskTrendsChart } from '@/components/features/dashboard/TaskTrendsChart';
import { DashboardLoadingState } from '@/components/features/dashboard/DashboardLoadingState';

import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

import { useDashboard, TimeRange } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const {
    todos,
    statsData,
    isLoading,
    isRefreshing,
    selectedTimeRange,
    error,
    displayStats,
    displayCompletionRate,
    todayCompleted,
    chartData,
    refreshData,
    handleTimeRangeChange,
  } = useDashboard(
    (title, description, variant) => {
      toast({ title, description, variant });
    },
    (title, description) => {
      toast({ title, description });
    },
    t
  );

  const timeRangeOptions = [
    { value: '7days' as TimeRange, label: t('timeRange.7days') },
    { value: '30days' as TimeRange, label: t('timeRange.30days') },
    { value: 'thisMonth' as TimeRange, label: t('timeRange.thisMonth') },
  ];

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
                {t('dashboard.backToTodos')}
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('dashboard.title')}</h1>
          </div>

          <div className="flex items-center gap-2">
            {/* 時間範圍選擇器 */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {timeRangeOptions.map(option => (
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
              {t('button.refresh')}
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
                  {t('dashboard.statusChart.title')}
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
                  {t('dashboard.activity.title')}
                </CardTitle>
                <Clock className="h-5 w-5 text-teal-500" />
              </CardHeader>
              <CardContent className="pt-6">
                {todos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>{t('dashboard.activity.noTasks')}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todos.slice(0, 5).map(todo => (
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
                              {todo.status.replace('-', t('dashboard.activity.statusReplaceHyphen'))}
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
                          {t('dashboard.activity.viewAllLink')}
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
                    {t('dashboard.insight.productiveHour')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsData.productivity.mostProductiveHour.hour}:00
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {statsData.productivity.mostProductiveHour.count} {t('dashboard.insight.tasksCompleted')}
                  </p>
                </CardContent>
              </Card>

              {/* 平均完成時間 */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {t('dashboard.insight.avgCompletion')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsData.averageCompletionTime.hours.toFixed(1)}h
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {statsData.averageCompletionTime.days.toFixed(1)} {t('dashboard.insight.daysAverage')}
                  </p>
                </CardContent>
              </Card>

              {/* 週完成率 */}
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {t('dashboard.insight.weeklyRate')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {statsData.productivity.weeklyCompletionRate.toFixed(1)}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {statsData.productivity.tasksCompletedThisWeek}/
                    {statsData.productivity.tasksCreatedThisWeek} {t('dashboard.insight.tasksThisWeek')}
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
