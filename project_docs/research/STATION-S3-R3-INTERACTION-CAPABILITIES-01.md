# Station S3-R3 — Interaction Capabilities 01

Date: 2026-09-27
Base: fresh `main@c09b291ee13cc846fbdab717cee31377bf6cc085`
Status: RESEARCH — NOT PRODUCT AUTHORITY

## Dependency/currentness

R2 final handoff is integrated. R3 is eligible for research only. Construction, Studios and AI/MCP foundation remain blocked until R1-R7, synthesis and explicit Construction materialization.

The accepted S3 hierarchy and boundaries remain unchanged. In particular: identity != placement != presentation != action; ComponentRegistry != AppManifest; WindowGeometry != composition grid; discrete/span authoring remains distinct from window geometry; Station cannot acquire Core/business authority.

## Station current state

`packages/station-interaction` already supplies a bounded presentation interaction layer:

- `PresentationCommandRegistry` owns presentation command identity, registration, availability and invocation;
- availability is re-evaluated at invocation time;
- shortcuts map to command identity rather than defining another command;
- `StationInteractionContext` keeps focus, selection and surface context explicit;
- `CoreCommandIntent` is a non-executable descriptor in the presentation registry and reserves authority for Core/domain owners;
- executable tests prove invocation-time availability recheck, multi-projection command identity, deterministic shortcut conflict handling, presentation-only focus/selection normalization, Core-intent rejection by the presentation registry and duplicate-command fail-closed behavior.

This is inherited evidence. R3 must not rebuild or retest it wholesale.

## Open question / hypothesis

Can C4 Capability remain a small provider-independent semantic layer above components/collections by separating:

`intent -> command -> target -> conditions -> authority -> effects -> result -> presentation consequences`

rather than putting domain action semantics into Button/Menu/Tree variants?

Working hypothesis: yes, but the existing presentation command registry covers only a bounded subset. It proves command identity and invocation-time presentation availability, not generic business authority, effect completion, partial effect, retry, compensation, evidence/currentness or accepted-vs-effective state.

## Independent benchmark evidence and delta

### VS Code command/context model — adopt-pattern

VS Code separates command identity from the surfaces that expose it. Commands can be invoked from command palette, keybindings and UI surfaces, while context/when clauses gate visibility and enablement. This independently converges with Station's existing command registry and projection identity rule.

Station consequence: conditions should be inspectable/context-derived inputs to command availability, but visibility/presentation gating must not be confused with execution authority. A hidden or disabled projection is not itself the authority decision.

Proof delta: same command identity across projections; context changes invalidate prior availability; invocation revalidates conditions; projection-specific visibility cannot silently create another action identity.

### Radix Menu/Toolbar — adopt-pattern, not provider authority

Radix Toolbar and Dropdown Menu independently show that navigation/focus ownership and activation are separate interaction contracts. Toolbar uses roving focus; Dropdown Menu owns item navigation, typeahead, dismissal and focus restoration; a menu trigger can be composed inside a toolbar without collapsing both state machines.

Station consequence: C4 capability activation must remain separate from C3 traversal/focus machinery. Contextual keyboard ownership from R2 is reinforced: the active interaction scope owns navigation keys, while activation resolves semantic command identity.

Proof delta: focus entry/transfer/restoration, no key stealing across nested scopes, activation identity invariant under projection.

### React Spectrum pending actions and MUI loading — divergence worth preserving

React Spectrum's pending Button remains focusable while press/hover are disabled and the pending state is announced. MUI's loading Button disables the control while showing a progress indicator. Both represent pending presentation, but differ in focus behavior.

Station consequence: `pending/loading` must not be promoted into universal command semantics. It is a presentation consequence derived from an execution/effect state under an explicit component/accessibility policy. The semantic execution model should expose enough result/currentness state for a projection to choose an appropriate pending representation without making that representation authoritative.

Proof delta: repeated activation policy while pending; focus/accessibility behavior belongs to the projection/component contract; command identity/result semantics remain unchanged.

### Webflow collaboration/preview and JetBrains Local History — history is not one universal capability

Independent editor evidence challenges a single global `undo/history` abstraction. Webflow documents per-collaborator undo/redo while multiple people edit the same artifact and keeps preview as a distinct interactive projection. JetBrains separates immediate Undo from Local History and VCS rollback; Local History retains revisions independently from source-control commits and can restore a bounded prior state.

Station consequence: `undo`, draft discard, durable history/versioning, and authoritative compensation are different contracts. A local composition draft may own reversible mutations without implying that a Core/business effect is compensatable. Preview may project the same draft without becoming another state authority.

Proof delta: mutation scope/owner identity; undo only reverses admitted local mutations; discard restores the draft base; preview is observational over the same draft; durable history and authoritative compensation require separate evidence.

## Candidate Interaction Grammar

Research candidate only; field names are not schema authority.

1. **Intent** — user/system request to attempt an action. Intent does not prove permission or success.
2. **Command identity** — stable semantic operation reference. Toolbar/menu/shortcut/overflow are projections of it by default.
3. **Target** — explicit ref(s) the command is requested against. Target identity is not placement or visual selection.
4. **Conditions** — deterministic contextual preconditions that can explain availability/applicability. Must be re-evaluated at execution boundary when stale state is possible.
5. **Authority** — owner allowed to decide whether the requested effect may occur. Presentation registry may own Station-local presentation commands; Core/domain commands remain Core/domain authority.
6. **Effects** — requested/observed state changes. `accepted` is not equivalent to `effective`.
7. **Result** — typed execution outcome/evidence envelope sufficient to distinguish at least rejected/unavailable, accepted/pending, effective/succeeded, failed, partial/indeterminate where semantics require them. Exact vocabulary remains synthesis work.
8. **Presentation consequences** — disabled/pending/error/success/navigation/focus/toast/etc. derived for a projection; they do not become effect authority.

## Station capability ownership census — delta 02

### Composition draft / dirty / validation — existing bounded capability, not a component variant

`packages/station-composition/draft-transaction.ts` already models an immutable valid base, a mutable-by-replacement draft snapshot, validation findings and explicit `dirty`. Every admitted mutation is validated before it can replace the draft. Invalid mutation returns the unchanged transaction plus findings. `discardCompositionDraft` restores the base and clears dirty; `projectCompositionPreview` snapshots the same draft.

Existing product tests prove the bounded invariants: a valid mutation changes preview while preserving base, dirty becomes true, discard restores base and dirty=false, and an invalid root-removal is rejected without corrupting base or draft.

Classification: **own / already implemented** as a composition-level editing transaction. It is reusable C4-like behavior over a composition artifact, but it does not justify `DirtyButton`, `ValidationPane` or another component identity. Dirty and findings are state/consequences of the draft transaction.

Inherited proof: immutable base, admitted valid mutation, explicit dirty transition, discard restoration, invalid mutation fail-closed.

Remaining gap: there is no demonstrated generic undo/redo stack, durable history, concurrent merge semantics, or save/publish authority in this transaction. Those remain `unproven-gap`, not implied by dirty/discard.

### Window move/resize/snap — windowing-owned capability, not composition-grid authority

`packages/station-windowing/window-frame.tsx` owns pointer sessions for move/resize, preview geometry during the pointer session, pointer capture, bounds projection, optional edge snap, and final `SET_GEOMETRY`. The window reducer separately owns `SET_BOUNDS` and geometry normalization. Product tests exercise measured bounds/windowing behavior.

Classification: **own / existing specialized capability** at the windowing boundary. It must not be generalized into composition-grid placement merely because both use spatial terms. `WindowGeometry != composition grid` remains intact.

Inherited proof: bounded window geometry and existing move/resize/bounds behavior where product tests cover it.

Remaining gap: generic drag/drop semantics, reorder semantics, keyboard resize, drop-target negotiation and composition authoring drag are not proven by window movement. Reusing pointer mechanics may be considered later; reusing window authority would be incorrect.

### Ordering/layering — do not promote from incidental z-order

Window instances possess z-order/focus behavior, but this does not prove a reusable collection ordering capability. C3 ordered traversal and future composition/layer ordering have different ownership and mutation semantics.

Classification: **defer generic ordering capability** until an artifact actually requires reusable move-before/move-after/reparent semantics and their proof delta.

### Core result/effect schema census

Repository search reconfirms `CoreCommandIntent` as deliberately non-executable by `PresentationCommandRegistry`, and existing tests prove that projection of Core intents never becomes Station authorization. No existing generic cross-boundary `accepted/effective/partial/retry/compensation/currentness` result contract was located by targeted symbol/vocabulary search in this R3 census.

This negative census is not proof that no domain-specific result type exists anywhere. It is sufficient to block invention of a generic schema here: R3 should carry these concepts as obligations/vocabulary until a concrete authoritative boundary is selected in synthesis/Construction.

## Failure/recovery semantics

R3 must preserve these distinctions:

- stale condition/target: availability observed earlier cannot authorize execution later;
- unavailable/rejected: no effect should be inferred;
- accepted != effective: acknowledgement/queueing does not prove final state;
- partial/indeterminate effect: must not be collapsed into success;
- retry: requires an explicit retry-safety/idempotency policy or fresh command attempt; UI must not assume retry is safe;
- compensation/rollback: only where the authoritative capability declares it; not a generic Station promise;
- evidence/currentness: outcome evidence needs enough identity/currentness to avoid presenting stale completion as current truth.

Station presentation commands that are synchronous/local may legitimately mark several of these concerns not-applicable. That decision is per capability contract, not global.

## C4 promotion and dedup rule

Promote a C4 Capability only when there is reusable semantic behavior above component/collection mechanics: stable command/action identity, target/condition semantics, reusable state transition, execution boundary, or result/recovery contract with its own proof delta.

Do **not** create a new capability merely for another button label/icon/color, another toolbar/menu placement, another domain noun, responsive relocation, or a projection-specific pending/error rendering.

`ApproveDocumentButton` remains a rejected direction when `Button + binding -> approve command + document target + conditions/authority` expresses the case. A genuinely distinct approval capability is justified only by distinct reusable semantic/authority/effect obligations, not by its visual trigger.

Additional dedup rule from the census: a state bit is not automatically a Capability. `dirty` is derived from draft/base difference; validation findings are output of composition validation; pointer preview is transient windowing state. Promote only when there is a reusable owner, transition contract and proof delta.

## Proof Grammar — inherited vs R3 delta

Coverage vocabulary: `proven | failed | unproven-gap | not-applicable`. Absence of evidence is never PASS.

| Obligation | Status | Rule |
|---|---|---|
| presentation command unique identity | proven | inherit existing Station test |
| invocation-time presentation availability recheck | proven | inherit existing Station test |
| multiple presentation projections -> one command identity | proven | inherit existing Station test |
| shortcut conflict fail-closed | proven | inherit existing Station test |
| focus/selection presentation-context normalization | proven | inherit existing Station test |
| Core intent cannot execute in presentation registry | proven | inherit authority-boundary test |
| composition draft preserves immutable base | proven | inherit composition-draft test |
| admitted composition mutation is validated | proven | inherit composition-draft test |
| invalid composition mutation fails closed without corrupting draft | proven | inherit composition-draft test |
| dirty transition + discard restoration | proven | inherit composition-draft test |
| preview projects same draft rather than second authority | proven, bounded | inherit draft snapshot/preview test; broader multi-projection round-trip remains gap |
| window move/resize/bounds behavior | proven, bounded | inherit windowing/product evidence; does not transfer to composition placement |
| generic drag/drop target negotiation | unproven-gap | future authoring capability proof |
| generic ordering/reparenting | unproven-gap | future artifact-specific proof |
| generic undo/redo | unproven-gap | draft discard is not undo stack |
| durable history/versioning | unproven-gap | separate from local undo/draft |
| target identity/currentness beyond presentation context | unproven-gap | R3/synthesis delta |
| conditions vs authority separation | unproven-gap | R3/synthesis delta |
| stale-state rejection at authoritative boundary | unproven-gap | future boundary proof where applicable |
| accepted != effective representation | unproven-gap | future result-contract proof |
| partial/indeterminate effect semantics | unproven-gap | capability-specific proof |
| retry safety/idempotency declaration | unproven-gap | capability-specific; may be N/A |
| compensation/rollback | unproven-gap | capability-specific; may be N/A |
| result evidence/currentness | unproven-gap | boundary/integration proof |
| contextual keyboard ownership | inherited R2 gap | do not mark PASS; refine with capability projection |
| projection command-identity invariance | partially proven for presentation command + shortcut; broader projections unproven-gap | delta-only proof |
| pending presentation focus/a11y | policy-dependent | component/projection proof; not command authority |

## Smallest future proofs

Future Construction should not build a giant end-to-end suite for every command. The minimum adequate proof follows ownership:

- command registry: identity/conflict/availability transition unit tests;
- binding/projection: one test that multiple surfaces resolve the same semantic command and preserve target;
- composition draft: inherit current base/dirty/discard/invalid-mutation tests; add only undo/history delta if such a contract is promoted;
- drag/drop/reorder: prove target compatibility and mutation semantics at the artifact owner, not via window movement tests;
- authoritative boundary: stale/unauthorized request fails closed without claiming effect;
- asynchronous effect contract where applicable: accepted/pending is distinguishable from effective/final;
- retry/compensation only when admitted by the capability contract;
- accessibility/focus proof belongs to the interactive projection, inheriting command semantics rather than re-proving them.

Human acceptance remains separate: it validates whether the intended command/result/presentation policy is correct, not whether the machine proof happened to pass.

## Grammar sufficiency implications

The future sufficiency test should attempt the same small Interaction Grammar against approval, ticketing, CRUD, operational dashboard and deployment configuration. R3 success is not a numeric score. Record for each exemplar whether existing primitives/collections + command/target/conditions/authority/effect/result contracts express the behavior, which lower proofs are inherited, and which gaps force a genuinely new abstraction.

A domain-specific button/component created only to make an exemplar fit counts as a dedup/sufficiency warning, not success.

The draft census adds a concrete sufficiency constraint: CRUD/editor exemplars should reuse the same base/draft/validation/dirty semantics when applicable rather than inventing per-tool dirty components. Approval/deployment exemplars must not reuse draft discard as if it were compensation for an authoritative external effect.

## Disposition

- **own**: Station presentation-command identity/context contracts; composition draft transaction; windowing-local move/resize; proof inheritance; provider-independent capability vocabulary.
- **adapt**: mature context gating, focus arbitration, local undo/history mechanics and result/pending representation mechanisms only where accepted semantics require them.
- **adopt-pattern**: one semantic command across projections; invocation-time revalidation; separation of navigation/focus from activation; pending as presentation consequence rather than authority; explicit separation of undo, draft discard, durable history and authoritative compensation.
- **defer**: generic Core executor, transaction engine, generic ordering/reparenting, generic undo framework, compensation engine, AI/MCP command generation, or product-specific capability catalog.

## Current R3 gaps / next work

1. Census any existing composition insertion/reparent/reorder and validation finding contracts before proposing drag/drop authoring grammar.
2. Inspect existing Station save/persistence/versioning boundaries to separate local draft from durable artifact authority.
3. Benchmark editor/workstation models only against remaining concrete questions: target resolution, contextual enablement, undo scope, async result/currentness and projection invariance.
4. Extend proof matrix for each promotable capability; do not convert implementation presence to PASS.
5. Keep R4 blocked until R3 handoff bounds capability ownership and proof debt.
