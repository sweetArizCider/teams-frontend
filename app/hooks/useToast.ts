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

export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

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

      // Auto remove toast after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

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
