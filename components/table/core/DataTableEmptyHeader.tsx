import { Table, TableRow, TableCell } from '@/components/ui/table';
import type { Table as TanstackTable } from '@tanstack/react-table';

export default function DataTableEmptyHeader({ table }: { table: TanstackTable<unknown> }) {
  return (
    <TableRow>
      {table
        .getAllColumns()
        .filter((col) => col.id !== 'select' && col.getIsVisible() && col.id !== 'actions')
        .map((col) => (
          <TableCell key={col.id} className="font-semibold text-sm">
            {col.id}
          </TableCell>
        ))}
    </TableRow>
  );
}
