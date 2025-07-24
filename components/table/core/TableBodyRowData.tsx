import React from 'react';
import TableBodyRow from './TableBodyRow';
import type { Table as TanstackTable } from '@tanstack/react-table';

export default function TableBodyRowData({ table }: { table: TanstackTable<unknown> }) {
  return (
    <>
      {table.getRowModel().rows.map((row) => (
        <TableBodyRow key={row.id} row={row} />
      ))}
    </>
  );
}
