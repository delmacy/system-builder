# WP-COMPONENT-CATALOG-COMPLETENESS — Versioned source and qualification inventory

Date: 2026-10-13
Baseline: `main@0a3556bd` after PRs #1196–#1198
Status: DOCUMENTATION & ENCLOSURE CANDIDATE — residual limitations retained

## Qualification definitions

- `SOURCE_ONLY`: published source/export, with no implied browser or Editor journey.
- `LAB_PROVEN`: source plus scoped interactive Lab/browser evidence. Does not mean general accessibility certification.
- `EDITOR_READY`: canonical descriptor, valid insertion, Inspector edit and actual artifact save/reopen demonstrated for that component's specific supported property workflow.
- `DEFERRED`: intentionally outside this WP's tested implementation.
- `UNPROVEN`: requirement identified but evidence absent/insufficient; never equate with completed.

## Current source-backed inventory

| Family | Source files | Tested coverage / provenance | Qualification |
| --- | --- | --- | --- |
| EmptyState, Pagination | `ui-core/catalog-capabilities.tsx` | Construction A, Collections Lab, `station-ui-collections.spec.ts` | LAB_PROVEN for bounded paging/empty |
| DateTimeField, FileField | `ui-core/input-extensions.tsx` | PR #1151, Primitives Lab; native fields and selection-only file semantics | LAB_PROVEN bounded; browser/locale/upload integration beyond source contract UNPROVEN |
| Combobox | `ui-core/combobox.tsx` | PR #1152, bounded local selection/filter | LAB_PROVEN scoped; full ARIA/provider parity UNPROVEN |
| InputGroup | `ui-core/input-group.tsx` | PR #1154, slot composition | LAB_PROVEN scoped; broad input assistive-technology behavior UNPROVEN |
| PasswordField, Avatar | `ui-core/password-field.tsx`, `ui-core/avatar.tsx` | PR #1159 merge `b5de689d`; PR #1158 merge `b59b377c` | SOURCE_ONLY minimum, Lab evidence to be assessed per behavior; no general Editor approval |
| Stepper, NavigationTree, CommandPalette | `ui-core/stepper.tsx`, `navigation-tree.tsx`, `command-palette.tsx` | C review, PRs #1174/#1176; `station-ui-overlays.spec.ts` | LAB_PROVEN bounded, Studio navigation consumer; residual ARIA/tooltips/shortcut scope |
| SplitPane, DockGroup, FilterBar | `ui-core/workstation.tsx` | Construction D report, PR #1179; `station-ui-industrial.spec.ts` | LAB_PROVEN bounded; not persistent shell docking |
| CollectionView and DataTable | `ui-core/collection-view.tsx`, `ui-core/data-table.tsx` | Collection Lab and `station-ui-collections.spec.ts` including 390px sorted/paged selection, loading/error/empty | LAB_PROVEN bounded; no server mutations/virtualization |
| ColorField, PropertyPicker | `ui-core/editor-fields.tsx` | Construction F PR #1185; Construction G PRs #1190–#1196; Editor Inspector, preview, save/reopen | EDITOR_READY for validated inert source property workflow only |
| DocumentTextField | `ui-core/document-text-field.tsx` | Present on main; Construction G PR #1196, actual controlled document field Editor journey | EDITOR_READY for bounded plain text, not rich text or canonical documents |
| Other source primitives, industrial controls, overlays | `ui-core/primitives.tsx`, `industrial.ts`, `overlays.tsx` | Source exports and segmented Lab/browser tests; not all individual controls have insertion proof | SOURCE_ONLY or LAB_PROVEN per tested member; do not bulk promote |

All modules above are exported through `packages/ui-core/index.ts`. Source location and a Lab demo alone cannot authorize generic ComponentRegistry insertion. The three G components only are Editor-qualified for the narrow scenarios demonstrated.

## Evidence and migration integrity

- Construction G final PR #1196: exact head `34b23344`, seven passing workflows, merged `646bd3a7`.
- A–G Test Review PR #1197: five passing workflows, merged `a9fe3fbb`.
- B/E/F historical reconciliation PR #1198: five passing workflows, merged `0a3556bd`.
- `docs/architecture/STATION_CONSTRUCTION_G_ENCLOSURE.md` records G scope and tests.
- Preserve legacy composition payload versions and local save/reopen semantics, no alternate Editor or Core authority.

## Explicit residual backlog (does not invalidate bounded qualification)

1. NavigationTree: complete nested `treegroup`/parent relationships, keyboard-visible tooltip, global shortcut arbitration and File Manager adoption — `DEFERRED` / `UNPROVEN`.
2. Combobox/provider parity, browser-native date localization, FileField server upload, sensitive field assistive-technology detail — `UNPROVEN` beyond bounded source behavior.
3. CollectionView: infinite scrolling, server fetching/mutations and virtualization for large lists — `DEFERRED`.
4. Workstation: persisted docking layout, freely draggable/floating windows and command authorization — `DEFERRED`.
5. Rich HTML/markdown document editing, chart/graph provider contracts, remote media ingestion — `DEFERRED`.
6. Generalized insertion/Inspector/codec qualification for all other primitives — `UNPROVEN` until individually exercised.

## Closure decision

This document is the Documentation & Enclosure evidence inventory. It does not, by itself, claim all optional/deferred features or arbitrary upstream shadcn parity. Once its exact-head CI passes and the PR is merged, the **bounded component catalog WP** may be considered enclosed with explicit retained backlog; individual EDITOR_READY claims remain limited to the three Construction G fields.
