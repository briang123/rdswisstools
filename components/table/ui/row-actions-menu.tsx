import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { IconDotsVertical } from '@tabler/icons-react';

interface RowActionsMenuProps {
  rowId: string;
  onEdit: (rowId: string) => void;
  onCopy: (rowId: string) => void;
  onDelete: (rowId: string) => void;
}

export function RowActionsMenu({ rowId, onEdit, onCopy, onDelete }: RowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="data-[state=open]:bg-muted text-muted-foreground flex size-8 cursor-pointer rounded hover:bg-muted transition">
          <IconDotsVertical />
          <span className="sr-only">Open menu</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={() => onEdit(rowId)}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCopy(rowId)}>Make a copy</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDelete(rowId)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
