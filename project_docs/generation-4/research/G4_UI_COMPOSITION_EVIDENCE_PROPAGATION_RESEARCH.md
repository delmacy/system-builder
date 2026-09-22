# G4 — UI Composition Evidence Propagation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Maturity: `EMERGING / MATERIAL_DELTA`

## Purpose

Extend the interaction-state and evidence-invalidation research with a missing composition contract: how a change in a lower-level UI artifact affects evidence for its `usedBy` ancestors without either rerunning the entire UI universe or incorrectly retaining stale green evidence.

This remains research only. It does not authorize implementation, package/tool adoption, WBS, Work Packages, Sprints, TASKs or provider selection. The frontend remains Next.js + React + TypeScript; no WASM/UI-polyglot path is introduced.

## Composition ladder under test

```text
TOKEN
  -> PRIMITIVE
  -> COMPONENT
  -> PATTERN/BLOCK
  -> DOMAIN BUILDING BLOCK
  -> MODULE COMPONENT
  -> TOOL
  -> WORKSPACE
  -> COMPLETE TASK PAGE
  -> SYSTEM VIEW
```

The central question is not merely whether A imports B. It is whether an ancestor's claimed behavior, accessibility, representation, responsiveness, performance or operational interaction materially depends on the changed contract of a descendant.

## Evidence reviewed

Primary tooling documentation supports several useful but non-canonical observations:

- Storybook stories can be reused as executable component scenarios and its Vitest integration runs component behavior in a real browser; visual and accessibility checks remain distinct proof classes.
- Storybook composition can aggregate multiple independently published component catalogs for browsing/auditing, showing that catalog aggregation need not imply one runtime dependency closure.
- Playwright projects support distinct browser/device/configuration profiles and explicit project dependencies. This is useful evidence that execution dependencies and proof profiles can be modeled separately.
- Vitest Browser Mode executes browser-native tests with explicit providers/instances; runner/provider identity is therefore environment evidence, not scenario semantics.

These sources qualify test/evidence organization. They do not select Storybook, Vitest, Playwright or Chromatic as canonical SB providers.

## Finding 1 — import dependency is too weak; transitive invalidation is too strong

Two naive policies both fail:

```text
leaf changed -> invalidate every ancestor
```

causes evidence explosion, while:

```text
only directly changed artifact invalidates
```

misses semantic breakage propagated through composition.

Candidate distinction:

```text
SourceDependency
CompositionDependency
ContractDependency
EvidenceDependency
```

A `Button` may be source/composition-dependent inside `EntityForm`, but a change to its shadow token need not invalidate the form's save-transition proof. A change to Button activation suppression while pending can invalidate a form proof that claims duplicate-submit prevention.

`Dependency edge != evidence invalidation edge`.

## Finding 2 — evidence claims, not ancestors, are the propagation unit

Candidate record:

```text
EvidenceClaim
  id
  subjectArtifact
  scenario
  proofClass
  asserts[]
  dependsOnContracts[]
  dependsOnClaims[]
  environmentProfile?
  evidenceDisposition
  revision
```

Examples:

```text
EntityForm / save-no-duplicate-effect
  depends on:
    Button.activation.pendingSuppression
    Form.submit.transition
    SaveCommand.effectIdentity

TicketPanel / keyboard-edit-flow
  depends on:
    EntityForm.focusOrder
    Dialog.focusRestore

Workspace / dark-mode-layout
  depends on:
    semantic token mapping
    panel composition
  does not automatically depend on:
    Button async transition contract
```

Therefore propagation walks from a changed semantic fingerprint to the claims that explicitly consume it, then to claims that depend on those claims.

## Finding 3 — four propagation relations are sufficient as a research vocabulary

Candidate relations:

```text
DIRECT
  claim explicitly consumes the changed contract/fingerprint

DERIVED
  claim depends on another evidence claim whose guarantee changed

CONTEXTUAL
  dependency matters only under a declared profile/scenario
  e.g. dark, RTL, compact, mobile, reduced-motion, touch

INSULATED
  composition boundary proves the changed dimension is not material to this claim
```

`INSULATED` must be justified, not assumed. It is a qualified statement about one proof dimension, not a claim that the child can never affect the parent.

## Finding 4 — invalidation propagates by dimension

Reuse the existing fingerprints:

```text
BehaviorFingerprint
AccessibilityFingerprint
RepresentationFingerprint
EnvironmentFingerprint
```

Candidate propagation examples:

| Leaf change | Direct leaf evidence | Ancestor propagation |
| --- | --- | --- |
| raw radius/shadow token | visual | only ancestor visual claims that render/use affected surface |
| semantic warning token remap | visual + accessibility qualification | ancestor state representations using warning semantics |
| Button pending activation suppression | behavioral/transition | forms/bulk actions whose duplicate-effect claim depends on it |
| Dialog focus restore | behavioral + accessibility | flows that open/close that dialog and claim deterministic focus return |
| Input accessible-name contract | accessibility | composed forms whose field naming proof consumes that contract |
| breakpoint/layout contract | responsive + accessibility qualification | pages/workspaces using that responsive composition path |
| primitive dependency upgrade | impact analysis | only claims reachable through changed fingerprints; no blanket transitive PASS retention or invalidation |

This preserves `Visual preference may change without invalidating interaction semantics` while still allowing representation changes to invalidate relevant ancestor screenshots.

## Finding 5 — composition requires explicit contract surfaces

A reusable artifact should expose which parts of its lower-level dependencies become promises of the artifact itself.

Candidate shape:

```text
CompositionContract
  artifact
  composedOf[]
  importsGuarantees[]
  masksOrOwns[]
  addsGuarantees[]
  scenarioBindings[]
  profileBindings[]
```

Example:

```text
EntityForm
  importsGuarantees:
    Input.keyboardEditing
    Dialog.focusRestore
    Button.pendingActivationSuppression
  addsGuarantees:
    dirtyStatePreservation
    validationSummaryNavigation
    saveConflictRecovery
```

If EntityForm deliberately owns a concern itself, evidence must prove that ownership boundary; merely wrapping a primitive does not insulate it.

## Finding 6 — ancestor evidence may be REQUALIFY_REQUIRED without being invalidated

Binary current/invalidated is insufficient for composition propagation.

Candidate propagation disposition:

```text
UNAFFECTED
REQUALIFY_REQUIRED
STALE
INVALIDATED
INCOMPLETE
```

- `UNAFFECTED`: changed fingerprint is outside the claim dependency closure.
- `REQUALIFY_REQUIRED`: impact is plausible/profile-dependent and must be checked before retaining current status.
- `STALE`: previous evidence is historically valid but no longer covers the current dependency closure.
- `INVALIDATED`: known changed assumption defeats the claim.
- `INCOMPLETE`: required ancestor proof was never established.

`Child evidence invalidated != ancestor behavior failed`.

## Finding 7 — proof inheritance is deliberately limited

A parent may reuse a child's qualified guarantee, but child PASS does not prove parent composition correctness.

Examples:

```text
Button keyboard PASS
!= EntityForm keyboard-flow PASS

Dialog focus-restore PASS
!= Workspace multi-panel focus-continuity PASS

Input contrast PASS
!= Form error-summary non-color redundancy PASS
```

The parent needs evidence for integration semantics it adds: ordering, orchestration, conflict/recovery, authority, async composition, responsive reachability and cross-component focus.

Candidate rule:

```text
child guarantee can satisfy a declared premise
but cannot satisfy the parent's added conclusion
```

## Finding 8 — generated-system closure and Builder closure remain separate

`Componentes` may know the complete Builder catalog, but a generated runtime should carry/test only its selected dependency closure plus required shared contracts.

Candidate separation:

```text
BuilderCatalogClosure
GeneratedRuntimeClosure(systemDefinition/release)
EvidenceClosure(claim + scenario + profile)
```

A Builder-only engineering surface changing must not invalidate an autonomous generated system that does not include or depend on it. Conversely, a shared primitive contract change can require requalification of generated systems that actually consume that contract.

This preserves `Builder != Runtime` and `Generated runtime != Builder dependency`.

## Finding 9 — evidence graph must not become canonical business truth

The future Componentes evidence graph is engineering metadata. It can answer:

- what UI claim was tested;
- which contracts/evidence it relied on;
- why evidence became stale/invalidated;
- which ancestors require requalification.

It cannot decide business authority, runtime effect truth, policy or canonical currentness merely because a UI scenario passed.

`Evidence dependency graph != business dependency graph != authority graph`.

## Adversarial probes

1. **Visual-only primitive change causes full-suite rerun** — reject; propagate only affected representation claims.
2. **Button async semantics change but ancestor forms stay green** — reject where their duplicate-effect/save claims import that guarantee.
3. **Dialog focus change leaves workspace a11y evidence current** — reject for scenarios that consume dialog close/focus restoration.
4. **Child PASS treated as parent PASS** — reject; parent-added composition semantics require evidence.
5. **Wrapper assumed to insulate dependency** — reject unless the composition contract and evidence establish masking/ownership.
6. **RTL change invalidates every behavioral scenario** — reject; use contextual/profile-qualified propagation.
7. **Generated system invalidated by Builder-only tool change** — reject unless shared dependency closure is actually affected.
8. **Dependency upgrade blindly trusted because API types compile** — reject; contract/fingerprint impact analysis remains required.
9. **Evidence graph used to infer business truth** — reject; engineering evidence remains a projection.
10. **Ancestor scenario rerun hides a missing leaf proof** — reject; derived claims retain lineage and cannot fabricate missing premises.

## Componentes translation

Candidate additions to Composition Lineage / UsedBy / Evidence:

```text
Composition Lineage
  composedOf
  usedBy
  imported guarantees
  owned/masked guarantees

Evidence Impact
  changed fingerprint
  affected claims
  propagation path
  disposition
  required requalification

Why this reruns
  leaf change
    -> imported contract
    -> parent claim
    -> scenario/profile
```

The UI should permit drilling from a stale ancestor claim to the exact changed premise rather than showing only a generic red/green badge.

## Proof obligations

1. Every propagated invalidation names the changed fingerprint and affected claim.
2. No parent inherits a child's PASS for semantics the parent itself adds.
3. No leaf change invalidates unrelated proof dimensions by default.
4. `INSULATED` boundaries have explicit contract/evidence justification.
5. Contextual propagation names theme/density/viewport/input/RTL/motion/browser profile where relevant.
6. Generated-runtime evidence closure excludes Builder-only artifacts absent from the generated dependency closure.
7. A changed shared primitive contract requalifies only actual consumers and affected claims.
8. Historical evidence remains inspectable after becoming stale/invalidated.
9. Evidence propagation never manufactures business/runtime truth or authority.
10. Missing premises remain visible; rerunning an ancestor cannot silently substitute for an absent required lower-level guarantee.

## Performance boundary

Evidence impact analysis should operate over indexed claim/fingerprint edges rather than scanning/rendering the full Componentes catalog. If scale becomes material, investigate in order:

```text
algorithm/data structure
-> bounded query/materialization
-> virtualization for rendered result sets
-> Web Worker for measured heavy client analysis
-> SVG/Canvas/WebGL only for visualization workloads that justify them
```

No UI WASM/rewrite hypothesis is introduced.

## Candidate invariants

- `Dependency edge != evidence invalidation edge`.
- `Child PASS != parent composition PASS`.
- `Changed child != every ancestor invalid`.
- `Unchanged ancestor source != ancestor evidence current`.
- `Composition wrapper != automatic insulation`.
- `Evidence propagation follows claims/fingerprints, not file imports alone`.
- `Visual dependency != behavioral dependency by default`.
- `Builder catalog closure != generated-runtime closure != evidence closure`.
- `Evidence graph != business truth/authority graph`.

## Effect on existing research plan

This finding refines rather than replaces the existing `ComponentRecord -> StateConstraint[] -> ScenarioRecord[] -> EvidenceRequirement[] -> ScenarioEvidence[]` model. Add research candidates:

```text
CompositionContract
EvidenceClaim
EvidenceDependencyEdge
PropagationDisposition
```

No provider choice or implementation decision follows from these records.

## Open gaps

1. test this propagation model against concrete `Button -> EntityForm -> TicketPanel -> Tool -> Workspace -> Complete Task Page` scenarios;
2. define when a composite may legitimately `maskOrOwn` a lower-level guarantee and what proof establishes insulation;
3. research manual-accessibility evidence aging/reviewer provenance through composition;
4. determine how release-pinned generated systems retain historical primitive evidence after the Builder catalog advances;
5. model partial/bulk async outcomes where a parent aggregates multiple child claims with mixed `EFFECTIVE/FAILED/UNKNOWN` dispositions;
6. research evidence impact presentation at thousands of artifacts without turning Componentes into an unreadable dependency graph.

## Saturation state

`MATERIAL_DELTA`.

The research model changes materially: evidence propagation is claim- and fingerprint-based rather than source/import-based or blanket-transitive; parent composition semantics require their own proof; and Builder, generated-runtime and evidence closures are explicitly separated.