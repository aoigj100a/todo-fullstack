import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

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

export function TaskTrendsChart({ chartData }: TaskTrendsChartProps) {
  // 由於實際數據需要來自後端，先使用模擬資料
  const mockData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    completed: [2, 5, 3, 7, 4, 2, 1],
    created: [3, 4, 6, 2, 5, 3, 2],
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Weekly Task Trends</CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {/* 簡易的圖表視覺化 */}
          <div className="grid grid-cols-7 h-full gap-1 items-end">
            {mockData.labels.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex flex-col items-center w-full">
                  <div
                    className="bg-green-500 w-6"
                    style={{ height: `${mockData.completed[index] * 15}px` }}
                  />
                  <div
                    className="bg-blue-500 w-6 mt-1"
                    style={{ height: `${mockData.created[index] * 15}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1">{day.substring(0, 3)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4 gap-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 mr-1" />
              <span className="text-xs">Completed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 mr-1" />
              <span className="text-xs">Created</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
