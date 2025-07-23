import type { Row, FilterFn } from '@tanstack/react-table';

export function customFilterFn(
  row: Row<unknown>,
  columnId: string,
  filterValue: { op: string; val: string },
) {
  const cellValue = String(row.getValue(columnId) ?? '');
  const { op, val } = filterValue;
  switch (op) {
    case 'equals':
      return cellValue.toLowerCase() === val.toLowerCase();
    case 'notEquals':
      return cellValue.toLowerCase() !== val.toLowerCase();
    case 'contains':
      return cellValue.toLowerCase().includes(val.toLowerCase());
    case 'notContains':
      return !cellValue.toLowerCase().includes(val.toLowerCase());
    case 'startsWith':
      return cellValue.toLowerCase().startsWith(val.toLowerCase());
    case 'endsWith':
      return cellValue.toLowerCase().endsWith(val.toLowerCase());
    default:
      return true;
  }
}

export const globalFilterFn: FilterFn<unknown> = (row, _columnId, filterValue) => {
  if (!filterValue) return true;
  // Get all visible columns for this row, excluding utility columns
  const visibleColumnIds = row
    .getAllCells()
    .map((cell) => cell.column.id)
    .filter((colId) => !['drag', 'select', 'actions'].includes(colId));
  return visibleColumnIds.some((colId) => {
    const cellValue = String(row.getValue(colId) ?? '');
    return cellValue.toLowerCase().includes((filterValue as string).toLowerCase());
  });
};
