import { useState } from 'react';
import type { RowSelectionState } from '@tanstack/react-table';

/**
 * Custom hook to manage row selection state for TanStack Table.
 * @param initialSelection Optional initial selection state.
 */
export function useTableSelection(initialSelection: RowSelectionState = {}) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialSelection);
  return { rowSelection, setRowSelection };
}
