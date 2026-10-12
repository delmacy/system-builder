# Construction D — Industrial compounds (materialization)

Date: 2026-10-12
WP: STATION-WP-UI-FOUNDATION-01
Branch: sprint/STATION-WP-UI-FOUNDATION-01-CONSTRUCTION-D
Base: main after qualified C merge PR #1141 (1530207bccb72083640f4e8e42e766f3fccf45e0).
Status: MATERIALIZED, product implementation not yet qualified.

## Baseline and authority
Planning contract 021 and the 11-sprint P/A/B/C/D/E/F/G/T/I/Z roadmap remain authoritative. PRs #1137/#1138/#1140/#1141 integrated, with the latter seven exact-head workflows PASS. WP-ICON-01 corpus PR #1139 integrated: use existing semantic icons, do not fork its registry. Preserve editor registry/codec, NEXT_WORK, Catalog and Studio transport ownership. No component is editor-ready before F save/reopen proof.

## Construction D delivery slices
D1 — Accessible source-owned Toolbar, ToolbarGroup, ToolbarButton and ToolbarSeparator with real command boundaries, icon-or-visible-label names, disabled semantics, pressed state only for toggle actions, and compact/comfortable theme inheritance.
D2 — ToggleGroup, SplitButton, SearchField/SelectField and context command affordances. Separate menu providers from toolbar semantics and avoid bespoke focus navigation without tests.
D3 — PropertyField/PropertySection, PaneHeader, StatusBar and TabStrip for workstation layout, preserving current inspectors, fields and tab APIs; do not create a second editor or registry.
D4 — Lab demos, verified semantic icon rendering (token resolution via ICON API, no parallel SVG maps), browser keyboard focus/roving/escape/disabled/overflow, accessibility SSR and screenshot proof. Run exact-head CI and merge only after all applicable checks PASS.

## Risks, gates and accounting
R1 toolbar looked like buttons without accessible interaction: keyboard/pointer/disabled proof required.
R2 registry/icon drift: consume WP-ICON-01 API, no hardcoded duplicate role map.
R3 broad scope: isolate bounded work per task/commit, avoid source-only components being called editor-ready.
R4 concurrent workers: branch-scoped unique paths; before each product edit re-check main, open PRs, changed paths and file SHA.
No D claims until checks pass. Source-only D components become editor-insertable only in F.

## Acceptance
Concrete typed public exports, CSS tokens/data-slot, no forked registry; Lab mounted within Station; automated SSR/unit and real Playwright journeys; Windows and Ubuntu/Next; all applicable exact-head CI. Record evidence/limitations and upgrade from MATERIALIZED to IMPLEMENTED/QUALIFIED/MERGED only when observed.
