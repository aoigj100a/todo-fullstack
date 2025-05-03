'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

import { TodosLoadingState } from '@/components/features/todos/TodosLoadingState';
import { TodoCard } from '@/components/features/todos/TodoCard';
import { CreateTodoDialog } from '@/components/features/todos/CreateTodoDialog';
import { EditTodoDialog } from '@/components/features/todos/EditTodoDialog';
import { TodosFilterBar } from '@/components/features/todos/TodosFilterBar';
import { TodosStatusFilter } from '@/components/features/todos/TodosStatusFilter';
import { TodosBoardView } from '@/components/features/todos/TodosBoardView';
import { TodosEmptyState } from '@/components/features/todos/TodosEmptyState';
import { FadePresence } from '@/components/ui/nimated-presence';
import { TodosHelpInfo } from '@/components/features/todos/TodosHelpInfo';

import { useLanguage } from '@/contexts/LanguageContext';
import { todoService } from '@/service/todo';
import { useSoftDelete } from '@/hooks/useSoftDelete';
import { Todo } from '@/types';

type ViewType = 'list' | 'board';
type FilterStatus = 'all' | 'pending' | 'in-progress' | 'completed';

function TodosPage() {
  const { t } = useLanguage();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [focusedTodoIndex, setFocusedTodoIndex] = useState<number | null>(null);

  const [viewType, setViewType] = useState<ViewType>('list');

  const searchParams = useSearchParams();
  const router = useRouter();

  const [filterStatus, setFilterStatus] = useState<FilterStatus>(() => {
    const statusParam = searchParams.get('status') as FilterStatus | null;
    if (
      statusParam === 'all' ||
      statusParam === 'pending' ||
      statusParam === 'in-progress' ||
      statusParam === 'completed'
    ) {
      return statusParam;
    }
    return 'all';
  });

  // 使用 useSoftDelete hook
  const { handleDelete, clearPendingDeletions, getPendingDeletionIds } = useSoftDelete<Todo>(
    todos,
    setTodos,
    {
      onDelete: async (id: string) => {
        await todoService.deleteTodo(id);
      },
      timeout: 5000,
      getItemTitle: (todo: Todo) => todo.title,
    },
  );

  const loadTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos((prevTodos) => {
        const pendingTodoIds = getPendingDeletionIds();
        return data.filter((todo: Todo) => !pendingTodoIds.includes(todo._id));
      });
    } catch (error) {
      toast.error('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTodos = useMemo(() => {
    if (filterStatus === 'all') {
      return todos;
    } else {
      return todos.filter((todo) => todo.status === filterStatus);
    }
  }, [todos, filterStatus]);

  const statusCounts = useMemo(() => {
    return {
      all: todos.length,
      pending: todos.filter((todo) => todo.status === 'pending').length,
      'in-progress': todos.filter((todo) => todo.status === 'in-progress').length,
      completed: todos.filter((todo) => todo.status === 'completed').length,
    };
  }, [todos]);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditingTodo(null);
    setIsEditDialogOpen(false);
  };

  const handleEditSuccess = () => {
    loadTodos();
    handleEditClose();
  };

  const handleStatusChange = async () => {
    await loadTodos();
  };

  const handleViewChange = useCallback(
    (view: ViewType) => {
      setViewType(view);
      // 保存到 localStorage
      localStorage.setItem('todoViewPreference', view);

      // 更新 URL 參數
      const params = new URLSearchParams(searchParams.toString());
      params.set('view', view);

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleFilterChange = useCallback(
    (status: FilterStatus) => {
      setFilterStatus(status);

      // 更新 URL 參數
      const params = new URLSearchParams(searchParams.toString());
      params.set('status', status);

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // 清除篩選時也需要更新 URL
  const handleClearFilter = useCallback(() => {
    setFilterStatus('all');

    // 更新 URL 參數
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', 'all');

    // 使用 Next.js App Router 的方式更新 URL
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleOpenCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true);
  }, []);

  const handleCreateDialogClose = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  // 處理鍵盤導航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!filteredTodos.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedTodoIndex((prev) => {
          // 如果沒有選中項目或已是最後一項，則選中第一項
          if (prev === null || prev >= filteredTodos.length - 1) return 0;
          return prev + 1;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedTodoIndex((prev) => {
          // 如果沒有選中項目或已是第一項，則選中最後一項
          if (prev === null || prev <= 0) return filteredTodos.length - 1;
          return prev - 1;
        });
      } else if (e.key === 'Enter' && focusedTodoIndex !== null) {
        e.preventDefault();
        const focusedTodo = filteredTodos[focusedTodoIndex];
        handleEdit(focusedTodo);
      } else if (e.key === ' ' && focusedTodoIndex !== null) {
        // 處理空格鍵 - 切換狀態
        e.preventDefault();
        const focusedTodo = filteredTodos[focusedTodoIndex];
        // 顯示視覺反饋
        const statusElement = document.querySelector(
          `[data-todo-id="${focusedTodo._id}"] .status-icon`,
        );
        if (statusElement) {
          statusElement.classList.add('animate-pulse');
          setTimeout(() => statusElement.classList.remove('animate-pulse'), 500);
        }
        // 調用 toggleTodoStatus 函數
        todoService
          .toggleTodoStatus(focusedTodo._id, focusedTodo.status as TodoStatus)
          .then(() => {
            handleStatusChange();
            toast.success('Status updated');
          })
          .catch(() => {
            toast.error('Failed to update status');
          });
      }
    },
    [filteredTodos, focusedTodoIndex, handleStatusChange],
  );

  // 設置鍵盤事件監聽器
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    // 載入 Todos
    loadTodos();

    // 從 URL 參數或 localStorage 載入視圖類型
    const viewParam = searchParams.get('view') as ViewType | null;
    if (viewParam === 'list' || viewParam === 'board') {
      setViewType(viewParam);
    } else {
      const savedView = localStorage.getItem('todoViewPreference') as ViewType | null;
      if (savedView === 'list' || savedView === 'board') {
        setViewType(savedView);
      }
    }

    // 清理函數
    return () => {
      clearPendingDeletions();
    };
  }, [searchParams, clearPendingDeletions]);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{t('todos.title')}</h1>
          <CreateTodoDialog onSuccess={loadTodos} />
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <TodosFilterBar
          viewType={viewType}
          onViewChange={handleViewChange}
          className="bg-white rounded-lg shadow-sm"
        />
        <TodosStatusFilter
          currentStatus={filterStatus}
          statusCounts={statusCounts}
          onStatusChange={handleFilterChange}
          className="bg-white rounded-lg shadow-sm"
        />
      </div>

      {isLoading ? (
        <TodosLoadingState />
      ) : (
        <>
          {filteredTodos.length === 0 ? (
            <FadePresence>
              <TodosEmptyState
                filterStatus={filterStatus}
                onClearFilter={handleClearFilter}
                onCreateTodo={handleOpenCreateDialog}
              />
            </FadePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {viewType === 'list' ? (
                  <div className="space-y-4">
                    {filteredTodos.map((todo, index) => (
                      <motion.div
                        key={todo._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <TodoCard
                          {...todo}
                          onDelete={() => handleDelete(todo._id)}
                          onEdit={() => handleEdit(todo)}
                          onStatusChange={handleStatusChange}
                          isFocused={focusedTodoIndex === index}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <TodosBoardView
                    todos={filteredTodos}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onStatusChange={handleStatusChange}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {editingTodo && isEditDialogOpen && (
            <EditTodoDialog
              todo={editingTodo}
              open={isEditDialogOpen}
              onClose={handleEditClose}
              onSuccess={handleEditSuccess}
            />
          )}
          {isCreateDialogOpen && <CreateTodoDialog onSuccess={loadTodos} />}

          <TodosHelpInfo />
        </>
      )}
    </div>
  );
}

export default TodosPage;
