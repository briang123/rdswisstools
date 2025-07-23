export type FilterDraft = {
  id: string;
  column: string;
  operator: string;
  value: string;
};

export type FilterOperator = {
  value: string;
  label: string;
};

export const FILTER_OPERATORS = [
  { value: 'equals', label: 'equals' },
  { value: 'notEquals', label: 'does not equal' },
  { value: 'contains', label: 'contains' },
  { value: 'notContains', label: 'does not contain' },
  { value: 'startsWith', label: 'starts with' },
  { value: 'endsWith', label: 'ends with' },
];

export interface FiltersUIProps {
  filterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
  draftFilters: FilterDraft[];
  setDraftFilters: (filters: FilterDraft[]) => void;
  newFilter: Omit<FilterDraft, 'id'>;
  setNewFilter: (filter: Omit<FilterDraft, 'id'>) => void;
  logicType: 'AND' | 'OR';
  setLogicType: (logic: 'AND' | 'OR') => void;
  dataKeys: string[];
  FILTER_OPERATORS: FilterOperator[];
  handleAddFilter: () => void;
  handleRemoveFilter: (id: string) => void;
  handleClearFilters: () => void;
  handleApplyFilters: () => void;
}
