import { ColumnDef, Row, FilterFn, Column as TanstackColumn, Table } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { RowActionsMenu } from '@/components/table/ui/row-actions-menu';
import { customFilterFn } from '@/components/table/utils/filters';

export function getSelectionColumn(): ColumnDef<unknown> {
  return {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllRowsSelected()}
          onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
          aria-label="Select all rows"
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
  };
}

export function getActionsColumn(rowActionHandlers: {
  onEdit: (id: string) => void;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
}): ColumnDef<unknown> {
  return {
    id: 'actions',
    cell: ({ row }) => (
      <RowActionsMenu
        rowId={String(row.id)}
        onEdit={rowActionHandlers.onEdit}
        onCopy={rowActionHandlers.onCopy}
        onDelete={rowActionHandlers.onDelete}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

export function getDataColumn(key: string, idx: number): ColumnDef<unknown> {
  const safeKey = key && typeof key === 'string' && key.trim() !== '' ? key : `Column ${idx + 1}`;
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
        {column.getIsSorted() === 'asc' && <span className="inline size-3">↓</span>}
        {column.getIsSorted() === 'desc' && <span className="inline size-3">↑</span>}
      </button>
    ),
    cell: ({ row }: { row: Row<unknown> }) =>
      String((row.original as Record<string, unknown>)[key] ?? ''),
    enableSorting: true,
    enableColumnFilter: true,
    filterFn: customFilterFn as unknown as FilterFn<unknown>,
  };
}

export function getVisibleColumns(table: Table<unknown>) {
  return table
    .getAllColumns()
    .filter((col) => col.getIsVisible() && col.id !== 'select' && col.id !== 'actions')
    .map((col) => col.id);
}

export function getToolbarColumns(table: Table<unknown>) {
  return table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined')
    .map((column) => ({
      id: column.id,
      label: column.id,
      canHide: column.getCanHide(),
      isVisible: column.getIsVisible(),
      toggle: () => column.toggleVisibility(!column.getIsVisible()),
    }));
}

export function getDataTableColumns(
  dataKeys: string[],
  rowActionHandlers: {
    onEdit: (id: string) => void;
    onCopy: (id: string) => void;
    onDelete: (id: string) => void;
  },
): ColumnDef<unknown>[] {
  return [
    getSelectionColumn(),
    ...dataKeys.map((key, idx) => getDataColumn(key, idx)),
    getActionsColumn(rowActionHandlers),
  ];
}
