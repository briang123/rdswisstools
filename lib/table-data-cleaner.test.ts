import {
  removeDuplicateRows,
  removeEmptyRows,
  removeEmptyColumns,
  TableDataCleanerBuilder,
  cleanTableData,
  TableRow,
} from './table-data-cleaner';

describe('Table Data Cleaner Utilities', () => {
  describe('removeDuplicateRows', () => {
    it('removes duplicate rows (deep equality)', () => {
      const rows: TableRow[] = [
        { a: 1, b: 2 },
        { a: 1, b: 2 },
        { a: 2, b: 3 },
      ];
      expect(removeDuplicateRows(rows)).toEqual([
        { a: 1, b: 2 },
        { a: 2, b: 3 },
      ]);
    });
  });

  describe('removeEmptyRows', () => {
    it('removes rows where all values are empty', () => {
      const rows: TableRow[] = [
        { a: '', b: '' },
        { a: null, b: undefined },
        { a: 'x', b: '' },
        { a: '', b: 'y' },
      ];
      expect(removeEmptyRows(rows)).toEqual([
        { a: 'x', b: '' },
        { a: '', b: 'y' },
      ]);
    });
  });

  describe('removeEmptyColumns', () => {
    it('removes columns that are empty in all rows', () => {
      const rows: TableRow[] = [
        { a: '', b: 'x', c: '' },
        { a: '', b: 'y', c: '' },
      ];
      expect(removeEmptyColumns(rows)).toEqual([{ b: 'x' }, { b: 'y' }]);
    });
    it('returns original if no columns are empty in all rows', () => {
      const rows: TableRow[] = [
        { a: '1', b: '2' },
        { a: '3', b: '4' },
      ];
      expect(removeEmptyColumns(rows)).toEqual(rows);
    });
  });

  describe('TableDataCleanerBuilder', () => {
    it('chains cleaning operations', () => {
      const rows: TableRow[] = [
        { a: '', b: 'x', c: '' },
        { a: '', b: 'y', c: '' },
        { a: '', b: '', c: '' },
        { a: '', b: 'x', c: '' },
      ];
      const cleaned = new TableDataCleanerBuilder(rows)
        .removeDuplicateRows()
        .removeEmptyRows()
        .removeEmptyColumns()
        .getResult();
      expect(cleaned).toEqual([{ b: 'x' }, { b: 'y' }]);
    });
  });

  describe('cleanTableData', () => {
    it('runs all cleaning steps in order', () => {
      const rows: TableRow[] = [
        { a: '', b: 'x', c: '' },
        { a: '', b: 'y', c: '' },
        { a: '', b: '', c: '' },
        { a: '', b: 'x', c: '' },
      ];
      expect(cleanTableData(rows)).toEqual([{ b: 'x' }, { b: 'y' }]);
    });
    it('handles empty input', () => {
      expect(cleanTableData([])).toEqual([]);
    });
  });
});
