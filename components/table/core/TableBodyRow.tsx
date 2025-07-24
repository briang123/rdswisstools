import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { flexRender, Row, Cell } from '@tanstack/react-table';

function TableBodyCell({ cell }: { cell: Cell<unknown, unknown> }) {
  return <TableCell>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
}

export default function TableBodyRow({ row }: { row: Row<unknown> }) {
  return (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map((cell) => (
        <TableBodyCell key={cell.id} cell={cell} />
      ))}
    </TableRow>
  );
}
