import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UseToastReturn {
  toasts: ToastData[];
  showToast: (
    _type: ToastType,
    _message: string,
    _duration?: number,
    _customId?: string
  ) => void;
  removeToast: (_id: string) => void;
  clearAllToasts: () => void;
}

type UseToastHook = () => UseToastReturn;

export const useToast: UseToastHook = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      message: string,
      duration: number = 2000,
      customId?: string
    ): void => {
      const id = customId || `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastData = { id, type, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        // eslint-disable-next-line no-undef
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const clearAllToasts = useCallback((): void => {
    setToasts([]);
  }, []);

  return {
    toasts,
    showToast,
    removeToast,
    clearAllToasts
  };
};
