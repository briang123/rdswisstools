import { renderHook, act } from '@testing-library/react';
import { useGlobalSearch } from './use-global-search';

describe('useGlobalSearch', () => {
  it('should initialize with the given initial value', () => {
    const { result } = renderHook(() => useGlobalSearch('init'));
    expect(result.current.value).toBe('init');
  });

  it('should update value immediately when setValue is called', () => {
    const { result } = renderHook(() => useGlobalSearch('start'));
    act(() => {
      result.current.setValue('changed');
    });
    expect(result.current.value).toBe('changed');
  });
});
