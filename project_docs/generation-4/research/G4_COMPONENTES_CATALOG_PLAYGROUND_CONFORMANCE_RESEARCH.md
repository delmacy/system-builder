# G4 — Componentes Catalog / Playground Conformance Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Purpose

Define an implementation-independent conformance model for the permanent `Componentes` catalog/playground of the G4 Web Desktop & Application Environment. The catalog is not a gallery and not semantic authority. Its purpose is to make reusable UI contracts, states, transitions, composition boundaries, accessibility, performance, failure/recovery and proof obligations inspectable before implementation planning.

This artifact extends `G4_FRONTEND_DESIGN_SYSTEM_FOUNDATION_PLAN.md` and `G4_UI_INTERACTION_STATE_MATRIX_RESEARCH.md`. It preserves the current Web Desktop hierarchy as a candidate interaction hierarchy, not frozen product taxonomy:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

## Evidence classes

Research evidence used in this round:

1. Storybook official documentation: stories can be executable component fixtures; interaction tests can simulate workflows; current Vitest integration can run interaction, accessibility and visual checks in UI/CLI/CI. This is evidence for a fixture/proof grammar, not provider adoption.
2. WAI-ARIA Authoring Practices: component roles imply keyboard/focus interaction contracts; APG examples explicitly require browser/assistive-technology testing and prefer native semantics where practical. This is evidence that structural markup, focus and keyboard behavior belong in conformance, not visual polish.
3. Adobe Spectrum component guidance: mature component documentation checks applicable interactive states, themes/scales, non-color-only communication and contrast. This supports explicit state/theme/density matrices rather than a happy-path screenshot catalog.
4. Existing G4 state-matrix research: `visual variant != interaction state != semantic state != operational state`; focused, selected, authority, async, data/currentness and editing states remain independent axes.

No provider/library is selected by this research.

## Finding 1 — Catalog entry != screenshot != proof

A durable catalog entry needs a semantic contract envelope:

```text
ComponentCatalogEntry
  identity
  classification
  semanticRole
  sharedOrSpecialized
  composedOf[]
  usedBy[]
  inputs[]
  outputs[]
  commands[]
  events[]
  stateOwnership[]
  stateAxes[]
  guards[]
  transitions[]
  failureModes[]
  recoveryPaths[]
  accessibilityContract
  responsiveDensityContract
  performanceEnvelope
  fixtures[]
  proofObligations[]
  evidenceRefs[]
  maturity
```

Invariants:

- `CATALOG_ENTRY != IMPLEMENTATION`
- `RENDERED_STORY != CONFORMANT_COMPONENT`
- `VISUAL_MATCH != INTERACTION_CONFORMANCE`
- `AUTOMATED_A11Y_PASS != ACCESSIBILITY_PROOF_COMPLETE`
- `FIXTURE_PASS != SEMANTIC_AUTHORITY`
- `PROVIDER_EXAMPLE != SB_CONTRACT`

The catalog describes the expected observable UI contract. Canonical business meaning remains outside the component.

## Finding 2 — Conformance scales by composition level

Use the requested classification as a first-class axis:

```text
primitive/atomic
 -> compound
 -> module component
 -> tool
 -> application
 -> window
 -> desktop
 -> workspace
 -> system view
```

Each higher level inherits applicable lower-level obligations but adds composition-specific proofs. A workspace is not conformant merely because every Button is conformant.

### Primitive / atomic

Examples: Button, IconButton, Badge, state indicator, focus indicator.

Proof emphasis: native/ARIA role, accessible name, focus-visible, keyboard activation, disabled/read-only distinction where applicable, state representation beyond color, theme/density/reduced-motion.

### Compound

Examples: TabStrip, Toolbar/Ribbon group, WindowTitleBar, CommandMenuItem, status summary.

Proof emphasis: child coordination, roving focus where appropriate, ordering, selected-vs-focused separation, overflow, unavailable-reason discoverability.

### Module component

Examples: relation editor, deployment placement summary, contract surface inspector.

Proof emphasis: semantic identity preservation, typed empty/error/stale/unknown states, authority/currentness projections, domain-specific guards without assuming business ownership.

### Tool

Examples: Inspector, Tool Rail, Command Palette, recovery panel, conflict inspector.

Proof emphasis: command/context resolution, selection/focus handoff, async lifecycle, partial/unknown results, recovery and keyboard-only operation.

### Application

Proof emphasis: registry/load/residency lifecycle, multiple windows, permission visibility, activation failure, restore without confusing UI residency with runtime lifecycle.

### Window

Proof emphasis: focus/activation, dock/snap/split/tab, dirty/recovery, close protocol, suspend/evict, high-window-count and owner/modal relations.

### Desktop

Proof emphasis: window registry/taskbar, cross-window focus, layout persistence, desktop switch, application activation budgeting and accessible alternatives to drag/spatial arrangement.

### Workspace

Proof emphasis: Client/Workspace/revision/environment qualification, recovery envelope, stale-context handling, delegated access and cross-desktop continuity.

### System view

Proof emphasis: end-to-end task completion across projections while preserving semantic identity/currentness/revision/environment and avoiding visual authority fabrication.

## Finding 3 — State matrix must be sparse but explicit

The complete Cartesian product of all state axes is infeasible and often nonsensical. Conformance therefore uses an explicit coverage relation rather than silently testing only defaults.

```text
StateAxis
  interaction
  focus
  selection
  availability/authority
  async/execution
  data/currentness
  editing
  visibility/layout
  lifecycle
  qualified semantic overlays
```

For each component:

```text
ApplicableStateSet
ExcludedStateSet(reason)
RequiredPairwiseInteractions
RequiredAdversarialCombinations
```

Example required combinations for an editable command surface include:

- focused + selected;
- focused + not selected;
- read-only + current;
- permission-denied + current;
- dirty + autosaving;
- dirty + stale;
- pending + window minimized;
- ACK + verification pending;
- unknown outcome + recoverable session;
- disabled-by-readiness + otherwise authorized.

This prevents combinatorial explosion while preserving evidence that dangerous cross-axis interactions were considered.

`NOT_TESTED != NOT_APPLICABLE`.

## Finding 4 — Fixture taxonomy must distinguish state from scenario

Candidate fixture classes:

```text
CANONICAL_STATE_FIXTURE
TRANSITION_FIXTURE
ADVERSARIAL_FIXTURE
RECOVERY_FIXTURE
ACCESSIBILITY_FIXTURE
RESPONSIVE_DENSITY_FIXTURE
PERFORMANCE_FIXTURE
FAILURE_INJECTION_FIXTURE
COMPOSITION_FIXTURE
```

A fixture declares deterministic starting assumptions and observable expectations. It must not embed hidden business authority.

A scenario can compose multiple fixtures. Example:

```text
WorkspaceSwitchWithDirtyWindow
  start: client=A/workspace=W1/revision=R1/environment=E1
  window: dirty + current + authorized
  action: request switch to W2
  inject: authority changes during reconciliation
  expect:
    dirty work not silently discarded
    old semantic selection not rebound to W2
    restored layout not reported current by implication
    focus lands on valid successor
```

## Finding 5 — Transition conformance is first-class

Static snapshots miss the highest-risk UI bugs. Every material transition should specify:

```text
preconditions
trigger
intermediate states
allowed side effects
forbidden side effects
terminal dispositions
time/async assumptions
recovery route
observable evidence
```

Examples:

- `dirty -> autosaving -> saved | save-failed | conflicted`;
- `requested -> pending -> acknowledged -> verifying -> effective | effect-unknown`;
- `current -> stale -> refreshing -> current | conflicted | unknown`;
- `window hot -> suspended -> evicted -> restoring -> ready | degraded`;
- `permission-visible -> authority-stale -> denied/read-only/authorized`.

Conformance must fail if an intermediate state is visually skipped in a way that fabricates semantics, e.g. `ACK -> SUCCESS` when effect verification is required.

## Finding 6 — Proof obligations are typed

Candidate proof classes:

```text
STRUCTURAL
INTERACTION
SEMANTIC_PROJECTION
ACCESSIBILITY
RESPONSIVE_DENSITY
PERFORMANCE
FAILURE_RECOVERY
COMPOSITION
CROSS_SURFACE_CONTINUITY
```

A catalog badge such as `CONFORMANT` is too coarse. Store a vector:

```text
ConformanceDisposition
  structural
  interaction
  semanticProjection
  accessibility
  responsiveDensity
  performance
  failureRecovery
  composition
  crossSurfaceContinuity
```

Each dimension may be `PASS`, `FAIL`, `PARTIAL`, `NOT_APPLICABLE`, `NOT_EVALUATED`, or `STALE_EVIDENCE`.

Invariants:

- `PARTIAL != PASS`
- `NOT_EVALUATED != NOT_APPLICABLE`
- `STALE_EVIDENCE != CURRENT_PROOF`
- `ONE_BROWSER_PASS != UNIVERSAL_ACCESSIBILITY`
- `UNIT_COMPONENT_PASS != COMPOSED_PAGE_PASS`

## Finding 7 — Accessibility needs manual/AT evidence classes

Automated accessibility checks are useful gates but cannot prove keyboard/focus semantics or real assistive-technology interoperability alone. APG explicitly cautions that examples can have browser/AT support gaps and should be tested with target combinations.

Catalog accessibility evidence should therefore separate:

```text
STATIC_AUTOMATED
KEYBOARD_SCRIPTED
FOCUS_SCRIPTED
SCREEN_READER_MANUAL
ZOOM_REFLOW_MANUAL
REDUCED_MOTION
HIGH_CONTRAST_FORCED_COLORS
TOUCH_SMALL_SCREEN
```

Required shell-level proofs include:

- Ribbon/Toolbar operable without excessive tab stops and without pointer-only controls;
- docking/snap/split has non-drag alternatives;
- selected and focused are separately perceivable;
- unavailable reason can be discovered without hover;
- alert/status updates do not steal focus unless interruption is semantically required;
- responsive fullscreen projection does not create a new semantic Window/Workspace identity.

## Finding 8 — Performance evidence belongs to the contract

Performance conformance is scenario-relative, not one universal millisecond threshold. Each relevant entry declares workload shape and measurement dimensions:

```text
PerformanceEnvelope
  normalWorkload
  stressWorkload
  initialRender
  interactionLatency
  updateCost
  memoryResidency
  backgroundCost
  recoveryCost
  degradationStrategy
```

For Web Desktop scenarios:

- NORMAL: 50–200 modules, 5–10 floors, practical multi-window desktop;
- STRESS: approximately 1000 modules and high result/window counts;
- large-scene degradation must aggregate/virtualize, never silently omit semantic items;
- catalog performance fixtures should test visible working set and aggregation/drill-down behavior rather than requiring every item resident/rendered simultaneously.

`PERFORMANCE_DEGRADATION != SEMANTIC_OMISSION`.

## Finding 9 — Failure injection is mandatory above primitive level

Candidate injected failures:

- lazy application load failure;
- permission/currentness change mid-interaction;
- async validation race;
- save conflict;
- offline/reconnect;
- stale revision/environment;
- command ACK with unknown effect;
- partial bulk result;
- suspended/evicted window during pending work;
- crash before final browser lifecycle callback;
- detached surface loss;
- component subtree render failure.

The catalog must prove that fatal presentation failure preserves recoverable work/effect lineage where the governing contract requires it.

## Finding 10 — Catalog itself has lifecycle/currentness

A component contract and its evidence evolve. Candidate lifecycle:

```text
DRAFT
 -> RESEARCH_QUALIFIED
 -> IMPLEMENTATION_CANDIDATE
 -> IMPLEMENTED_UNQUALIFIED
 -> CONFORMANCE_IN_PROGRESS
 -> QUALIFIED
 -> DEPRECATED
 -> RETIRED
```

This is research vocabulary only; it does not authorize implementation.

Evidence binds at least:

```text
componentContractRevision
implementationRevision (when implementation exists)
fixtureRevision
browser/AT/runtime profile
proofTimestamp
```

A code or contract change can make evidence `STALE_EVIDENCE`; old green badges cannot silently survive material changes.

`IMPLEMENTED != QUALIFIED`.

## Componentization impact

### Shared behavior candidates

Shared infrastructure should own only cross-cutting interaction mechanics:

- focus/keyboard primitives;
- state/evidence indicators;
- command projection mechanics;
- async/loading/error/recovery surfaces;
- responsive/density primitives;
- fixture/evidence schema;
- catalog navigation/filtering;
- conformance disposition rendering.

### Specialized behavior

Specialized components own domain projection rules and domain-specific interaction constraints, but not canonical business truth. Their catalog entry references the semantic contracts they project.

### composedOf / usedBy

The catalog should support both directions. A primitive can show all compounds/tools/windows that depend on it; a system view can expose its dependency tree down to primitives. This enables impact analysis when a primitive contract or accessibility behavior changes.

`composedOf` is structural dependency evidence, not semantic ownership.

## Catalog/playground candidate system view

A complete research candidate view contains:

```text
CatalogNavigator
  filters: classification/domain/maturity/conformance/state

ContractHeader
  identity + classification + shared/specialized + revision

FixtureWorkbench
  state fixtures
  transition playback
  failure injection
  responsive/density viewport
  theme/reduced-motion/forced-colors controls

ContractInspector
  inputs/outputs/events/commands
  state ownership
  guards/transitions
  composedOf/usedBy

EvidencePanel
  proof vector
  failures
  stale evidence
  environment/profile

PerformancePanel
  workload profile
  measurements
  aggregation/virtualization behavior
```

The playground may visually resemble Storybook or other mature component explorers, but this structure is a System Builder research contract, not a provider decision.

## Mandatory scenario set

1. Cold-open catalog with many registered components: index/navigation loads without rendering every fixture.
2. Primitive Button: keyboard, focus-visible, disabled/unavailable reason and reduced-motion/theme matrix.
3. Ribbon group: roving focus, overflow, command availability change and small-screen projection.
4. Tab group: selected/focused distinction, expensive activation, close/recovery and keyboard navigation.
5. Window: dock/split/minimize/suspend/restore with dirty state.
6. Workspace switch: preserve layout identity where valid while requalifying Client/revision/environment/currentness.
7. Command: input -> confirmation -> pending -> ACK -> verification -> effective.
8. Bulk command: partial success + unknown subset + retry subset.
9. Offline draft: local checkpoint -> reconnect -> conflict/reconcile -> saved.
10. Permission revoke while a tool/dialog is open: no stale authorization inference.
11. Fatal subtree/window failure: recoverable draft/effect references survive.
12. Projection switch: list/table/graph/2D/3D preserve semantic identity and disclose aggregation.
13. Stress view: ~1000 semantic items use virtualization/aggregation without silent omission.
14. Accessibility without drag: arrange/dock/split and navigation remain operable by keyboard/control alternatives.
15. Evidence invalidation: material component-contract change turns prior proof into `STALE_EVIDENCE` until requalified.

## Proof obligations

PO-CAT-01 — Every cataloged artifact has stable semantic identity and classification independent of its rendered fixture.

PO-CAT-02 — Applicable state axes are explicit; exclusions carry reasons. `NOT_TESTED` cannot masquerade as `NOT_APPLICABLE`.

PO-CAT-03 — Material transitions expose intermediate states and cannot visually fabricate semantic completion.

PO-CAT-04 — Shared components do not become canonical business owners through reuse.

PO-CAT-05 — Focus, selection, active window and semantic selection remain independently testable.

PO-CAT-06 — Accessibility includes keyboard/focus and qualified manual/AT evidence in addition to automated checks.

PO-CAT-07 — Pointer/drag interactions have an accessible non-drag route where they are necessary for task completion.

PO-CAT-08 — Failure injection cannot silently discard dirty/recoverable work or convert `PENDING/UNKNOWN` into success/failure without evidence.

PO-CAT-09 — Performance degradation uses aggregation/virtualization/culling only with semantic counts, disclosure and drill-down; no silent omission.

PO-CAT-10 — Responsive/small-screen projection preserves semantic identity, state and currentness even when layout/window chrome changes radically.

PO-CAT-11 — `composedOf/usedBy` impact analysis can identify affected composites when a lower-level contract changes.

PO-CAT-12 — Conformance is a typed vector; partial/not-evaluated/stale evidence cannot render as universal pass.

PO-CAT-13 — Evidence is revision/profile bound and becomes stale after material contract/implementation/fixture changes.

PO-CAT-14 — A composed tool/application/window/desktop/workspace/system-view has its own integration proofs beyond the sum of child proofs.

PO-CAT-15 — Catalog fixtures never manufacture authority/currentness/effectiveness; they may simulate qualified evidence only when clearly labeled as fixture input.

## Deduplication

This round does not redefine:

- token/provider hypotheses from the Frontend Design System Foundation Plan;
- the state vocabulary from the UI Interaction State Matrix;
- Command Registry admission semantics;
- Window/Application lifecycle;
- workspace recovery;
- canvas projection semantics;
- canonical business authority.

It adds the missing **conformance/evidence grammar** that can exercise those contracts consistently.

## Maturity and saturation

Slice maturity: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

The catalog/playground contract is now materially defined, but research is not saturated. Remaining gaps include:

1. evidence invalidation/dependency propagation through `composedOf/usedBy` graphs;
2. exact pairwise/adversarial state-coverage generation strategy without combinatorial explosion;
3. browser/assistive-technology qualification matrix and support-floor policy;
4. empirical performance budgets for catalog cold-open, fixture switching and stress scenarios;
5. failure-boundary taxonomy for application/window/workspace/system-view compositions;
6. versioning policy for component contracts versus implementation variants.

No implementation planning is authorized while these gaps remain material.

## Next research vector

Highest-value next vector: **conformance evidence invalidation and dependency propagation**. Research how a primitive/component contract change propagates stale-proof status through `composedOf/usedBy`, how semantic versus visual-only changes differ, how impact is bounded without invalidating the entire catalog, and how higher-level integration proofs can be selectively requalified without treating dependency graphs as business authority.
