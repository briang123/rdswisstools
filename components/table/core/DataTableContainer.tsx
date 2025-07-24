import React from 'react';

export default function DataTableContainer({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full flex-col justify-start gap-6 ${className}`}
      data-testid="data-table-root"
    >
      {children}
    </div>
  );
}
