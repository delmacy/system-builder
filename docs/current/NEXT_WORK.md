# Next Work — STATION Component Composition Planning

Date: 2026-09-24
Planning base: `main@6ef02605f7c34fb35039a1c300a80dea98a6aa07`

## Current state

STATION-VISUAL-WP-01 / M1 is integrated by PR #911. The next horizon is component-first composition planning, governed by:
- `docs/architecture/STATION_FRONTEND_FOUNDATION.md`;
- `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`.

## Design principle

Proceed from the simplest reusable objects to progressively richer compositions:

```text
tokens/icons
→ primitives
→ interaction primitives
→ collections
→ navigation/editing pieces
→ generic composites
→ shared editor engine
→ component editor
→ templates
→ window/view editor
→ domain applications/studios
```

Primary rule: **develop once, compose many, run/recycle anywhere**.

The composition model is intentionally LEGO-like: standardized pieces, constrained joints, combinatorial freedom.

## Composition contracts

Every reusable component must declare how it can participate in composition.

Required vocabulary:
- Component;
- Slot;
- Layout;
- ChildPolicy;
- Constraints.

Optional extensions:
- Variant;
- Binding;
- Command.

Not every component is a group. Collections such as List/Grid/Table/Tree are meaningful composites that manage their own items. Groups such as ButtonGroup exist only when several small controls form one semantic unit or need a constrained internal micro-grid.

## Grid discipline

Do not use arbitrary canonical pixel sizing.

The editor works with:
- column spans;
- row spans;
- standardized spacing tokens;
- compatible slots;
- grid/row/column/split/stack/dock/tabs layouts.

A visual resize handle may exist, but crossing a boundary must emit a discrete span change such as `columnSpan 3 → 4`, not an arbitrary width.

Avoid XS/S/M/L sizing as the main contract. Prefer combinable discrete units with min/max/recommended spans.

Nested micro-layout is owned locally by the component. Example:

```text
View grid
└── ButtonGroup   ← one outer block/span
    ├── ButtonSlot
    ├── ButtonSlot
    └── ButtonSlot
```

The page grid manages meaningful blocks; each component manages its own constrained internal layout.

## Editor path

Do not build independent editor implementations.

First create the reusable **Composition Editor Engine**:

```text
Composition Editor Engine
├── Composition Canvas
├── Grid/Span Controller
├── Slot Resolver
├── Placement Validator
├── Selection/Focus
├── Layers/Component Tree
├── Inspector
├── Variant Editor
├── Undo/Redo
├── Preview
├── Draft/Dirty State
└── Save Pipeline
```

Then specialize it.

### Component Editor

First editor specialization. It edits reusable pieces/composites:
- internal slots/sub-grids;
- child composition;
- row/column spans;
- gap/padding/alignment;
- declared variants;
- preview;
- draft/save;
- save as template where appropriate.

### Template Library / Manager

Uses the same composition graph/contracts for reusable:
- component compositions;
- sections;
- views/pages;
- application shells;
- later subsystem compositions.

### Window/View Editor

First general application-level editor. It provides:
- View Tree for pages/windows/dialogs/panels;
- separate Component/Layers Tree for the selected view;
- constrained placement on grid/layout regions;
- +1/-1 row/column sizing;
- Inspector;
- component/template palette;
- preview;
- Save Changes to a normalized declarative draft revision;
- Publish as a separate action.

The editor does not author arbitrary HTML/CSS.

## Save model

```text
Working Composition
→ validate slots/layout/constraints
→ normalize
→ canonical Composition Graph
→ Draft Revision
→ Publish
→ Active View/Component
```

Save must preserve semantic layout rather than raw arbitrary geometry.

## AI-assisted flow

Once the shared contracts/editors exist:

```text
intent/domain model
→ AI proposes contract-valid composition
→ user adjusts visually within grid/slot rules
→ Save Changes
→ normalized declarative revision
→ AI reads the final composition
→ completes/proposes bindings, commands, validation, APIs and backend logic
→ qualification
→ Publish
```

The user's visual adjustment becomes authoritative input to downstream implementation.

## Next eligible planning work

This editor-foundation horizon is now the **next planned stage after M1**.

Do **not** jump directly to Component Editor, Window/View Editor, File Manager or Workflow Studio Construction. Materialize the shared dependency closure first.

Next planning/materialization gates:

1. repository-wide Component Inventory and taxonomy;
2. Component Registry contract;
3. Composition Contract schema;
4. grid/span, nested-slot, layout-ownership and responsive policy;
5. collection/layout primitives;
6. accessibility contracts;
7. Inspector + Layers Tree;
8. Composition Graph + validator;
9. schema versioning + migration;
10. editor transaction/history model;
11. normalize/save/draft pipeline;
12. preview sandbox;
13. local Git-backed UI Review Workspace (incoming + approved mirrored trees, selective checkout, approval manifest and push-back delta);
14. shared Composition Editor Engine;
15. Component Editor;
16. Template Library/Manager with compatibility validation;
17. Window/View Editor;
18. artifact-backed persistence/publication integration;
19. AI-assisted generation/completion.

The next Work Package should be materialized from fresh main around the earliest dependency-closed subset of this chain, rather than around an application-sized feature.

## Deferred but coordinated direction

The later semantic artifact/filesystem model remains:

```text
System
└── Subsystem
    └── Artifact
        └── Revision
            └── Publication
```

Subsystems are isolated by default; cross-subsystem reuse is explicit. The existing `packages/artifact-store` remains release-artifact hash/payload infrastructure until planning proves which lower-level primitives should be reused by the future semantic Artifact Repository.

## Boundary

Station remains presentation/composition-oriented until explicit Core/domain authority contracts are introduced. Do not smuggle business truth, unrestricted filesystem authority, arbitrary pixel layouts or application-local duplicate primitives into the frontend.
