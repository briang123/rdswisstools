import { useState, useCallback } from 'react';

export function useGlobalSearch(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const onChange = useCallback((newValue: string) => setValue(newValue), []);
  return { value, onChange, setValue };
}

// Fix for TypeScript module resolution
export {};
