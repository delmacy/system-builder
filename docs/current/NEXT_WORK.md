# Next Work — STATION Component Composition Planning

Date: 2026-09-24
Planning base: `main@87d3a28f5a2c18f9261a9607f0b79422477600e5`

## Current state

STATION-VISUAL-WP-01 / M1 is integrated by PR #911. The source-owned shell, windowing, interaction, app-runtime, settings and browser proof are complete enough to begin the next planning horizon.

The post-M1 direction is governed by:
- `docs/architecture/STATION_FRONTEND_FOUNDATION.md`;
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`.

## Development principle

Proceed from the simplest reusable objects to progressively richer compositions:

```text
tokens/icons
→ UI primitives
→ interaction primitives
→ collections
→ navigation/editing components
→ generic composites
→ domain composites
→ applications
→ studios
→ subsystem/system compositions
```

Primary rule: **develop once, compose many, run/recycle anywhere**.

Before creating an application-specific component, first test whether it can be expressed as a composition or specialization of a lower-level reusable component.

## First general application target

The first general application target is the **Window/View Editor**, but it is not yet a Construction package.

It should ultimately provide:
- a View Tree for application pages/windows/dialogs/panels;
- a Component/Layers Tree for the selected view;
- visual move/resize;
- alignment/snap/order;
- Inspector-driven properties;
- preview;
- `Save Changes` into a normalized declarative draft revision;
- separate Publish semantics;
- progressive palette/drag-drop/layout constraints.

The editor edits declarative composition, not arbitrary HTML/CSS.

## Reuse tool

A sibling **Template Library / Template Manager** is planned for reusable component/section/page/application-shell compositions, including Save as Template, variants, provenance, compare/apply/reset semantics and later compatible template updates.

## Semantic filesystem/artifact direction

Future managed artifacts follow:

```text
System
└── Subsystem
    └── Artifact
        └── Revision
            └── Publication
```

Subsystems remain isolated by default. Cross-subsystem reuse is explicit through import/derive/reference capabilities. Users do not create arbitrary raw files; applications import/create managed artifact kinds such as future `.wkfw` workflows. Extension is UX identity/filtering; semantic kind/schema is authoritative.

The existing `packages/artifact-store` is release-artifact hash/payload infrastructure and must not be mistaken for the future semantic Artifact Repository, though its immutable/hash-verification primitives may be reusable.

## Next eligible planning work

Do **not** materialize File Manager, Workflow Studio or Window/View Editor Construction yet.

Next:
1. repository-wide Component Inventory;
2. classify current components by composition level;
3. build a Composition/Dependency Graph;
4. identify duplication and missing generic primitives/composites;
5. identify the minimum dependency closure needed for Window/View Editor;
6. reconcile ViewDefinition/ComponentTree with existing AppManifest, WindowDefinition, interaction and windowing contracts;
7. define the minimal save/draft/revision boundary needed by the editor;
8. define qualification strategy;
9. only then materialize the next Work Package from fresh main.

## Boundary

Station remains presentation/composition-oriented until explicit Core/domain authority contracts are introduced. Do not smuggle business truth, unrestricted filesystem authority or application-local duplicate primitives into the frontend.
