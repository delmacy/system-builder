# G4 Frontend Packet 02 — Composition Evidence Qualification

Status: `PLANNING_PACKET / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Objective

Qualify the latest `G4_UI_COMPOSITION_EVIDENCE_PROPAGATION_RESEARCH.md` findings against the first bounded composition step above primitives. The packet tests whether lower-level guarantees can be imported, owned/masked, invalidated and requalified through concrete COMPONENT and PATTERN/BLOCK compositions without jumping to Tool, Workspace, Complete Task Page or System View.

Priority remains:

`FUNCTION -> STATE -> TRANSITION -> COMPOSITION -> CONSISTENCY -> REPRESENTATION -> ACCESSIBILITY -> PERFORMANCE -> VISUAL REFINEMENT`.

Frontend remains `Next.js + React + TypeScript`; WASM is not a UI path. This packet authorizes research/construction documentation only, not product implementation or provider selection.

## Predecessor evidence

Required predecessor findings:

1. `G4_UI_INTERACTION_STATE_MATRIX_RESEARCH.md`: `visual variant != interaction state != semantic state != operational state`; focus and selection are independent; authority, async, content, editing, expansion and lifecycle states are separate dimensions.
2. `G4_FRONTEND_DESIGN_SYSTEM_FOUNDATION_PLAN.md`: explicit composition ladder and `Componentes` inventory; higher layers compose lower layers and lower layers do not import higher-level business ownership.
3. `G4_UI_COMPOSITION_EVIDENCE_PROPAGATION_RESEARCH.md`: evidence propagation follows claims/fingerprints rather than import edges; `Child PASS != parent composition PASS`; composition boundaries may import, own/mask or add guarantees; propagation dispositions include `UNAFFECTED`, `REQUALIFY_REQUIRED`, `STALE`, `INVALIDATED`, `INCOMPLETE`.
4. Latest :40 material delta: concrete qualification is now the highest-value unresolved gap before promoting research toward tools/workspaces.

If Construction A discovers that the primitive contracts needed below are materially undefined, it must stop promotion and record the missing primitive evidence rather than inventing a higher-level contract.

## Bounded slice

Composition levels in scope:

`PRIMITIVE -> COMPONENT -> PATTERN/BLOCK`.

Concrete artifacts:

- `FormField` — composed from Label + Input/control + InlineMessage/description.
- `FormSection` — composed from FormField + structural primitives.
- `SearchFilterBar` — Search/Input + filter controls + clear/reset + result-state summary.
- `ConfirmActionFlow` — Button/trigger + Dialog/AlertDialog + async action feedback.
- `InspectorPropertyEditor` — label/value/editor + read-only/authority/currentness/error representation.

These artifacts are selected because they exercise focus, validation, authority, async effects, typed emptiness, composition lineage and evidence propagation while remaining below module/tool/workspace scope.

## Non-goals

Explicitly out of scope:

- Living Canvas, graph/workflow/topology editors;
- Office-style Ribbon implementation or shell implementation;
- module-specific screens;
- complete task pages or system views;
- business/domain authority ownership;
- canonical workflow semantics;
- provider choice or package installation;
- shadcn/Radix/Base UI/React Aria binding decisions;
- production code, apps/packages/package.json, migrations;
- G2/G3, executive WBS, Work Packages, Sprints or TASKs;
- visual branding polish.

## Research questions

1. Which primitive guarantees does each composite explicitly import?
2. Which guarantees may a composite legitimately own/mask, and what evidence proves insulation?
3. Which semantics are added only by composition and therefore require parent-level proof?
4. How do focus, selection, authority, async, validation and content states combine without collapsing into one `status`?
5. When does a child change make parent evidence `REQUALIFY_REQUIRED` versus `STALE` or `INVALIDATED`?
6. Can a visual-only/token change avoid invalidating behavioral claims while still requalifying representation/a11y claims where needed?
7. How are mixed async outcomes represented without treating ACK as effect?
8. How does a read-only property editor remain distinguishable from permission denied, unavailable and disabled?
9. How do empty-first-use, filtered-empty and no-access remain semantically distinct in SearchFilterBar?
10. What minimum scenario set proves the composite without a Cartesian explosion of every state dimension?

## Mandatory benchmark / primary-source review

Construction A must extract interaction grammar, not branding, from relevant primary documentation/current product behavior:

- Adobe Photoshop: tool/options/panel state separation and focus/selection grammar.
- Budibase: component/block composition and decomposability/ejectability.
- n8n: contextual controls, parameter editing and async execution feedback.
- Canva editor: progressive disclosure, contextual actions and side-panel editing.
- React Aria: form field, focus, validation, disabled/read-only and accessible composition semantics.
- Radix UI and/or Base UI: Dialog/AlertDialog, focus management, controlled/uncontrolled state and composition contracts.
- shadcn/ui: source-owned composition examples only; do not infer primitive semantics from styling.
- Storybook: scenario/story reuse and component documentation/testing evidence.
- Playwright: interaction/browser evidence boundaries.
- axe/WCAG primary guidance where automated accessibility claims are made.
- Tailwind v4 only where representation/token behavior materially affects the scenario.

No benchmark automatically becomes the SB provider.

## Mandatory state and transition coverage

Every composite must preserve the distinction:

`visual variant != interaction state != semantic state != operational state`.

### Pointer/direct manipulation

At least: idle, hover, pressed where applicable, context-menu where applicable, pointer cancellation/recovery.

### Keyboard/focus

At least: focus, focus-visible, focus-within, deterministic tab order, focus restoration after overlay close, escape/cancel behavior, keyboard activation. `focus != selected`.

### Selection

Where meaningful: unselected, selected, multi/primary selection semantics. Selection must not be inferred from focus.

### Authority/availability

At least: enabled, disabled, read-only, unavailable, permission-denied, authority-pending, policy-blocked where applicable. `read-only != permission denied`; `blocked != disabled`.

### Async/execution

At least: idle, queued/pending, processing/saving, waiting-external where applicable, success/effective, failed, timed-out, unknown-outcome, retry/reconcile. `pending != effective`; `ACK != effect`.

### Data/content

At least where applicable: uninitialized, empty-first-use, empty-filtered, empty-no-access, partial, loaded, stale, refreshing, conflicted, unknown, error. `empty != filtered-empty != no-access`.

### Validation/editing

At least: pristine, dirty, validating, valid, invalid, warning, autosaving/saving, saved, save-failed, external-change/conflict where applicable.

### Expansion/layout

At least where applicable: collapsed/expanded, opening/closing, pinned/unpinned, responsive overflow/reflow.

### Lifecycle / SB overlays

Where applicable: candidate, stable, deprecated plus qualified `observed/effective/partial/unknown/stale/conflicted/blocked/reconciling`. These overlays cannot overwrite interaction state.

## Required transition probes

At minimum document and challenge:

- pristine -> dirty -> validating -> invalid -> corrected -> valid -> saving -> ACK -> effective;
- saving -> timeout -> unknown-outcome -> reconcile -> effective/failed;
- enabled -> authority-pending -> allowed/permission-denied/policy-blocked;
- loaded -> stale -> refreshing -> loaded/error;
- trigger focus -> dialog open -> action/cancel -> dialog close -> focus restored;
- search loaded -> filtered-empty -> clear filter -> loaded;
- visible/editable -> read-only without losing readable value/context;
- child guarantee current -> child fingerprint changed -> parent claim disposition -> requalification.

## Failure and recovery

Each artifact must document:

- invalid input and validation recovery;
- async failure without duplicate effects;
- timeout/unknown outcome without false success;
- stale/conflicted data and recovery/reload/merge path;
- permission/authority change during interaction;
- overlay dismissal/focus recovery;
- dependency guarantee change and evidence requalification;
- missing lower-level proof as `INCOMPLETE`, never fabricated PASS.

## Accessibility obligations

- visible, non-obscured focus;
- keyboard reachability and activation;
- deterministic focus restore for overlays;
- accessible name/description/error association for fields;
- validation/error not represented by color alone;
- disabled/read-only/permission-denied meaning exposed accessibly where useful;
- live async changes announced without noisy repeated announcements;
- reduced-motion equivalent for any transition/motion;
- zoom/reflow and responsive reachability;
- no drag-only requirement;
- manual accessibility evidence remains distinct from automated axe results.

## Performance obligations

This packet does not optimize prematurely. It must identify measurable risks only:

- avoid rerendering the whole Componentes catalog for local state changes;
- evidence-impact queries operate on bounded claim/fingerprint edges;
- large option/filter sets identify virtualization thresholds as future measured work, not default complexity;
- async indicators must not create uncontrolled timers/animation churn;
- visual regression evidence must be scenario/profile bounded rather than exhaustive Cartesian rendering.

## Composition contracts

For each artifact produce:

```text
CompositionContract
  artifact
  composedOf[]
  usedBy[]
  importsGuarantees[]
  masksOrOwns[]
  addsGuarantees[]
  scenarioBindings[]
  profileBindings[]
```

Minimum candidate relations:

- FormField `composedOf` Label + control + description/error feedback.
- FormSection `composedOf` FormField[] + structural primitives.
- SearchFilterBar `composedOf` search input + filter controls + action controls + result-state representation.
- ConfirmActionFlow `composedOf` trigger + dialog/alert dialog + action controls + async feedback.
- InspectorPropertyEditor `composedOf` label/key-value + editor/control + status/currentness/authority feedback.

`usedBy` examples are illustrative lineage only and must not authorize higher-level implementation: forms, inspectors, tables, domain panels, future tools/workspaces.

## Componentes impact

Every reusable artifact and material scenario must be planned for `Componentes`.

Preserve metadata candidates:

`id, name, category, compositionLevel, lifecycle, purpose, inputs, outputs, events, states, transitions, dependencies, tokens, icons, a11y, composedOf, usedBy, revision/source/test evidence`.

Additionally qualify:

- imported guarantees;
- owned/masked guarantees;
- added guarantees;
- evidence claims;
- changed fingerprints;
- propagation path;
- evidence disposition;
- reason for requalification.

`ComponentRecord != ScenarioRecord != EvidenceClaim/TestResult` must remain visible in the model.

## Adversarial cases

1. Focused field rendered as selected — reject.
2. Read-only inspector property represented as disabled or permission-denied — reject.
3. Search returning no matches represented as if user has no access — reject.
4. Dialog request ACK rendered as successful external effect — reject.
5. Policy-blocked destructive action represented as generic disabled with no discoverable reason — reject.
6. Child primitive PASS automatically turns composite green — reject.
7. Visual token change invalidates every behavioral claim — reject.
8. Changed Button pending semantics leave ConfirmActionFlow duplicate-effect evidence current — reject.
9. Dialog focus contract changes but parent flow a11y evidence stays current — reject.
10. Wrapper claims to mask a primitive guarantee without proof — reject.
11. Parent rerun silently substitutes for missing required child premise — reject.
12. Componentes stores one flattened `status` for all dimensions — reject.
13. Scenario matrix explodes into all possible state combinations instead of risk/materiality-based scenarios — reject.
14. Responsive overflow hides the only path to a required action — reject.
15. Async failure recovery allows accidental duplicate submission/effect — reject.

## Proof obligations

P1. Each composite names its imported, owned/masked and added guarantees.

P2. Every `maskOrOwn` claim has evidence showing that the composite actually controls/insulates that dimension.

P3. Child PASS is only a premise; parent-added semantics have parent evidence.

P4. Focus, selection, authority, async, data, validation and operational overlays remain independently representable.

P5. `read-only != permission denied`, `blocked != disabled`, `pending != effective`, typed emptiness and `ACK != effect` survive composition.

P6. Evidence propagation names changed fingerprint, affected claim and disposition.

P7. Visual-only changes do not invalidate unrelated behavioral evidence by default.

P8. Accessibility proof includes keyboard/focus and manual obligations, not axe-only green status.

P9. Missing lower-level proof remains `INCOMPLETE`; no ancestor run fabricates it.

P10. Componentes can trace `composedOf/usedBy` and scenario/evidence lineage without flattening business truth into engineering evidence.

P11. The scenario set is bounded by material state/risk coverage and explains omitted Cartesian combinations.

P12. No artifact in this packet requires Tool/Workspace/Page/System View semantics to be considered complete.

## Construction A expected outputs

Construction A is research/documentation only. Produce a qualification matrix for all five artifacts containing:

1. composition contract;
2. state-family applicability matrix;
3. required transitions;
4. failure/recovery paths;
5. accessibility contract;
6. evidence claims and fingerprints;
7. adversarial results;
8. benchmark/source notes;
9. Componentes metadata/scenario entries;
10. explicit gaps that block promotion.

Construction A must test at least one propagation chain per artifact from changed primitive guarantee to composite evidence disposition.

Construction A must not design a Tool or Workspace.

## Construction B expected outputs

Construction B remains bounded to integration/reconciliation of the COMPONENT/PATTERN evidence produced by A:

1. cross-artifact consistency matrix;
2. normalized composition/evidence vocabulary;
3. deduplicated scenario families suitable for Componentes;
4. explicit `maskOrOwn` acceptance/rejection rules;
5. bounded evidence-invalidation examples spanning `Primitive -> Component -> Pattern/Block`;
6. closure assessment: `PASS`, `PARTIAL`, or `BLOCKED` for promotion to the next composition level.

Construction B may recommend the next slice but must not materialize Tool/Workspace/Page/System View work.

## Closure criteria

Packet closes only when:

- all five artifacts have explicit composition contracts;
- all applicable mandatory state families are covered or marked N/A with rationale;
- required transitions and failure/recovery are documented;
- accessibility and performance obligations have bounded evidence plans;
- each material scenario is mapped to Componentes metadata/evidence lineage;
- propagation examples distinguish `UNAFFECTED`, `REQUALIFY_REQUIRED`, `STALE`, `INVALIDATED`, `INCOMPLETE` where applicable;
- at least one legitimate insulation/mask case is proven or the research records that none was proven;
- adversarial probes are resolved without semantic flattening;
- no unresolved primitive gap is silently bypassed;
- Construction B can state whether progression beyond PATTERN/BLOCK is justified.

## Handoff

Next handoff: Construction A should execute this packet from current branch head, beginning with `FormField` and `ConfirmActionFlow` because together they exercise validation, focus, authority, async effect and composition evidence. Stop and report if a material primitive contract gap prevents qualification.
