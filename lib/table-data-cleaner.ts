// Utility functions for cleaning table data (array of objects)

export type TableRow = Record<string, unknown>;

/** Remove duplicate rows (deep equality) */
export function removeDuplicateRows(rows: TableRow[]): TableRow[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    const key = JSON.stringify(row);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Remove rows where all values are empty (null, undefined, or empty string) */
export function removeEmptyRows(rows: TableRow[]): TableRow[] {
  return rows.filter((row) =>
    Object.values(row).some((v) => v !== null && v !== undefined && String(v).trim() !== ''),
  );
}

/** Remove columns that are empty in all rows */
export function removeEmptyColumns(rows: TableRow[]): TableRow[] {
  if (rows.length === 0) return rows;
  const columns = Object.keys(rows[0]);
  const nonEmptyColumns = columns.filter((col) =>
    rows.some(
      (row) => row[col] !== null && row[col] !== undefined && String(row[col]).trim() !== '',
    ),
  );
  return rows.map((row) => {
    const newRow: TableRow = {};
    for (const col of nonEmptyColumns) {
      newRow[col] = row[col];
    }
    return newRow;
  });
}

/** Builder pattern for chaining table cleaning operations */
export class TableDataCleanerBuilder {
  private rows: TableRow[];

  constructor(rows: TableRow[]) {
    this.rows = rows;
  }

  removeDuplicateRows() {
    this.rows = removeDuplicateRows(this.rows);
    return this;
  }

  removeEmptyRows() {
    this.rows = removeEmptyRows(this.rows);
    return this;
  }

  removeEmptyColumns() {
    this.rows = removeEmptyColumns(this.rows);
    return this;
  }

  getResult() {
    return this.rows;
  }
}

/** Run all cleaning steps in a standard order */
export function cleanTableData(rows: TableRow[]): TableRow[] {
  return new TableDataCleanerBuilder(rows)
    .removeDuplicateRows()
    .removeEmptyRows()
    .removeEmptyColumns()
    .getResult();
}
