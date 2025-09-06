// src/hooks/useSoftDelete.ts
import { useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface SoftDeleteOptions<T> {
  onDelete: (id: string) => Promise<void>;
  timeout?: number;
  getItemTitle?: (item: T) => string;
}

export function useSoftDelete<T extends { _id: string }>(
  items: T[],
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  options: SoftDeleteOptions<T>
) {
  const { onDelete, timeout = 5000, getItemTitle = item => item._id } = options;

  const pendingDeletions = useRef<
    Map<
      string,
      {
        item: T;
        timeoutId: NodeJS.Timeout;
        toastId?: string;
      }
    >
  >(new Map());

  const handleDelete = useCallback(
    async (itemId: string) => {
      const itemToDelete = items.find(item => item._id === itemId);
      if (!itemToDelete) return;

      // Clear any existing timeout
      if (pendingDeletions.current.has(itemId)) {
        const { timeoutId, toastId } = pendingDeletions.current.get(itemId)!;
        clearTimeout(timeoutId);
        if (toastId) toast.dismiss(toastId);
      }

      // Optimistically remove from UI
      setItems(currentItems => currentItems.filter(item => item._id !== itemId));

      // Show toast with undo button
      const itemTitle = getItemTitle(itemToDelete);
      const toastId = toast('Item deleted', {
        action: {
          label: 'Undo',
          onClick: () => handleUndo(itemId),
        },
        duration: timeout,
        description: `"${itemTitle}" has been removed`,
      });

      // Set deletion timeout
      const timeoutId = setTimeout(async () => {
        try {
          await onDelete(itemId);
          pendingDeletions.current.delete(itemId);
        } catch (error) {
          // Restore item on delete failure
          const pendingDeletion = pendingDeletions.current.get(itemId);
          if (pendingDeletion) {
            setItems(currentItems => {
              if (currentItems.some(item => item._id === itemId)) return currentItems;
              return [...currentItems, pendingDeletion.item];
            });
            pendingDeletions.current.delete(itemId);
          }
          toast.error('Failed to delete item');
        }
      }, timeout);

      // Store in pending deletions
      pendingDeletions.current.set(itemId, {
        item: itemToDelete,
        timeoutId,
        toastId: toastId?.toString(),
      });
    },
    [items, setItems, onDelete, timeout, getItemTitle]
  );

  const handleUndo = useCallback(
    (itemId: string) => {
      const pendingDeletion = pendingDeletions.current.get(itemId);
      if (!pendingDeletion) return;

      clearTimeout(pendingDeletion.timeoutId);
      if (pendingDeletion.toastId) {
        toast.dismiss(pendingDeletion.toastId);
      }
      pendingDeletions.current.delete(itemId);

      setItems(currentItems => {
        if (currentItems.some(item => item._id === itemId)) return currentItems;
        return [...currentItems, pendingDeletion.item];
      });

      const itemTitle = getItemTitle(pendingDeletion.item);
      toast.success('Item restored', {
        description: `"${itemTitle}" has been restored`,
      });
    },
    [setItems, getItemTitle]
  );

  const clearPendingDeletions = useCallback(() => {
    pendingDeletions.current.forEach(({ timeoutId }) => {
      clearTimeout(timeoutId);
    });
    pendingDeletions.current.clear();
  }, []);

  return {
    handleDelete,
    handleUndo,
    clearPendingDeletions,
    getPendingDeletionIds: () => Array.from(pendingDeletions.current.keys()),
  };
}
