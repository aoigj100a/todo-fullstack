'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { TodosLoadingState } from '@/components/todos/TodosLoadingState';
import { TodoCard } from '@/components/todos/TodoCard';
import { CreateTodoDialog } from '@/components/todos/CreateTodoDialog';
import { EditTodoDialog } from '@/components/todos/EditTodoDialog';
import { TodosFilterBar } from '@/components/todos/TodosFilterBar';
import { TodosStatusFilter } from '@/components/todos/TodosStatusFilter';
import { TodosBoardView } from '@/components/todos/TodosBoardView';
import { TodosEmptyState } from '@/components/todos/TodosEmptyState';

import { Todo } from '@/types/todo';
import { todoService } from '@/service/todo';
import { FadePresence } from '@/components/ui/nimated-presence';
import { AnimatePresence, motion } from 'framer-motion';
import { TodosHelpInfo } from '@/components/todos/TodosHelpInfo';

const UNDO_TIMEOUT = 5000;

type ViewType = 'list' | 'board';
type FilterStatus = 'all' | 'pending' | 'in-progress' | 'completed';

function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [viewType, setViewType] = useState<ViewType>('list');

  const searchParams = useSearchParams();
  const router = useRouter();

  // const [viewType, setViewType] = useState<ViewType>(() => {
  //   const viewParam = searchParams.get("view") as ViewType | null;
  //   if (viewParam === "list" || viewParam === "board") {
  //     return viewParam;
  //   }

  //   const savedView = localStorage.getItem(
  //     "todoViewPreference"
  //   ) as ViewType | null;
  //   if (savedView === "list" || savedView === "board") {
  //     return savedView;
  //   }

  //   return "list";
  // });

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

  const pendingDeletions = useRef<
    Map<
      string,
      {
        todo: Todo;
        timeoutId: NodeJS.Timeout;
        toastId?: string;
      }
    >
  >(new Map());

  const loadTodos = async () => {
    try {
      const data = await todoService.getTodos();
      setTodos((prevTodos) => {
        const pendingTodoIds = Array.from(pendingDeletions.current.keys());
        return data.filter((todo: Todo) => !pendingTodoIds.includes(todo._id));
      });
    } catch (error) {
      toast.error('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (todoId: string) => {
    console.log('Starting delete process for:', todoId);

    const todoToDelete = todos.find((t) => t._id === todoId);
    if (!todoToDelete) return;

    // Clear any existing timeout
    if (pendingDeletions.current.has(todoId)) {
      const { timeoutId, toastId } = pendingDeletions.current.get(todoId)!;
      clearTimeout(timeoutId);
      if (toastId) toast.dismiss(toastId);
    }

    // Optimistically remove from UI
    setTodos((currentTodos) => currentTodos.filter((todo) => todo._id !== todoId));

    // Show toast with undo button
    const toastId = toast('Todo deleted', {
      action: {
        label: 'Undo',
        onClick: () => handleUndo(todoId),
      },
      duration: UNDO_TIMEOUT,
      description: `"${todoToDelete.title}" has been removed`,
    });

    // Set deletion timeout
    const timeoutId = setTimeout(async () => {
      try {
        console.log('Executing final delete for:', todoId);
        await todoService.deleteTodo(todoId);
        console.log('Delete completed successfully');
        pendingDeletions.current.delete(todoId);
      } catch (error) {
        console.error('Delete failed:', error);
        handleUndo(todoId);
        toast.error('Failed to delete todo');
      }
    }, UNDO_TIMEOUT);

    // Store in pending deletions
    pendingDeletions.current.set(todoId, {
      todo: todoToDelete,
      timeoutId,
      toastId: toastId?.toString(),
    });
  };

  const handleUndo = (todoId: string) => {
    const pendingDeletion = pendingDeletions.current.get(todoId);
    if (!pendingDeletion) return;

    clearTimeout(pendingDeletion.timeoutId);
    if (pendingDeletion.toastId) {
      toast.dismiss(pendingDeletion.toastId);
    }
    pendingDeletions.current.delete(todoId);

    setTodos((currentTodos) => {
      if (currentTodos.some((t) => t._id === todoId)) return currentTodos;
      return [...currentTodos, pendingDeletion.todo];
    });

    toast.success('Todo restored', {
      description: `"${pendingDeletion.todo.title}" has been restored`,
    });
  };

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

  // 在 useEffect 中讀取用戶的視圖偏好
  useEffect(() => {
    // 從 localStorage 讀取用戶偏好的視圖類型
    const savedViewPreference = localStorage.getItem('todoViewPreference') as ViewType | null;
    if (
      savedViewPreference &&
      (savedViewPreference === 'list' || savedViewPreference === 'board')
    ) {
      setViewType(savedViewPreference);
    }

    loadTodos();

    return () => {
      pendingDeletions.current.forEach(({ timeoutId }) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  useEffect(() => {
    loadTodos();
    return () => {
      pendingDeletions.current.forEach(({ timeoutId }) => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  useEffect(() => {
    // 這部分代碼只在瀏覽器中執行
    const viewParam = searchParams.get('view') as ViewType | null;
    if (viewParam === 'list' || viewParam === 'board') {
      setViewType(viewParam);
      return;
    }

    const savedView = localStorage.getItem('todoViewPreference') as ViewType | null;
    if (savedView === 'list' || savedView === 'board') {
      setViewType(savedView);
    }
  }, [searchParams]);

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold">My Todos</h1>
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
          {/* 在這裡添加EditTodoDialog */}
          {editingTodo && isEditDialogOpen && (
            <EditTodoDialog
              todo={editingTodo}
              open={isEditDialogOpen}
              onClose={handleEditClose}
              onSuccess={handleEditSuccess}
            />
          )}
          {isCreateDialogOpen && <CreateTodoDialog onSuccess={loadTodos} />}
          {/* 添加幫助信息 */}
          <TodosHelpInfo />
        </>
      )}
    </div>
  );
}

export default TodosPage;
