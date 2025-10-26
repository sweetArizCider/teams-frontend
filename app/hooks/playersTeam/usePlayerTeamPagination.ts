import { useState } from 'react';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (_page: number) => void;
  resetPage: () => void;
}

export const usePlayerTeamPagination = ({
  totalItems,
  itemsPerPage
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const onPageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const resetPage = (): void => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    onPageChange,
    resetPage
  };
};
