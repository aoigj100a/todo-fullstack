import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TaskTrendsChartProps {
  chartData?: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

export function TaskTrendsChart({}: TaskTrendsChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  // 模擬數據 - 可以根據 selectedPeriod 切換
  const weekData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    completed: [2, 5, 3, 7, 4, 2, 1],
    created: [3, 4, 6, 2, 5, 3, 2],
  };

  const monthData = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    completed: [12, 18, 15, 22],
    created: [15, 20, 18, 25],
  };

  const currentData = selectedPeriod === 'week' ? weekData : monthData;
  const maxValue = Math.max(...currentData.completed, ...currentData.created);

  // 計算統計數據
  const totalCompleted = currentData.completed.reduce((sum, val) => sum + val, 0);
  const totalCreated = currentData.created.reduce((sum, val) => sum + val, 0);
  const completionRate = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0;

  // 計算趨勢
  const completedTrend = currentData.completed.slice(-2);
  const createdTrend = currentData.created.slice(-2);
  const completedChange =
    completedTrend.length >= 2
      ? ((completedTrend[1] - completedTrend[0]) / completedTrend[0]) * 100
      : 0;
  const createdChange =
    createdTrend.length >= 2 ? ((createdTrend[1] - createdTrend[0]) / createdTrend[0]) * 100 : 0;

  return (
    <Card className="shadow-sm border-border">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-500" />
            <CardTitle className="text-lg font-semibold text-foreground">
              {t('dashboard.trends.title')}
            </CardTitle>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'ghost'}
                size="sm"
                className={`h-8 px-3 text-xs font-medium transition-colors ${
                  selectedPeriod === 'week'
                    ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm'
                    : 'hover:bg-muted/80 text-muted-foreground'
                }`}
                onClick={() => setSelectedPeriod('week')}
              >
                <Calendar className="h-3 w-3 mr-1" />
                {t('dashboard.trends.period.week')}
              </Button>
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'ghost'}
                size="sm"
                className={`h-8 px-3 text-xs font-medium transition-colors ${
                  selectedPeriod === 'month'
                    ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm'
                    : 'hover:bg-muted/80 text-muted-foreground'
                }`}
                onClick={() => setSelectedPeriod('month')}
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                {t('dashboard.trends.period.month')}
              </Button>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{totalCompleted}</div>
            <div className="text-xs text-muted-foreground">{t('dashboard.trends.completed')}</div>
            <div
              className={`text-xs flex items-center justify-center gap-1 mt-1 ${
                completedChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <TrendingUp className={`h-3 w-3 ${completedChange < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(completedChange).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{totalCreated}</div>
            <div className="text-xs text-muted-foreground">{t('dashboard.trends.created')}</div>
            <div
              className={`text-xs flex items-center justify-center gap-1 mt-1 ${
                createdChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <TrendingUp className={`h-3 w-3 ${createdChange < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(createdChange).toFixed(0)}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">{t('dashboard.trends.rate')}</div>
            <div className="text-xs text-muted-foreground mt-1">{t('dashboard.trends.completion')}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="h-[240px] relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground pr-2">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue * 0.75)}</span>
            <span>{Math.round(maxValue * 0.5)}</span>
            <span>{Math.round(maxValue * 0.25)}</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full">
            {/* Grid lines */}
            <div className="absolute inset-0 ml-8">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-border"
                  style={{ bottom: `${ratio * 100}%` }}
                />
              ))}
            </div>

            {/* Chart bars */}
            <div
              className="grid h-full gap-3 items-end relative z-10"
              style={{ gridTemplateColumns: `repeat(${currentData.labels.length}, 1fr)` }}
            >
              {currentData.labels.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {hoveredIndex === index && (
                    <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg z-20 min-w-[120px]">
                      <div className="text-center">
                        <div className="font-medium mb-1">
                          {selectedPeriod === 'week' ? day : `Week ${day.slice(1)}`}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-teal-300">Created:</span>
                          <span>{currentData.created[index]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-300">Completed:</span>
                          <span>{currentData.completed[index]}</span>
                        </div>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}

                  <div className="flex flex-col items-center w-full relative">
                    {/* Completed tasks bar */}
                    <div
                      className={`bg-gradient-to-t from-teal-500 to-teal-400 w-7 rounded-t-md transition-all duration-300 ${
                        hoveredIndex === index
                          ? 'opacity-90 shadow-lg scale-105'
                          : 'opacity-75 hover:opacity-90'
                      }`}
                      style={{
                        height: `${Math.max((currentData.completed[index] / maxValue) * 180, 6)}px`,
                        minHeight: '6px',
                      }}
                    />

                    {/* Created tasks bar */}
                    <div
                      className={`bg-gradient-to-t from-blue-400 to-blue-300 w-7 rounded-t-md mt-1 transition-all duration-300 ${
                        hoveredIndex === index
                          ? 'opacity-90 shadow-lg scale-105'
                          : 'opacity-75 hover:opacity-90'
                      }`}
                      style={{
                        height: `${Math.max((currentData.created[index] / maxValue) * 180, 6)}px`,
                        minHeight: '6px',
                      }}
                    />
                  </div>

                  {/* Day label */}
                  <span
                    className={`text-xs mt-2 font-medium transition-colors ${
                      hoveredIndex === index ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-6 gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-teal-500 to-teal-400 rounded-sm mr-2 shadow-sm" />
            <span className="text-sm text-muted-foreground font-medium">Completed Tasks</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-300 rounded-sm mr-2 shadow-sm" />
            <span className="text-sm text-muted-foreground font-medium">Created Tasks</span>
          </div>
        </div>

        {/* Additional insights */}
        <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/30 dark:to-blue-950/30 rounded-lg border border-teal-100 dark:border-teal-900/40">
          <div className="text-sm text-foreground">
            <span className="font-medium">💡 Insight:</span>
            {completionRate >= 80 ? (
              <span className="ml-1">
                Great productivity! You're completing most of your tasks.
              </span>
            ) : completionRate >= 60 ? (
              <span className="ml-1">Good progress! Consider focusing on task completion.</span>
            ) : (
              <span className="ml-1">
                You're creating more tasks than completing. Try to focus on finishing existing ones.
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
