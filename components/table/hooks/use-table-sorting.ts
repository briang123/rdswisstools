import { useState } from 'react';
import type { SortingState } from '@tanstack/react-table';

/**
 * Custom hook to manage sorting state for TanStack Table.
 * @param initialSorting Optional initial sorting state.
 */
export function useTableSorting(initialSorting: SortingState = []) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  return { sorting, setSorting };
}
