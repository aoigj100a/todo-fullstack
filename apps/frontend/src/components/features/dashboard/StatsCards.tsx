import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { CheckCircle, Clock, ListTodo, BarChart } from 'lucide-react';

interface StatsCardsProps {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completionRate: number;
  todayCompleted: number;
}

export function StatsCards({
  totalTasks,
  completedTasks,
  inProgressTasks,
  completionRate,
  todayCompleted,
}: StatsCardsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.stats.totalTasks')}</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">{t('dashboard.stats.totalTasks.desc')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.stats.completionRate')}
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <div className="h-2 w-full bg-muted rounded-full mt-2">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {t('dashboard.stats.completionRate.desc')
              .replace('{completed}', completedTasks.toString())
              .replace('{total}', totalTasks.toString())}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t('dashboard.stats.inProgress')}</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressTasks}</div>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.stats.inProgress.desc').replace(
              '{percentage}',
              (Math.round((inProgressTasks / totalTasks) * 100) || 0).toString()
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            {t('dashboard.stats.completedToday')}
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCompleted}</div>
          <p className="text-xs text-muted-foreground">
            {t('dashboard.stats.completedToday.desc')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
