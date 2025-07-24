import React from 'react';
import TableHeaderRow from './TableHeaderRow';
import type { Table as TanstackTable } from '@tanstack/react-table';

export default function TableHeaderRowData({ table }: { table: TanstackTable<unknown> }) {
  return (
    <>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableHeaderRow key={headerGroup.id} headerGroup={headerGroup} />
      ))}
    </>
  );
}
