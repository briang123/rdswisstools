import { useState } from 'react';

export function useTablePagination(initialPageSize: number = 10) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: initialPageSize });
  return { pagination, setPagination };
}
