import { renderHook, act } from '@testing-library/react';
import { useDataTable } from './use-data-table';

jest.useFakeTimers();

describe('useDataTable (global search)', () => {
  it('should initialize globalSearch with empty string', () => {
    const { result } = renderHook(() => useDataTable([]));
    expect(result.current.globalSearch).toBe('');
  });

  it('should update globalSearch immediately', () => {
    const { result } = renderHook(() => useDataTable([]));
    act(() => {
      result.current.setGlobalSearch('changed');
    });
    expect(result.current.globalSearch).toBe('changed');
  });

  it('should update debouncedGlobalSearch after 300ms', () => {
    const { result } = renderHook(() => useDataTable([]));
    act(() => {
      result.current.setGlobalSearch('debounced');
    });
    // Should not update immediately
    expect(result.current.debouncedGlobalSearch).not.toBe('debounced');
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(result.current.debouncedGlobalSearch).toBe('debounced');
  });
});
