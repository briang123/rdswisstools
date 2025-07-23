import React, { useMemo } from 'react';
import type { VisibilityState, ColumnFiltersState } from '@tanstack/react-table';
import { useTableSelection } from '../hooks/use-table-selection';
import { useTableSorting } from '../hooks/use-table-sorting';
import { useTablePagination } from '../hooks/use-table-pagination';
import { useTableFilters } from '../hooks/use-table-filters';
import { useGlobalSearch } from '../hooks/use-global-search';

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
  const globalSearchState = useGlobalSearch('');
  const filtersState = useTableFilters(dataKeys, setColumnFilters);

  return {
    // Column visibility/filters
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    dataKeys,
    // Selection
    rowSelection,
    setRowSelection,
    // Sorting
    sorting,
    setSorting,
    // Pagination
    pagination,
    setPagination,
    // Global search
    ...globalSearchState,
    // Filters UI state/logic
    ...filtersState,
  };
}
