import { create, StoreApi } from 'zustand';

// File import and table data state for a table
export interface TableFileImportState {
  file: File | null;
  setFile: (file: File | null) => void;
  resetFile: () => void;
  tableData: Record<string, unknown>[];
  setTableData: (data: Record<string, unknown>[]) => void;
  globalSearch: string;
  setGlobalSearch: (value: string) => void;
  debouncedGlobalSearch: string;
  setDebouncedGlobalSearch: (value: string) => void;
}

// Store registry to support dynamic table names

const tableStores: Record<string, StoreApi<TableFileImportState>> = {};

export function useTableStoreFactory(tableKey: string): StoreApi<TableFileImportState> {
  if (!tableStores[tableKey]) {
    tableStores[tableKey] = create<TableFileImportState>((set) => ({
      file: null,
      setFile: (file) => set({ file }),
      resetFile: () => set({ file: null }),
      tableData: [],
      setTableData: (data) => set({ tableData: data }),
      globalSearch: '',
      setGlobalSearch: (value) => {
        set({ globalSearch: value });
        // Debounce logic will be handled in a custom hook or effect in the component
      },
      debouncedGlobalSearch: '',
      setDebouncedGlobalSearch: (value) => set({ debouncedGlobalSearch: value }),
    }));
  }
  return tableStores[tableKey];
}
