'use client';

import * as React from 'react';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
  IconFileCode,
  IconFileSpreadsheet,
  IconFileText,
  IconFileTypeCsv,
  IconMarkdown,
  IconCopy,
  IconDownload,
  IconFile,
  IconChevronUp,
} from '@tabler/icons-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
  FilterFn,
  filterFns,
  Table as TanstackTable,
  Column as TanstackColumn,
} from '@tanstack/react-table';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { toast } from 'sonner';
import { z } from 'zod';

import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
} from '@/components/ui/menubar';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';

// Export utilities for array-of-objects and visible columns
function exportToCSV(data: Record<string, unknown>[], columns: string[]): string {
  const headerRow = columns;
  const dataRows = data.map((row) => columns.map((col) => row[col] ?? ''));
  return Papa.unparse([headerRow, ...dataRows]);
}

function exportToJSON(data: Record<string, unknown>[], columns: string[]): string {
  const jsonData = data.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col) => {
      obj[col] = row[col] ?? '';
    });
    return obj;
  });
  return JSON.stringify(jsonData, null, 2);
}

function exportToHTML(data: Record<string, unknown>[], columns: string[]): string {
  let html = '<table border="1" cellpadding="5" cellspacing="0">\n';
  html += '  <thead>\n    <tr>\n';
  columns.forEach((col) => {
    html += `      <th>${col}</th>\n`;
  });
  html += '    </tr>\n  </thead>\n';
  html += '  <tbody>\n';
  data.forEach((row) => {
    html += '    <tr>\n';
    columns.forEach((col) => {
      html += `      <td>${row[col] ?? ''}</td>\n`;
    });
    html += '    </tr>\n';
  });
  html += '  </tbody>\n</table>';
  return html;
}

function exportToMarkdown(data: Record<string, unknown>[], columns: string[]): string {
  let md = '| ' + columns.join(' | ') + ' |\n';
  md += '| ' + columns.map(() => '---').join(' | ') + ' |\n';
  data.forEach((row) => {
    md += '| ' + columns.map((col) => row[col] ?? '').join(' | ') + ' |\n';
  });
  return md;
}

function exportToXLSX(data: Record<string, unknown>[], columns: string[], filename: string): void {
  const headerRow = columns;
  const dataRows = data.map((row) => columns.map((col) => row[col] ?? ''));
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);
  XLSX.utils.book_append_sheet(wb, ws, 'Table Data');
  XLSX.writeFile(wb, filename);
}

function exportToPDF(data: Record<string, unknown>[], columns: string[], filename: string): void {
  const doc = new jsPDF();
  const headerRow = columns;
  const dataRows = data.map((row) => columns.map((col) => row[col] ?? ''));
  autoTable(doc, {
    head: [headerRow],
    body: dataRows,
    startY: 20,
    margin: { top: 20 },
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [79, 70, 229] },
  });
  doc.setFontSize(16);
  doc.text('Table Data', 14, 15);
  doc.save(filename);
}

function downloadBlob(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// Utility: Convert array-of-objects to TableData
function arrayToTableData(data: Record<string, unknown>[], visibleColumns: string[]): any {
  const columns = visibleColumns.map((key) => ({
    id: key,
    label: key,
    visible: true,
  }));
  return {
    columns,
    rows: data.map((row) => ({
      cells: Object.fromEntries(columns.map((col) => [col.id, { value: row[col.id] ?? '' }])),
    })),
  };
}

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string }) {
  const { attributes, listeners } = useSortable({ id });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Remove static columns

export function DataTable({ data }: { data: Record<string, unknown>[] }) {
  // Remove internal state for data
  // const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Dynamically generate columns from data keys
  const dataKeys = React.useMemo(
    () => (data && data.length > 0 ? Object.keys(data[0] as object) : []),
    [data],
  );
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
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer rounded hover:bg-muted transition">
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => alert(`Edit row ${row.id}`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Copy row ${row.id}`)}>
              Make a copy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => alert(`Delete row ${row.id}`)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
  const [globalSearch, setGlobalSearch] = useState('');

  function customFilterFn(
    row: Row<unknown>,
    columnId: string,
    filterValue: { op: string; val: string },
  ) {
    const cellValue = String(row.getValue(columnId) ?? '');
    const { op, val } = filterValue;
    switch (op) {
      case 'equals':
        return cellValue === val;
      case 'notEquals':
        return cellValue !== val;
      case 'contains':
        return cellValue.toLowerCase().includes(val.toLowerCase());
      case 'notContains':
        return !cellValue.toLowerCase().includes(val.toLowerCase());
      case 'startsWith':
        return cellValue.toLowerCase().startsWith(val.toLowerCase());
      case 'endsWith':
        return cellValue.toLowerCase().endsWith(val.toLowerCase());
      default:
        return true;
    }
  }

  // Global filter function for TanStack Table
  const globalFilterFn: FilterFn<unknown> = (row, _columnId, filterValue) => {
    if (!filterValue) return true;
    // Get all visible columns for this row, excluding utility columns
    const visibleColumnIds = row
      .getAllCells()
      .map((cell) => cell.column.id)
      .filter((colId) => !['drag', 'select', 'actions'].includes(colId));
    return visibleColumnIds.some((colId) => {
      const cellValue = String(row.getValue(colId) ?? '');
      return cellValue.toLowerCase().includes((filterValue as string).toLowerCase());
    });
  };

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
    onGlobalFilterChange: setGlobalSearch,
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
  function handleCopy(format: string) {
    let content = '';
    switch (format) {
      case 'csv':
        content = exportToCSV(data, visibleColumns);
        break;
      case 'json':
        content = exportToJSON(data, visibleColumns);
        break;
      case 'html':
        content = exportToHTML(data, visibleColumns);
        break;
      case 'markdown':
        content = exportToMarkdown(data, visibleColumns);
        break;
      default:
        return;
    }
    navigator.clipboard.writeText(content);
    toast.success(`Copied table data as ${format.toUpperCase()} to clipboard`);
  }

  function handleSave(format: string) {
    let content = '';
    let mime = '';
    let filename = 'table';
    switch (format) {
      case 'csv':
        content = exportToCSV(data, visibleColumns);
        mime = 'text/csv';
        filename += '.csv';
        downloadBlob(content, filename, mime);
        toast.success('Saved table data as CSV');
        break;
      case 'json':
        content = exportToJSON(data, visibleColumns);
        mime = 'application/json';
        filename += '.json';
        downloadBlob(content, filename, mime);
        toast.success('Saved table data as JSON');
        break;
      case 'html':
        content = exportToHTML(data, visibleColumns);
        mime = 'text/html';
        filename += '.html';
        downloadBlob(content, filename, mime);
        toast.success('Saved table data as HTML');
        break;
      case 'markdown':
        content = exportToMarkdown(data, visibleColumns);
        mime = 'text/markdown';
        filename += '.md';
        downloadBlob(content, filename, mime);
        toast.success('Saved table data as Markdown');
        break;
      case 'excel':
        exportToXLSX(data, visibleColumns, 'table.xlsx');
        toast.success('Saved table data as Excel');
        break;
      case 'pdf':
        exportToPDF(data, visibleColumns, 'table.pdf');
        toast.success('Saved table data as PDF');
        break;
      default:
        return;
    }
  }

  // Remove global filter input and add filter menu using DropdownMenu
  // Filter operator options
  const FILTER_OPERATORS = [
    { value: 'equals', label: 'equals' },
    { value: 'notEquals', label: 'does not equal' },
    { value: 'contains', label: 'contains' },
    { value: 'notContains', label: 'does not contain' },
    { value: 'startsWith', label: 'starts with' },
    { value: 'endsWith', label: 'ends with' },
  ];

  // Filter menu state
  type FilterDraft = { id: string; column: string; operator: string; value: string };
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [logicType, setLogicType] = useState<'AND' | 'OR'>('AND');
  const [draftFilters, setDraftFilters] = useState<FilterDraft[]>([]);
  const [newFilter, setNewFilter] = useState<Omit<FilterDraft, 'id'>>({
    column: dataKeys[0] || '',
    operator: 'equals',
    value: '',
  });

  // Add filter to draft
  function handleAddFilter() {
    if (newFilter.column && newFilter.value) {
      setDraftFilters((prev) => [
        ...prev,
        { ...newFilter, id: `filter-${Math.random().toString(36).slice(2, 10)}` },
      ]);
      setNewFilter({ ...newFilter, value: '' });
    }
  }
  // Remove filter from draft
  function handleRemoveFilter(id: string) {
    setDraftFilters((prev) => prev.filter((f) => f.id !== id));
  }
  // Clear all filters
  function handleClearFilters() {
    setDraftFilters([]);
    setColumnFilters([]);
  }
  // Apply filters to table
  function handleApplyFilters() {
    setColumnFilters(
      draftFilters.map((f) => ({ id: f.column, value: { op: f.operator, val: f.value } })),
    );
    setFilterMenuOpen(false);
  }

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
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search..."
            className="max-w-xs rounded-md border border-border bg-background text-foreground px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            data-testid="data-table-global-search"
          />
          {/* Filter menu button using DropdownMenu */}
          <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="inline-flex items-center text-xs h-8 px-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1 text-popover-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                {draftFilters.length > 0 && (
                  <span className="ml-1 bg-primary text-white text-xs px-1.5 rounded-full">
                    {draftFilters.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-0" sideOffset={5}>
              <div className="p-3 bg-popover text-popover-foreground">
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm font-medium text-popover-foreground">Filters</span>
                  <Button
                    variant="link"
                    className="text-xs text-primary p-0 h-auto"
                    onClick={handleAddFilter}
                    disabled={!newFilter.column || !newFilter.value}
                  >
                    + Add filter
                  </Button>
                </div>
                {/* New filter form */}
                <div className="p-2 rounded mb-2 border bg-muted dark:bg-muted border-border dark:border-border">
                  <div className="flex items-center space-x-2 w-full mb-2">
                    <Select
                      value={newFilter.column}
                      onValueChange={(value) => setNewFilter({ ...newFilter, column: value })}
                    >
                      <SelectTrigger className="text-xs h-8 w-full bg-background text-foreground border border-border rounded">
                        <SelectValue placeholder="Select column" />
                      </SelectTrigger>
                      <SelectContent className="bg-background text-foreground border border-border">
                        {dataKeys.map((col) => (
                          <SelectItem
                            key={col}
                            value={col}
                            className="text-xs bg-background text-foreground"
                          >
                            {col}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={newFilter.operator}
                      onValueChange={(value) => setNewFilter({ ...newFilter, operator: value })}
                    >
                      <SelectTrigger className="text-xs h-8 w-full bg-background text-foreground border border-border rounded">
                        <SelectValue placeholder="Operator" />
                      </SelectTrigger>
                      <SelectContent className="bg-background text-foreground border border-border">
                        {FILTER_OPERATORS.map((op) => (
                          <SelectItem
                            key={op.value}
                            value={op.value}
                            className="text-xs bg-background text-foreground"
                          >
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="text"
                    className="w-full text-xs h-8 bg-background text-foreground border border-border rounded"
                    placeholder="Filter value"
                    value={newFilter.value}
                    onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFilter();
                    }}
                  />
                </div>
                {/* Filter Logic Type Selector (Button Group) */}
                {draftFilters.length > 1 && (
                  <div className="mb-3 p-2 rounded border bg-muted dark:bg-muted border-border dark:border-border">
                    <div className="text-xs font-medium mb-2">Filter Condition Logic:</div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={logicType === 'AND' ? 'default' : 'outline'}
                        className={`text-xs px-2 py-1 border border-border rounded ${logicType === 'AND' ? '' : 'bg-background text-foreground'}`}
                        onClick={() => setLogicType('AND')}
                      >
                        Match ALL filters (AND)
                      </Button>
                      <Button
                        size="sm"
                        variant={logicType === 'OR' ? 'default' : 'outline'}
                        className={`text-xs px-2 py-1 border border-border rounded ${logicType === 'OR' ? '' : 'bg-background text-foreground'}`}
                        onClick={() => setLogicType('OR')}
                      >
                        Match ANY filter (OR)
                      </Button>
                    </div>
                  </div>
                )}
                {/* Active filters */}
                {draftFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="p-2 rounded mb-2 border bg-muted dark:bg-muted border-border dark:border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs">
                        <span className="font-medium">{filter.column}</span>{' '}
                        <span className="text-gray-500">
                          {FILTER_OPERATORS.find((op) => op.value === filter.operator)?.label ||
                            filter.operator}
                        </span>{' '}
                        <span>&quot;{filter.value}&quot;</span>
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => handleRemoveFilter(filter.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                {/* Filter actions */}
                <div className="mt-3 flex justify-between">
                  <Button
                    variant="ghost"
                    className="text-xs h-8"
                    onClick={handleClearFilters}
                    disabled={draftFilters.length === 0}
                  >
                    Clear all
                  </Button>
                  <Button variant="default" className="text-xs h-8" onClick={handleApplyFilters}>
                    Apply filters
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Menubar on the right */}
        <Menubar className="bg-muted border rounded-md shadow-sm" data-testid="data-table-menubar">
          <MenubarMenu>
            <MenubarTrigger>
              <IconCopy className="mr-2" />
              Copy
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => handleCopy('json')}>
                <IconFileCode className="mr-2" />
                JSON
              </MenubarItem>
              <MenubarItem onClick={() => handleCopy('html')}>
                <IconFileText className="mr-2" />
                HTML
              </MenubarItem>
              <MenubarItem onClick={() => handleCopy('csv')}>
                <IconFileTypeCsv className="mr-2" />
                CSV
              </MenubarItem>
              <MenubarItem onClick={() => handleCopy('markdown')}>
                <IconMarkdown className="mr-2" />
                Markdown
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              <IconDownload className="mr-2" />
              Save
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => handleSave('json')}>
                <IconFileCode className="mr-2" />
                JSON
              </MenubarItem>
              <MenubarItem onClick={() => handleSave('html')}>
                <IconFileText className="mr-2" />
                HTML
              </MenubarItem>
              <MenubarItem onClick={() => handleSave('csv')}>
                <IconFileTypeCsv className="mr-2" />
                CSV
              </MenubarItem>
              <MenubarItem onClick={() => handleSave('markdown')}>
                <IconMarkdown className="mr-2" />
                Markdown
              </MenubarItem>
              <MenubarItem onClick={() => handleSave('excel')}>
                <IconFileSpreadsheet className="mr-2" />
                Excel
              </MenubarItem>
              <MenubarItem onClick={() => handleSave('pdf')}>
                <IconFile className="mr-2" />
                PDF
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              <IconLayoutColumns className="mr-2" />
              Columns
            </MenubarTrigger>
            <MenubarContent className="w-56">
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                .map((column) => (
                  <MenubarCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </MenubarCheckboxItem>
                ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
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
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                data-testid="data-table-first-page"
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                data-testid="data-table-prev-page"
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                data-testid="data-table-next-page"
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                data-testid="data-table-last-page"
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function TableCellViewer({ item }: { item: Record<string, unknown> }) {
  const isMobile = useIsMobile();
  // Example rendering for dynamic data (can be improved as needed)
  return (
    <div className="p-2">
      {Object.entries(item).map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <span className="font-semibold">{key}:</span>
          <span>{String(value ?? '')}</span>
        </div>
      ))}
    </div>
  );
}
