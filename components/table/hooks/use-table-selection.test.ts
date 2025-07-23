import { renderHook, act } from '@testing-library/react';
import { useTableSelection } from './use-table-selection';
import type { RowSelectionState } from '@tanstack/react-table';

describe('useTableSelection', () => {
  it('should initialize with the given initial value', () => {
    const initial: RowSelectionState = { 1: true, 2: false };
    const { result } = renderHook(() => useTableSelection(initial));
    expect(result.current.rowSelection).toEqual(initial);
  });

  it('should default to an empty object if no initial value is provided', () => {
    const { result } = renderHook(() => useTableSelection());
    expect(result.current.rowSelection).toEqual({});
  });

  it('should update rowSelection when setRowSelection is called', () => {
    const { result } = renderHook(() => useTableSelection());
    act(() => {
      result.current.setRowSelection({ 3: true });
    });
    expect(result.current.rowSelection).toEqual({ 3: true });
  });
});
