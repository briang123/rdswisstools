import { renderHook, act } from '@testing-library/react';
import { useTablePagination } from './use-table-pagination';

describe('useTablePagination', () => {
  it('should initialize with default page size 10 and pageIndex 0', () => {
    const { result } = renderHook(() => useTablePagination());
    expect(result.current.pagination).toEqual({ pageIndex: 0, pageSize: 10 });
  });

  it('should initialize with a custom page size', () => {
    const { result } = renderHook(() => useTablePagination(25));
    expect(result.current.pagination).toEqual({ pageIndex: 0, pageSize: 25 });
  });

  it('should update pageIndex and pageSize', () => {
    const { result } = renderHook(() => useTablePagination());
    act(() => {
      result.current.setPagination({ pageIndex: 2, pageSize: 20 });
    });
    expect(result.current.pagination).toEqual({ pageIndex: 2, pageSize: 20 });
  });

  it('should handle edge cases for negative pageIndex and pageSize', () => {
    const { result } = renderHook(() => useTablePagination());
    act(() => {
      result.current.setPagination({ pageIndex: -1, pageSize: -5 });
    });
    expect(result.current.pagination).toEqual({ pageIndex: -1, pageSize: -5 });
  });
});
