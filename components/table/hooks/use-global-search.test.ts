import { renderHook, act } from '@testing-library/react';
import { useGlobalSearch } from './use-global-search';

describe('useGlobalSearch', () => {
  it('should initialize with the given initial value', () => {
    const { result } = renderHook(() => useGlobalSearch('init'));
    expect(result.current.value).toBe('init');
  });

  it('should update value when onChange is called', () => {
    const { result } = renderHook(() => useGlobalSearch(''));
    act(() => {
      result.current.onChange('new value');
    });
    expect(result.current.value).toBe('new value');
  });

  it('should update value when setValue is called', () => {
    const { result } = renderHook(() => useGlobalSearch('start'));
    act(() => {
      result.current.setValue('changed');
    });
    expect(result.current.value).toBe('changed');
  });
});
