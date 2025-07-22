import { useEffect, useMemo, useState, useCallback } from 'react';
import type { SortingState, ColumnFiltersState } from '@tanstack/react-table';

export interface UseDataTableOptions {
  initialSorting?: SortingState;
  initialFilters?: ColumnFiltersState;
  initialPagination?: { pageIndex: number; pageSize: number };
}

export type DataSource<T> = T[] | (() => Promise<T[]>);

export function useDataTable<T = unknown>(
  dataSource: DataSource<T>,
  options: UseDataTableOptions = {},
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [sorting, setSorting] = useState<SortingState>(options.initialSorting || []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    options.initialFilters || [],
  );
  const [pagination, setPagination] = useState(
    options.initialPagination || { pageIndex: 0, pageSize: 10 },
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (typeof dataSource === 'function') {
        const result = await dataSource();
        setData(result);
      } else {
        setData(dataSource);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [dataSource]);

  useEffect(() => {
    loadData();
    // Only reload if dataSource changes (not on options change)
  }, [loadData]);

  // Memoize data keys for dynamic columns
  const dataKeys = useMemo(
    () => (data && data.length > 0 ? Object.keys(data[0] as object) : []),
    [data],
  );

  return {
    data,
    loading,
    error,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    pagination,
    setPagination,
    dataKeys,
    reload: loadData,
  };
}
