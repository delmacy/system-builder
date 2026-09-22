# G4 — Proprietary Editor Shared Foundation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

This artifact studies the proprietary applications/editors that do not have a ready one-to-one product analogue: Workflow Designer, Component Editor / Componentes, View/Page Builder, Form Builder, Rules/Decision Editor, System/Module Designer, Elicitation/Requirements, Preview/Sandbox and Revision/Diff.

Current shell hypothesis is preserved:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D is an optional future projection/application, not a mandatory shell. This research does not select providers or authorize implementation.

## Evidence reviewed

- Camunda 8 user-task/form documentation: a user task may reference a form but is not identical to it; task input/output mappings reshape process variables; linked forms support independent version binding (`latest`, `deployment`, `versionTag`).
- Camunda form-linking guidance: linked forms are recommended over embedding because independent lifecycle/versioning is easier to maintain; the workflow element carries a reference rather than absorbing form ownership.
- Storybook Controls/stories: component inputs can be manipulated independently and stories represent discrete component states in an isolated preview, supporting an executable state-lab concept without making preview canonical runtime truth.
- Mature editor patterns already captured in sibling G4 research: command registry, selection/focus separation, query-scoped selection, inspector/outliner, operation registry, projection handoff, autosave/conflict/reconciliation and accessibility peers.

These are pattern evidence, not adoption decisions.

## F1 — The proprietary apps need a Shared Editor Foundation, not a shared domain model

The reusable layer should own editor mechanics while each application owns its semantics.

```text
SharedEditorFoundation
  EditorDocumentSession
  CanonicalSelection
  FocusRoute
  OutlinerProjection
  InspectorHost
  WorkSurfaceHost
  CommandRegistryProjection
  OperationRegistryProjection
  UndoRedoCoordinator
  DirtyAutosaveConflictCoordinator
  RevisionHistoryProjection
  DiffProjectionHost
  ValidationFindingsSurface
  BindingBrowserHost
  ExpressionEditorHost
  PreviewHost
  EvidencePanelHost
  KeyboardDragAlternative
```

It must not own WorkflowActivity, View, Form, Component, DomainCommand, Permission or DomainState semantics.

Invariant: `shared editor mechanics != shared business ownership`.

## F2 — Every editor session needs a document/revision basis

Candidate:

```text
EditorDocumentSession
  documentIdentity
  documentKind
  baseRevision
  currentness
  localDraftRevision
  dirtyState
  saveState
  conflictState
  authorityContext
  disclosureContext
  environmentContext?
  selectionContext
  focusRoute
  operationRefs[]
```

This is reusable across Workflow, View, Form, Component, Rules, Module, Requirements and Revision/Diff. A view switch must not silently replace the revision basis.

State candidates:

`CLEAN | DIRTY | SAVING | SAVE_FAILED | EXTERNAL_CHANGE_DETECTED | CONFLICTED | RECONCILING | READ_ONLY | PERMISSION_DENIED | STALE`.

## F3 — Undo/redo is editor-intent history, not authoritative business rollback

Undo/redo should operate on reversible editor mutations inside a bounded draft/revision session. It cannot imply reversal of published/runtime/domain effects.

Candidate command metadata:

```text
EditorMutation
  mutationId
  semanticIntent
  targetIdentity
  baseRevision
  inverseStrategy
  merge/coalesce policy
  validationImpact
  externalEffect = NONE | REQUIRES_SEPARATE_OPERATION
```

`Undo edit != rollback publish != compensate business effect`.

## F4 — Selection/Outliner/Inspector form one reusable triad

Across graph, page, form, component and module editors:

- WorkSurface projects the selected object;
- Outliner projects structural/semantic containment or ordering appropriate to that editor;
- Inspector projects qualified properties/actions for the same canonical identity.

The Outliner must not invent containment where the domain has only references/relations. The Inspector cannot maintain a shadow semantic model.

## F5 — Binding Browser is a shared infrastructure component with typed adapters

Bindings recur across View, Form, Component, Workflow and Rules but their source/target contracts differ.

```text
BindingCandidate
  sourceIdentity
  sourceKind
  sourceRevision/currentness
  value/schema contract
  targetRequirement
  compatibility
  conversionCandidate?
  authority/disclosure qualification
  evidence
```

Compatibility filtering should make valid composition easier than invalid composition. Missing binding, stale binding, schema mismatch, permission mismatch and unknown compatibility remain distinct findings.

## F6 — Expression/Rule Editor can share syntax infrastructure without collapsing rule ownership

Reusable infrastructure may include parsing surface, completion, type/schema hints, diagnostics, references, test fixtures and evaluation preview. Domain-specific adapters define permitted functions, facts, authority and effect semantics.

`Expression parses != rule valid`; `rule evaluates in preview != authorized/effective business decision`.

## F7 — Validation needs layered findings

Candidate layers:

```text
STRUCTURAL
TYPE_SCHEMA
BINDING
REACHABILITY
PERMISSION_AUTHORITY
CURRENTNESS
WORKFLOW_CONFORMANCE
ACCESSIBILITY
RESPONSIVE
RUNTIME_PREVIEW
PUBLISH_READINESS
```

A finding has severity, target identity, revision basis, evidence, remediation candidate and whether it blocks a particular operation. `BLOCKED != DISABLED`: a command may remain discoverable while explaining why execution is blocked.

## F8 — Workflow Designer owns activity/control-flow semantics; forms/views are references

A workflow activity may require human interaction and bind a Form/View/Application, but:

`View != Workflow Activity`
`Form != Workflow State`

Camunda provides strong pattern evidence: user tasks have assignments, variable mappings and a form reference; forms may be independently version-bound. Therefore SB should research a typed binding such as:

```text
HumanInteractionBinding
  activityRef
  interactionResourceRef
  resourceKind = FORM | VIEW | APPLICATION_ROUTE
  bindingPolicy
  inputMapping
  outputMapping
  completionContract
  permissionRequirements
```

The workflow remains owner of activity lifecycle; the form/view remains owner of presentation/input composition.

## F9 — View/Page Builder owns composition/layout; actions are references

A Button or component event should bind to a Command/Action candidate, never become the command itself.

```text
InteractionBinding
  componentEventRef
  actionRef
  argumentMapping
  eligibilityProjection
  authorityRequirement
  confirmationPolicy
  async/effect projection
```

`Button != Domain Command` and `Component event != authorized action`.

A control without an authorized command is a validation finding, not permission to fabricate one.

## F10 — Form Builder owns capture/validation composition, not workflow/domain state

Form fields bind to typed data requirements. Form-local validation may reject malformed input, while business validation/authority remains external.

Schema evolution must produce impact findings:

`schema changed -> binding requalification -> broken/convertible/compatible/unknown`.

A workflow state cannot be inferred from whether a form happens to be visible or valid.

## F11 — Component Editor / Componentes needs two coupled but distinct modes

1. **Definition editor**: variants, interaction states, slots/props, responsive rules, accessibility, events, bindings and permission-aware presentation.
2. **State lab / evidence catalog**: discrete scenarios, fixtures, interaction tests, accessibility checks, visual evidence and usage references.

Storybook is useful evidence for isolated states and controllable inputs, but SB's Componentes must additionally model semantic states such as `STALE`, `READ_ONLY`, `BLOCKED`, `PERMISSION_DENIED`, `PENDING`, `EFFECTIVE` only where applicable and must record impossible combinations.

Candidate ComponentDefinition facets:

```text
visual variants
interaction states
semantic states
async states
data bindings
validation
permissions/disclosure
events/action bindings
workflow bindings
visibility rules
responsive/density rules
accessibility contract
evidence/test refs
composedOf / usedBy
```

## F12 — Rules/Decision Editor should separate decision definition, invocation and effect

The editor may provide tables/graphs/expressions and simulation fixtures, but a decision result is not automatically an authorized action or effective state change.

`Decision result != command authorization != effect`.

Cross-app bindings must show which workflow/activity/action consumes the decision and at which revision/binding policy.

## F13 — System/Module Designer is an integration editor, not owner of child artifacts

It composes module identity, capabilities/services, ports/contracts, dependencies, providers/bindings, adapters/extensions, configuration/data/workflow/security/runtime/observability/evidence references. Opening a child artifact delegates to its specialized editor while preserving object/revision/environment context.

The module editor may surface impact/findings across children but must not clone child identity into module-local copies.

## F14 — Elicitation/Requirements needs traceability rather than direct code ownership

Candidate trace chain:

```text
Requirement / constraint / acceptance criterion
  -> proposed semantic artifact(s)
  -> decision/rationale
  -> validation/proof obligation
  -> implementation/published evidence later
```

Requirements can propose or constrain Workflow/View/Form/Component/Command relationships but cannot silently mutate authoritative artifacts. AI suggestions remain proposals with provenance.

## F15 — Preview/Sandbox is an interpreter/projection with declared equivalence scope

Preview should consume a declared revision bundle and sandbox adapters/fixtures. It must report which behaviors are previewable, simulated, unavailable or substituted.

```text
PreviewSession
  revisionBundle
  environment/sandbox profile
  fixture/data profile
  authority simulation policy
  provider substitution map
  unsupportedBehaviors[]
  evidenceRefs[]
```

`Preview != effective runtime`.

Mismatch between PreviewBehavior and compiled/runtime behavior is a first-class finding, not something hidden by visual similarity.

## F16 — Revision/Diff must be semantic-aware and cross-artifact

Text/JSON diff is insufficient for editor artifacts. Candidate semantic diff classes:

```text
STRUCTURE
BINDING
STATE_MACHINE
PERMISSION_AUTHORITY
SCHEMA
COMMAND_ACTION
WORKFLOW_REACHABILITY
RESPONSIVE_ACCESSIBILITY
EVIDENCE_PROOF
```

A cross-artifact change impact graph is required for cases such as schema change -> form binding break -> workflow human-task risk -> preview mismatch.

`Text diff != semantic diff`; `same rendering != same semantics`.

## F17 — Semantic Bridge should use references/contracts, not merged ownership

Research bridge:

```text
Workflow Activity
  --HumanInteractionBinding--> Form/View
Form/View Component Event
  --InteractionBinding--> Command/Action
Command/Action
  --AuthorityQualification--> Permission/Policy
Command/Action
  --Precondition/EffectContract--> Domain State
Occurrence/Effect
  --EvidenceReference--> Evidence
```

Each edge is independently versioned/qualified. The bridge allows navigation and impact analysis without turning the chain into one mega-document.

## F18 — Composition validity should be proactive

Guided/opinionated composition should provide:

- compatibility-filtered candidate pickers;
- prerequisites before insertion/binding;
- typed port/binding affordances;
- missing-binding detection;
- orphan component/state detection;
- unreachable workflow-state/activity detection;
- required-input diagnostics;
- permission/authority mismatch diagnostics;
- currentness/schema mismatch diagnostics;
- preview coverage/mismatch diagnostics.

Drag/drop remains a convenience projection. Keyboard/picker flows must expose the same compatibility qualification. A visually accepted drop is never semantic proof.

## F19 — Cross-editor command registry needs stable intent, editor-specific eligibility

Commands such as Save, Undo, Redo, Validate, Preview, Compare, Open Referenced Artifact, Inspect Evidence and Publish Candidate can share stable identities/presentation conventions. Their eligibility and effect remain editor/document specific.

The Desktop/Application shell projects commands from the focused Window/View but `Focused Window != selected semantic object` and command visibility never grants authority.

## F20 — Proprietary editors share failure/recovery requirements

Minimum recovery envelope:

```text
RecoverableEditorState
  document identity + base revision
  local draft mutations/snapshot
  dirty/conflict state
  selection
  focus return anchor
  open panels/view
  operation refs
  unresolved findings
```

Fatal renderer/editor failure should permit reopening in an alternate representation where possible. Offline edits require local draft lineage and requalification on reconnect; they cannot assume old permissions/currentness remain valid.

## Editor-specific findings matrix

| Editor | Owns | Reuses heavily | Highest-risk semantic boundary |
|---|---|---|---|
| Workflow Designer | activities, transitions, workflow semantics | graph surface, inspector, bindings, validation, revision/diff | form/view reference must not become activity/state ownership |
| Component Editor / Componentes | component definition + state/evidence catalog | inspector, state matrix, preview, validation | visual/interaction state vs domain/authority state |
| View/Page Builder | layout/composition/navigation projection | canvas/outliner, bindings, command registry, responsive tools | UI event vs authorized command |
| Form Builder | capture composition + local validation | component palette, schema bindings, preview | form validity/state vs business state |
| Rules/Decision Editor | decision/rule definition | expression editor, tables/graphs, fixtures, diff | evaluation result vs authorized effect |
| System/Module Designer | integration/reference composition | outliner, graph, inspector, bindings, impact | child artifact reference vs cloned ownership |
| Elicitation/Requirements | requirements, rationale, traceability | editor session, evidence, diff, linking | proposal/trace vs authoritative mutation |
| Preview/Sandbox | bounded behavior projection | preview host, fixtures, evidence, operation registry | simulated behavior vs effective runtime |
| Revision/Diff | comparison/impact projection | history, semantic adapters, evidence | textual/rendering equality vs semantic equality |

## Shared primitive -> infrastructure -> app -> integration decomposition

### P0 — Shared primitives — LOW/MEDIUM

Selection/focus, tree/outliner row, inspector field/group, command presentation, finding marker, revision badge, binding candidate, evidence reference, keyboard reorder/move, diff marker, state chip.

### P1 — Editor infrastructure — MEDIUM/HIGH

EditorDocumentSession, WorkSurfaceHost, OutlinerProjection, InspectorHost, CommandRegistryProjection, UndoRedoCoordinator, Autosave/Conflict/Reconcile, BindingBrowser, ExpressionEditorHost, ValidationFindings, RevisionHistory, DiffProjection, PreviewHost, EvidencePanel.

### P2 — Proprietary app semantics — HIGH/VERY HIGH

Workflow graph semantics, Component state/variant model, Page/View composition grammar, Form/schema grammar, Rule/Decision semantics, Module integration model, Requirement trace model, Preview interpreter, semantic diff adapters.

### P3 — Cross-app semantic integration — VERY HIGH/EXTREME

Typed versioned bindings across Workflow <-> View/Form <-> Component <-> Command/Action <-> Permission <-> Domain State <-> Evidence; impact propagation; cross-editor currentness/conflict; publish/revision bundle qualification; preview equivalence evidence.

Complexity hotspot: P3 should not be hidden inside generic UI components. It is where independent ownership, revisioning, authority and effect semantics meet.

## Mandatory adversarial scenarios / proof obligations

1. Workflow activity requires a form; form revision changes after workflow review -> binding policy determines whether new instances use latest/pinned version; no silent mutation of historical occurrence.
2. Domain command exists with no UI binding -> remains valid command; UI reports unbound discoverability finding only if policy requires presentation.
3. UI Button exists with action binding but current actor lacks authority -> button presentation reflects qualification; event cannot bypass authorization.
4. Schema field removed/changed -> Form binding becomes broken/convertible/unknown; workflow state is not inferred from rendering success.
5. Permission changes while View is open -> currentness/authority requalification; dirty draft is preserved but effect execution may become blocked.
6. Two editors modify same artifact revision -> external-change detected; reconcile/compare rather than last-writer visual overwrite.
7. Offline draft reconnects -> base revision, authority and bindings requalified before save/publish.
8. Preview passes but provider/runtime behavior differs -> mismatch finding/evidence; Preview cannot mark production EFFECTIVE.
9. Drag relation rejected semantically -> equivalent keyboard/picker path exposes compatibility reasons.
10. Component has LOADING/EMPTY/ERROR variants but domain command is BLOCKED -> component state and command eligibility remain separate dimensions.
11. Rule evaluates true but command permission denied -> no effect occurs.
12. Form is valid but workflow completion prerequisites are unmet -> form validity does not advance workflow.
13. View is deleted while workflow references it -> unresolved reference finding; workflow activity is not silently deleted.
14. Revision diff shows identical visual output but permission binding changed -> semantic diff must expose authority change.
15. Preview resource uses latest binding while reviewed workflow expected deployment-pinned resource -> currentness/binding mismatch must be visible.

## Componentes impact

`Componentes` should catalog both reusable editor infrastructure and domain components. New metadata candidates:

```text
editorRoles[]
documentKinds[]
semanticOwner
bindingKinds[]
revisionBehavior
undoability
previewability
validationLayers[]
stateDimensions[]
impossibleStateCombinations[]
keyboardEquivalent
responsive/density behavior
evidence/test refs
crossAppUsedBy[]
```

Componentes itself becomes both a proprietary Component Editor and the executable evidence/state catalog; these roles should remain explicit rather than conflated.

## Maturity / saturation

`PROPRIETARY_EDITOR_SHARED_FOUNDATION = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence direction:

- shared editor infrastructure is justified;
- domain ownership remains in specialized applications;
- typed/versioned references are preferable to embedding/copying across editors;
- revision/currentness/authority must travel through bindings;
- preview and semantic diff are cross-cutting infrastructure, not late polish;
- Componentes needs definition-editor and state/evidence-lab roles.

Remaining material gaps:

1. exact semantic contract for publish bundles spanning independently versioned Workflow/View/Form/Component/Rule artifacts;
2. cross-artifact undo boundaries and whether multi-document edits require transactional draft groups or compensating editor mutations;
3. semantic impact graph incremental recomputation and stale-finding invalidation;
4. expression language capability/security sandboxing and explainability;
5. preview equivalence taxonomy and evidence thresholds;
6. detailed Revision/Diff UX for large dependency cuts;
7. empirical keyboard/drag parity studies for graph/page/form composition;
8. shared editor performance budgets for very large outliners/graphs and diff sets.

Next research vector: **publish-bundle qualification + cross-artifact revision pinning + multi-document draft/undo semantics**, because this is the point where the shared editor foundation meets autonomous artifact lifecycles and can otherwise accidentally create a hidden mega-document.