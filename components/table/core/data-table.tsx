'use client';

import * as React from 'react';
import { toast } from 'sonner';

import {
  FilterFn,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { PaginationControls } from '@/components/table/ui/pagination-controls';
import { TableToolbar } from '@/components/table/core/table-toolbar';

import TableEmptyState from '@/components/table/core/TableEmptyState';
import DataTableEmptyHeader from '@/components/table/core/DataTableEmptyHeader';
import TableHeaderRowData from '@/components/table/core/TableHeaderRowData';
import TableBodyRowData from '@/components/table/core/TableBodyRowData';

import { useDataTable } from '@/components/table/core/use-data-table';
import { FILTER_OPERATORS } from '@/components/table/ui/filters-ui.types';
import { globalFilterFn } from '@/components/table/utils/filters';
import { handleCopy, handleSave } from '@/components/table/utils/utils';
import type { ExportFormat } from '@/components/table/utils/utils';
import {
  getDataTableColumns,
  getVisibleColumns,
  getToolbarColumns,
} from '@/components/table/core/data-table.columns';
import DataTableContainer from '@/components/table/core/DataTableContainer';

function getRowActionHandlers() {
  return {
    onEdit: (id: string) => alert(`Edit row ${id}`),
    onCopy: (id: string) => alert(`Copy row ${id}`),
    onDelete: (id: string) => alert(`Delete row ${id}`),
  };
}

function getPaginationControlsProps(table: ReturnType<typeof useReactTable>) {
  return {
    pageIndex: table.getState().pagination.pageIndex,
    pageCount: table.getPageCount(),
    pageSize: table.getState().pagination.pageSize,
    onPageSizeChange: table.setPageSize,
    onFirstPage: () => table.setPageIndex(0),
    onPrevPage: table.previousPage,
    onNextPage: table.nextPage,
    onLastPage: () => table.setPageIndex(table.getPageCount() - 1),
    canPrevPage: table.getCanPreviousPage(),
    canNextPage: table.getCanNextPage(),
  };
}

export function DataTable({ data }: { data: Record<string, unknown>[] }) {
  const [tableData, setTableData] = React.useState<Record<string, unknown>[]>(data);

  // Sync tableData with data prop
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  const {
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
    value: globalSearch,
    setValue: onGlobalSearchChange,
    filterMenuOpen,
    setFilterMenuOpen,
    logicType,
    setLogicType,
    draftFilters,
    setDraftFilters,
    newFilter,
    setNewFilter,
    handleAddFilter,
    handleRemoveFilter,
    handleClearFilters,
    handleApplyFilters,
  } = useDataTable(tableData);

  const columns = React.useMemo(
    () => getDataTableColumns(dataKeys, getRowActionHandlers()),
    [dataKeys],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter: globalSearch,
    },
    globalFilterFn: globalFilterFn as unknown as FilterFn<unknown>,
    onGlobalFilterChange: onGlobalSearchChange,
    getRowId: (_row, idx) => idx.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const visibleColumns = React.useMemo(() => getVisibleColumns(table), [table]);
  const hasRowData = table.getRowModel().rows?.length > 0;

  return (
    <DataTableContainer>
      <TableToolbar
        globalSearch={globalSearch}
        onGlobalSearchChange={onGlobalSearchChange}
        filterMenuOpen={filterMenuOpen}
        setFilterMenuOpen={setFilterMenuOpen}
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        newFilter={newFilter}
        setNewFilter={setNewFilter}
        logicType={logicType}
        setLogicType={setLogicType}
        dataKeys={dataKeys}
        FILTER_OPERATORS={FILTER_OPERATORS}
        handleAddFilter={handleAddFilter}
        handleRemoveFilter={(idx: string) => handleRemoveFilter(idx)}
        handleClearFilters={handleClearFilters}
        handleApplyFilters={handleApplyFilters}
        onCopy={(format) => handleCopy(format as ExportFormat, tableData, visibleColumns, toast)}
        onSave={(format) => handleSave(format as ExportFormat, tableData, visibleColumns, toast)}
        onClear={() => setTableData([])}
        columns={getToolbarColumns(table)}
      />
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {hasRowData ? (
                <TableHeaderRowData table={table} />
              ) : (
                <DataTableEmptyHeader table={table} />
              )}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8 min-h-[240px]">
              {hasRowData ? (
                <TableBodyRowData table={table} />
              ) : (
                <TableEmptyState message="No results. You can clear filters or upload new data." />
              )}
            </TableBody>
          </Table>
        </div>
        <PaginationControls {...getPaginationControlsProps(table)} />
      </div>
    </DataTableContainer>
  );
}
