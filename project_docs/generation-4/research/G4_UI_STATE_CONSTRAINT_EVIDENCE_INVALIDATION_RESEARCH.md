# G4 — UI State Constraint Algebra & Evidence Invalidation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Maturity: `EMERGING / MATERIAL_DELTA`

## Purpose

Extend `G4_UI_INTERACTION_STATE_MATRIX_RESEARCH.md` and `G4_COMPONENTES_EXECUTABLE_SCENARIO_RESEARCH.md` with two missing contracts:

1. a small provider-neutral constraint algebra for determining whether a multidimensional UI state is valid, impossible, unsupported or requires runtime qualification;
2. evidence invalidation rules that prevent unrelated changes from forcing every Componentes scenario to rerun while also preventing stale evidence from appearing current.

This is research only. It does not authorize implementation, test tooling adoption, package changes or product work.

The frontend remains in the Next.js + React + TypeScript ecosystem. No WASM/UI-polyglot path is researched here.

## Evidence classes reviewed

Primary documentation reviewed in this round:

- Storybook tags/test configuration: one scenario corpus can be included/excluded by test purpose rather than every story being run identically for every proof class.
- Storybook Vitest integration: component, accessibility and visual checks are distinct test types; some are coupled to component execution while visual checks can run independently.
- Vitest Browser Mode: browser-native execution supports multiple browser instances/providers and real interaction; provider choice remains test infrastructure, not scenario semantics.
- Playwright visual comparisons: screenshot baselines are explicit artifacts and may be deliberately regenerated; visual evidence therefore has a distinct invalidation lifecycle from behavioral assertions.
- existing SB G4 research: UI/Canvas/test metadata remain projections/evidence rather than canonical business truth; `ACK != effect`; focus, selection, semantic state and operational state remain separate.

## Finding 1 — constraints operate over dimensions, not one universal enum

Candidate state vector:

```text
UIStateVector
  visualVariant
  interaction
  focus
  selection
  availabilityAuthority
  asyncExecution
  dataContent
  editingValidation
  visibilityLayout
  artifactLifecycle
  semanticOverlays[]
  operationalOverlays[]
```

A state is not valid merely because every individual value exists. Validity is evaluated by constraints over a component contract and scenario context.

Candidate constraint result:

```text
ConstraintDisposition =
  VALID
  INVALID_BY_CONTRACT
  UNSUPPORTED
  NOT_APPLICABLE
  REQUIRES_QUALIFICATION
```

`MATERIAL_SCENARIO` is intentionally not a validity disposition. It is a coverage decision over a valid or qualified state/transition.

This separates two questions:

```text
Can this state/transition exist?
!=
Must this state/transition have dedicated reproducible evidence?
```

## Finding 2 — a small constraint algebra is preferable to ad-hoc booleans

Candidate rule forms:

```text
REQUIRES(A, B)
FORBIDS(A, B)
IMPLIES(A, B)
EXACTLY_ONE(A...N)
AT_MOST_ONE(A...N)
ALLOWS_WHEN(A, predicate/context)
QUALIFY_WHEN(A, evidence/context requirement)
TRANSITION(from, event, to)
FORBID_TRANSITION(from, event, to)
```

Rules may reference typed dimensions and declared context, but should not become a general-purpose policy language.

Examples:

```text
REQUIRES(async=saving, editing in {dirty, autosaving})
FORBIDS(availability=permission-denied, authority=effective-action-authority)
IMPLIES(data=filtered-empty, filter=active)
QUALIFY_WHEN(async=cancelled, effectDisposition in {NO_EFFECT, UNKNOWN, PARTIAL})
FORBID_TRANSITION(async=pending, ACK, semanticOverlay=effective)
TRANSITION(editing=dirty, SAVE, async=saving)
```

The fourth example protects cancellation semantics: cancellation of local waiting does not prove an external effect did not happen.

The fifth protects `ACK != effect`.

## Finding 3 — constraints need provenance and scope

A constraint should declare why it exists and where it applies.

Candidate research shape:

```text
StateConstraint
  id
  ownerContract
  appliesToLevels[]
  dimensions[]
  rule
  rationale
  sourceRefs[]
  accessibilityImpact?
  authorityImpact?
  severity
  lifecycleStatus
  revision
```

Composition rule:

- higher-level components inherit applicable lower-level constraints;
- higher levels may add constraints;
- higher levels may narrow valid states when their contract requires it;
- higher levels must not silently redefine the meaning of inherited states such as `STALE`, `UNKNOWN`, `PENDING`, `READ_ONLY`, `BLOCKED` or `EFFECTIVE`.

If a composite genuinely needs different semantics, it needs a differently named state or an explicit qualified overlay rather than semantic shadowing.

## Finding 4 — transition constraints are first-class

Static state validity does not prove transition correctness.

Examples requiring dedicated transition constraints:

```text
idle -> pending -> success
idle -> pending -> failed -> retrying -> pending -> success
pristine -> dirty -> saving -> conflicted -> reconciling -> saved
pending -> cancelling -> cancelled + effect=UNKNOWN
loaded/current -> refreshing -> loaded/current
loaded/current -> refreshing -> stale/error  // old usable data retained when contract allows
```

A transition contract may constrain:

- activating event;
- guards/authority requirements;
- duplicate-effect suppression;
- focus behavior;
- accessible announcements;
- intermediate state observability;
- cancellation semantics;
- recovery path;
- effect verification/currentness requirements.

`Valid endpoints != valid transition`.

## Finding 5 — adversarial cases become constraint probes

The required adversarials map naturally into constraint violations or qualification requirements:

| Adversarial | Constraint/proof obligation |
| --- | --- |
| hover-only action | action must have keyboard/touch/discoverable alternate path |
| focus looks selected | focus and selection dimensions require non-conflated representation |
| duplicate effect during loading | repeated activation cannot mint duplicate effect unless contract explicitly allows it |
| optimistic success before verification | ACK/pending cannot imply EFFECTIVE |
| empty hides authorization problem | `empty-first-use`, `filtered-empty`, `no-access-empty` are distinct |
| stale looks current | stale/currentness must remain explicit and non-color-only |
| refresh erases dirty state | background refresh cannot overwrite local dirty state without reconciliation contract |
| dialog loses focus | close transition requires deterministic focus restoration/fallback |
| responsive hides action | alternate reachable action path required |
| drag-only | non-drag equivalent required where dragging is not essential |
| partial bulk failure shown success | aggregate outcome must preserve PARTIAL/failed/unknown constituents |
| revision changes during review | review becomes drifted/stale and requires requalification |
| disabled without reason | disabled presentation cannot be sole explanation when reason is material |
| skeleton leaks unauthorized structure | loading projection obeys DisclosureEnvelope |
| fatal workspace error destroys work | recoverable local work requires preservation/recovery contract |
| cross-workspace loses identity | ProjectionHandoff preserves canonical identity or reports why it cannot |
| reduced motion/dark changes meaning | semantic state survives representation profile changes |
| cancelled shown completed | cancelled remains separate from verified no-effect/effective outcome |

## Finding 6 — evidence is typed; invalidation must be typed too

Candidate evidence classes:

```text
STRUCTURAL
BEHAVIORAL
TRANSITION
ACCESSIBILITY_AUTOMATED
ACCESSIBILITY_MANUAL
VISUAL
RESPONSIVE
CROSS_BROWSER
PERFORMANCE
DEPENDENCY_COMPATIBILITY
```

A single PASS is insufficient. Evidence identity includes at least:

```text
componentRevision
scenarioRevision
constraintRevisionSet
dependencyClosure
semanticTokenContractRevision
visualTokenProfileRevision
browser/environment
viewport/theme/density/motion/input profiles
executedAt
```

Candidate evidence disposition:

```text
CURRENT
STALE
INVALIDATED
INCOMPLETE
NOT_RUN
NOT_APPLICABLE
FAIL
```

`STALE` means prior evidence still exists but its qualification no longer covers the current closure. `INVALIDATED` means a known change defeats a material assumption of that evidence. Neither is equivalent to FAIL.

## Finding 7 — invalidation follows impact dimensions, not file changes alone

Candidate change-impact classes:

```text
VISUAL_TOKEN_CHANGE
SEMANTIC_TOKEN_MEANING_CHANGE
DOM_STRUCTURE_CHANGE
FOCUS_MODEL_CHANGE
KEYBOARD_CONTRACT_CHANGE
ARIA_SEMANTICS_CHANGE
STATE_CONSTRAINT_CHANGE
TRANSITION_CHANGE
ASYNC_EFFECT_SEMANTICS_CHANGE
RESPONSIVE_LAYOUT_CHANGE
DEPENDENCY_PRIMITIVE_CHANGE
BROWSER_SUPPORT_CHANGE
TEXT_I18N_CHANGE
PERFORMANCE_PATH_CHANGE
```

Candidate invalidation matrix:

| Change | Visual | Behavioral/transition | Accessibility | Responsive | Cross-browser |
| --- | --- | --- | --- | --- | --- |
| raw visual token value only | invalidate | normally retain | requalify contrast-sensitive checks | normally retain | normally retain |
| semantic token meaning/remap | invalidate | qualify affected state representations | invalidate semantic/non-color/contrast evidence | qualify | qualify |
| focus model | qualify if focus visuals change | invalidate focus transitions | invalidate keyboard/focus evidence | qualify | qualify |
| ARIA role/name/state | usually retain | qualify | invalidate affected a11y evidence | retain | qualify |
| DOM/composition structure | invalidate affected snapshots | qualify/invalidate affected interactions | qualify/invalidate | qualify | qualify |
| async/effect semantics | retain unless representation changes | invalidate affected transitions | qualify announcements/focus | retain | retain/qualify |
| responsive breakpoint/layout | invalidate affected profiles | qualify reachable-action paths | qualify reflow/focus order | invalidate | qualify |
| primitive dependency upgrade | impact-analysis required | impact-analysis required | impact-analysis required | impact-analysis required | impact-analysis required |
| copy/i18n/RTL change | invalidate affected visual profiles | qualify text-dependent behavior | qualify names/reading order | invalidate long-string/RTL profiles | normally retain |

This is deliberately not a permanent CI policy. It is a research model for future evidence selection.

## Finding 8 — dependency closure needs semantic fingerprints

File-level dependency tracking alone is too coarse. Candidate evidence dependency fingerprints:

```text
BehaviorFingerprint
  relevant state constraints
  transition contracts
  event semantics

AccessibilityFingerprint
  roles/names/states
  focus model
  keyboard contract
  announcements

RepresentationFingerprint
  semantic token mapping
  layout/composition contract
  icon/text semantics

EnvironmentFingerprint
  browser/provider profile
  viewport/density/theme/motion/input
```

A visual-token adjustment should normally alter `RepresentationFingerprint` without changing `BehaviorFingerprint`. A focus-management change alters accessibility and behavioral fingerprints even if the screenshot remains identical.

This is the key mechanism for avoiding both extremes:

```text
rerun everything after every change
vs
trust stale green evidence after semantic changes
```

## Finding 9 — source/tool format remains non-canonical

Storybook tags demonstrate selective scenario/test inclusion; its Vitest integration distinguishes test classes. Vitest Browser Mode and Playwright provide browser execution/visual evidence. These are useful provider candidates, but the SB contract should remain:

```text
ComponentRecord
  -> StateConstraint[]
  -> ScenarioRecord[]
  -> EvidenceRequirement[]
  -> ScenarioEvidence[]
```

A future adapter may materialize those records as Storybook stories, Vitest browser tests, Playwright scenarios or another tool.

`Scenario semantics != test-runner format`.

## Componentes translation

Candidate permanent page additions:

```text
Componentes
  Catalog
  Gallery
  Playground
  State Matrix
    dimensions
    constraints
    invalid/qualified combinations
  Interaction Playback
    transition timeline
    focus/announcement/effect tracks
  Evidence
    evidence by proof class
    current/stale/invalidated/incomplete
    change impact / why rerun is required
  Composition Lineage
  UsedBy
```

A component maturity badge should not collapse proof classes. Candidate maturity remains staged:

```text
FUNCTIONALLY_DEFINED
-> STATE_DEFINED
-> COMPOSITION_VALIDATED
-> ACCESSIBILITY_VALIDATED
-> VISUALLY_REFINED
-> STABLE
```

but the UI should expose the underlying evidence dimensions and gaps.

## Performance boundary

The evidence model must scale without making Componentes itself render the full scenario/evidence universe. Use bounded queries, progressive disclosure and eventual virtualization where measured. Performance investigation remains ordered:

```text
algorithm/data structure
-> bounded rendering/virtualization
-> Web Worker/off-main-thread JS
-> SVG/Canvas/WebGL according to workload
-> isolated computational specialization only if measured and contract-bounded
```

No WASM/UI rewrite hypothesis is introduced.

## Candidate invariants

- `State validity != scenario coverage`.
- `Valid endpoints != valid transition`.
- `MATERIAL_SCENARIO != state validity disposition`.
- `Inherited state name != permission to redefine semantics`.
- `Evidence PASS != eternal component property`.
- `Evidence stale != test failed`.
- `Evidence invalidated != business/runtime failure`.
- `Visual change != behavioral invalidation by default`.
- `Behavior unchanged != visual evidence current`.
- `Screenshot unchanged != accessibility contract unchanged`.
- `axe PASS != accessibility proof`.
- `Test runner != scenario authority`.
- `File dependency != semantic dependency closure`.
- `Cancellation != verified no-effect`.
- `ACK != EFFECTIVE`.
- `Loading != completed`.

## Open gaps

1. qualify how evidence requirements propagate through `composedOf`/`usedBy` without rerunning every ancestor after a leaf change;
2. research semantic fingerprint granularity and false-positive/false-negative invalidation risk;
3. define manual-accessibility evidence aging/currentness and reviewer provenance without turning Componentes into a compliance authority;
4. test the constraint algebra against concrete primitives (`Button`, `Dialog`, `Input`, `Select`) and one complex module component;
5. research failure/recovery scenarios for workspace-level persisted state and revision drift;
6. determine which state/transition contracts are portable into generated systems and which are Builder-only.

## Saturation state

`MATERIAL_DELTA`.

The round changes the research model materially: state combinations are now governed by a small typed constraint vocabulary; scenario coverage is separated from validity; evidence is proof-class-specific; and invalidation follows semantic impact/fingerprints rather than source-file churn.
