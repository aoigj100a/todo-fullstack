// src/components/features/dashboard/DashboardLoadingState.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Activity, Clock } from 'lucide-react';

export function DashboardLoadingState() {
  return (
    <div className="space-y-6">
      {/* Stats Cards Loading */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart Loading */}
        <Card className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-40" />
            </div>
            <PieChart className="h-5 w-5 text-gray-300" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-48">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
            <div className="flex justify-center flex-wrap gap-4 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="w-3 h-3 mr-1 rounded" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Loading */}
        <Card className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Clock className="h-5 w-5 text-gray-300" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center flex-1">
                    <Skeleton className="w-3 h-3 rounded-full mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-48 mb-1" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart Loading */}
      <Card className="animate-pulse">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-gray-300" />
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-20 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="h-[240px] relative">
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between pr-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>
            <div className="ml-8 h-full">
              <div
                className="grid h-full gap-3 items-end"
                style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
              >
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="flex flex-col items-center w-full">
                      <Skeleton
                        className={'w-7 rounded-t-md mb-1'}
                        style={{ height: `${Math.random() * 120 + 20}px` }}
                      />
                      <Skeleton
                        className={'w-7 rounded-t-md'}
                        style={{ height: `${Math.random() * 120 + 20}px` }}
                      />
                    </div>
                    <Skeleton className="h-3 w-8 mt-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
