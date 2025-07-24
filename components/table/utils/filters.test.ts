import { customFilterFn, globalFilterFn } from './filters';
import type { Row } from '@tanstack/react-table';

describe('customFilterFn', () => {
  // Helper to mock a TanStack row
  const makeRow = (val: string): Row<unknown> =>
    ({
      getValue: (col: string) => (col === 'name' ? val : undefined),
    }) as Row<unknown>;

  it('equals is case-insensitive', () => {
    expect(customFilterFn(makeRow('Alice'), 'name', { op: 'equals', val: 'alice' })).toBe(true);
    expect(customFilterFn(makeRow('ALICE'), 'name', { op: 'equals', val: 'alice' })).toBe(true);
    expect(customFilterFn(makeRow('Alice'), 'name', { op: 'equals', val: 'Bob' })).toBe(false);
  });

  it('notEquals is case-insensitive', () => {
    expect(customFilterFn(makeRow('Alice'), 'name', { op: 'notEquals', val: 'bob' })).toBe(true);
    expect(customFilterFn(makeRow('ALICE'), 'name', { op: 'notEquals', val: 'alice' })).toBe(false);
  });

  it('contains is case-insensitive', () => {
    expect(
      customFilterFn(makeRow('Alice Wonderland'), 'name', { op: 'contains', val: 'wonder' }),
    ).toBe(true);
    expect(customFilterFn(makeRow('Alice'), 'name', { op: 'contains', val: 'bob' })).toBe(false);
  });

  it('notContains is case-insensitive', () => {
    expect(
      customFilterFn(makeRow('Alice Wonderland'), 'name', { op: 'notContains', val: 'bob' }),
    ).toBe(true);
    expect(
      customFilterFn(makeRow('Alice Wonderland'), 'name', { op: 'notContains', val: 'wonder' }),
    ).toBe(false);
  });

  it('startsWith is case-insensitive', () => {
    expect(
      customFilterFn(makeRow('Alice Wonderland'), 'name', { op: 'startsWith', val: 'ali' }),
    ).toBe(true);
    expect(
      customFilterFn(makeRow('Alice Wonderland'), 'name', { op: 'startsWith', val: 'bob' }),
    ).toBe(false);
  });

  it('endsWith is case-insensitive', () => {
    expect(
      customFilterFn(makeRow('Alice Wonderland'), 'name', { op: 'endsWith', val: 'land' }),
    ).toBe(true);
    expect(
      customFilterFn(makeRow('Alice Wonderland'), 'name', { op: 'endsWith', val: 'alice' }),
    ).toBe(false);
  });

  it('returns true for unknown op', () => {
    expect(customFilterFn(makeRow('Alice'), 'name', { op: 'unknown', val: 'alice' })).toBe(true);
  });

  it('handles null/undefined cell values', () => {
    const row = { getValue: () => undefined } as unknown as Row<unknown>;
    expect(customFilterFn(row, 'name', { op: 'equals', val: '' })).toBe(true);
  });
});

describe('globalFilterFn', () => {
  // Helper to mock a TanStack row with getAllCells and getValue
  const makeRow = (cells: Record<string, string | undefined>): Row<unknown> =>
    ({
      getAllCells: () => Object.keys(cells).map((id) => ({ column: { id } })),
      getValue: (col: string) => cells[col],
    }) as Row<unknown>;

  const noop = () => {};

  it('returns true if filterValue is falsy', () => {
    const row = makeRow({ name: 'Alice' });
    expect(globalFilterFn(row, 'name', '', noop)).toBe(true);
    expect(globalFilterFn(row, 'name', null, noop)).toBe(true);
    expect(globalFilterFn(row, 'name', undefined, noop)).toBe(true);
  });

  it('matches any visible column (case-insensitive)', () => {
    const row = makeRow({ name: 'Alice', city: 'Zurich' });
    expect(globalFilterFn(row, 'name', 'zur', noop)).toBe(true);
    expect(globalFilterFn(row, 'name', 'ali', noop)).toBe(true);
    expect(globalFilterFn(row, 'name', 'bob', noop)).toBe(false);
  });

  it('ignores utility columns (drag, select, actions)', () => {
    const row = makeRow({ drag: 'x', select: 'y', actions: 'z', name: 'Alice' });
    expect(globalFilterFn(row, 'name', 'alice', noop)).toBe(true);
    expect(globalFilterFn(row, 'name', 'x', noop)).toBe(false);
  });

  it('handles undefined cell values', () => {
    const row = makeRow({ name: undefined, city: 'Zurich' });
    expect(globalFilterFn(row, 'name', 'zur', noop)).toBe(true);
    expect(globalFilterFn(row, 'name', 'alice', noop)).toBe(false);
  });
});
