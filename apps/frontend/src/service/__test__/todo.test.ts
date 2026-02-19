import { describe, test, expect, vi, beforeEach } from 'vitest';
import { todoService } from '../todo';
import { TodoStatus } from '@/types';

const API_URL = 'http://localhost:5001/api';

function mockFetchSuccess(data: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data }),
  });
}

function mockFetchFailure() {
  return vi.fn().mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({ error: 'error' }),
  });
}

describe('todoService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTodos', () => {
    test('should fetch and return todos', async () => {
      const todos = [{ _id: '1', title: 'Test', status: 'pending' }];
      global.fetch = mockFetchSuccess(todos);

      const result = await todoService.getTodos();

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/todos`);
      expect(result).toEqual(todos);
    });

    test('should throw when response is not ok', async () => {
      global.fetch = mockFetchFailure();

      await expect(todoService.getTodos()).rejects.toThrow('Failed to fetch todos');
    });
  });

  describe('createTodo', () => {
    test('should post and return created todo', async () => {
      const input = { title: 'New todo' };
      const created = { _id: '1', title: 'New todo', status: 'pending' };
      global.fetch = mockFetchSuccess(created);

      const result = await todoService.createTodo(input);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      expect(result).toEqual(created);
    });

    test('should throw when response is not ok', async () => {
      global.fetch = mockFetchFailure();

      await expect(todoService.createTodo({ title: 'fail' })).rejects.toThrow(
        'Failed to create todo',
      );
    });
  });

  describe('updateTodo', () => {
    test('should put and return updated todo', async () => {
      const updates = { title: 'Updated' };
      const updated = { _id: '1', title: 'Updated', status: 'pending' };
      global.fetch = mockFetchSuccess(updated);

      const result = await todoService.updateTodo('1', updates);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/todos/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      expect(result).toEqual(updated);
    });

    test('should throw when response is not ok', async () => {
      global.fetch = mockFetchFailure();

      await expect(todoService.updateTodo('1', {})).rejects.toThrow('Failed to update todo');
    });
  });

  describe('toggleTodoStatus', () => {
    test.each<[TodoStatus, TodoStatus]>([
      ['pending', 'in-progress'],
      ['in-progress', 'completed'],
      ['completed', 'pending'],
    ])('should transition %s → %s', async (current, expected) => {
      const todo = { _id: '1', status: expected };
      global.fetch = mockFetchSuccess(todo);

      await todoService.toggleTodoStatus('1', current);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/todos/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: expected }),
      });
    });
  });

  describe('deleteTodo', () => {
    test('should delete and return true', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });

      const result = await todoService.deleteTodo('1');

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/todos/1`, { method: 'DELETE' });
      expect(result).toBe(true);
    });

    test('should throw when response is not ok', async () => {
      global.fetch = mockFetchFailure();

      await expect(todoService.deleteTodo('1')).rejects.toThrow('Failed to delete todo');
    });
  });

  describe('setTodoStatus', () => {
    test('should update with the given status', async () => {
      const todo = { _id: '1', status: 'completed' };
      global.fetch = mockFetchSuccess(todo);

      await todoService.setTodoStatus('1', 'completed');

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/todos/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });
    });
  });
});
