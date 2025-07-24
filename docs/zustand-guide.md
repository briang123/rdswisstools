# Zustand Guide for Next.js

## 1. Installation

```bash
npm install zustand
# or
yarn add zustand
```

---

## 2. Creating a Store

Create a file for your store, e.g., `store/useRaceStore.ts`:

```ts
import { create } from 'zustand';

interface RaceState {
  races: string[];
  addRace: (race: string) => void;
}

export const useRaceStore = create<RaceState>((set) => ({
  races: [],
  addRace: (race) => set((state) => ({ races: [...state.races, race] })),
}));
```

---

## 3. Using the Store in a Component

```tsx
import { useRaceStore } from '../store/useRaceStore';

export default function RaceList() {
  const races = useRaceStore((state) => state.races);
  const addRace = useRaceStore((state) => state.addRace);

  return (
    <div>
      <h2>Races</h2>
      <ul>
        {races.map((race, idx) => (
          <li key={idx}>{race}</li>
        ))}
      </ul>
      <button onClick={() => addRace('New Race')}>Add Race</button>
    </div>
  );
}
```

---

## 4. Tips for Scaling

- **Slices:** Organize large stores into slices (separate logic for users, races, results, etc.).
- **Persist State:** Use `zustand/middleware` for localStorage/sessionStorage persistence.
- **Server State:** For server data, use Zustand for UI state and something like React Query for fetching.
- **TypeScript:** Zustand has great TypeScript support for type-safe stores.

---

## 5. Useful Links

- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Awesome Zustand Examples](https://github.com/pmndrs/zustand#examples)

---

**That’s it! Zustand is simple, fast, and grows with your app.**

---

## 6. Refactoring Existing State to Zustand

If your project already uses React hooks for state (like useState or custom hooks), you can migrate to Zustand for global, shareable state. Here’s how you might refactor a data table setup:

### Typical Custom Hooks (Before)

You might have hooks like:

- `useTableSelection` (row selection)
- `useTableSorting` (sorting)
- `useTablePagination` (pagination)
- `useTableFilters` (column filters, filter menu, logic)
- `useGlobalSearch` (search input)

Each manages its own local state with `useState`.

### Refactored: Centralized Zustand Store

Create a single store for all table state (e.g., `store/useTableStore.ts`):

```ts
import { create } from 'zustand';
import type { RowSelectionState, SortingState, ColumnFiltersState } from '@tanstack/react-table';
import type { FilterDraft } from '@/components/table/ui/filters-ui.types';

interface TableState {
  rowSelection: RowSelectionState;
  setRowSelection: (s: RowSelectionState) => void;
  sorting: SortingState;
  setSorting: (s: SortingState) => void;
  pagination: { pageIndex: number; pageSize: number };
  setPagination: (p: { pageIndex: number; pageSize: number }) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (f: ColumnFiltersState) => void;
  filterMenuOpen: boolean;
  setFilterMenuOpen: (b: boolean) => void;
  logicType: 'AND' | 'OR';
  setLogicType: (l: 'AND' | 'OR') => void;
  draftFilters: FilterDraft[];
  setDraftFilters: (f: FilterDraft[]) => void;
  newFilter: Omit<FilterDraft, 'id'>;
  setNewFilter: (f: Omit<FilterDraft, 'id'>) => void;
  globalSearch: string;
  setGlobalSearch: (v: string) => void;
}

export const useTableStore = create<TableState>((set) => ({
  rowSelection: {},
  setRowSelection: (rowSelection) => set({ rowSelection }),
  sorting: [],
  setSorting: (sorting) => set({ sorting }),
  pagination: { pageIndex: 0, pageSize: 10 },
  setPagination: (pagination) => set({ pagination }),
  columnFilters: [],
  setColumnFilters: (columnFilters) => set({ columnFilters }),
  filterMenuOpen: false,
  setFilterMenuOpen: (filterMenuOpen) => set({ filterMenuOpen }),
  logicType: 'AND',
  setLogicType: (logicType) => set({ logicType }),
  draftFilters: [],
  setDraftFilters: (draftFilters) => set({ draftFilters }),
  newFilter: { column: '', operator: 'equals', value: '' },
  setNewFilter: (newFilter) => set({ newFilter }),
  globalSearch: '',
  setGlobalSearch: (globalSearch) => set({ globalSearch }),
}));
```

### Updating Components

Instead of using custom hooks, import and use the store:

```tsx
import { useTableStore } from '../store/useTableStore';

const rowSelection = useTableStore((s) => s.rowSelection);
const setRowSelection = useTableStore((s) => s.setRowSelection);
// ...and so on for sorting, pagination, etc.
```

### Refactoring Tips

- **Remove local useState and custom hooks** for table state.
- **Replace** all state usages with Zustand selectors (as above).
- **For derived state** (like debounced search), you can use a separate hook or add logic to the store.
- **Persist state** if needed using Zustand middleware.
- **Test** thoroughly—Zustand state is global, so changes in one component affect all others using the same store.

### Example: DataTable Component (Before vs After)

**Before:**

```tsx
const { rowSelection, setRowSelection } = useTableSelection();
```

**After:**

```tsx
const rowSelection = useTableStore((s) => s.rowSelection);
const setRowSelection = useTableStore((s) => s.setRowSelection);
```

Repeat for sorting, pagination, filters, etc.

---

**Migrating to Zustand makes your table state global, easier to share, and ready for more advanced features!**

---

## 7. Case Study: Why Use Zustand for Shared State?

### Scenario: Race Management Dashboard

Suppose you’re building a race management platform with these features:

- A data table showing all races
- Filters and search for races
- A sidebar showing selected races
- Export and batch actions for selected races

#### Initial Approach: Local State

- Each component (table, filters, sidebar) manages its own state with `useState` or custom hooks.
- To update the sidebar when a row is selected in the table, you pass callbacks and state through several layers (prop drilling).
- Filters and search state are duplicated or synced manually between components.
- As the app grows, adding new features (e.g., batch actions, cross-page selection) becomes complex and error-prone.

#### Problems

- **Prop Drilling:** Passing state and callbacks through many layers clutters your code.
- **Duplication:** Multiple sources of truth for the same data (e.g., selected races in both table and sidebar).
- **Tight Coupling:** Components become tightly coupled, making refactoring and testing harder.
- **Scalability Issues:** Adding new features or pages that need the same state requires more plumbing.

#### Refactored with Zustand

- All shared state (selected races, filters, search, etc.) is moved to a Zustand store.
- Any component can read or update the state directly, without prop drilling.
- State is always in sync—no duplication or manual syncing needed.
- Adding new features (e.g., a batch export button, a summary widget) is easy: just use the store.
- State can be persisted (e.g., to localStorage) with a middleware for a better user experience.

#### Benefits

- **Simplicity:** No more prop drilling or duplicate state.
- **Scalability:** Easily add new features or pages that use the same state.
- **Maintainability:** Components are decoupled and easier to test.
- **Performance:** Zustand is fast and only re-renders components that use the changed state.
- **Persistence:** Easily persist state for a seamless user experience.

---

**In summary:**

> Zustand solves the pain points of prop drilling, state duplication, and scaling shared state in React apps. For a growing platform, it keeps your codebase clean, maintainable, and ready for new features.

---

## Product Requirements Document (PRD): Data Table Module (Zustand-Related Tasks Only)

- [ ] Refactor all table state (selection, sorting, pagination, filters, global search) to use Zustand for global state management
- [ ] Remove prop drilling and replace with Zustand selectors where shared state is needed
- [ ] Use context or Zustand if prop drilling becomes excessive
- [ ] Persist table state (filters, selection, pagination) to localStorage/sessionStorage for better UX
- [ ] Document all public APIs and provide a migration guide for future Zustand refactors
