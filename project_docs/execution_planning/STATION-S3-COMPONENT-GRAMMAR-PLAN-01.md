# Station S3 — Component Grammar & Catalog — Plan 01

Date: 2026-09-26
Status: PLANNING & MATERIALIZATION
Scope source: `docs/contracts/001-station-component-grammar/ADDENDUM.md`
Predecessor: Station M2 Component Composition/Editor — CLOSED

## Objective

Converge a bounded, testable component grammar and catalog for Station before specialized tools/studios proliferate. Research must produce implementation-ready contracts and a dependency-safe forecast; it must not mutate product merely to demonstrate an idea.

## Complexity ladder

C0 Token
C1 Primitive
C2 Compound
C3 Collection
C4 Capability
C5 Pane / Region
C6 Pattern
C7 Template / View
C8 Tool
C9 Application
C10 Studio

Each level must define ownership, allowed dependencies, composition rules, identity semantics, state/action semantics, test obligations and promotion criteria.

## Research sprints

### S3-R1 — Census & parity
Inventory existing Station/ui-core primitives and component contracts. Compare gaps/overlaps against representative ecosystems (Radix/Base/React Aria, shadcn, MUI, Fluent, Carbon, PatternFly, Chakra, Ant and relevant source-owned patterns). Classify adopt/adapt/own/defer; no provider lock-in.

### S3-R2 — Compounds & collections
Materialize rules for ButtonGroup/action groups, field/control assemblies, lists, menus, toolbars, tables/collections and related reusable compounds. Explicitly separate semantic intent from primitive visual variants.

### S3-R3 — Interaction capabilities
Classify selection, command/action dispatch, focus, validation, dirty state, drag/drop, resize, ordering, keyboard, accessibility and other reusable capabilities. Determine which are component-owned, shared Station services or projections of existing contracts.

### S3-R4 — Regions & semantic patterns
Define bounded Pane/Region and Pattern grammar: FormActions, ConfirmationActions, DestructiveActions, navigation/tool regions, inspector/layers patterns and named slots. Establish compatibility rules and forbidden arbitrary composition.

### S3-R5 — Templates / full views
Research canonical screen/view families and responsive span/grid behavior. Define how declarative structure, layers, inspector and preview remain synchronized projections of one composition model.

### S3-R6 — Tool families
Map component/pattern requirements for editor/tool families without constructing full specialized studios. Identify common shared editor foundation versus specialization contracts.

### S3-R7 — Studio readiness & Core projection census
Assess what additional contracts are actually required to progress from Tool/Application to specialized Studio. Perform Core Contract Reuse & Station Projection Census before proposing new cross-boundary contracts. Existing Core concepts must be reused/projected where possible rather than duplicated.

## Test dimension

Every promoted level must specify:
- contract/unit tests for local state and invariants;
- composition/schema validation for allowed parent/slot/variant relationships;
- structural/layout invariants based on discrete spans and responsive proportions;
- interaction/component tests;
- Playwright acceptance journeys for representative compositions;
- visual evidence/regression where structure can deform without semantic failure;
- accessibility checks;
- integration/contract tests at Station/Core boundaries without giving Station Core authority.

Human-readable acceptance journeys should state action -> expected state transition so non-test specialists can audit intended behavior independently of Playwright syntax.

## Forecast / dependency order

`R1 -> R2 -> R3 -> R4 -> R5 -> R6 -> R7 -> synthesis -> Construction materialization`

Research may run in parallel only where evidence collection is independent. Taxonomy/contract promotion follows the dependency order above.

## Exit gate

S3 Planning/Research is ready for Construction materialization only when:
1. hierarchy and ownership rules are explicit;
2. primitive/compound/pattern catalog gaps are classified;
3. compatibility and composition constraints are testable;
4. span/responsive layout rules are represented without arbitrary pixel authoring;
5. semantic action/pattern rules avoid primitive explosion;
6. Core reuse/projection census identifies any genuine cross-boundary gaps;
7. tool/application/studio complexity is decomposed without prematurely constructing Studios;
8. implementation slices can be materialized with allowed/forbidden/max_files and exact-head evidence.

## Explicitly deferred

- broad Studio implementation;
- arbitrary HTML/CSS authoring;
- unbounded theming/personalization;
- new Core/business authority;
- remote publish/deploy/provider runtime scope not separately admitted;
- silent replacement of existing M2 contracts.
