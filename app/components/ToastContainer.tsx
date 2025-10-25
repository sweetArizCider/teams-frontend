import React from 'react';
import { Toast, ToastToggle } from 'flowbite-react';
import {
  HiCheck,
  HiExclamation,
  HiX,
  HiInformationCircle
} from 'react-icons/hi';
import type { ToastData } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastData[];
  onRemoveToast: (_id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = (
  props: ToastContainerProps
) => {
  const { toasts, onRemoveToast } = props;

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <HiCheck className='h-5 w-5' />;
      case 'error':
        return <HiX className='h-5 w-5' />;
      case 'warning':
        return <HiExclamation className='h-5 w-5' />;
      case 'info':
        return <HiInformationCircle className='h-5 w-5' />;
      default:
        return <HiInformationCircle className='h-5 w-5' />;
    }
  };

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200';
      case 'info':
        return 'bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className='fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm'>
      {toasts.map((toast) => (
        <Toast key={toast.id}>
          <div
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getToastStyles(toast.type)}`}
          >
            {getToastIcon(toast.type)}
          </div>
          <div className='ml-3 text-sm font-normal'>{toast.message}</div>
          <ToastToggle onDismiss={() => onRemoveToast(toast.id)} />
        </Toast>
      ))}
    </div>
  );
};
