# G4 Frontend Research Packet 01 — Primitive State Constraint Qualification

Status: `PLANNED / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Packet owner: G4 Frontend Design System & UI Foundation

## 1. Why this packet is next

The latest frontend research materially advanced the model from loose state lists to:

```text
ComponentRecord
  -> StateConstraint[]
  -> ScenarioRecord[]
  -> EvidenceRequirement[]
  -> ScenarioEvidence[]
```

It also introduced a small candidate constraint algebra and typed evidence invalidation. The highest-value unresolved gap is now empirical qualification of that model against concrete low-level components before promoting it into module/tool/workspace semantics.

This packet therefore deliberately remains at the lower composition layers.

```text
TOKEN
  -> PRIMITIVE
  -> COMPONENT
```

It does not jump to Canvas, Workflow Workspace, complete pages or generated-system composition.

## 2. Predecessor evidence

Required predecessor artifacts:

- `G4_FRONTEND_DESIGN_SYSTEM_FOUNDATION_PLAN.md`
- `G4_UI_INTERACTION_STATE_MATRIX_RESEARCH.md`
- `G4_COMPONENTES_EXECUTABLE_SCENARIO_RESEARCH.md`
- `G4_UI_STATE_CONSTRAINT_EVIDENCE_INVALIDATION_RESEARCH.md`
- `G4_PRODUCT_UX_AI_NATIVE_BUILDER.md`

Material predecessor findings to preserve:

- `Visual variant != interaction state != semantic state != operational state`.
- `Focused != selected != active != checked`.
- `ACK != EFFECTIVE`; `Loading != completed`; cancellation does not prove no effect.
- state validity is distinct from scenario coverage;
- valid endpoints do not imply a valid transition;
- higher-level composition inherits lower-level semantics and may narrow them only explicitly;
- scenario semantics remain provider-neutral and are not owned by Storybook/Vitest/Playwright;
- evidence is proof-class-, revision-, dependency- and environment-qualified;
- visual, behavioral, accessibility and responsive invalidation are distinct;
- `Componentes` is a projection over component/scenario/evidence inventories, not canonical business truth.

## 3. Objective

Test whether the candidate multidimensional state model, constraint vocabulary, scenario model and evidence classes are sufficient and non-contradictory for four representative primitives:

```text
Button
Input
Dialog
Select / Combobox family
```

The packet must discover where the generic algebra is too weak, too broad or semantically ambiguous before it is inherited by patterns and workspaces.

## 4. In scope

### 4.1 Shared primitive contract shape

For each primitive, qualify:

```text
purpose
inputs
outputs/events
visual variants
interaction states
focus states
selection/value states when applicable
availability/authority states
async states when applicable
data/content states when applicable
validation/editing states when applicable
visibility/overlay states when applicable
valid state constraints
invalid state constraints
qualified combinations
transitions
guards
failure/recovery
focus behavior
keyboard behavior
screen-reader semantics/announcements
responsive/touch behavior
reduced-motion behavior
composition dependencies
Componentes scenarios
evidence requirements
```

### 4.2 Constraint algebra

Exercise at least:

```text
REQUIRES
FORBIDS
IMPLIES
EXACTLY_ONE / AT_MOST_ONE where justified
ALLOWS_WHEN
QUALIFY_WHEN
TRANSITION
FORBID_TRANSITION
```

Do not add a new rule form unless a concrete primitive demonstrates that the existing vocabulary cannot express a material contract without distortion.

### 4.3 Evidence impact

For each primitive, classify which changes should invalidate or merely requalify:

```text
behavioral evidence
transition evidence
accessibility evidence
visual evidence
responsive evidence
cross-browser evidence
```

The goal is to test semantic fingerprints against real primitive contracts, not define permanent CI policy.

## 5. Out of scope

- product code or Next.js implementation;
- package installation or provider adoption;
- choosing one permanent primitive library globally;
- visual brand refinement;
- WorkflowCanvas, Data Modeler, topology or complete workspace design;
- module-specific business semantics;
- implementation WBS, Work Packages, Sprints or TASKs;
- generated runtime implementation;
- exhaustive browser matrix or performance benchmark execution.

## 6. Mandatory primary evidence / benchmarks

Construction A must prioritize primary documentation for the exact primitive behavior being studied:

- WAI-ARIA Authoring Practices Guide patterns relevant to button, dialog, combobox/select and text-entry behavior;
- WCAG 2.2 criteria relevant to keyboard, focus visibility/obscuring, target sizing, dragging alternatives where applicable and status/error communication;
- React Aria component interaction/accessibility documentation;
- Radix UI primitive documentation;
- Base UI primitive documentation;
- shadcn current component composition/source patterns where relevant;
- Storybook scenario/interaction documentation and browser-test model only as evidence-provider candidates, not scenario authority.

Mature React design systems may be used to identify divergent interaction choices, but the packet must distinguish normative accessibility requirements from library conventions.

## 7. Primitive-specific research questions

### 7.1 Button

- What exactly distinguishes disabled, read-only/not-applicable, permission-blocked and pending?
- During pending/loading, is focus retained and repeated activation suppressed?
- When does an async button expose progress vs only pending state?
- How is destructive intent represented without conflating destructive variant with failure state?
- What announcement is needed for progress/result, and which result is only request ACK vs effective outcome?
- What happens if cancellation occurs after an external effect may already have started?

### 7.2 Input

- Which dimensions distinguish empty/filled, pristine/dirty, valid/invalid/warning, validating and external-update/conflict?
- Can read-only content still receive focus/select/copy, and how does that differ from disabled?
- How are validation messages associated and announced without stealing focus?
- How should background refresh behave while local input is dirty?
- Which constraints prevent `read-only + dirty` from silently becoming an ordinary editable state?

### 7.3 Dialog

- What are the exact open/close/focus-entry/focus-containment/focus-restoration contracts?
- What if the invoker disappears or becomes unauthorized while the dialog is open?
- How are pending destructive actions represented if close is requested?
- Which escape/close paths are valid for modal vs alert/destructive confirmation semantics?
- What state is preserved if content errors or async work fails?

### 7.4 Select / Combobox family

- Which behaviors belong to select vs editable combobox rather than being collapsed into one abstraction?
- How do open/closed, focus, highlighted option, selected value and typed query remain distinct?
- How are loading-options, no-results, filtered-empty, permission-filtered and error represented?
- How does keyboard navigation behave with disabled/unavailable options?
- What happens when the selected value becomes stale, unauthorized, removed or externally changed?

## 8. Mandatory state and transition probes

At minimum, Construction A must attempt to express and classify these scenarios.

### Button

```text
idle -> hover -> focus-visible -> pressed -> idle
idle -> pending -> ACK -> verification-pending -> effective
idle -> pending -> failed -> retrying -> pending
pending -> cancelling -> cancelled + effect=UNKNOWN
permission-blocked -> explanation path
```

### Input

```text
pristine -> focus -> dirty -> validating -> valid
pristine -> dirty -> validating -> invalid -> correction -> valid
dirty -> background external update -> conflicted/requalification
read-only -> focus/select/copy without edit
```

### Dialog

```text
closed -> open -> initial-focus
open -> internal navigation -> close -> focus-restored
open -> pending destructive action -> failure -> recoverable open state
open -> invoker removed -> close -> qualified fallback focus
```

### Select / Combobox

```text
closed -> open -> option navigation -> selection -> closed
closed -> open -> query -> loading-options -> results
query -> no-results
selected -> external option removal -> stale/conflicted qualification
open -> permission/currentness change -> requalification
```

Construction A must mark each as `VALID`, `INVALID_BY_CONTRACT`, `UNSUPPORTED`, `NOT_APPLICABLE` or `REQUIRES_QUALIFICATION` where that disposition is meaningful, and separately decide whether it is a `MATERIAL_SCENARIO` for evidence.

## 9. Failure / recovery requirements

The packet must explicitly cover:

- duplicate activation during pending;
- validation failure without focus loss;
- async failure while preserving recoverable user input;
- cancellation with unknown external effect disposition;
- dialog close when original focus target is gone;
- stale/removed combobox selection;
- permission/currentness change while an overlay is open;
- network/provider failure during option loading;
- external update racing with local dirty state.

No failure state may silently collapse to ordinary `disabled`, `empty` or `success`.

## 10. Accessibility obligations

Construction A must produce explicit candidate contracts for:

- keyboard operation;
- focus-visible and focus restoration;
- accessible names/descriptions;
- state/property announcements;
- validation/error association;
- status/progress announcements without unnecessary focus movement;
- touch/pointer reachability;
- non-color state redundancy;
- reduced-motion equivalence;
- zoom/reflow implications where material;
- distinction between automation evidence and manual accessibility review.

`axe PASS != accessibility proof` remains binding.

## 11. Performance boundary

No optimization technology is selected by this packet. Construction A should only record primitive-level performance assumptions that can affect composition, for example:

- controlled vs uncontrolled state update frequency;
- overlay mounting/lifecycle assumptions;
- option-list size thresholds requiring later bounded rendering/virtualization research;
- scenario/evidence catalog rendering must use progressive disclosure rather than eagerly materializing every state combination.

No WASM path is in scope.

## 12. Composition and lineage

Expected minimum lineage candidates:

```text
Button
  usedBy -> Dialog actions, Form actions, Toolbar actions, Workflow controls

Input
  usedBy -> FormField, SearchBox, Filter controls, EntityForm

Dialog
  composedOf -> overlay/focus-management/action primitives
  usedBy -> confirmation, editor, review/authorization flows

Select/Combobox
  composedOf -> trigger/input, popup/listbox, option, status/empty/loading patterns
  usedBy -> FormField, filters, provider/capability pickers, authority-aware selectors
```

Construction A must distinguish structural dependency from semantic `usedBy` lineage.

## 13. Componentes impact

Each primitive must yield a candidate `ComponentRecord` and bounded `ScenarioRecord` set suitable for:

```text
Componentes
  Overview
  Variants
  State Matrix
    dimensions
    constraints
    invalid/qualified combinations
  Interaction Playback
    transition timeline
    focus track
    announcement track
    effect/currentness track when applicable
  Accessibility
  Responsive / input modes
  Evidence
  Composition Lineage
  UsedBy
```

Do not generate Cartesian scenario explosion. Prefer material scenarios selected by risk, semantic distinction and composition reuse.

## 14. Adversarial probes

Construction A must actively try to falsify the model with at least:

1. focused button visually indistinguishable from selected/toggled state;
2. pending button permits duplicate external effect;
3. destructive button color is interpreted as current error state;
4. disabled control provides no discoverable reason for material unavailability;
5. read-only input is treated as disabled and becomes unreachable/unselectable without justification;
6. validation error steals focus or is not announced;
7. background refresh overwrites dirty input;
8. dialog closes and loses focus because invoker disappeared;
9. modal traps focus incorrectly or permits background interaction;
10. combobox loading is rendered as no-results;
11. permission-filtered options are represented as ordinary empty results when that distinction is material;
12. stale selected value silently becomes a new value;
13. reduced motion removes state meaning;
14. visual-token change unnecessarily invalidates behavioral evidence;
15. focus/ARIA change incorrectly leaves accessibility evidence current.

## 15. Construction A expected output

Construction A should update existing frontend research artifacts or create one dense dedicated qualification artifact if needed. Expected content:

- four primitive contract profiles;
- state-dimension map per primitive;
- constraint rules with provenance/rationale;
- transition tables;
- invalid/qualified combinations;
- failure/recovery semantics;
- accessibility behavior;
- ComponentRecord/ScenarioRecord examples;
- evidence requirement and invalidation examples;
- unresolved divergences among primary libraries;
- explicit finding whether the candidate algebra survives, needs bounded extension or is over-specified.

Construction A must not select a permanent library or write code.

## 16. Construction B expected output

Construction B should consume the qualified primitive contracts and test composition into a deliberately small set of higher structures:

```text
FormField / FormSection
Search + Filter pattern
Confirmation / destructive-action flow
Inspector property editor
```

Construction B must verify:

- inherited state semantics are preserved;
- focus/selection/authority distinctions survive composition;
- async and validation states compose without one generic `status`;
- `composedOf` / `usedBy` lineage remains inspectable;
- evidence invalidation can propagate through dependency closure without automatically rerunning every ancestor;
- Componentes can represent both primitive and composed scenarios;
- no complete workspace semantics are invented prematurely.

Construction B may identify candidate implications for later EntityForm/Tool/Workspace research, but must not promote them into settled contracts in this packet.

## 17. Proof obligations

The packet closes only if evidence supports all of the following or records a bounded unresolved gap:

1. The state-vector model can represent all four primitives without collapsing materially different meanings.
2. The candidate constraint vocabulary expresses material valid/invalid/qualified combinations without becoming a general policy language.
3. Focus, selection/value, activation, availability/authority and async outcome remain independently representable.
4. `ACK != EFFECTIVE` survives Button composition.
5. Read-only and disabled remain semantically distinct where applicable.
6. Dialog focus entry/containment/restoration is representable as transition behavior rather than styling.
7. Select/Combobox can distinguish loading, no-results, permission-filtered, stale selection and error where material.
8. Failure/recovery preserves recoverable user state where feasible.
9. Accessibility obligations are explicit and not reduced to automated checks.
10. Componentes can reproduce material primitive scenarios without Cartesian explosion.
11. Evidence requirements can be typed by proof class and qualified by revision/environment.
12. A visual-only change need not invalidate behavior by default, while focus/ARIA/state-contract changes do invalidate or requalify relevant evidence.
13. Composition into the bounded Construction B patterns does not silently redefine primitive semantics.
14. No implementation/provider decision is smuggled into the research contract.

## 18. Closure criteria

Documentation may close this packet when:

- Construction A has qualified all four primitive profiles against primary evidence;
- Construction B has tested the four bounded compositions;
- every adversarial has a disposition or explicit unresolved gap;
- constraint-algebra changes, if any, are reconciled into the canonical frontend research artifact;
- Componentes metadata/scenario implications are reconciled;
- evidence invalidation implications are reconciled;
- no contradictory state names remain across the touched artifacts;
- unresolved items are small enough to become explicit successor packet candidates rather than hidden ambiguity.

Candidate successor packets, only after closure:

```text
A. Form / Search / Filter / Table / Tree interaction patterns
B. Overlay / command / navigation / toolbar focus architecture
C. workspace persisted-state + revision-drift recovery
D. generated-runtime portable interaction-contract closure
```

Successor selection remains Planning work; this packet does not authorize it.
