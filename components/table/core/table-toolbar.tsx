import React from 'react';
import { FiltersUI } from '@/components/table/ui/filters-ui';
import { ExportUI } from '@/components/table/ui/export-ui';
import { ColumnVisibilityMenu } from '@/components/table/ui/column-visibility-menu';
import type { FilterDraft, FilterOperator } from '@/components/table/ui/filters-ui.types';
import { Button } from '@/components/ui/button';

interface TableToolbarProps {
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  filterMenuOpen: boolean;
  setFilterMenuOpen: (open: boolean) => void;
  draftFilters: FilterDraft[];
  setDraftFilters: (filters: FilterDraft[]) => void;
  newFilter: Omit<FilterDraft, 'id'>;
  setNewFilter: (filter: Omit<FilterDraft, 'id'>) => void;
  logicType: 'AND' | 'OR';
  setLogicType: (type: 'AND' | 'OR') => void;
  dataKeys: string[];
  FILTER_OPERATORS: FilterOperator[];
  handleAddFilter: () => void;
  handleRemoveFilter: (id: string) => void;
  handleClearFilters: () => void;
  handleApplyFilters: () => void;
  onCopy: (format: string) => void;
  onSave: (format: string) => void;
  columns: Array<{
    id: string;
    label: string;
    canHide: boolean;
    isVisible: boolean;
    toggle: () => void;
  }>;
  onClear?: () => void;
}

export function TableToolbar({
  globalSearch,
  onGlobalSearchChange,
  filterMenuOpen,
  setFilterMenuOpen,
  draftFilters,
  setDraftFilters,
  newFilter,
  setNewFilter,
  logicType,
  setLogicType,
  dataKeys,
  FILTER_OPERATORS,
  handleAddFilter,
  handleRemoveFilter,
  handleClearFilters,
  handleApplyFilters,
  onCopy,
  onSave,
  columns,
  onClear,
}: TableToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-4 lg:px-6 mb-4">
      {/* Global text search and Filters button side by side */}
      <div className="flex items-center gap-2 flex-1">
        <input
          type="text"
          value={globalSearch}
          onChange={(e) => onGlobalSearchChange(e.target.value)}
          placeholder="Search..."
          className="max-w-xs rounded-md border border-border bg-background text-foreground px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          data-testid="data-table-global-search"
        />
        <FiltersUI
          filterMenuOpen={filterMenuOpen}
          setFilterMenuOpen={setFilterMenuOpen}
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          newFilter={newFilter}
          setNewFilter={setNewFilter}
          logicType={logicType}
          setLogicType={setLogicType}
          dataKeys={dataKeys}
          FILTER_OPERATORS={FILTER_OPERATORS}
          handleAddFilter={handleAddFilter}
          handleRemoveFilter={handleRemoveFilter}
          handleClearFilters={handleClearFilters}
          handleApplyFilters={handleApplyFilters}
        />
      </div>
      {/* Menubar on the right */}
      <ExportUI onCopy={onCopy} onSave={onSave} />
      <ColumnVisibilityMenu columns={columns} />
      {onClear && (
        <Button
          type="button"
          variant="destructive"
          size="default"
          className="ml-2 text-[color:var(--destructive-foreground)]"
          onClick={onClear}
        >
          Clear Table
        </Button>
      )}
    </div>
  );
}
