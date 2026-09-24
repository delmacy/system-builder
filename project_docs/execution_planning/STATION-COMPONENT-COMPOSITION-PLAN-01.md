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

## Level 6 — shared editor foundation and first editor specializations

The first post-component goal is not a monolithic application; it is the reusable **Composition Editor Engine** and its specializations.

The first specialization is the **Component Editor**, used to refine reusable primitives/composites, internal slots, variants and proportional sub-grids.

The first general application-level specialization is the **Window/View Editor**, used to organize Station/application views from those reusable pieces.

Initial Window/View Editor scope:

- select a view/window;
- reposition components only through valid grid slots/layout regions;
- resize through discrete row/column span changes, never arbitrary canonical pixel dimensions;
- align/order through declared layout rules;
- inspect/edit presentation properties;
- save changes;
- preview;
- preserve a working draft independently from the published definition.

Progressive scope:

- palette of registered components/templates;
- constrained insertion into compatible slots;
- component/layers tree;
- responsive/layout variants;
- bindings/events/commands only after the presentation model is stable.

The editors must edit a declarative composition graph, not arbitrary HTML/CSS.

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
Composition contracts + grid/slot rules
        ↓
Collections + selection/navigation
        ↓
Inspector + Layers Tree + generic editor surfaces
        ↓
Composition Graph + validation + save pipeline
        ↓
Shared Composition Editor Engine
        ↓
Component Editor
        ↓
Template Library/Manager
        ↓
Window/View Editor          ← first general application-level editor
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


## Nested slot composition for small controls

Small controls such as icon buttons should not consume first-class layout grid cells individually when they logically belong to one control cluster.

Introduce reusable grouped composites such as `ButtonGroup`.

Primary model:

```text
Outer View Grid
└── ButtonGroup   ← occupies one outer slot/span
    ├── ButtonSlot
    ├── ButtonSlot
    ├── ButtonSlot
    └── ...
```

The outer grid controls the group's placement and proportional footprint. The group owns an internal standardized sub-grid for its buttons.

### ButtonGroup contract

A ButtonGroup should define, at minimum:

- outer `columnSpan` / `rowSpan`;
- internal slot count or capacity;
- direction: row / column / wrapped where explicitly supported;
- standardized internal gap token;
- alignment / distribution;
- button size preset;
- optional compact/icon-only mode;
- overflow behavior when capacity is exceeded.

Individual icon buttons should normally occupy `ButtonSlot` units inside the group rather than arbitrary dimensions in the page/view grid.

Example:

```yaml
component: ButtonGroup
layout:
  columnSpan: 3
  rowSpan: 1
internalGrid:
  slots: 5
  gap: 1
  buttonSize: compact
children:
  - component: IconButton
    slot: 1
  - component: IconButton
    slot: 2
  - component: IconButton
    slot: 3
  - component: IconButton
    slot: 4
  - component: IconButton
    slot: 5
```

This establishes nested composition:

```text
View grid
→ composite slot
→ component-local grid
→ primitive controls
```

The same pattern should generalize beyond buttons to compact control groups, segmented controls, toolbar clusters, status clusters and similar micro-compositions.

Rule: the page/view grid manages meaningful layout blocks; component-internal micro-layout is owned by the component's own constrained sub-grid.


## Composition contracts — LEGO-style assembly semantics

To make constrained visual assembly concrete, every reusable component must declare how it participates in composition. Not every component is a group, but every component must declare its composition contract.

Core contract vocabulary:

- `Component`: reusable visual/interaction unit.
- `Slot`: named insertion point exposed by a component.
- `Layout`: outer placement model and internal arrangement model.
- `ChildPolicy`: whether/how the component accepts children.
- `Constraints`: allowed spans, placements and proportional bounds.
- optional `Variant`: standardized presentation/behavior variant.
- optional `Binding`: declarative data/state connection.
- optional `Command`: declarative action/intent connection.

### Component families

Use the following taxonomy to avoid unnecessary grouping.

#### Atomic primitives

Examples: Button, IconButton, Input, Badge, Label.

These may occupy a slot directly when semantically valid. They do not need a dedicated group unless several primitives form one meaningful local unit.

#### Collections

Examples: List, Grid, Table, Tree.

Collections are already meaningful composites. They normally occupy one outer grid span and manage their own items internally. Do not introduce redundant wrappers such as ListGroup unless a distinct semantic need exists.

#### Local semantic composites

Examples: ButtonGroup, FilterBar, Toolbar, Card, FormSection, StatusCluster.

These exist when multiple lower-level pieces form one meaningful unit or need a constrained micro-layout.

#### Layout containers

Examples: Row, Column, Grid, Split, Stack, Dock, Tabs.

These own arrangement rather than business/content semantics.

### ChildPolicy

Standardize child behavior:

```text
none      — does not accept compositional children
single    — accepts one child/slot content
multiple  — accepts multiple children
managed   — accepts children but owns their internal arrangement/slotting
```

Examples:

```text
Button       → none
Panel        → multiple
Tabs         → managed
List         → managed
ButtonGroup  → managed
```

### Slot contracts

A composite exposes named slots and allowed child kinds.

Example:

```text
Card
├── header
├── content
└── actions
```

The `actions` slot may accept Button, ButtonGroup or Menu, while rejecting unrelated components such as Table.

Slots are the primary 'LEGO joints': composition freedom is constrained by compatible insertion contracts.

### Layout ownership

Layout authority must be explicit at each nesting level.

Example:

```text
ViewGrid
→ owns ResourceList outer span

ResourceList
→ owns ListItem arrangement

ListItem
→ owns its own internal micro-layout
```

This prevents parent grids from micromanaging internal component geometry.

### Placement and proportional constraints

Each component should declare compatible parent/layout contexts and discrete span bounds, e.g.:

```yaml
component: ResourceList
placement:
  allowedIn: [grid, split, panel]
layout:
  minColumns: 3
  maxColumns: 12
  minRows: 2
children:
  policy: managed
  accepts: [ListItem]
```

A component can also expose recommended spans without reducing sizing to XS/S/M/L presets.

### Composition validation

The editor must validate a composition before save:

- child kind is accepted by the destination slot;
- parent layout supports the component;
- spans satisfy constraints;
- required slots are satisfied;
- managed children obey the component-local grid;
- no unsupported nesting cycles;
- variants/bindings/commands use declared contracts.

Invalid compositions should be blocked or surfaced as explicit validation findings rather than silently persisted.

## Editor architecture — shared Composition Editor Engine

Component Editor and Window/View Editor must not be separate editing engines.

Create a shared **Composition Editor Engine** built from reusable pieces:

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
├── Save Pipeline
└── Qualification hooks
```

The engine edits a declarative composition graph subject to the composition contracts above.

### Composition graph

Canonical editing model should distinguish:

```text
CompositionNode
├── componentRef
├── variantRef?
├── outerLayout
│   ├── columnSpan
│   ├── rowSpan
│   └── placement metadata
├── slot assignments
├── properties
├── bindings?
├── commands?
└── child nodes
```

The graph should preserve semantic layout rather than arbitrary pixel geometry.

## Component Editor plan

The **Component Editor** is the first specialization of the shared engine for reusable pieces and composites.

Initial goals:

- open a reusable component/composite definition;
- inspect its component tree;
- add/remove/reorder compatible children through slots;
- change row/column spans using discrete units;
- edit internal grids/subslots;
- edit standard gap/padding/alignment/distribution tokens;
- edit variants such as compact/pulse/dense where declared;
- preview states;
- save a new draft revision;
- save/create a reusable variant;
- save as a reusable template where appropriate.

Example target:

```text
ActionCard
└── ButtonGroup
    ├── IconButton
    ├── IconButton
    ├── IconButton
    ├── IconButton
    └── IconButton
```

The outer View grid sees ActionCard/ButtonGroup as meaningful blocks; the Component Editor exposes the internal sub-grid.

## Window/View Editor plan

The **Window/View Editor** is the second specialization of the same engine and remains the first general application target.

It operates at view/page/window composition level.

Required surfaces:

- View Tree: application pages/windows/dialogs/panels;
- Component/Layers Tree: selected view composition;
- Composition Canvas;
- Inspector;
- component/template palette;
- preview;
- Save Changes;
- Publish as a separate action.

Sizing/placement remains grid-constrained:

- +1/-1 column;
- +1/-1 row;
- approved spans;
- layout switches such as grid/split/stack/tabs;
- no canonical arbitrary pixel resize.

## Template tool integration

Template Library/Manager must consume the same composition contracts and graph format.

Template categories may include:

- component;
- local composite;
- section;
- page/view;
- application shell;
- later subsystem composition.

A template is therefore a reusable, versioned composition graph with provenance, not copied markup.

## Construction ordering for the editors

Do not materialize editor applications before the shared dependency closure exists.

Recommended planning/build order:

```text
A. Component inventory + taxonomy
        ↓
B. Composition contract schema
   Component / Slot / Layout / ChildPolicy / Constraints
        ↓
C. Grid/span + nested-slot primitives
        ↓
D. Collection and layout primitives
        ↓
E. Generic Inspector + Layers Tree
        ↓
F. Composition Graph + validator
        ↓
G. Save/normalize/draft pipeline
        ↓
H. Shared Composition Editor Engine
        ↓
I. Component Editor
        ↓
J. Template Library/Manager
        ↓
K. Window/View Editor
        ↓
L. Artifact-backed persistence/publication integration
        ↓
M. AI-assisted generation/completion
```

The exact order of I/J/K may be adjusted by the dependency graph, but no specialization may bypass H.

## AI-assisted authoring flow

Once the editors and contracts exist, AI-assisted construction should follow:

```text
intent/domain model
→ AI proposes valid composition graph
→ user adjusts through constrained editor
→ Save Changes
→ normalized declarative revision
→ AI reads final composition
→ proposes/completes bindings, commands, validation, APIs and backend logic
→ qualification
→ Publish
```

The AI must generate only contract-valid pieces/spans/slots rather than arbitrary CSS geometry.

This makes the human adjustment itself an authoritative input to downstream backend/logical completion.


## Missing cross-cutting editor foundations

The editor chain also requires the following transverse foundations before specialization is considered complete.

### Component Registry

Provide a source-owned registry for every composable component and composite. It should expose:

- stable component id;
- display name/category;
- composition family;
- icon token;
- supported parent/layout contexts;
- slot definitions;
- child policy;
- layout constraints;
- editable properties;
- declared variants;
- supported bindings/commands;
- schema/version metadata.

The editor palette, validator, inspector and AI authoring flow should resolve capabilities from this registry rather than hard-coded per-editor branches.

### Schema versioning and migration

Composition definitions, component contracts, templates and saved views need explicit schema versions.

Required capabilities:

- detect old schema versions;
- deterministic migration to current schema;
- preserve unsupported/unknown data safely or reject explicitly;
- migration tests/fixtures;
- prevent silent destructive rewrite on save.

### Responsive policy

The grid model must define responsive behavior rather than leave it to arbitrary CSS.

Planning must cover:

- supported breakpoints;
- span remapping per breakpoint;
- minimum viable width/height constraints;
- overflow/collapse behavior;
- component-specific responsive policies;
- preview at supported breakpoints.

Responsive behavior must remain token/grid based.

### Accessibility contracts

Composable components must declare and preserve accessibility semantics.

Planning must include:

- keyboard navigation;
- focus order;
- semantic roles/labels;
- minimum interaction target guidance;
- reduced motion;
- contrast/token conformance;
- validation for invalid nesting or missing accessible labels where applicable.

The editor must not allow a visually valid composition to become structurally inaccessible without surfacing findings.

### Editor transaction and history model

Undo/redo should be based on editor transactions, not incidental React state.

Define:

- atomic edit operations;
- grouped transactions;
- dirty state;
- undo/redo stack;
- reset/revert;
- conflict handling when underlying definitions change;
- deterministic serialization after history operations.

### Preview sandbox

Provide an isolated preview surface for draft compositions.

The sandbox should support:

- current draft render;
- breakpoint preview;
- presentation variants;
- sample/mock data where allowed;
- no accidental Core/business side effects;
- deterministic refresh/reload.

### Template and variant compatibility

Before applying a template or variant, validate compatibility with:

- destination component kind;
- required slots;
- schema version;
- layout constraints;
- supported bindings/commands;
- component versions.

Applying incompatible templates must produce explicit findings rather than partial silent mutation.

## Revised editor dependency closure

The complete dependency chain for editor materialization is now:

```text
A. Component inventory + taxonomy
        ↓
B. Component Registry
        ↓
C. Composition contract schema
        ↓
D. Grid/span + nested-slot + responsive policy
        ↓
E. Collection/layout primitives
        ↓
F. Accessibility contracts
        ↓
G. Inspector + Layers Tree
        ↓
H. Composition Graph + validator
        ↓
I. Schema versioning + migration
        ↓
J. Editor transaction/history model
        ↓
K. Save/normalize/draft pipeline
        ↓
L. Preview sandbox
        ↓
M. Shared Composition Editor Engine
        ↓
N. Component Editor
        ↓
O. Template Library/Manager + compatibility
        ↓
P. Window/View Editor
        ↓
Q. Artifact-backed persistence/publication
        ↓
R. AI-assisted generation/completion
```

This dependency closure should be treated as the next planning/construction horizon after the M1 shell. No editor specialization should bypass the shared foundations above.
