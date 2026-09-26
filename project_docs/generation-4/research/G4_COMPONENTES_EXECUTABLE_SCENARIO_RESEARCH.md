# G4 — Componentes Executable Scenario & Evidence Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Maturity: `EMERGING / MATERIAL_DELTA`

## Purpose

Qualify the future permanent **Componentes** page as a living UI inventory **and executable interaction-specification surface** from token through complete task page. This research extends `G4_UI_INTERACTION_STATE_MATRIX_RESEARCH.md`; it does not authorize Storybook, Vitest, Playwright, axe, Chromatic, shadcn registry adoption, product code, or build work.

The durable composition chain remains:

```text
TOKEN -> PRIMITIVE -> COMPONENT -> PATTERN/BLOCK
-> DOMAIN BUILDING BLOCK -> MODULE COMPONENT
-> TOOL -> WORKSPACE -> COMPLETE TASK PAGE -> SYSTEM VIEW
```

Core rule:

`Component catalog != screenshot gallery != canonical business truth`.

## Evidence classes reviewed

Primary-source evidence in this round:

- Storybook interaction tests and `play` functions: a story establishes initial state/context, then executes user interactions and assertions; the Interactions UI can pause, resume, rewind and step through the flow.
- Storybook Vitest addon: stories can be transformed into component tests and executed in real browser mode; accessibility and visual test types can be associated with the same story/scenario.
- Storybook accessibility addon: axe-core provides automated checks but explicitly catches only a subset of WCAG issues; incomplete/manual review remains necessary.
- Storybook visual testing: isolated stories/scenarios can become visual-regression targets.
- Vitest 4: Browser Mode is stable and can use Playwright/WebDriver providers.
- WAI-ARIA APG: toolbar/dialog patterns prove that focus entry, roving focus, disabled-control discoverability, focus containment and focus restoration are behavioral contracts, not visual variants.
- shadcn registry: registry items carry explicit files and dependency metadata; current registry tooling supports composition of large registries and validation. This is useful evidence for source/dependency inventory, not authority for SB's semantic catalog.

## Finding 1 — `ComponentRecord` and `ScenarioRecord` must be separate

The earlier candidate `ComponentRecord` is useful but insufficient if states/transitions are stored as loose strings. A reusable artifact needs stable identity while scenarios need independent identity, preconditions, transition steps and evidence.

Candidate research shape:

```text
ComponentRecord
  id
  name
  category
  compositionLevel
  lifecycleStatus
  sourceOwnership
  previewRef
  variants[]
  stateDimensions[]
  validStateConstraints[]
  dependencies[]
  registryDependencies[]
  tokenRefs[]
  iconRefs[]
  a11yContractRefs[]
  usedBy[]
  composedOf[]
  scenarioRefs[]
  revision

ScenarioRecord
  id
  componentId
  purpose
  initialState
  preconditions
  fixtures
  interactionSteps[]
  expectedTransitions[]
  expectedAnnouncements[]
  expectedFocusPath[]
  expectedEffectDisposition?
  viewportProfiles[]
  themeProfiles[]
  densityProfiles[]
  motionProfiles[]
  inputProfiles[]
  browserProfiles[]
  a11yChecks[]
  visualChecks[]
  behavioralChecks[]
  recoveryChecks[]
  evidenceRefs[]
  lifecycleStatus
  revision
```

`ComponentRecord != ScenarioRecord != TestResult != business/runtime evidence`.

A component can remain stable while a scenario is superseded because its interaction contract changes. A test result is evidence for one scenario/revision/environment, not an eternal property of the component.

## Finding 2 — states need dimensions plus constraints, not Cartesian explosion

The UI state model is multidimensional:

```text
visualVariant
interactionState
authorityState
asyncState
dataState
editingState
visibilityState
semanticOverlay
operationalState
```

Generating every Cartesian combination is both wasteful and semantically wrong. The catalog should instead distinguish:

```text
VALID
INVALID_BY_CONTRACT
UNSUPPORTED
NOT_APPLICABLE
REQUIRES_QUALIFICATION
MATERIAL_SCENARIO
```

Example:

```text
Button
  variant=destructive
  focus=focus-visible
  async=pending
  authority=enabled
  => material scenario

Button
  async=success
  interaction=pressed forever
  => invalid/transient combination

ReadOnly inspector
  editing=dirty
  authority=read-only
  => either impossible or explicit conflict/requalification scenario,
     never silently renderable by accident
```

Therefore `State Matrix` is not a truth table of all combinations. It is a **coverage map over declared state constraints and material scenarios**.

## Finding 3 — one scenario should be reusable across four proof surfaces

Candidate scenario pipeline:

```text
Scenario definition
      |
      +-> interactive playback in Componentes
      +-> browser behavioral test
      +-> accessibility checks/manual obligations
      +-> visual-regression target
```

This avoids four drifting specifications for the same interaction. Storybook's current story/play/Vitest model is evidence that a single scenario artifact can support rendering, interaction debugging and browser testing. It is a candidate implementation pattern only; SB should preserve a provider-neutral scenario contract so Storybook can be replaced.

Candidate invariant:

`Scenario semantics != Storybook story format`.

## Finding 4 — playback must show transition evidence, not only final pixels

For complex components, Componentes should expose a timeline such as:

```text
INITIAL
  dirty

STEP 1: activate Save
  -> saving
  focus remains on Save
  duplicate activation suppressed

STEP 2: server reports revision conflict
  -> conflicted / merge-required
  live region announces conflict

STEP 3: choose Reconcile
  -> reconciling

STEP 4: reconciliation succeeds
  -> saved
  revision/currentness refreshed
```

The playback surface should be able to show, when applicable:

- current state dimensions;
- transition cause;
- focused element / focus restoration anchor;
- accessible announcement expected/observed;
- pending request vs effective outcome;
- dirty/recoverable state preservation;
- current revision/currentness;
- failed assertion/evidence;
- reduced-motion equivalent.

This directly protects `ACK != effect`, `Focus != selected`, `Loading != completed`, and `Animation != state authority`.

## Finding 5 — test evidence is revision- and environment-qualified

A green badge beside a component must not mean “this component is correct”. Candidate evidence identity:

```text
ScenarioEvidence
  componentRevision
  scenarioRevision
  dependencyClosure
  browser/environment
  viewport
  theme
  density
  motionPreference
  inputMode
  executedAt
  result
  checksPerformed[]
  checksNotPerformed[]
  artifactRefs[]
```

The UI should distinguish at least:

```text
NOT_RUN
PASS
FAIL
INCOMPLETE
STALE_EVIDENCE
NOT_APPLICABLE
```

Automated axe success is not WCAG proof. Visual-regression success is not interaction proof. Chromium success is not cross-browser proof. A story rendering is not effect correctness.

## Finding 6 — `Componentes` should be a projection over source-owned inventory

shadcn's registry model provides useful evidence for explicit source/dependency metadata: registry items identify files and dependencies, and large registries can be composed/validated. SB can borrow the **inventory discipline** while retaining its own composition semantics.

Candidate separation:

```text
Source Registry
  what source artifacts/dependencies exist

Component Catalog
  what reusable UI identities/contracts exist

Scenario Catalog
  what states/transitions must be reproducible

Evidence Index
  what has actually been checked, where, and against which revision

Componentes page
  authorized projection over all four
```

`Registry metadata != ComponentRecord authority != test evidence != canonical business truth`.

This also supports generated-runtime dependency closure: a generated system should carry the components and state machinery it actually depends on, not the entire Builder catalog.

## Vertical scenario minimums

### Tokens

Test semantic distinguishability and portability, not clicks:

```text
focus vs selected vs attention
warning vs destructive
current vs stale
candidate vs effective
light/dark/high-contrast candidate
reduced-motion static equivalents
```

### Primitives

At least one scenario for keyboard/focus, disabled/pending semantics and recovery where meaningful. Example Button:

```text
idle -> focus-visible -> pending -> effective-success
idle -> pending -> failed -> retry -> success
pending + repeated activation -> no duplicate request
```

Dialog:

```text
trigger focus -> open -> initial focus -> trapped tab sequence
-> escape/cancel -> close -> focus restored
```

WAI-ARIA APG treats initial focus, containment and restoration as part of the dialog interaction contract.

### Patterns / blocks

Search/filter:

```text
typing -> searching -> partial -> loaded
searching -> error -> retry
loaded -> filtered-empty
loaded -> permission changes -> no-access-empty
```

EntityForm:

```text
pristine -> dirty -> saving -> saved
dirty -> autosaving -> external-change -> merge-required
-> reconcile -> saved
```

### Module components

Scheduling/bulk surfaces need partial outcome scenarios:

```text
10 selected
-> bulk action pending
-> 8 effective + 1 failed + 1 unknown
-> PARTIAL, never whole-success
```

Drag operations require non-drag equivalents and valid/invalid target scenarios.

### Tools / workspaces

A tool scenario includes shell state and recoverability:

```text
cold-open -> loading -> ready -> dirty
-> background revision drift -> conflict
-> recoverable tool error -> recovery
```

Fatal rendering failure must be tested separately from loss of canonical/recoverable work.

### Complete task pages

Candidate reference flow:

```text
CREATE -> EDIT -> VALIDATE -> REVIEW -> AUTHORIZE
-> PUBLISH -> VERIFY EFFECT -> OPERATE -> AUDIT -> RECOVER
```

Each boundary must define loading, stale/currentness, authority, revision drift, cancellation and unknown-outcome behavior where applicable.

## Accessibility proof obligations

WAI-ARIA toolbar guidance demonstrates why component-level state cannot stop at CSS: a toolbar is normally one Tab stop with arrow-key navigation, can optionally restore the last focused control, and may keep disabled controls focusable where discoverability is important. Therefore Componentes must expose **interaction grammar by composite role**, not merely primitive snapshots.

Candidate mandatory evidence classes:

```text
keyboard-only
focus-visible / focus-not-obscured
focus restore
screen-reader naming/state/announcement review
pointer/touch target behavior
non-drag equivalent
zoom/reflow
reduced motion
non-color redundancy
```

Automated accessibility tooling is a first-line detector only. Manual obligations remain first-class and must be representable as `INCOMPLETE` rather than fabricated PASS.

## Adversarial scenarios promoted to catalog obligations

The following should eventually exist as reusable scenario templates where applicable:

1. double activation while pending does not duplicate effect;
2. ACK arrives but effective outcome remains `UNKNOWN`;
3. background refresh does not erase dirty local work;
4. authorization changes while dialog/tool is open;
5. selected identity becomes undisclosable during live update;
6. partial bulk result is not rendered as total success;
7. responsive collapse preserves alternate path to every required action;
8. hover-only affordance remains reachable by keyboard/touch;
9. dialog close restores focus to a valid logical anchor;
10. reduced-motion removes motion but not state meaning;
11. skeleton/placeholder does not leak unauthorized structure;
12. stale scenario evidence is not displayed as current proof;
13. browser-specific behavior divergence is visible rather than averaged into PASS;
14. fatal work-surface error preserves recoverable unsaved state where architecture permits;
15. cancellation with unresolved external effect remains `UNKNOWN`, not completed/cancelled-effect.

## Candidate `Componentes` information architecture

```text
Componentes
  Catalog
  Gallery
  Playground
  State Matrix
  Scenarios
  Interaction Playback
  Accessibility
  Responsive
  Theme / Light / Dark
  Density
  Reduced Motion
  Composition Lineage
  Used By
  Dependencies
  Tests / Evidence
  Lifecycle / Revision
```

For a complete tool/workspace, the same structure applies. `Componentes` therefore scales from Badge to Workflow Workspace without inventing a second UI Lab.

## Tooling qualification — current candidate stack, not selection

Evidence currently supports researching this candidate chain:

```text
provider-neutral ScenarioRecord
        -> Storybook-compatible story/play adapter candidate
        -> Vitest Browser Mode candidate
        -> Playwright browser provider candidate
        -> axe automated a11y candidate
        -> visual regression provider candidate
```

Important constraints:

- Storybook is not the canonical scenario model by assumption.
- Playwright Component Testing need not be selected merely because Playwright is useful as a browser provider.
- cloud visual regression is not mandatory; portability/exit path must remain.
- generated runtimes do not need Builder-only test/catalog dependencies in production bundles.
- CI proof and interactive Componentes playback may share scenario definitions while remaining separate execution surfaces.

## Candidate maturity gate for a reusable UI artifact

A component should not advance merely because it looks finished. Candidate promotion evidence:

```text
EXPERIMENTAL
  -> contract/state dimensions identified

CANDIDATE
  -> material scenarios + invalid combinations declared
  -> keyboard/focus contract known
  -> composition/dependencies known

STABLE
  -> required scenario suite reproducible
  -> accessibility obligations reviewed
  -> visual/behavioral regressions bounded
  -> light/dark/responsive/reduced-motion obligations satisfied as applicable
  -> generated-system dependency implications understood
```

`STABLE != frozen forever`; a source-owned component can evolve, but evidence becomes stale when relevant contract/revision/dependency changes.

## Material delta

This round changes the prior model in five material ways:

1. `ComponentRecord` is split from independently versioned `ScenarioRecord` and `ScenarioEvidence`.
2. State Matrix becomes a constrained coverage model, not a Cartesian product generator.
3. One provider-neutral scenario is proposed as the common source for interactive playback, behavioral tests, accessibility obligations and visual regression.
4. Evidence receives explicit revision/environment/currentness semantics, preventing a generic green “tested” badge.
5. Component lifecycle promotion becomes evidence-driven and state-contract-aware.

## Risks / anti-patterns

- treating Storybook stories as the only canonical UI specification;
- marking axe-clean as “WCAG compliant”;
- generating every state combination blindly;
- snapshot-only testing for stateful behavior;
- testing only Chromium and presenting the result as browser-neutral proof;
- coupling Componentes to production runtime bundles;
- allowing test fixtures to become canonical business data;
- silently updating visual baselines after semantic interaction changes;
- preserving PASS after component/scenario/dependency revision invalidates evidence;
- using one green badge to collapse render, behavior, accessibility, visual and effect correctness.

## Open gaps / next highest-value research

1. Define a **state-constraint algebra** for `valid / invalid / requires qualification` combinations without overengineering a universal state machine.
2. Define evidence invalidation rules: which changes stale render, behavior, a11y, visual or cross-browser evidence independently.
3. Compare Storybook/Vitest-browser versus direct Playwright-oriented adapters for complete workspaces where routing, multi-panel state, workers or network behavior exceed isolated component scope.
4. Define fixture/simulation boundaries so `Componentes` can reproduce provider failure, latency, partial result and `UNKNOWN` effect without becoming a second runtime.
5. Define generated-system extraction: how ComponentRecord dependency closure maps to source registry/build closure without dragging Builder-only catalog/test infrastructure into autonomous runtimes.

## Working conclusion

`Componentes` should evolve from a gallery into an **executable, revision-qualified interaction contract inventory**. The important unit is not the screenshot; it is a reproducible scenario whose initial state, transitions, focus behavior, announcements, failure/recovery path and evidence scope are explicit.

This remains research only. No implementation technology is selected or authorized.
