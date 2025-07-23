import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

import type { FiltersUIProps, FilterDraft, FilterOperator } from '../ui/filters-ui.types';

export function FiltersUI({
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
}: FiltersUIProps) {
  return (
    <DropdownMenu open={filterMenuOpen} onOpenChange={setFilterMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="inline-flex items-center text-xs h-8 px-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1 text-popover-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {draftFilters.length > 0 && (
            <span className="ml-1 bg-primary text-white text-xs px-1.5 rounded-full">
              {draftFilters.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" sideOffset={5}>
        <div className="p-3 bg-popover text-popover-foreground">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium text-popover-foreground">Filters</span>
            <Button
              variant="link"
              className="text-xs text-primary p-0 h-auto"
              onClick={handleAddFilter}
              disabled={!newFilter.column || !newFilter.value}
            >
              + Add filter
            </Button>
          </div>
          {/* New filter form */}
          <div className="p-2 rounded mb-2 border bg-muted dark:bg-muted border-border dark:border-border">
            <div className="flex items-center space-x-2 w-full mb-2">
              <Select
                value={newFilter.column}
                onValueChange={(value) => setNewFilter({ ...newFilter, column: value })}
              >
                <SelectTrigger className="text-xs h-8 w-full bg-background text-foreground border border-border rounded">
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground border border-border">
                  {dataKeys.map((col: string) => (
                    <SelectItem
                      key={col}
                      value={col}
                      className="text-xs bg-background text-foreground"
                    >
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={newFilter.operator}
                onValueChange={(value) => setNewFilter({ ...newFilter, operator: value })}
              >
                <SelectTrigger className="text-xs h-8 w-full bg-background text-foreground border border-border rounded">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent className="bg-background text-foreground border border-border">
                  {FILTER_OPERATORS.map((op: FilterOperator) => (
                    <SelectItem
                      key={op.value}
                      value={op.value}
                      className="text-xs bg-background text-foreground"
                    >
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="text"
              className="w-full text-xs h-8 bg-background text-foreground border border-border rounded"
              placeholder="Filter value"
              value={newFilter.value}
              onChange={(e) => setNewFilter({ ...newFilter, value: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddFilter();
              }}
            />
          </div>
          {/* Filter Logic Type Selector (Button Group) */}
          {draftFilters.length > 1 && (
            <div className="mb-3 p-2 rounded border bg-muted dark:bg-muted border-border dark:border-border">
              <div className="text-xs font-medium mb-2">Filter Condition Logic:</div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={logicType === 'AND' ? 'default' : 'outline'}
                  className={`text-xs px-2 py-1 border border-border rounded ${logicType === 'AND' ? '' : 'bg-background text-foreground'}`}
                  onClick={() => setLogicType('AND')}
                >
                  Match ALL filters (AND)
                </Button>
                <Button
                  size="sm"
                  variant={logicType === 'OR' ? 'default' : 'outline'}
                  className={`text-xs px-2 py-1 border border-border rounded ${logicType === 'OR' ? '' : 'bg-background text-foreground'}`}
                  onClick={() => setLogicType('OR')}
                >
                  Match ANY filter (OR)
                </Button>
              </div>
            </div>
          )}
          {/* Active filters */}
          {draftFilters.map((filter: FilterDraft) => (
            <div
              key={filter.id}
              className="p-2 rounded mb-2 border bg-muted dark:bg-muted border-border dark:border-border"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs">
                  <span className="font-medium">{filter.column}</span>{' '}
                  <span className="text-gray-500">
                    {FILTER_OPERATORS.find((op: FilterOperator) => op.value === filter.operator)
                      ?.label || filter.operator}
                  </span>{' '}
                  <span>&quot;{filter.value}&quot;</span>
                </div>
                <button
                  className="text-gray-400 hover:text-red-600"
                  onClick={() => handleRemoveFilter(filter.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {/* Filter actions */}
          <div className="mt-3 flex justify-between">
            <Button
              variant="ghost"
              className="text-xs h-8"
              onClick={handleClearFilters}
              disabled={draftFilters.length === 0}
            >
              Clear all
            </Button>
            <Button variant="default" className="text-xs h-8" onClick={handleApplyFilters}>
              Apply filters
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
