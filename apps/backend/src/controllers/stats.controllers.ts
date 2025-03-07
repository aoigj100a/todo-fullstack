// src/controllers/stats.controllers.ts
import { Request, Response } from 'express';
import { Todo } from '../models/Todo';
import { 
  calculateAverageCompletionTime,
  getCompletedTasksByDate,
  getProductivityByHour,
  calculateTaskTurnoverRates
} from '../services/todo-stats.service';

/**
 * 取得完整的待辦事項統計資料
 */
export const getTodoStats = async (req: Request, res: Response) => {
  try {
    const { timeRange = '7days' } = req.query;
    
    // 計算日期範圍
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange as string) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'thisMonth':
        startDate.setDate(1); // 當月第一天
        break;
      default:
        startDate.setDate(endDate.getDate() - 7); // 默認7天
    }
    
    // 並行獲取所有統計數據
    const [
      statusCounts,
      completedByDate,
      productivityByHour,
      turnoverRates,
      averageCompletionTime
    ] = await Promise.all([
      // 1. 各狀態數量
      Todo.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      
      // 2. 按日期統計已完成任務
      getCompletedTasksByDate(startDate, endDate),
      
      // 3. 按小時分析生產力
      getProductivityByHour(),
      
      // 4. 計算任務周轉速率
      calculateTaskTurnoverRates(),
      
      // 5. 計算平均完成時間
      calculateAverageCompletionTime()
    ]);
    
    // 處理狀態計數數據
    const formattedStatusCounts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      total: 0
    };
    
    statusCounts.forEach((item: any) => {
      if (item._id === 'pending') formattedStatusCounts.pending = item.count;
      else if (item._id === 'in-progress') formattedStatusCounts.inProgress = item.count;
      else if (item._id === 'completed') formattedStatusCounts.completed = item.count;
    });
    
    formattedStatusCounts.total = 
      formattedStatusCounts.pending + 
      formattedStatusCounts.inProgress + 
      formattedStatusCounts.completed;
    
    // 計算完成率
    const completionRate = formattedStatusCounts.total > 0
      ? (formattedStatusCounts.completed / formattedStatusCounts.total) * 100
      : 0;
    
    // 構建回應
    const statsResponse = {
      statusCounts: formattedStatusCounts,
      completionRate: parseFloat(completionRate.toFixed(2)),
      timeSeries: {
        completed: completedByDate
      },
      productivity: {
        byHour: productivityByHour.hourlyData,
        mostProductiveHour: productivityByHour.mostProductiveHour,
        ...turnoverRates
      },
      averageCompletionTime: {
        milliseconds: averageCompletionTime.averageTime,
        hours: parseFloat((averageCompletionTime.averageTime / 3600000).toFixed(2)), // 轉換為小時
        days: parseFloat((averageCompletionTime.averageTime / (3600000 * 24)).toFixed(2)) // 轉換為天
      }
    };
    
    res.json({
      success: true,
      data: statsResponse
    });
    
  } catch (error) {
    console.error('Error generating stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * 取得狀態分布統計
 */
export const getStatusStats = async (req: Request, res: Response) => {
  try {
    const statusCounts = await Todo.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const formattedStatusCounts = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      total: 0
    };
    
    statusCounts.forEach((item: any) => {
      if (item._id === 'pending') formattedStatusCounts.pending = item.count;
      else if (item._id === 'in-progress') formattedStatusCounts.inProgress = item.count;
      else if (item._id === 'completed') formattedStatusCounts.completed = item.count;
    });
    
    formattedStatusCounts.total = 
      formattedStatusCounts.pending + 
      formattedStatusCounts.inProgress + 
      formattedStatusCounts.completed;
    
    const completionRate = formattedStatusCounts.total > 0
      ? (formattedStatusCounts.completed / formattedStatusCounts.total) * 100
      : 0;
    
    res.json({
      success: true,
      data: {
        statusCounts: formattedStatusCounts,
        completionRate: parseFloat(completionRate.toFixed(2))
      }
    });
    
  } catch (error) {
    console.error('Error generating status stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate status statistics'
    });
  }
};

/**
 * 取得時間序列統計資料
 */
export const getTimeSeriesStats = async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    // 解析日期參數，默認為過去7天
    const endDate = dateTo ? new Date(dateTo as string) : new Date();
    const startDate = dateFrom ? new Date(dateFrom as string) : new Date(endDate);
    
    if (!dateFrom) {
      startDate.setDate(endDate.getDate() - 7);
    }
    
    // 檢查日期有效性
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD format.'
      });
    }
    
    // 獲取時間序列數據
    const completedByDate = await getCompletedTasksByDate(startDate, endDate);
    
    // 獲取創建的任務時間序列
    const createdByDate = await Todo.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$createdAt" 
            } 
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // 處理創建的任務數據，確保所有日期都有數據點
    const formattedCreatedByDate = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = createdByDate.find(item => item._id === dateStr);
      
      formattedCreatedByDate.push({
        date: dateStr,
        count: dayData ? dayData.count : 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json({
      success: true,
      data: {
        timeRange: {
          from: startDate.toISOString().split('T')[0],
          to: endDate.toISOString().split('T')[0]
        },
        series: {
          created: formattedCreatedByDate,
          completed: completedByDate
        }
      }
    });
    
  } catch (error) {
    console.error('Error generating time series stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate time series statistics'
    });
  }
};

/**
 * 取得生產力分析統計
 */
export const getProductivityStats = async (req: Request, res: Response) => {
  try {
    // 獲取生產力相關數據
    const [productivityByHour, turnoverRates, completionTimeStats] = await Promise.all([
      getProductivityByHour(),
      calculateTaskTurnoverRates(),
      calculateAverageCompletionTime()
    ]);
    
    // 獲取工作天分析（按星期幾分組）
    const productivityByDayOfWeek = await Todo.aggregate([
      {
        $match: {
          status: "completed",
          completedAt: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$completedAt" }, // 1-7, 1為週日，7為週六
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // 填充所有星期數據
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dailyData = Array(7).fill(0).map((_, index) => {
      const dayOfWeek = index + 1; // MongoDB 的 $dayOfWeek 返回 1-7
      const found = productivityByDayOfWeek.find(item => item._id === dayOfWeek);
      return {
        dayOfWeek,
        dayName: dayNames[index],
        count: found ? found.count : 0
      };
    });
    
    // 找出最高效的工作日
    const mostProductiveDay = dailyData.reduce(
      (max, current) => current.count > max.count ? current : max, 
      { dayOfWeek: 0, dayName: "", count: 0 }
    );
    
    res.json({
      success: true,
      data: {
        byHour: productivityByHour.hourlyData,
        mostProductiveHour: productivityByHour.mostProductiveHour,
        byDayOfWeek: dailyData,
        mostProductiveDay,
        completionTime: {
          average: {
            milliseconds: completionTimeStats.averageTime,
            hours: parseFloat((completionTimeStats.averageTime / 3600000).toFixed(2)),
            days: parseFloat((completionTimeStats.averageTime / (3600000 * 24)).toFixed(2))
          },
          fastest: {
            milliseconds: completionTimeStats.fastestTime,
            hours: parseFloat((completionTimeStats.fastestTime / 3600000).toFixed(2))
          },
          slowest: {
            milliseconds: completionTimeStats.slowestTime,
            hours: parseFloat((completionTimeStats.slowestTime / 3600000).toFixed(2))
          }
        },
        efficiency: {
          weeklyCompletionRate: parseFloat(turnoverRates.weeklyCompletionRate.toFixed(2)),
          tasksCompletedThisWeek: turnoverRates.tasksCompletedThisWeek,
          tasksCreatedThisWeek: turnoverRates.tasksCreatedThisWeek
        }
      }
    });
    
  } catch (error) {
    console.error('Error generating productivity stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate productivity statistics'
    });
  }
};

/**
 * 取得完成時間統計
 */
export const getCompletionTimeStats = async (req: Request, res: Response) => {
  try {
    const completionTimeStats = await calculateAverageCompletionTime();
    
    // 按完成時間分類（快速、中等、緩慢）
    const completionTimeDistribution = await Todo.aggregate([
      {
        $match: {
          status: "completed",
          completedAt: { $exists: true, $ne: null }
        }
      },
      {
        $project: {
          completionTime: { 
            $subtract: ["$completedAt", "$createdAt"] 
          }
        }
      },
      {
        $bucket: {
          groupBy: "$completionTime",
          boundaries: [0, 3600000, 86400000, Number.MAX_SAFE_INTEGER], // 1小時, 1天, 無限大
          default: "other",
          output: {
            count: { $sum: 1 },
            tasks: { $push: { id: "$_id", completionTime: "$completionTime" } }
          }
        }
      }
    ]);
    
    // 格式化分類數據
    const formattedDistribution = [
      { category: "fast", label: "Under 1 hour", count: 0 },
      { category: "medium", label: "1-24 hours", count: 0 },
      { category: "slow", label: "Over 24 hours", count: 0 }
    ];
    
    completionTimeDistribution.forEach((item: any) => {
      if (item._id === 0) formattedDistribution[0].count = item.count;
      else if (item._id === 3600000) formattedDistribution[1].count = item.count;
      else if (item._id === 86400000) formattedDistribution[2].count = item.count;
    });
    
    res.json({
      success: true,
      data: {
        average: {
          milliseconds: completionTimeStats.averageTime,
          hours: parseFloat((completionTimeStats.averageTime / 3600000).toFixed(2)),
          days: parseFloat((completionTimeStats.averageTime / (3600000 * 24)).toFixed(2))
        },
        fastest: {
          milliseconds: completionTimeStats.fastestTime,
          hours: parseFloat((completionTimeStats.fastestTime / 3600000).toFixed(2))
        },
        slowest: {
          milliseconds: completionTimeStats.slowestTime,
          hours: parseFloat((completionTimeStats.slowestTime / 3600000).toFixed(2))
        },
        totalCompleted: completionTimeStats.totalTasks,
        distribution: formattedDistribution
      }
    });
    
  } catch (error) {
    console.error('Error generating completion time stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate completion time statistics'
    });
  }
};