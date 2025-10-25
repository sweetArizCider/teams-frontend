import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  paginatedData: T[];
  setCurrentPage: (_page: number) => void;
  onPageChange: (_page: number) => void;
}

export const usePagination = <T>(
  props: UsePaginationProps<T>
): UsePaginationReturn<T> => {
  const { data, itemsPerPage } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const onPageChange = (page: number): void => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    setCurrentPage,
    onPageChange
  };
};
