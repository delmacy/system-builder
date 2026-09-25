# STATION Composition Construction A — LEGO foundation

Sprint ID: `STATION-COMPOSITION-CONSTRUCTION-A-01`
Status: COMMITTED
Materialization base: `main@1804c2e5b5eacd677ed3a2c2808e383fb42e2144`
Execution branch: `sprint/STATION-COMPOSITION-CONSTRUCTION-A-01`
Predecessor: STATION-VISUAL-WP-01 / PR #911 integrated
Planning authority: `STATION-COMPONENT-COMPOSITION-PLAN-01.md`

## Goal
Establish the smallest executable composition substrate required by the future Component Editor and Window/View Editor, without building either editor yet.

The package proves the principle:

> standardized pieces + constrained joints + combinatorial freedom.

## Scope
- repository-backed component inventory/taxonomy;
- source-owned Component Registry;
- executable composition contracts: Component, Slot, Layout, ChildPolicy, Constraints;
- discrete grid/span primitives and nested-slot ownership;
- first local semantic composite: ButtonGroup;
- Component Lab proof showing valid/invalid composition and proportional sizing.

## TASK chain
`TASK-606 -> TASK-607 -> TASK-608 -> TASK-609 -> TASK-610`

## Product rules
- no arbitrary pixel geometry as canonical composition state;
- no XS/S/M/L sizing contract;
- one canonical typography/theme remains authoritative;
- collections are self-managed composites and do not require artificial group wrappers;
- ButtonGroup owns its internal ButtonSlots and appears as one meaningful outer block;
- editor/application-specific logic is deferred;
- Station remains presentation/composition only.

## Exit proof
Construction A exits only when:
1. components can be registered and queried deterministically;
2. composition contracts validate parent/slot/child compatibility;
3. grid/span constraints reject invalid spans;
4. ButtonGroup demonstrates nested slot composition;
5. Component Lab renders the proof using real source-owned components;
6. deterministic/product/architecture checks are green.

## Non-goals
No Component Editor UI, Window/View Editor UI, File Manager, Workflow Studio, arbitrary CSS editor, responsive designer, theme designer, semantic Artifact Repository or Core/business authority.

## Stop/escalation
Stop if implementation requires arbitrary per-screen styling, business/domain truth in Station, filesystem authority, or replacing existing Station window/app/interaction ownership.
