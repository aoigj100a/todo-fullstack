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

  const data = [
    {
      status: 'Pending',
      count: statusCounts.pending,
      color: '#f59e0b', // 與 yellow-500 一致的暖黃色
      lightColor: '#fef3c7', // yellow-100 作為輔助色
      labelKey: 'dashboard.statusChart.pending',
    },
    {
      status: 'In Progress',
      count: statusCounts.inProgress,
      color: '#0d9488', // 與專案主色調 teal-600 一致
      lightColor: '#ccfbf1', // teal-100 作為輔助色
      labelKey: 'dashboard.statusChart.inProgress',
    },
    {
      status: 'Completed',
      count: statusCounts.completed,
      color: '#059669', // 與 green-600 一致的綠色
      lightColor: '#d1fae5', // green-100 作為輔助色
      labelKey: 'dashboard.statusChart.completed',
    },
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
        <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center mb-4">
          <span className="text-gray-400 text-sm">無資料</span>
        </div>
        <p className="text-gray-500 text-sm">{t('dashboard.statusChart.noData')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-48 h-48">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
          {/* 外環陰影 */}
          <defs>
            <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#00000010" />
            </filter>
            {/* 為每個段落添加漸變 */}
            {segments.map((segment, i) => (
              <radialGradient key={`gradient-${i}`} id={`gradient-${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={segment.color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={segment.color} stopOpacity="1" />
              </radialGradient>
            ))}
          </defs>

          {segments.map((segment, i) => (
            <g key={i}>
              {/* 扇形 */}
              <path
                d={createArcPath(segment.startAngle, segment.angle)}
                fill={`url(#gradient-${i})`}
                stroke="white"
                strokeWidth="3"
                filter="url(#dropshadow)"
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            </g>
          ))}

          {/* 中間的空心圓與陰影 */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius * 0.6}
            fill="white"
            stroke="#f3f4f6"
            strokeWidth="2"
            filter="url(#dropshadow)"
          />

          {/* 中心文字 */}
          <text
            x={centerX}
            y={centerY - 8}
            textAnchor="middle"
            className="text-2xl font-bold fill-gray-700"
            dominantBaseline="middle"
          >
            {total}
          </text>
          <text
            x={centerX}
            y={centerY + 12}
            textAnchor="middle"
            className="text-sm fill-gray-500"
            dominantBaseline="middle"
          >
            總任務
          </text>
        </svg>
      </div>

      {/* 圖例 - 使用專案一致的設計 */}
      <div className="flex flex-wrap justify-center gap-4">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center space-x-2 group cursor-pointer">
            {/* 顏色指示器 */}
            <div className="relative">
              <div
                className="w-4 h-4 rounded-full shadow-sm transition-transform group-hover:scale-110"
                style={{ backgroundColor: segment.color }}
              />
              <div
                className="absolute inset-0 w-4 h-4 rounded-full opacity-20"
                style={{ backgroundColor: segment.lightColor }}
              />
            </div>

            {/* 標籤與數據 */}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {t(segment.labelKey)}
              </span>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="font-semibold">{segment.count} 項</span>
                <span>({segment.percentage.toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
