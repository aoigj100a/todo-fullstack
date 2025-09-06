import { Todo } from '../models/Todo';

// 計算任務平均完成時間（從創建到完成的毫秒數）
export const calculateAverageCompletionTime = async () => {
  const result = await Todo.aggregate([
    // 只選擇已完成且有 completedAt 的任務
    {
      $match: {
        status: 'completed',
        completedAt: { $exists: true, $ne: null },
      },
    },
    // 計算每個任務的完成時間（完成時間減去創建時間）
    {
      $project: {
        completionTime: {
          $subtract: ['$completedAt', '$createdAt'],
        },
        title: 1, // 可選：保留標題用於調試
      },
    },
    // 計算平均值
    {
      $group: {
        _id: null,
        averageTime: { $avg: '$completionTime' },
        fastestTime: { $min: '$completionTime' },
        slowestTime: { $max: '$completionTime' },
        totalTasks: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0
    ? result[0]
    : {
        averageTime: 0,
        fastestTime: 0,
        slowestTime: 0,
        totalTasks: 0,
      };
};

// 獲取按日期分組的已完成任務數量
export const getCompletedTasksByDate = async (startDate: Date, endDate: Date) => {
  const result = await Todo.aggregate([
    {
      $match: {
        completedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$completedAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // 填充缺失日期（確保沒有完成任務的日期也有數據點）
  const filledResult = fillMissingDates(result, startDate, endDate);

  return filledResult;
};

// 輔助函數：填充沒有數據的日期
export const fillMissingDates = (
  data: Array<{ _id: string; count: number }>,
  startDate: Date,
  endDate: Date
) => {
  const dateMap = new Map();

  // 將現有數據放入 Map
  data.forEach(item => {
    dateMap.set(item._id, item.count);
  });

  const result = [];
  const currentDate = new Date(startDate);

  // 遍歷日期範圍，填充缺失的日期
  while (currentDate <= endDate) {
    const dateStr = formatDate(currentDate);
    result.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0,
    });

    // 增加一天
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

// 輔助函數：格式化日期為 YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 按小時分析完成的任務，找出高效時段
export const getProductivityByHour = async () => {
  const result = await Todo.aggregate([
    {
      $match: {
        status: 'completed',
        completedAt: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: {
          $hour: '$completedAt',
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        hour: '$_id',
        count: 1,
        _id: 0,
      },
    },
  ]);

  // 填充所有 24 小時
  const hourlyData = Array(24)
    .fill(0)
    .map((_, hour) => {
      const found = result.find(item => item.hour === hour);
      return {
        hour,
        count: found ? found.count : 0,
      };
    });

  // 找出最高效時段
  const mostProductiveHour = hourlyData.reduce(
    (max, current) => (current.count > max.count ? current : max),
    { hour: 0, count: 0 }
  );

  return {
    hourlyData,
    mostProductiveHour,
  };
};

// 計算任務在不同狀態的平均停留時間
export const calculateTaskTurnoverRates = async () => {
  // 對於已完成的任務，計算從創建到完成的總時間
  const completedTasksTime = await Todo.aggregate([
    {
      $match: {
        status: 'completed',
        completedAt: { $exists: true, $ne: null },
      },
    },
    {
      $project: {
        totalTime: {
          $divide: [
            { $subtract: ['$completedAt', '$createdAt'] },
            3600000, // 轉換為小時
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        averageTime: { $avg: '$totalTime' },
        count: { $sum: 1 },
      },
    },
  ]);

  // 計算任務完成的比率（每天或每週）
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const tasksCompletedThisWeek = await Todo.countDocuments({
    completedAt: { $gte: startOfWeek },
  });

  const tasksCreatedThisWeek = await Todo.countDocuments({
    createdAt: { $gte: startOfWeek },
  });

  const completionRate =
    tasksCreatedThisWeek > 0 ? (tasksCompletedThisWeek / tasksCreatedThisWeek) * 100 : 0;

  return {
    averageCompletionTimeHours:
      completedTasksTime.length > 0 ? completedTasksTime[0].averageTime : 0,
    completedTaskCount: completedTasksTime.length > 0 ? completedTasksTime[0].count : 0,
    weeklyCompletionRate: completionRate,
    tasksCompletedThisWeek,
    tasksCreatedThisWeek,
  };
};
