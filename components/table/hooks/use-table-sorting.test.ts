import { renderHook, act } from '@testing-library/react';
import { useTableSorting } from './use-table-sorting';
import type { SortingState } from '@tanstack/react-table';

describe('useTableSorting', () => {
  it('should initialize with empty sorting state by default', () => {
    const { result } = renderHook(() => useTableSorting());
    expect(result.current.sorting).toEqual([]);
  });

  it('should initialize with provided initial sorting state', () => {
    const initial: SortingState = [{ id: 'name', desc: false }];
    const { result } = renderHook(() => useTableSorting(initial));
    expect(result.current.sorting).toEqual(initial);
  });

  it('should update sorting state with setSorting', () => {
    const { result } = renderHook(() => useTableSorting());
    act(() => {
      result.current.setSorting([{ id: 'age', desc: true }]);
    });
    expect(result.current.sorting).toEqual([{ id: 'age', desc: true }]);
  });
});
