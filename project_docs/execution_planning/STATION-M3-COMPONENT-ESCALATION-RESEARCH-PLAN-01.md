# STATION M3 Component Escalation Research Plan 01

Date: 2026-09-25
Planning base: `main@0c187226d6d13255f288b2696ee871703830d356`
Status: PLANNING / RESEARCH SPRINTS PROPOSED
Predecessor: M2 Station Component Composition/Editor (still closing; TASK-621..622 remain after TASK-620 integration)
Authority: ADR-0017, `docs/architecture/STATION_FRONTEND_FOUNDATION.md`, `project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md`

## Intent

M3 must not jump directly from the shared composition engine into a collection of specialized Studios. Its purpose is to increase the breadth, composability and proven reuse of the Station component language from micro to macro, so later applications and Studios are mostly assembled from already-proven capabilities.

Primary progression:

```text
tokens / semantic icons
  -> primitives
  -> complementary primitives
  -> interaction behaviors
  -> collections
  -> local composites
  -> reusable interaction capabilities
  -> sections / panes / dialogs / wizards
  -> view patterns
  -> full-screen compositions / templates
  -> generic tools
  -> specialized tool families
  -> applications
  -> opinionated Studios
```

A Studio is not a primitive milestone. It is an application that gathers the tools, capabilities, guidance and domain-specific semantics required to complete a class of work.

## Product principle

M3 optimizes for three related outcomes:

1. **Reuse economics** — build and prove a capability once, then compose it many times.
2. **Cognitive familiarity** — reuse established interaction grammar so a new application feels learnable before the user has used it.
3. **Domain complexity only** — do not make the user pay interface complexity beyond the complexity inherent in the work.

Novel capability may be novel; basic interaction should remain deliberately familiar unless evidence shows a better pattern.

## External inventory baseline

Research should benchmark at least:

- shadcn/ui: broad source-owned component set plus registry/block distribution model;
- Radix Primitives / Base UI / React Aria: behavior/accessibility primitive layer;
- Material UI + MUI X: broad component families plus richer Data Grid, date/time, chart and Tree View surfaces;
- Ant Design: broad enterprise-oriented taxonomy across general, layout, navigation, data entry, data display and feedback;
- complementary registries/libraries only after security, licensing, maintenance/currentness and API-fit review;
- application/template ecosystems for composition patterns rather than direct copying.

Research must distinguish: useful semantic family, implementation dependency, visual inspiration, interaction precedent and unsuitable pattern. The target is not to import every component from another library.

## M3 research sprint sequence

### Research Sprint M3-R1 — Component census and primitive parity

Goal: establish the smallest trustworthy vocabulary.

Research outputs:

- repository-wide Station/ui-core component census;
- shadcn/Radix/Base/React Aria/MUI/Ant family comparison;
- missing primitive matrix;
- accessibility/keyboard/focus obligations by primitive family;
- canonical vs complementary vs reject/defer classification;
- dependency/licensing/replaceability notes;
- duplication/ad-hoc convergence findings.

Candidate families include inputs, selection controls, feedback/status, overlays, menus, typography helpers, navigation atoms, layout atoms, item/cell atoms and resize/split handles.

Exit criterion: we can explain which low-level components Station owns, which behaviors may sit on mature primitives, and which gaps materially block higher compositions.

### Research Sprint M3-R2 — Compound controls and collection grammar

Goal: move from atoms to reusable units without introducing domain authority.

Research outputs:

- Field/InputGroup/Item/ButtonGroup/ToggleGroup/SegmentedControl families;
- List/Grid/Table/Tree/TreeGrid/virtualized collection capability map;
- SelectionModel, keyboard navigation, focus and command semantics;
- Toolbar/FilterBar/SearchBar/StatusCluster families;
- responsive and small-screen behavior expectations;
- complexity/dependency graph from primitive to compound.

Exit criterion: collection and control-cluster semantics are reusable across files, workflows, components, policies, deployment and other domains.

### Research Sprint M3-R3 — Reusable interaction capabilities

Goal: identify units larger than visual components that should still be reused independently of applications.

Research outputs:

- ResourceTree / NavigationTree;
- ResourceList / ResourceGrid;
- Breadcrumb/PathNavigator;
- SearchFilterSurface;
- PropertyInspector;
- LayersTree;
- CommandPalette / CommandBar;
- Picker and selector families;
- Open/Save/Move/Copy/Conflict dialog patterns;
- Wizard/Stepper/Review/Confirmation flows;
- empty/loading/error/recovery surfaces;
- scope/authority input contracts without implementing business authority.

Important invariant:

`visual component != interaction capability != domain authority`.

Exit criterion: a future File Manager, Workflow Studio, Policy Studio or Deployment Studio can reuse these capabilities rather than cloning them.

### Research Sprint M3-R4 — Section, pane, dialog and view-pattern composition

Goal: discover the reusable mid-level structures that dominate real application screens.

Research outputs:

- master-detail;
- list-detail;
- tree-editor-inspector;
- split explorer;
- dashboard/overview;
- settings/control-center;
- table + filters + bulk actions;
- wizard/task flow;
- monitor/operations surface;
- editor + preview;
- comparison/diff;
- history/revisions;
- command/inspection layouts;
- dialogs/drawers/sheets/panels and when each is appropriate;
- proportions, density, hierarchy and responsive collapse strategies.

Templates from mature ecosystems are evidence for recurring structures, not canonical SB definitions.

Exit criterion: common screens can be described declaratively using reusable sections and capabilities instead of bespoke page markup.

### Research Sprint M3-R5 — Screen templates and application composition

Goal: climb from view patterns to nearly complete application surfaces.

Research outputs:

- template taxonomy: component, section, view, application-shell;
- provenance/derivation/variant expectations;
- application-shell composition patterns;
- navigation + working area + inspector + status combinations;
- progressive disclosure strategy for novice/intermediate/expert users;
- familiar-mechanics rules for Station applications;
- declarative template constraints and portability;
- anti-patterns: screenshot templates, copied HTML, arbitrary pixel geometry and one-off app shells.

Exit criterion: multiple materially different full views can be composed from the same lower-level vocabulary without breaking Station grammar.

### Research Sprint M3-R6 — Tool taxonomy and reusable tool families

Goal: define what a tool is before defining Studios.

Research outputs:

- tool taxonomy: inspect, select, navigate, edit, transform, validate, compare, import/export, configure, bind, authorize-request, deploy-request, observe and recover;
- shared tool chrome and command contracts;
- tool capability requirements;
- reusable wizard framework;
- validation/result/proof surfaces;
- context/scoping contracts;
- authority handoff boundaries;
- undo/redo/draft/preview applicability;
- tool-to-view and tool-to-application composition rules.

No provider runtime, business authority or domain execution is implemented by this research.

Exit criterion: specialized applications can share tool mechanics while keeping domain semantics explicit.

### Research Sprint M3-R7 — Specialized application/Studio readiness

Goal: determine when the substrate is rich enough that Studios become composition-heavy rather than bespoke.

Candidate domains for readiness analysis only:

- Component/View composition;
- File/resource management;
- Workflow;
- Policies/permissions;
- deployment/environment/provider configuration;
- data/storage administration;
- observability/operations;
- forms/entities/schema;
- integrations/adapters.

For each candidate, produce:

- reusable percentage estimate by capability family, explicitly marked as planning evidence rather than performance fact;
- missing domain-specific semantics;
- missing shared capabilities;
- required authority boundary;
- likely wizard/opinionated flow;
- whether it is ready, blocked on shared foundation, or intentionally deferred.

Exit criterion: no Studio is promoted merely because its name exists in the roadmap. Promotion requires evidence that shared foundations cover the majority of its generic interaction needs and its remaining delta is meaningfully domain-specific.

## Complexity ladder

Use this ladder for the M3 inventory and dependency graph:

| Level | Unit | Examples | Primary concern |
|---|---|---|---|
| C0 | Token/semantic atom | spacing, typography role, semantic icon | consistency |
| C1 | Primitive | Button, Input, Checkbox, Label | accessibility + predictable behavior |
| C2 | Compound | Field, InputGroup, ButtonGroup, Item | local composition |
| C3 | Collection | List, Table, Tree, Grid | selection/navigation/scale |
| C4 | Capability | Inspector, Picker, ResourceTree, SearchFilter | reusable interaction semantics |
| C5 | Section/Pane | NavigationPane, PropertyPane, CommandPane | layout + local orchestration |
| C6 | Pattern | master-detail, tree-editor-inspector, wizard | cross-capability composition |
| C7 | View Template | resource browser, settings view, editor view | near-screen composition |
| C8 | Generic Tool | diff, preview, validator, importer, selector | task completion |
| C9 | Application | File Manager, Component Editor | coherent application lifecycle |
| C10 | Studio | Workflow/Policy/Deploy Studio | opinionated domain workbench |

Higher levels must identify their lower-level dependencies. A missing C1-C4 capability that would otherwise be reimplemented by several C8-C10 surfaces has priority over premature Studio work.

## Research matrices

M3 should maintain four matrices rather than one flat component list.

### Component Coverage Matrix

Columns: family, level, existing SB implementation, external analogues, accessibility maturity, responsive maturity, composition contract, duplicate risk, priority.

### Reuse/Capability Matrix

Columns: capability, consuming domains, authority requirement, state ownership, keyboard/focus contract, reusable subparts, expected variants, domain-neutral percentage.

### Adoption Matrix

Columns: candidate source/library, mode (`own`, `adapt`, `wrap`, `borrow pattern`, `reject/defer`), security, licensing, currentness, maintenance, compatibility, bundle/performance, replaceability, lock-in.

### Screen/Template Matrix

Columns: screen pattern, component dependencies, capability dependencies, familiar precedent, responsive transformation, accessibility obligations, likely consuming applications.

## Foundations with multiplicative value

Research should prioritize foundations that reduce the marginal cost of many future applications:

- canonical component registry and composition contracts;
- accessibility/focus/keyboard primitives;
- collection + selection models;
- tree/list/table/grid families;
- command model;
- inspector/property schema rendering;
- resource navigation/picker family;
- dialogs and wizard framework;
- validation/error/proof surfaces;
- draft/undo/redo/preview semantics;
- template/provenance model;
- responsive composition rules;
- shared application/editor shell.

## Things that should remain application/domain-specific

Do not erase semantics merely to maximize reuse. Likely specific deltas include:

- workflow node/edge semantics and BPMN-like rules;
- policy/permission semantics and authorization decisions;
- deployment/provider/environment semantics;
- database/storage-specific operations;
- artifact/resource authority and provenance rules;
- observability query/alert/incident semantics;
- schema/entity/form domain contracts.

Adapter normalization must not fabricate semantic equivalence.

## Familiarity strategy

M3 research should explicitly capture familiar interaction precedents from Windows/Ubuntu, mature IDEs and productivity/design applications while preserving an SB identity.

Rule:

> Reuse the user's mental model where it is sound; do not clone another product's identity.

Expected familiar mechanics include focus, windows, tabs, context menus, Open/Save, breadcrumbs, trees, properties/inspectors, Back/Next wizards, drag/drop where appropriate, keyboard navigation, selection and conventional feedback states.

## M3 non-goals

- no immediate Studio implementation;
- no arbitrary HTML/CSS page builder;
- no free-form pixel geometry as canonical composition;
- no provider/deploy/workflow runtime implementation;
- no Core/business authority in Station;
- no semantic File Manager implementation merely to prove ResourceTree;
- no indiscriminate import of third-party libraries;
- no parallel competing theme/typography systems;
- no XS/S/M/L sizing taxonomy as a canonical contract.

## Planning closure / construction gate

M3 research is ready to feed later materialization only after:

1. component census and external parity are documented;
2. complexity/dependency graph is stable enough to identify shared bottlenecks;
3. reusable capability families are separated from domain authority;
4. at least several screen archetypes are decomposed successfully from the proposed vocabulary;
5. complementary-library adoption candidates have licensing/security/currentness/replaceability evidence;
6. accessibility and small-screen equivalence obligations exist for each promoted family;
7. tool taxonomy and Studio readiness criteria are documented;
8. remaining unknowns are explicitly marked research gaps rather than silently encoded as implementation assumptions.

Only then should fresh-main planning materialize bounded Construction packages.
