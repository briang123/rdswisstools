import { renderHook, act } from '@testing-library/react';
import { useTableFilters } from '../hooks/use-table-filters';
import type { ColumnFiltersState } from '@tanstack/react-table';

describe('useTableFilters', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('auto-adds newFilter and applies it if handleApplyFilters is called with a valid newFilter', () => {
    const dataKeys = ['name', 'age'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));

    // Set a valid newFilter
    act(() => {
      result.current.setNewFilter({ column: 'name', operator: 'equals', value: 'Alice' });
    });

    // Call handleApplyFilters
    act(() => {
      result.current.handleApplyFilters();
    });

    // Wait for setTimeout in handleApplyFilters
    act(() => {
      jest.runAllTimers();
    });

    // The setColumnFilters should be called with the new filter
    expect(setColumnFilters).toHaveBeenCalledWith([
      { id: 'name', value: { op: 'equals', val: 'Alice' } },
    ]);
  });

  it('applies only draftFilters if newFilter is empty', () => {
    const dataKeys = ['name', 'age'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));

    // Add a draft filter
    act(() => {
      result.current.setDraftFilters([
        { id: 'filter-1', column: 'age', operator: 'equals', value: '30' },
      ]);
    });

    // Call handleApplyFilters
    act(() => {
      result.current.handleApplyFilters();
    });

    expect(setColumnFilters).toHaveBeenCalledWith([
      { id: 'age', value: { op: 'equals', val: '30' } },
    ]);
  });

  it('handleAddFilter adds a filter to draftFilters and resets newFilter.value', () => {
    const dataKeys = ['name'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));
    act(() => {
      result.current.setNewFilter({ column: 'name', operator: 'equals', value: 'Bob' });
    });
    act(() => {
      result.current.handleAddFilter();
    });
    expect(result.current.draftFilters.length).toBe(1);
    expect(result.current.draftFilters[0]).toMatchObject({
      column: 'name',
      operator: 'equals',
      value: 'Bob',
    });
    expect(result.current.newFilter.value).toBe('');
  });

  it('handleRemoveFilter removes a filter by id', () => {
    const dataKeys = ['name'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));
    act(() => {
      result.current.setDraftFilters([
        { id: 'filter-1', column: 'name', operator: 'equals', value: 'Bob' },
        { id: 'filter-2', column: 'name', operator: 'equals', value: 'Alice' },
      ]);
      result.current.handleRemoveFilter('filter-1');
    });
    expect(result.current.draftFilters.length).toBe(1);
    expect(result.current.draftFilters[0].id).toBe('filter-2');
  });

  it('handleClearFilters clears draftFilters and calls setColumnFilters([])', () => {
    const dataKeys = ['name'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));
    act(() => {
      result.current.setDraftFilters([
        { id: 'filter-1', column: 'name', operator: 'equals', value: 'Bob' },
      ]);
      result.current.handleClearFilters();
    });
    expect(result.current.draftFilters.length).toBe(0);
    expect(setColumnFilters).toHaveBeenCalledWith([]);
  });

  it('setLogicType updates logicType', () => {
    const dataKeys = ['name'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));
    act(() => {
      result.current.setLogicType('OR');
    });
    expect(result.current.logicType).toBe('OR');
  });

  it('setFilterMenuOpen updates filterMenuOpen', () => {
    const dataKeys = ['name'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));
    act(() => {
      result.current.setFilterMenuOpen(true);
    });
    expect(result.current.filterMenuOpen).toBe(true);
  });

  it('setDraftFilters updates draftFilters', () => {
    const dataKeys = ['name'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));
    act(() => {
      result.current.setDraftFilters([
        { id: 'filter-1', column: 'name', operator: 'equals', value: 'Bob' },
      ]);
    });
    expect(result.current.draftFilters.length).toBe(1);
    expect(result.current.draftFilters[0].value).toBe('Bob');
  });

  it('setNewFilter updates newFilter', () => {
    const dataKeys = ['name'];
    const setColumnFilters = jest.fn();
    const { result } = renderHook(() => useTableFilters(dataKeys, setColumnFilters));
    act(() => {
      result.current.setNewFilter({ column: 'name', operator: 'equals', value: 'Charlie' });
    });
    expect(result.current.newFilter.value).toBe('Charlie');
  });
});
