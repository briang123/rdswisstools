import { useState } from 'react';
import type { FilterDraft } from '../ui/filters-ui.types';
import type { ColumnFiltersState } from '@tanstack/react-table';

export function useTableFilters(
  dataKeys: string[],
  setColumnFilters: (filters: ColumnFiltersState) => void,
) {
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [logicType, setLogicType] = useState<'AND' | 'OR'>('AND');
  const [draftFilters, setDraftFilters] = useState<FilterDraft[]>([]);
  const [newFilter, setNewFilter] = useState<Omit<FilterDraft, 'id'>>({
    column: dataKeys[0] || '',
    operator: 'equals',
    value: '',
  });

  function handleAddFilter() {
    if (newFilter.column && newFilter.value) {
      setDraftFilters((prev) => [
        ...prev,
        { ...newFilter, id: `filter-${Math.random().toString(36).slice(2, 10)}` },
      ]);
      setNewFilter((prev) => ({ ...prev, value: '' }));
    }
  }

  function handleRemoveFilter(id: string) {
    setDraftFilters((prev) => prev.filter((f) => f.id !== id));
  }

  function handleClearFilters() {
    setDraftFilters([]);
    setColumnFilters([]);
  }

  function handleApplyFilters() {
    // If newFilter is valid and not already in draftFilters, add it
    if (newFilter.column && newFilter.value) {
      setDraftFilters((prev) => [
        ...prev,
        { ...newFilter, id: `filter-${Math.random().toString(36).slice(2, 10)}` },
      ]);
      setNewFilter({ ...newFilter, value: '' });
      // Wait for state update before applying filters
      setTimeout(() => {
        setColumnFilters([
          ...draftFilters.map((f) => ({ id: f.column, value: { op: f.operator, val: f.value } })),
          { id: newFilter.column, value: { op: newFilter.operator, val: newFilter.value } },
        ]);
        setFilterMenuOpen(false);
      }, 0);
      return;
    }
    setColumnFilters(
      draftFilters.map((f) => ({ id: f.column, value: { op: f.operator, val: f.value } })),
    );
    setFilterMenuOpen(false);
  }

  return {
    filterMenuOpen,
    setFilterMenuOpen,
    logicType,
    setLogicType,
    draftFilters,
    setDraftFilters,
    newFilter,
    setNewFilter,
    handleAddFilter,
    handleRemoveFilter,
    handleClearFilters,
    handleApplyFilters,
  };
}
