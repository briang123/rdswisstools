import { Checkbox } from '../../ui/checkbox';
import React from 'react';

interface TableHeaderCheckboxProps {
  table: any;
}

export const TableHeaderCheckbox: React.FC<TableHeaderCheckboxProps> = ({ table }) => (
  <div className="flex items-center justify-center">
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  </div>
);
