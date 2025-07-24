import React from 'react';
import { TableRow, TableHead } from '@/components/ui/table';
import { flexRender, HeaderGroup, Header } from '@tanstack/react-table';

function TableHeaderCell({ header }: { header: Header<unknown, unknown> }) {
  return (
    <TableHead colSpan={header.colSpan}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
}

export default function TableHeaderRow({ headerGroup }: { headerGroup: HeaderGroup<unknown> }) {
  return (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <TableHeaderCell key={header.id} header={header} />
      ))}
    </TableRow>
  );
}
