# Construction E — Data & Presentation

Date: 2026-10-13
Status: ACTIVE / INTEGRATED PROOF PENDING

## Scope and baseline
- The existing source-owned `DataTable` already implements controlled sort, selected row, loading/error/empty notices, and horizontal scrolling.
- `Pagination`, `EmptyState`, `SearchField`, `SelectField`, and avatar all exist; do not copy their APIs.
- E adds `CollectionView`: typed responsive cards with caller-owned rows, selected key, item rendering and loading/error/empty states. It does not own fetching, canonical authority, mutations, or page data.
- Collection Lab allows users to switch table/cards and preview states, filtering and page navigation.
- Test evidence: `tests/browser/station-ui-collections.spec.ts` covers table filtering/sorting/keyboard/empty and the added card state and selection journey.

## Exit gates
- Architecture, TS, ESLint, production build, all browser tests, exact-head GitHub CI.
- Responsive 390px, selection after sort/filter/paging, table/card parity and bounded rendering proofs.
- Do not assert infinite scrolling or virtualization; very large datasets must remain paged by caller.
- Do not assert Editor-ready until Construction G's insertion, Inspector and save/reopen roundtrip.
