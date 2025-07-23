import React from 'react';

export function TableCellViewer({ item }: { item: Record<string, unknown> }) {
  // Example rendering for dynamic data (can be improved as needed)
  return (
    <div className="p-2">
      {Object.entries(item).map(([key, value]) => (
        <div key={key} className="flex gap-2">
          <span className="font-semibold">{key}:</span>
          <span>{String(value ?? '')}</span>
        </div>
      ))}
    </div>
  );
}
