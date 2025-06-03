// src/service/stats.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// 統計數據接口定義
export interface TodoStats {
  statusCounts: {
    pending: number;
    inProgress: number;
    completed: number;
    total: number;
  };
  completionRate: number;
  timeSeries: {
    completed: Array<{
      date: string;
      count: number;
    }>;
  };
  productivity: {
    byHour: Array<{
      hour: number;
      count: number;
    }>;
    mostProductiveHour: {
      hour: number;
      count: number;
    };
    weeklyCompletionRate: number;
    tasksCompletedThisWeek: number;
    tasksCreatedThisWeek: number;
  };
  averageCompletionTime: {
    milliseconds: number;
    hours: number;
    days: number;
  };
}

export interface CompletionTimeStats {
  average: {
    milliseconds: number;
    hours: number;
    days: number;
  };
  fastest: {
    milliseconds: number;
    hours: number;
  };
  slowest: {
    milliseconds: number;
    hours: number;
  };
  totalCompleted: number;
  distribution: Array<{
    category: 'fast' | 'medium' | 'slow';
    label: string;
    count: number;
  }>;
}

export interface ProductivityStats {
  byHour: Array<{
    hour: number;
    count: number;
  }>;
  mostProductiveHour: {
    hour: number;
    count: number;
  };
  byDayOfWeek: Array<{
    dayOfWeek: number;
    dayName: string;
    count: number;
  }>;
  mostProductiveDay: {
    dayOfWeek: number;
    dayName: string;
    count: number;
  };
  completionTime: {
    average: {
      milliseconds: number;
      hours: number;
      days: number;
    };
    fastest: {
      milliseconds: number;
      hours: number;
    };
    slowest: {
      milliseconds: number;
      hours: number;
    };
  };
  efficiency: {
    weeklyCompletionRate: number;
    tasksCompletedThisWeek: number;
    tasksCreatedThisWeek: number;
  };
}

export const statsService = {
  /**
   * 獲取完整的統計概覽數據
   * @param timeRange - 時間範圍 ('7days' | '30days' | 'thisMonth')
   */
  getStats: async (timeRange: '7days' | '30days' | 'thisMonth' = '7days'): Promise<TodoStats> => {
    try {
      const response = await fetch(`${API_URL}/stats?timeRange=${timeRange}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  /**
   * 獲取生產力分析統計
   */
  getProductivityStats: async (): Promise<ProductivityStats> => {
    try {
      const response = await fetch(`${API_URL}/stats/productivity`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch productivity stats: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching productivity stats:', error);
      throw error;
    }
  },

  /**
   * 獲取完成時間統計
   */
  getCompletionTimeStats: async (): Promise<CompletionTimeStats> => {
    try {
      const response = await fetch(`${API_URL}/stats/completion-time`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch completion time stats: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching completion time stats:', error);
      throw error;
    }
  },

  /**
   * 工具函數：格式化日期為 API 所需格式
   * @param date - 日期對象
   * @returns YYYY-MM-DD 格式的字符串
   */
  formatDateForAPI: (date: Date): string => {
    return date.toISOString().split('T')[0];
  },

  /**
   * 工具函數：獲取相對日期
   * @param days - 天數（負數表示過去）
   * @returns 日期對象
   */
  getRelativeDate: (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  },

  /**
   * 工具函數：獲取本週範圍
   * @returns { start: Date, end: Date }
   */
  getThisWeekRange: (): { start: Date; end: Date } => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay()); // 週日
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6); // 週六
    end.setHours(23, 59, 59, 999);

    return { start, end };
  },

  /**
   * 工具函數：獲取本月範圍
   * @returns { start: Date, end: Date }
   */
  getThisMonthRange: (): { start: Date; end: Date } => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  },

  /**
   * 工具函數：計算完成率
   * @param completed - 已完成數量
   * @param total - 總數量
   * @returns 完成率百分比（保留一位小數）
   */
  calculateCompletionRate: (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100 * 10) / 10;
  },

  /**
   * 工具函數：計算增長率
   * @param current - 當前值
   * @param previous - 之前值
   * @returns 增長率百分比（保留一位小數）
   */
  calculateGrowthRate: (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  },

  /**
   * 工具函數：格式化持續時間
   * @param milliseconds - 毫秒數
   * @returns 格式化的時間字符串
   */
  formatDuration: (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },

  /**
   * 工具函數：生成趨勢指示器數據
   * @param data - 數據數組
   * @returns 趨勢信息 { direction: 'up' | 'down' | 'stable', percentage: number }
   */
  getTrendInfo: (data: number[]): { direction: 'up' | 'down' | 'stable'; percentage: number } => {
    if (data.length < 2) {
      return { direction: 'stable', percentage: 0 };
    }

    const recent = data.slice(-2);
    const change = statsService.calculateGrowthRate(recent[1], recent[0]);

    if (Math.abs(change) < 5) {
      return { direction: 'stable', percentage: change };
    }

    return {
      direction: change > 0 ? 'up' : 'down',
      percentage: Math.abs(change),
    };
  },
};

// 導出單獨的工具函數以便其他地方使用
export const {
  formatDateForAPI,
  getRelativeDate,
  getThisWeekRange,
  getThisMonthRange,
  calculateCompletionRate,
  calculateGrowthRate,
  formatDuration,
  getTrendInfo,
} = statsService;
