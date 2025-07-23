import React from 'react';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarCheckboxItem,
} from '@/components/ui/menubar';
import { IconLayoutColumns } from '@tabler/icons-react';

export interface ColumnVisibilityMenuProps {
  columns: {
    id: string;
    label: string;
    canHide: boolean;
    isVisible: boolean;
    toggle: () => void;
  }[];
}

export function ColumnVisibilityMenu({ columns }: ColumnVisibilityMenuProps) {
  return (
    <Menubar className="bg-muted border rounded-md shadow-sm" data-testid="data-table-menubar">
      <MenubarMenu>
        <MenubarTrigger>
          <IconLayoutColumns className="mr-2" />
          Columns
        </MenubarTrigger>
        <MenubarContent className="w-56">
          {columns
            .filter((col) => col.canHide)
            .map((col) => (
              <MenubarCheckboxItem
                key={col.id}
                className="capitalize"
                checked={col.isVisible}
                onCheckedChange={col.toggle}
              >
                {col.label}
              </MenubarCheckboxItem>
            ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
