import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';

export default function TableEmptyState({ message }: { message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={1000} className="h-[240px] text-center align-middle">
        <div className="flex flex-col items-center justify-center h-full w-full gap-2">
          <span className="text-muted-foreground text-base">{message}</span>
        </div>
      </TableCell>
    </TableRow>
  );
}
