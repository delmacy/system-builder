# STATION Component Composition Plan 01 — reusable UI to Window/View Editor

Date: 2026-09-24
Planning base: `main@1b99786354979cb27728bde9e6b46aa7158c652e`
Status: PLANNING / NOT MATERIALIZED
Predecessor: STATION-VISUAL-WP-01 (M1 integrated by PR #911)
Architecture authority: ADR-0017 and `docs/architecture/STATION_FRONTEND_FOUNDATION.md`

## Purpose

Define the post-M1 Station development order from the simplest reusable objects to progressively richer compositions. Do not choose application-sized construction before the lower-level component graph is understood and stabilized.

Primary principle:

> Develop once, compose many, run/recycle anywhere.

Complex surfaces must preferentially be compositions of smaller standardized primitives rather than bespoke application-specific implementations.

## Repository baseline

The current repository already separates reusable layers:

- `packages/ui-core`: source-owned visual primitives.
- `packages/ui-icons`: semantic icon tokens and provider mapping.
- `packages/station-interaction`: focus, selection, shortcuts and presentation command semantics.
- `packages/station-windowing`: window definitions/instances, geometry, z-order and lifecycle.
- `packages/station-app-runtime`: `AppManifest`, `ToolManifest` and application registry.
- `packages/station-shell`: Navbar, command/toolbar surface, Taskbar/Launcher and shell composition.
- `packages/station-settings`: presentation preferences and storage adapter.
- `packages/artifact-store`: immutable/hash-verified ReleaseArtifact payload persistence. This is reusable infrastructure evidence, but is not yet the semantic System/Subsystem/Artifact/Revision repository described below.

The next planning work must extend these layers rather than bypass them.

## Composition hierarchy

Development should proceed bottom-up:

1. **Tokens and semantic icons**
2. **UI primitives**
3. **Interaction primitives**
4. **Collection primitives**
5. **Navigation and editing primitives**
6. **Generic composites**
7. **Domain composites**
8. **General applications**
9. **Domain studios**
10. **Subsystem/System compositions**

A higher level should not introduce a local reinvention of a lower-level behavior when a reusable primitive can own it.

## Level 1 — UI primitive completion

Existing: Button, IconButton, Input, Select, Toggle, Separator, Badge, Panel, ScrollArea, Tooltip and MenuSurface.

Candidate reusable additions, subject to inventory/need validation:

- Checkbox / Radio / Label / TextArea.
- Progress / Spinner / StatusIndicator.
- Tabs.
- Popover / Dropdown / ContextMenu primitives.
- Dialog primitives.
- ToolbarItem / MenuItem.
- ListItem / TreeItem / GridItem / TableCell.
- ResizableSeparator / SplitHandle.

These remain domain-neutral.

## Level 2 — interaction primitives

Reuse and extend `station-interaction` and `station-windowing` rather than creating application-local state machines.

Required generic behaviors include:

- focus;
- semantic selection;
- single/multi selection;
- keyboard navigation;
- command availability;
- drag/move;
- resize;
- snap/alignment;
- ordering/layering;
- undo/redo contract;
- history/navigation state where required.

## Level 3 — collection components

Build reusable collection surfaces:

- List;
- SelectableList;
- Grid;
- Tree;
- Table;
- SelectionModel;
- virtualized collection adapter only when evidence justifies it.

These components must not know whether they are displaying files, workflows, entities, components or templates.

## Level 4 — navigation and editing components

Reusable composition pieces:

- Breadcrumb / PathBar;
- NavigationTree;
- Sidebar / NavigationPane;
- Back/Forward history;
- Toolbar composition;
- PropertyGroup / PropertyRow / PropertyEditor;
- generic Inspector;
- Layers/Component tree;
- search/filter surface.

## Level 5 — generic composites

Compose the previous levels into reusable higher-order surfaces.

### ResourceExplorer

Candidate composition:

```text
ResourceExplorer
├── NavigationPane
├── Breadcrumb/PathBar
├── CollectionView
│   ├── List
│   ├── Grid
│   └── Tree
├── SelectionModel
├── Search/Filter
├── ContextMenu
└── Inspector
```

The ResourceExplorer remains provider-agnostic.

### PropertyInspector

Schema-driven property editing surface reusable by files/artifacts, workflow nodes, form controls, dashboard widgets and view components.

### EditorShell

Reusable editor chrome providing:

- palette slot;
- canvas/work area slot;
- tree/layers slot;
- inspector slot;
- toolbar/commands;
- status area;
- dirty/draft state;
- save/preview hooks.

## Level 6 — first general application: Window/View Editor

The first general post-component application is the **Window/View Editor**.

Its purpose is to let a user visually organize Station/application views using the same reusable components that the System Builder itself exposes.

Initial usable scope:

- select a view/window;
- move components;
- resize components;
- align/snap;
- order/layer;
- inspect/edit presentation properties;
- save changes;
- preview;
- preserve a working draft independently from the published definition.

Progressive scope:

- palette of registered components;
- drag/drop insertion;
- component/layers tree;
- layout constraints;
- responsive/layout variants;
- bindings/events/commands only after the presentation model is stable.

The editor must edit a declarative model, not arbitrary HTML/CSS.

## View and component trees

The editor should separate two related hierarchies.

### View Tree

Represents application-level surfaces similar to pages in a site:

```text
Application
├── Dashboard
├── Assets
├── Settings
├── Dialogs
└── Panels
```

### Component Tree

Represents the composition inside the selected view:

```text
Assets
├── Toolbar
├── SplitView
│   ├── ResourceExplorer
│   └── Inspector
└── StatusBar
```

The two trees must not be collapsed into one unbounded hierarchy.

## Save Changes semantics

`Save Changes` is not merely persistence of raw x/y coordinates.

The intended pipeline is:

```text
Working Layout
    ↓
normalize
    ↓
infer/retain stable layout semantics
    ↓
validate component tree
    ↓
canonical declarative definition
    ↓
Draft Revision
```

Where possible, stable semantic layouts (row, column, grid, split, stack, dock, tabs) should be preferred over unnecessary absolute coordinates.

Publication remains a separate action:

```text
Working Layout → Save Changes → Draft Revision → Publish → Active View
```

This preserves safe experimentation, review and rollback.

## Template Library / Template Manager

A second general tool should manage reusable compositions.

Templates can exist at multiple composition levels:

- component templates;
- section templates;
- page/view templates;
- application-shell templates;
- later, subsystem templates.

Expected actions:

- Save as Template;
- Create Variant;
- Apply Template;
- Reset to Template;
- Compare with Template;
- preserve derivation/provenance;
- later surface compatible upstream template updates.

Templates are declarative reusable compositions, not screenshots or copied HTML.

## Artifact and filesystem direction

The future File Manager is a managed semantic filesystem, not a free-form OS filesystem.

Proposed hierarchy:

```text
System
└── Subsystem
    └── Artifact
        └── Revision
            └── Publication
```

Rules agreed during planning:

- each subsystem is isolated by default;
- applications see only their allowed subsystem/context;
- users do not create arbitrary raw files; applications create/import managed artifacts;
- custom extensions identify artifact kinds for UX/filtering, while internal semantic metadata/schema remains authoritative;
- example workflow extension: `.wkfw`;
- importing from another subsystem is explicit and controlled;
- copy/derive should preserve provenance while producing an independent artifact by default;
- references/shared dependencies may be introduced explicitly where coupling is intended;
- runtime/database should consume the active/published normalized representation rather than repeatedly parsing user files.

Cross-subsystem reuse must preserve isolation: isolated for operation, permeable only through explicit import/reference capabilities.

## Security invariants for semantic artifacts

The visual filesystem path is not the security boundary.

Authorization/resolution must include scoped identity such as:

```text
principal
∩ system
∩ subsystem
∩ application
∩ capability
∩ artifact
```

Additional invariants:

- no direct arbitrary filesystem path access;
- no path traversal as authority;
- ArtifactId/path/hash alone does not grant access;
- list/search/history/diff/preview must enforce the same scope as open/download;
- imported artifacts are treated as untrusted input and schema/size/depth/reference validated;
- secrets never live in versioned artifacts; artifacts hold secret references only;
- historical revisions are immutable;
- provenance is recorded for cross-subsystem derivation/import;
- global confidential blob deduplication must not create cross-tenant information leaks.

## Relationship to current `artifact-store`

Do not rename or overload the existing release artifact store prematurely.

Current `packages/artifact-store` proves useful lower-level concepts:

- canonical hashing;
- immutable payload identity;
- aggregate/file hash verification;
- persistence adapter.

Planning must determine whether these become shared content-addressed primitives underneath a semantic Artifact Repository or remain release-specific.

The semantic repository still needs explicit models for:

- System;
- Subsystem;
- Artifact identity/kind;
- logical path;
- Revision;
- Publication/active revision;
- provenance;
- capability-scoped access;
- import/export.

## Planned application succession

Do not materialize all of these at once. The dependency graph controls eligibility.

Expected succession after component stabilization:

```text
Primitive inventory/completion
        ↓
Collections + selection/navigation
        ↓
Inspector + generic editor surfaces
        ↓
Window/View Editor          ← first general application
        ↓
Template Library/Manager
        ↓
ResourceExplorer
        ↓
Artifact-backed File Manager
        ↓
Workflow artifact/browser
        ↓
Workflow Studio
        ↓
other domain studios
```

ResourceExplorer may be pulled before or during Window/View Editor if the dependency graph proves it is required as a generic composite; application-level scope must not be chosen ahead of that evidence.

## Planning gates before Construction

Before materializing the next Work Package:

1. produce a repository-wide Component Inventory;
2. classify each existing/new candidate by composition level;
3. produce a Composition/Dependency Graph;
4. identify duplicate/ad-hoc components that should converge on shared primitives;
5. determine minimal primitive/composite gaps required for the Window/View Editor;
6. reconcile the editor model with AppManifest/WindowDefinition/station-interaction/station-windowing;
7. define declarative ViewDefinition/ComponentTree boundaries without prematurely introducing domain/runtime authority;
8. determine which artifact concepts are necessary for draft/save/versioning now versus deferred canonical repository work;
9. define deterministic/component/browser proof strategy;
10. only then materialize Construction TASKs from fresh main.

## Non-goals of this planning step

- No File Manager implementation yet.
- No Workflow Studio implementation yet.
- No free-form browser filesystem.
- No arbitrary HTML/CSS page builder.
- No business-domain authority in Station.
- No premature task numbering or application-sized Construction package before the composition graph is complete.


## Grid-constrained visual editing

The visual editors must intentionally limit free-form layout freedom.

Primary rule:

> Resize and placement are grid-constrained, not arbitrary pixel manipulation.

The editor should use standardized layout units so components keep proportional, predictable dimensions across views and applications.

### Resize model

Do not use free drag-resize as the canonical interaction for component sizing.

Resize should operate by adding/removing predefined grid units:

- columns;
- rows;
- approved spans;
- predefined spacing steps.

Conceptually:

```text
width  = N columns
height = M rows
gap    = spacing token
```

Examples:

```text
Card
columnSpan: 4
rowSpan: 3

ButtonGroup
columnSpan: 4
rowSpan: 1
gap: 1
```

The visual editor may expose handles, but a handle must snap to discrete row/column boundaries and emit grid-span changes rather than arbitrary pixel dimensions.

### Layout constraints

Prefer standardized layout systems:

- grid;
- row;
- column;
- split;
- stack;
- dock;
- tabs.

Absolute positioning is exceptional and must not be the default authoring model.

### Proportional dimensions

Component sizes should be derived from shared grid/tokens so that:

- sibling components align naturally;
- spacing remains consistent;
- responsive variants can remap spans predictably;
- templates remain portable;
- AI-generated views inherit the same visual grammar;
- manual adjustments do not degrade into arbitrary one-off dimensions.

### Editor behavior

The Component Editor and Window/View Editor should therefore expose controls such as:

- +1 / -1 column;
- +1 / -1 row;
- span presets;
- alignment;
- distribution;
- standard gap/padding tokens;
- breakpoint-specific spans where appropriate.

This constrained system is intentional: the editor is a composition tool over a design grammar, not a free-form drawing canvas.
