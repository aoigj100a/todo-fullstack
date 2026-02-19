import { describe, test, expect, vi, beforeEach } from 'vitest';
import { statsService } from '../stats';

const API_URL = 'http://localhost:5001/api';

function mockFetchSuccess(data: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data }),
  });
}

function mockFetchFailure(status = 500) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve({ error: 'error' }),
  });
}

describe('statsService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ─── API 方法 ───

  describe('getStats', () => {
    test('should fetch with default timeRange', async () => {
      global.fetch = mockFetchSuccess({ completionRate: 50 });

      const result = await statsService.getStats();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/stats?timeRange=7days`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual({ completionRate: 50 });
    });

    test('should fetch with specified timeRange', async () => {
      global.fetch = mockFetchSuccess({});

      await statsService.getStats('30days');

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/stats?timeRange=30days`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
    });

    test('should throw when response is not ok', async () => {
      global.fetch = mockFetchFailure(403);

      await expect(statsService.getStats()).rejects.toThrow('Failed to fetch stats: 403');
    });
  });

  describe('getProductivityStats', () => {
    test('should fetch productivity stats', async () => {
      const data = { mostProductiveHour: { hour: 10, count: 5 } };
      global.fetch = mockFetchSuccess(data);

      const result = await statsService.getProductivityStats();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/stats/productivity`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(data);
    });

    test('should throw when response is not ok', async () => {
      global.fetch = mockFetchFailure(500);

      await expect(statsService.getProductivityStats()).rejects.toThrow(
        'Failed to fetch productivity stats: 500'
      );
    });
  });

  describe('getCompletionTimeStats', () => {
    test('should fetch completion time stats', async () => {
      const data = { totalCompleted: 10 };
      global.fetch = mockFetchSuccess(data);

      const result = await statsService.getCompletionTimeStats();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/stats/completion-time`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      expect(result).toEqual(data);
    });

    test('should throw when response is not ok', async () => {
      global.fetch = mockFetchFailure(404);

      await expect(statsService.getCompletionTimeStats()).rejects.toThrow(
        'Failed to fetch completion time stats: 404'
      );
    });
  });

  // ─── Utility Functions ───

  describe('formatDateForAPI', () => {
    test('should format date as YYYY-MM-DD', () => {
      const date = new Date('2026-02-15T10:30:00Z');
      expect(statsService.formatDateForAPI(date)).toBe('2026-02-15');
    });

    test('should handle year boundaries', () => {
      const date = new Date('2025-12-31T23:59:59Z');
      expect(statsService.formatDateForAPI(date)).toBe('2025-12-31');
    });
  });

  describe('getRelativeDate', () => {
    test('should return a date offset by positive days', () => {
      const now = new Date();
      const result = statsService.getRelativeDate(3);
      const expected = new Date();
      expected.setDate(expected.getDate() + 3);

      expect(result.toDateString()).toBe(expected.toDateString());
    });

    test('should return a date offset by negative days', () => {
      const result = statsService.getRelativeDate(-7);
      const expected = new Date();
      expected.setDate(expected.getDate() - 7);

      expect(result.toDateString()).toBe(expected.toDateString());
    });

    test('should return today for 0 days', () => {
      const result = statsService.getRelativeDate(0);
      expect(result.toDateString()).toBe(new Date().toDateString());
    });
  });

  describe('getThisWeekRange', () => {
    test('should return start on Sunday 00:00:00.000', () => {
      const { start } = statsService.getThisWeekRange();

      expect(start.getDay()).toBe(0); // Sunday
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      expect(start.getMilliseconds()).toBe(0);
    });

    test('should return end on Saturday 23:59:59.999', () => {
      const { end } = statsService.getThisWeekRange();

      expect(end.getDay()).toBe(6); // Saturday
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
      expect(end.getMilliseconds()).toBe(999);
    });

    test('should span exactly 6 days', () => {
      const { start, end } = statsService.getThisWeekRange();
      const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

      expect(Math.floor(diffDays)).toBe(6);
    });
  });

  describe('getThisMonthRange', () => {
    test('should return start on the 1st at 00:00:00.000', () => {
      const { start } = statsService.getThisMonthRange();
      const now = new Date();

      expect(start.getFullYear()).toBe(now.getFullYear());
      expect(start.getMonth()).toBe(now.getMonth());
      expect(start.getDate()).toBe(1);
      expect(start.getHours()).toBe(0);
    });

    test('should return end on the last day at 23:59:59.999', () => {
      const { end } = statsService.getThisMonthRange();
      const now = new Date();
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      expect(end.getDate()).toBe(lastDay);
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
      expect(end.getMilliseconds()).toBe(999);
    });
  });

  describe('calculateCompletionRate', () => {
    test('should return 0 when total is 0', () => {
      expect(statsService.calculateCompletionRate(0, 0)).toBe(0);
    });

    test('should return 100 when all completed', () => {
      expect(statsService.calculateCompletionRate(10, 10)).toBe(100);
    });

    test('should return rate with one decimal place', () => {
      expect(statsService.calculateCompletionRate(1, 3)).toBe(33.3);
    });

    test('should handle partial completion', () => {
      expect(statsService.calculateCompletionRate(3, 4)).toBe(75);
    });
  });

  describe('calculateGrowthRate', () => {
    test('should return 100 when previous is 0 and current > 0', () => {
      expect(statsService.calculateGrowthRate(5, 0)).toBe(100);
    });

    test('should return 0 when both are 0', () => {
      expect(statsService.calculateGrowthRate(0, 0)).toBe(0);
    });

    test('should calculate positive growth', () => {
      expect(statsService.calculateGrowthRate(15, 10)).toBe(50);
    });

    test('should calculate negative growth', () => {
      expect(statsService.calculateGrowthRate(5, 10)).toBe(-50);
    });

    test('should return rate with one decimal place', () => {
      expect(statsService.calculateGrowthRate(1, 3)).toBe(-66.7);
    });
  });

  describe('formatDuration', () => {
    test('should format seconds only', () => {
      expect(statsService.formatDuration(45000)).toBe('45s');
    });

    test('should format minutes and seconds', () => {
      expect(statsService.formatDuration(125000)).toBe('2m 5s');
    });

    test('should format hours and minutes', () => {
      expect(statsService.formatDuration(3_660_000)).toBe('1h 1m');
    });

    test('should format days and hours', () => {
      expect(statsService.formatDuration(90_000_000)).toBe('1d 1h');
    });

    test('should return 0s for 0 milliseconds', () => {
      expect(statsService.formatDuration(0)).toBe('0s');
    });
  });

  describe('getTrendInfo', () => {
    test('should return stable for less than 2 data points', () => {
      expect(statsService.getTrendInfo([])).toEqual({ direction: 'stable', percentage: 0 });
      expect(statsService.getTrendInfo([5])).toEqual({ direction: 'stable', percentage: 0 });
    });

    test('should return stable for small changes (< 5%)', () => {
      const result = statsService.getTrendInfo([100, 103]);
      expect(result.direction).toBe('stable');
    });

    test('should return up for significant positive growth', () => {
      const result = statsService.getTrendInfo([10, 20]);
      expect(result.direction).toBe('up');
      expect(result.percentage).toBe(100);
    });

    test('should return down for significant negative growth', () => {
      const result = statsService.getTrendInfo([20, 10]);
      expect(result.direction).toBe('down');
      expect(result.percentage).toBe(50);
    });

    test('should only use last two data points', () => {
      const result = statsService.getTrendInfo([1, 2, 3, 10, 20]);
      expect(result.direction).toBe('up');
      expect(result.percentage).toBe(100);
    });
  });
});
