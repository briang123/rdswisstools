import React, { useMemo, useEffect, useRef } from 'react';
import type { VisibilityState, ColumnFiltersState } from '@tanstack/react-table';
import { useTableSelection } from '../hooks/use-table-selection';
import { useTableSorting } from '../hooks/use-table-sorting';
import { useTablePagination } from '../hooks/use-table-pagination';
import { useTableFilters } from '../hooks/use-table-filters';
import { useTableStoreFactory } from '@/hooks/use-table-store';
import { useStore } from 'zustand';

export function useDataTable(data: Record<string, unknown>[]) {
  // Column visibility and filters
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // Data keys
  const dataKeys = useMemo(
    () => (data && data.length > 0 ? Object.keys(data[0] as object) : []),
    [data],
  );

  // Table state hooks
  const { rowSelection, setRowSelection } = useTableSelection();
  const { sorting, setSorting } = useTableSorting();
  const { pagination, setPagination } = useTablePagination();
  const filtersState = useTableFilters(dataKeys, setColumnFilters);

  // Zustand table store (assuming a single table for now, key can be parameterized)
  const tableStore = useTableStoreFactory('table-state-main');
  const globalSearch = useStore(tableStore, (s) => s.globalSearch);
  const setGlobalSearch = useStore(tableStore, (s) => s.setGlobalSearch);
  const debouncedGlobalSearch = useStore(tableStore, (s) => s.debouncedGlobalSearch);
  const setDebouncedGlobalSearch = useStore(tableStore, (s) => s.setDebouncedGlobalSearch);

  // Debounce globalSearch updates
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedGlobalSearch(globalSearch);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [globalSearch, setDebouncedGlobalSearch]);

  return {
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    dataKeys,
    rowSelection,
    setRowSelection,
    sorting,
    setSorting,
    pagination,
    setPagination,
    globalSearch,
    setGlobalSearch,
    debouncedGlobalSearch,
    ...filtersState,
  };
}
