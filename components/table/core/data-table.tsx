'use client';

// External libraries
import * as React from 'react';
import { toast } from 'sonner';

// dnd-kit
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// tanstack table
import {
  ColumnDef,
  FilterFn,
  Row,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column as TanstackColumn,
} from '@tanstack/react-table';

// tabler icons
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

// Project UI components
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaginationControls } from '../ui/pagination-controls';
import { ColumnVisibilityMenu } from '../ui/column-visibility-menu';
import { RowActionsMenu } from '../ui/row-actions-menu';
import { TableHeaderCheckbox } from '@/components/table/core/TableHeaderCheckbox';

// Local table abstractions
import { useDataTable } from '../core/use-data-table';
import { FiltersUI } from '../ui/filters-ui';
import { ExportUI } from '../ui/export-ui';
import { DragHandle } from '../ui/DragHandle';
import { handleCopy, handleSave } from '../utils/utils';
import { FILTER_OPERATORS } from '../ui/filters-ui.types';
import { customFilterFn, globalFilterFn } from '../utils/filters';
import type { ExportFormat } from '../utils/utils';

export function DataTable({ data }: { data: Record<string, unknown>[] }) {
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
  } = useDataTable(data);
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Dynamically generate columns from data keys
  const columns = React.useMemo<ColumnDef<unknown>[]>(() => {
    const baseColumns: ColumnDef<unknown>[] = [
      {
        id: 'drag',
        header: () => null,
        cell: ({ row }) => <DragHandle id={String(row.id)} />, // Use row.id as string for unique identifier
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'select',
        header: ({ table }) => <TableHeaderCheckbox table={table} />,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ];
    const dataColumns = dataKeys.map((key, idx) => {
      const safeKey =
        key && typeof key === 'string' && key.trim() !== '' ? key : `Column ${idx + 1}`;
      return {
        id: safeKey,
        accessorKey: key,
        header: ({ column }: { column: TanstackColumn<unknown, unknown> }) => (
          <button
            type="button"
            className="flex items-center gap-1 group text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
            data-testid={`data-table-sort-${safeKey}`}
          >
            <span>{safeKey}</span>
            {column.getIsSorted() === 'asc' && <IconChevronDown className="inline size-3" />}
            {column.getIsSorted() === 'desc' && <IconChevronUp className="inline size-3" />}
          </button>
        ),
        cell: ({ row }: { row: Row<unknown> }) =>
          String((row.original as Record<string, unknown>)[key] ?? ''),
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: customFilterFn as unknown as FilterFn<unknown>,
      };
    });
    const actionsColumn: ColumnDef<unknown> = {
      id: 'actions',
      cell: ({ row }) => (
        <RowActionsMenu
          rowId={String(row.id)}
          onEdit={(id) => alert(`Edit row ${id}`)}
          onCopy={(id) => alert(`Copy row ${id}`)}
          onDelete={(id) => alert(`Delete row ${id}`)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };
    return [...baseColumns, ...dataColumns, actionsColumn];
  }, [dataKeys]);

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map((_, idx) => String(idx)) || [],
    [data],
  );

  // Global text search state (using TanStack Table's globalFilter)
  // const { value: globalSearch, onChange: onGlobalSearchChange } = useGlobalSearch('');

  const table = useReactTable({
    data,
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

  // Get visible columns from table state
  const visibleColumns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (col) =>
            col.getIsVisible() && col.id !== 'drag' && col.id !== 'select' && col.id !== 'actions',
        )
        .map((col) => col.id),
    [table],
  );

  // Export handlers
  // Remove handleCopy and handleSave function definitions from this file

  // Remove global filter input and add filter menu using DropdownMenu
  // Filter operator options
  function handleDragEnd() {
    // No-op for now
  }

  return (
    <div className="w-full flex-col justify-start gap-6" data-testid="data-table-root">
      <div className="flex items-center justify-between gap-2 px-4 lg:px-6 mb-4">
        {/* Global text search and Filters button side by side */}
        <div className="flex items-center gap-2 flex-1">
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            placeholder="Search..."
            className="max-w-xs rounded-md border border-border bg-background text-foreground px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="data-table-global-search"
          />
          <FiltersUI
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
            handleRemoveFilter={handleRemoveFilter}
            handleClearFilters={handleClearFilters}
            handleApplyFilters={handleApplyFilters}
          />
        </div>
        {/* Menubar on the right */}
        <ExportUI
          onCopy={(format) => handleCopy(format as ExportFormat, data, visibleColumns, toast)}
          onSave={(format) => handleSave(format as ExportFormat, data, visibleColumns, toast)}
        />
        <ColumnVisibilityMenu
          columns={table
            .getAllColumns()
            .filter((column) => typeof column.accessorFn !== 'undefined')
            .map((column) => ({
              id: column.id,
              label: column.id,
              canHide: column.getCanHide(),
              isVisible: column.getIsVisible(),
              toggle: () => column.toggleVisibility(!column.getIsVisible()),
            }))}
        />
      </div>
      <div className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <PaginationControls
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          pageSize={table.getState().pagination.pageSize}
          onPageSizeChange={table.setPageSize}
          onFirstPage={() => table.setPageIndex(0)}
          onPrevPage={table.previousPage}
          onNextPage={table.nextPage}
          onLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
          canPrevPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
        />
      </div>
    </div>
  );
}
