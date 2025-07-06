import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';

interface StatusCountsProps {
  statusCounts: {
    all: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export const StatusDistributionChart = ({ statusCounts }: StatusCountsProps) => {
  const { t } = useLanguage();

  // 準備圓餅圖的數據
  const data = [
    { status: 'Pending', count: statusCounts.pending, color: 'var(--chart-4)' },
    { status: 'In Progress', count: statusCounts.inProgress, color: 'var(--chart-2)' },
    { status: 'Completed', count: statusCounts.completed, color: 'var(--chart-1)' },
  ].filter((item) => item.count > 0);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  // 計算每個扇形的角度
  let cumulativeAngle = 0;
  const segments = data.map((item) => {
    const angle = (item.count / total) * 360;
    const startAngle = cumulativeAngle;
    cumulativeAngle += angle;
    return {
      ...item,
      percentage: (item.count / total) * 100,
      startAngle,
      angle,
    };
  });

  // SVG 尺寸
  const size = 200;
  const radius = size * 0.4;
  const centerX = size / 2;
  const centerY = size / 2;

  // 函數：將角度轉換為弧線終點座標
  const polarToCartesian = (angle: number) => {
    const angleInRadians = ((angle - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // 函數：生成扇形的 SVG 路徑
  const createArcPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(startAngle + endAngle);
    const largeArcFlag = endAngle > 180 ? 1 : 0;

    return [
      `M ${centerX} ${centerY}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  // 如果沒有數據，顯示空狀態
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-48 flex-col">
        <p className="text-muted-foreground">{t('dashboard.statusChart.noData')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-48 h-48">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {segments.map((segment, i) => (
            <path
              key={i}
              d={createArcPath(segment.startAngle, segment.angle)}
              fill={segment.color}
              stroke="white"
              strokeWidth="1"
            />
          ))}
          <circle cx={centerX} cy={centerY} r={radius * 0.6} fill="white" />
        </svg>
      </div>

      <div className="flex justify-center flex-wrap gap-4">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center">
            <div className="w-3 h-3 mr-1" style={{ backgroundColor: segment.color }} />
            <span className="text-sm">
              {segment.status} ({segment.percentage.toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
