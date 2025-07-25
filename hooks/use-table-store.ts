import { create } from 'zustand';

// File import and table data state for a table
export interface TableFileImportState {
  file: File | null;
  setFile: (file: File | null) => void;
  resetFile: () => void;
  tableData: Record<string, unknown>[];
  setTableData: (data: Record<string, unknown>[]) => void;
}

// Store registry to support dynamic table names
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableStores: Record<string, any> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTableStoreFactory(tableKey: string): any {
  if (!tableStores[tableKey]) {
    tableStores[tableKey] = create<TableFileImportState>((set) => ({
      file: null,
      setFile: (file) => set({ file }),
      resetFile: () => set({ file: null }),
      tableData: [],
      setTableData: (data) => set({ tableData: data }),
    }));
  }
  return tableStores[tableKey];
}
